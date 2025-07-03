"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { db } from '@/lib/firebase/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc, updateDoc, addDoc } from 'firebase/firestore';

export default function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usernames, setUsernames] = useState<{ [uid: string]: string }>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [conversation, setConversation] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'messages'),
      where('to', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setLoading(false);
      // Mark unread messages as read
      const unread = msgs.filter(m => m.read === false);
      for (const m of unread) {
        await updateDoc(doc(db, 'messages', m.id), { read: true });
      }
      // Fetch usernames for all unique senders
      const uniqueFrom = Array.from(new Set(msgs.map(m => m.from)));
      const usernameMap: { [uid: string]: string } = {};
      await Promise.all(uniqueFrom.map(async (uid) => {
        const userDoc = await getDoc(doc(db, 'users', uid));
        usernameMap[uid] = userDoc.exists() ? userDoc.data().username || uid : uid;
      }));
      setUsernames(usernameMap);
    });
    return () => unsubscribe();
  }, [user]);

  // Load conversation when a message is expanded
  useEffect(() => {
    if (!user || !expanded) return;
    const q = query(
      collection(db, 'messages'),
      where('to', 'in', [user.uid, expanded]),
      where('from', 'in', [user.uid, expanded]),
      orderBy('createdAt', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setConversation(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user, expanded]);

  const handleExpand = (fromUid: string) => {
    setExpanded(expanded === fromUid ? null : fromUid);
    setReply('');
  };

  const handleReply = async () => {
    if (!user || !expanded || !reply.trim()) return;
    setSending(true);
    await addDoc(collection(db, 'messages'), {
      to: expanded,
      from: user.uid,
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
      {loading ? (
        <p>Loading...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-600">No messages found.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map(msg => (
            <li key={msg.id} className="border-b pb-2">
              <div className="text-sm text-gray-500">From: {usernames[msg.from] || msg.from}</div>
              <div className="text-gray-800 cursor-pointer underline" onClick={() => handleExpand(msg.from)}>
                {msg.text}
              </div>
              <div className="text-xs text-gray-400">{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}</div>
              {expanded === msg.from && (
                <div className="mt-4 bg-gray-50 p-3 rounded">
                  <div className="mb-2 font-semibold">Conversation</div>
                  <div className="max-h-48 overflow-y-auto space-y-2 mb-2">
                    {conversation.map((c, i) => (
                      <div key={c.id || i} className={c.from === user.uid ? 'text-right' : 'text-left'}>
                        <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800 text-sm">
                          {c.text}
                        </span>
                        <div className="text-xs text-gray-400">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      className="flex-1 border rounded p-2"
                      placeholder="Type a reply..."
                      value={reply}
                      onChange={e => setReply(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleReply(); }}
                      disabled={sending}
                    />
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      onClick={handleReply}
                      disabled={sending}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 