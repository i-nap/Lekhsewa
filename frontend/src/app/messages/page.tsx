'use client'
import { useEffect, useState } from 'react';
import { getAllMessages } from '../api';
interface MessageData {
  id: number;
  fullName: string;
  email: string;
  message: string;
  created_at: string;
}

export default function MessagePage() {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const handleReply = (email: string, name: string) => {
    const subject = encodeURIComponent(`Reply to your inquiry - Lekhsewa`);
    const body = encodeURIComponent(`Hi ${name},\n\nThank you for reaching out to Lekhsewa. Regarding your message...`);
   const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
   window.open(gmailUrl, '_blank');
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllMessages();
        if (!data || data.length === 0) {
          setMessages([]);
        } else {
          setMessages(data);
          setError(null);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Could not load messages. Check if the backend URL is correct.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  

  if (loading) return <div className="p-10 text-white bg-gray-900 min-h-screen">Loading...</div>;
  if (error) return <div className="p-10 text-red-500 bg-gray-900 min-h-screen">{error}</div>;

  return (
    <main className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 border-b border-gray-700 pb-4 text-center">User Inquiries</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg hover:border-blue-500 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-600 text-xs font-bold px-2 py-1 rounded uppercase">
                    ID: {msg.id}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {msg.created_at
                      ? new Date(msg.created_at).toLocaleDateString()
                      : "No Date Available"}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-blue-400 mb-1">{msg.fullName}</h2>
               <p 
                  className="text-sm text-blue-400 mb-4 cursor-pointer hover:underline truncate" 
                  title={`Reply to ${msg.email}`} 
                  onClick={() => handleReply(msg.email, msg.fullName)}
                >
                  {msg.email}
                </p>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 h-32 overflow-y-auto">
                  <p className="text-gray-300 italic leading-relaxed text-sm">
                    {msg.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-500">
            <p className="text-xl italic">No messages found in the system.</p>
          </div>
        )}
      </div>
    </main>
  );
}