import { useState, useEffect } from 'react';

interface CoachInquiryModalProps {
  open: boolean;
  onClose: () => void;
  coach: { name: string; userId: string; email?: string };
  user?: { name?: string; email?: string };
  onSubmit: (data: { name: string; email: string; message: string; allowContact: boolean }) => Promise<void>;
}

export default function CoachInquiryModal({ open, onClose, coach, user, onSubmit }: CoachInquiryModalProps) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [allowContact, setAllowContact] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setName(user?.name || '');
      setEmail(user?.email || '');
      setMessage('');
      setAllowContact(true);
      setSuccess(false);
      setError('');
    }
  }, [open, user]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSubmit({ name, email, message, allowContact });
      setSuccess(true);
    } catch (err: any) {
      setError('Failed to send inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 relative animate-fade-in">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-2 text-gray-900">Inquire About Coaching</h2>
        <p className="mb-6 text-gray-600">Send a message to <span className="font-semibold">{coach.name}</span></p>
        {success ? (
          <div className="text-green-600 font-semibold text-center py-8">Inquiry sent! The coach will contact you soon.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Message</label>
              <textarea
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                placeholder="Tell the coach your goals, training level, or questions"
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowContact"
                checked={allowContact}
                onChange={e => setAllowContact(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="allowContact" className="text-gray-700">Allow coach to contact me via email</label>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Inquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 