'use client';

import { useRef, useState } from 'react';
import DrawingCanvas from '@/components/DrawingCanvas';

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);


    // const handleDoneClick = async () => {
    //     const canvas = canvasRef.current;
    //     if (!canvas) {
    //         setStatusMessage('Error: Canvas not found.');
    //         return;
    //     }

    //     canvas.toBlob(async (blob) => {
    //         if (!blob) {
    //             setStatusMessage('Error: Could not capture canvas image.');
    //             return;
    //         }

    //         const formData = new FormData();
    //         formData.append('file', blob, 'canvas-image.png');

    //         setIsLoading(true);
    //         setStatusMessage('Uploading your drawing...');

    //         try {
    //             const response = await fetch('https://lekhsewa.onrender.com/api/sendcanvasimage', {
    //                 method: 'POST',
    //                 body: formData,
    //             });

    //             const result = await response.json();

    //             if (!response.ok) {
    //                 throw new Error(result.error || 'An unknown error occurred.');
    //             }

    //             setStatusMessage(`Success! File saved as: ${result.FileName}`);
    //             console.log('Server response:', result);

    //         } catch (error) {
    //             setStatusMessage(`Error: ${(error as Error).message}`);
    //             console.error('Failed to send image:', error);

    //         } finally {
    //             setIsLoading(false);
    //         }

    //     }, 'image/png');
    // };

    // const handleClearClick = () => {
    //     const canvas = canvasRef.current;
    //     if (!canvas) return;
    //     const context = canvas.getContext('2d');
    //     if (!context) return;
    //     context.clearRect(0, 0, canvas.width, canvas.height);
    //     setStatusMessage('');
    // }

    return (
        
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
            
            {/* <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-gray-800">Nepali Typing </h1>
                <p className="text-lg text-gray-600 mt-2">Draw your Nepali characters below.</p>
            </div>

            <DrawingCanvas canvasRef={canvasRef} />

            <div className="mt-6 flex space-x-4">
                <button
                    onClick={handleClearClick}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    Clear
                </button>
                <button
                    onClick={handleDoneClick}
                    disabled={isLoading}
                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'Sending...' : 'Done'}
                </button>
            </div>

            {statusMessage && (
                <p className={`mt-4 text-lg font-medium ${statusMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
                    {statusMessage}
                </p>
            )} */}

            <button>

            <a className='text-black' href="/auth/login">Login</a>
            </button>
        </main>
    );
}