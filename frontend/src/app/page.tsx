'use client';

import { useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import DrawingCanvas from '@/components/DrawingCanvas';


export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

    const { isAuthenticated, isLoading, loginWithRedirect, error } = useAuth0();

    // --- API and Clear Logic ---
    const handleDoneClick = async () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            setStatusMessage('Error: Canvas not found.');
            return;
        }
        canvas.toBlob(async (blob) => {
            if (!blob) {
                setStatusMessage('Error: Could not capture canvas image.');
                return;
            }
            const formData = new FormData();
            formData.append('file', blob, 'canvas-image.png');
            setIsUploading(true);
            setStatusMessage('Uploading your drawing...');
            try {
                const response = await fetch('https://lekhsewa.onrender.com/api/sendcanvasimage', {
                    method: 'POST',
                    body: formData,
                });
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.error || 'An unknown error occurred.');
                }
                setStatusMessage(`Success! Predicted character: ${result.FileName}`);
                console.log('Server response:', result);
            } catch (error) {
                setStatusMessage(`Error: ${(error as Error).message}`);
                console.error('Failed to send image:', error);
            } finally {
                setIsUploading(false);
            }
        }, 'image/png');
    };

    const handleClearClick = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;
        context.clearRect(0, 0, canvas.width, canvas.height);
        setStatusMessage('');
    };

    // Show a loading screen while Auth0 checks the session
    if (isLoading) {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen p-4 pt-24 pb-24">
                <p className="text-lg text-neutral-300">Loading Session...</p>
            </main>
        );
    }

    // Show error message if Auth0 fails
    if (error) {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen p-4 pt-24 pb-24">
                <p className="text-lg text-red-500">Authentication Error: {error.message}</p>
            </main>
        );
    }

    // If NOT authenticated, show a login prompt
    if (!isAuthenticated) {
        return (
            <main className="flex flex-col items-center justify-center min-h-[80vh] p-4">
                <div className="text-center w-full max-w-lg p-8 bg-neutral-900 rounded-lg border border-neutral-800">
                    <h1 className="text-3xl font-bold text-white">Welcome to Lekhsewa</h1>
                    <p className="text-lg text-neutral-400 mt-4 mb-8">Please log in or sign up to use the Nepali Character Canvas.</p>
                    <button
                        onClick={() => loginWithRedirect()}
                        className="px-8 py-3 bg-white text-neutral-900 font-bold rounded-lg hover:bg-neutral-200 transition-colors"
                    >
                        Get Started
                    </button>
                </div>
            </main>
        );
    }

    // If authenticated, show your full application page
    return (
        <main className="flex flex-col items-center min-h-screen p-4 pt-24 pb-24 space-y-8 sm:space-y-12">
            <div className="w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-4 sm:p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-neutral-100">
                        Nepali Character Canvas
                    </h1>
                    <p className="text-md sm:text-lg text-neutral-400 mt-2">
                        Draw a single Nepali character in the box below.
                    </p>
                </div>
                <div className="w-full aspect-video rounded-lg bg-black border border-neutral-800 overflow-hidden">
                    <DrawingCanvas canvasRef={canvasRef} />
                </div>
                <div className="flex flex-col items-center space-y-4 pt-2">
                    <div className="flex w-full sm:w-auto space-x-4">
                        <button
                            onClick={handleClearClick}
                            disabled={isUploading}
                            className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg border border-gray-300
                                       hover:bg-gray-100
                                       disabled:opacity-50 disabled:cursor-not-allowed
                                       transition-colors duration-200"
                        >
                            Clear
                        </button>
                        <button
                            onClick={handleDoneClick}
                            disabled={isUploading}
                            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg
                                       hover:bg-blue-700
                                       focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75
                                       disabled:opacity-50 disabled:cursor-not-allowed
                                       transition-colors duration-200 shadow-md"
                        >
                            {isUploading ? 'Processing...' : 'Recognize'}
                        </button>
                    </div>
                    <div className="h-8 flex items-center">
                        {statusMessage && (
                            <p className={`mt-4 text-base font-medium ${statusMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
                                {statusMessage}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* --- Extra content --- */}
            <div className="w-full max-w-2xl text-left space-y-6 rounded-2xl border border border-neutral-800 bg-neutral-900 p-6 sm:p-8 shadow-lg">
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100">About Lekhsewa</h2>
                <p className="text-neutral-400 leading-relaxed">
                    Lekhsewa is a cutting-edge project designed to bridge the gap between handwritten Nepali script and digital text. Using advanced machine learning models, our application can recognize and transcribe characters drawn on the canvas in real-time.
                </p>
                <p className="text-neutral-400 leading-relaxed">
                    Our mission is to preserve and promote the Nepali language in the digital age. This demo showcases the core recognition functionality of our system. Draw a character, click "Recognize", and see the magic happen!
                </p>
                <div className="h-48"></div>
            </div>

            <footer className="mt-8 text-sm text-neutral-300">
                <p>Developed for Lekhsewa Project &copy; 2025</p>
            </footer>
        </main>
    );
}


