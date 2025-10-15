'use client';

import { useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import DrawingCanvas from '@/components/DrawingCanvas';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

    // --- API and Clear Logic (No changes needed here) ---
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

    return (
        <main className="flex flex-col items-center min-h-screen p-4 pt-24 pb-24 space-y-12">
            <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 space-y-6 shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">
                        Nepali Character Canvas
                    </h1>
                    <p className="text-lg text-slate-600 mt-2">
                        Draw a single Nepali character in the box below.
                    </p>
                </div>
                {/* --- Drawing Canvas Section --- */}
                <div className="w-full rounded-lg bg-gray-50 border border-gray-300">
                    <DrawingCanvas canvasRef={canvasRef} />
                </div>

                <div className="flex flex-col items-center space-y-4 pt-2">
                    <div className="flex space-x-4">
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
            <div className="w-full max-w-2xl text-left space-y-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-lg">
                <h2 className="text-3xl font-bold text-slate-900">About Lekhsewa</h2>
                <p className="text-slate-600 leading-relaxed">
                    Lekhsewa is a cutting-edge project designed to bridge the gap between handwritten Nepali script and digital text. Using advanced machine learning models, our application can recognize and transcribe characters drawn on the canvas in real-time. This technology has wide-ranging applications, from educational tools to accessibility features for digitizing historical documents.
                </p>
                <p className="text-slate-600 leading-relaxed">
                    Our mission is to preserve and promote the Nepali language in the digital age. By providing an intuitive and responsive platform, we hope to make it easier for everyone to interact with Nepali script, whether they are learning the alphabet or need a powerful tool for transcription. This demo showcases the core recognition functionality of our system. Draw a character, click "Recognize", and see the magic happen!
                </p>
                <div className="h-48"></div>
            </div>


            <footer className="mt-8 text-sm text-slate-500">
                <p>Developed for Lekhsewa Project &copy; 2025</p>
            </footer>

        </main>
    );
}


