'use client';

import { useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Call useAuth0 ONCE and destructure everything you need
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading, error } = useAuth0();

  const handleDoneClick = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setStatusMessage('No canvas available.');
      return;
    }

    setIsUploading(true);

    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          setStatusMessage('Failed to create image blob.');
          setIsUploading(false);
          return;
        }

        try {
          const form = new FormData();
          form.append('file', blob, 'drawing.png');

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: form,
          });

          const result: any = await response.json();

          if (!response.ok) {
            throw new Error(result.error || 'An unknown error occurred.');
          }

          setStatusMessage(`Success! File saved as: ${result.FileName}`);
          console.log('Server response:', result);
        } catch (err) {
          setStatusMessage(`Error: ${(err as Error).message}`);
          console.error('Failed to send image:', err);
        } finally {
          setIsUploading(false);
        }
      },
      'image/png'
    );
  };

  const handleClearClick = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStatusMessage('');
  };

  return (
    <main className="flex flex-col items-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-8 pt-24 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Nepali Typing</h1>
        <p className="text-lg text-gray-600 mt-2">Draw your Nepali characters below.</p>
      </div>

      <div className="mb-6">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="border border-gray-300 rounded-md bg-white"
        />
      </div>

      <div className="space-x-4 mb-4">
        <button onClick={() => loginWithRedirect()} className="px-4 py-2 bg-blue-600 text-white rounded">
          Log In
        </button>

        <button
          onClick={() =>
            logout({ logoutParams: { returnTo: typeof window !== 'undefined' ? window.location.origin : '/' } })
          }
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          Log Out
        </button>
      </div>

      {isLoading && <p className="mt-2 text-gray-600">Loading session…</p>}
      {error && <p className="mt-2 text-red-600">Auth error: {String(error.message || error)}</p>}

      {isAuthenticated && user && (
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold">{user.name ?? 'Unnamed human'}</h2>
          <p className="text-gray-700">{user.sub ?? 'No email'}</p>
        </div>
      )}

      <div className="mt-6 flex space-x-4">
        <button
          onClick={handleClearClick}
          disabled={isUploading}
          className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 disabled:bg-gray-300"
        >
          Clear
        </button>
        <button
          onClick={handleDoneClick}
          disabled={isUploading}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isUploading ? 'Sending...' : 'Done'}
        </button>
      </div>

      {statusMessage && (
        <p className={`mt-4 text-lg font-medium ${statusMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {statusMessage}
        </p>
      )}
    </main>
  );
}
