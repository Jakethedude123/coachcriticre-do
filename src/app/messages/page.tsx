"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { db } from '@/lib/firebase/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc, updateDoc, addDoc, getDocs } from 'firebase/firestore';

export default function MessagesPage() {
  const { user, loading } = useAuth();
  if (loading) {
    console.log('[MessagesPage] loading...');
    return <div>Loading...</div>;
  }
  if (!user) {
    console.log('[MessagesPage] user is null after loading');
    return <div>Please log in to view your messages.</div>;
  }
  const [messages, setMessages] = useState<any[]>([]);
  const [usernames, setUsernames] = useState<{ [uid: string]: string }>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [conversation, setConversation] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) return;
    // Fetch all messages where user is sender or recipient (backward compatible)
    const qFrom = query(
      collection(db, 'messages'),
      where('from', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const qTo = query(
      collection(db, 'messages'),
      where('to', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    let allMsgs: any[] = [];
    const unsubFrom = onSnapshot(qFrom, async (snapFrom) => {
      allMsgs = [...snapFrom.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }))];
    });
    const unsubTo = onSnapshot(qTo, async (snapTo) => {
      allMsgs = [...allMsgs, ...snapTo.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }))];
      // Group by the other participant
      const grouped: { [uid: string]: any } = {};
      allMsgs.forEach(m => {
        const other = m.from === user.uid ? m.to : m.from;
        if (!grouped[other] || new Date(m.createdAt) > new Date(grouped[other].createdAt)) {
          grouped[other] = m;
        }
      });
      setMessages(Object.values(grouped));
      // Mark unread messages as read
      const unread = allMsgs.filter(m => m.to === user.uid && m.read === false);
      for (const m of unread) {
        await updateDoc(doc(db, 'messages', m.id), { read: true });
      }
      // Fetch usernames for all unique participants
      const uniqueUsers = Array.from(new Set(allMsgs.flatMap(m => [m.from, m.to])));
      const usernameMap: { [uid: string]: string } = {};
      await Promise.all(uniqueUsers.map(async (uid) => {
        const userDoc = await getDoc(doc(db, 'users', uid));
        usernameMap[uid] = userDoc.exists() ? userDoc.data().displayName || uid : uid;
      }));
      setUsernames(usernameMap);
    });
    return () => { unsubFrom(); unsubTo(); };
  }, [user]);

  // Load conversation when a message is expanded
  useEffect(() => {
    if (!user || !expanded) return;
    // Real-time listeners for both directions
    let all: any[] = [];
    const q1 = query(
      collection(db, 'messages'),
      where('from', '==', user.uid),
      where('to', '==', expanded),
      orderBy('createdAt', 'asc')
    );
    const q2 = query(
      collection(db, 'messages'),
      where('from', '==', expanded),
      where('to', '==', user.uid),
      orderBy('createdAt', 'asc')
    );
    const unsub1 = onSnapshot(q1, (snap1) => {
      const fromMsgs = snap1.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      console.log('[MessagesPage] q1 (from user to other):', fromMsgs);
      all = [
        ...fromMsgs,
        ...all.filter(m => m.from !== user.uid || m.to !== expanded)
      ];
      all.sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime());
      setConversation([...all]);
      console.log('[MessagesPage] combined conversation after q1:', all);
    });
    const unsub2 = onSnapshot(q2, (snap2) => {
      const toMsgs = snap2.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      console.log('[MessagesPage] q2 (from other to user):', toMsgs);
      all = [
        ...all.filter(m => m.from !== expanded || m.to !== user.uid),
        ...toMsgs
      ];
      all.sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime());
      setConversation([...all]);
      console.log('[MessagesPage] combined conversation after q2:', all);
    });
    return () => { unsub1(); unsub2(); };
  }, [user, expanded]);

  // Helper to get the other participant's UID
  const getOtherParticipant = (msg: any) => (msg.from === user.uid ? msg.to : msg.from);

  // Group messages by the other participant
  const latestMessagesByOther = Object.values(
    messages.reduce((acc, msg) => {
      const other = getOtherParticipant(msg);
      if (!acc[other] || new Date(msg.createdAt) > new Date(acc[other].createdAt)) {
        acc[other] = msg;
      }
      return acc;
    }, {} as { [other: string]: any })
  ) as any[];

  const handleExpand = (otherUid: string) => {
    setExpanded(expanded === otherUid ? null : otherUid);
    setReply('');
  };

  const handleReply = async () => {
    if (!user || !expanded || !reply.trim()) return;
    setSending(true);
    await addDoc(collection(db, 'messages'), {
      to: expanded,
      from: user.uid,
      participants: [user.uid, expanded],
      text: reply,
      read: false,
      createdAt: new Date().toISOString(),
    });
    setReply('');
    setSending(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      {latestMessagesByOther.length === 0 ? (
        <p className="text-gray-600">No messages found.</p>
      ) : (
        <ul className="space-y-4">
          {latestMessagesByOther.map(msg => {
            const other = getOtherParticipant(msg);
            return (
              <li
                key={other}
                className={`transition-all duration-300 bg-white rounded-lg shadow border cursor-pointer overflow-hidden ${expanded === other ? 'ring-2 ring-blue-400 scale-105' : 'hover:ring-1 hover:ring-blue-200'}`}
                style={{ minHeight: expanded === other ? 320 : 64, maxHeight: expanded === other ? 600 : 64 }}
                onMouseEnter={() => handleExpand(other)}
                onMouseLeave={() => setExpanded(null)}
              >
                <div className="flex items-center justify-between px-6 py-4">
                  <div>
                    <div className="font-semibold text-lg">{usernames[other] || 'Unknown User'}</div>
                    <div className="inline-block px-4 py-2 rounded-2xl text-sm shadow bg-gray-200 text-gray-900 max-w-xs truncate mt-1">{msg.text}</div>
                  </div>
                  <div className="text-xs text-gray-400 ml-4">{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}</div>
                </div>
                {expanded === other && (
                  <div className="px-6 pb-6 animate-fade-in flex flex-col h-80">
                    <div className="flex-1 max-h-64 overflow-y-auto space-y-2 mb-2 flex flex-col">
                      {conversation.map((c, i) => (
                        <div key={c.id || i} className={`flex ${c.from === user.uid ? 'justify-end' : 'justify-start'}`}> 
                          <span className={`inline-block px-4 py-2 rounded-2xl text-sm shadow ${c.from === user.uid ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-900'}`}
                            style={{ transition: 'background 0.3s' }}>
                            {c.text}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-gray-200">
                      <input
                        type="text"
                        className="flex-1 border rounded p-2"
                        placeholder="Type your message..."
                        value={reply}
                        onChange={e => setReply(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleReply(); }}
                        disabled={sending}
                      />
                      <button
                        className="button-primary bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                        onClick={handleReply}
                        disabled={sending}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
} 