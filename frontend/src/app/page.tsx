'use client';

import { useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
// import DrawingCanvas from '@/components/DrawingCanvas'; // keep if you actually use it

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Call useAuth0 ONCE and destructure everything you need
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading, error } = useAuth0();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="space-x-4">
        <button onClick={() => loginWithRedirect()} className="px-4 py-2 bg-blue-600 text-white rounded">
          Log In
        </button>

        <button
          onClick={() => logout({ logoutParams: { returnTo: typeof window !== 'undefined' ? window.location.origin : '/' } })}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          Log Out
        </button>
      </div>

      {/* Loading and error states from Auth0 */}
      {isLoading && <p className="mt-4 text-gray-600">Loading session… chill.</p>}
      {error && <p className="mt-2 text-red-600">Auth error: {String(error.message || error)}</p>}

      {/* Only render user details when authenticated AND user exists */}
      {isAuthenticated && user && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold">{user.name ?? 'Unnamed human'}</h2>
          <p className="text-gray-700">{user.sub ?? 'No email'}</p>
        </div>
      )}

      {/* Example: gated content */}
      {!isAuthenticated && !isLoading && (
        <p className="mt-6 text-gray-700">You’re not logged in. Press the blue button, superhero.</p>
      )}
    </main>
  );
}
