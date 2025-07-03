"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { db } from '@/lib/firebase/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export default function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'messages'),
      where('to', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

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
              <div className="text-sm text-gray-500">From: {msg.from}</div>
              <div className="text-gray-800">{msg.text}</div>
              <div className="text-xs text-gray-400">{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 