'use client';

import { useRef, useState } from 'react';
import DrawingCanvas from '@/components/DrawingCanvas';
import { useAuth0 } from '@auth0/auth0-react';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { SpotifyButton } from '@/components/ui/SpotifyButton';

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const [recognizedText, setRecognizedText] = useState<string>('');

    const { isAuthenticated, isLoading, loginWithRedirect, error } = useAuth0();

    // --- API and Clear Logic ---
    const handleDoneClick = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.toBlob(async (blob) => {
            if (!blob) return;
            const formData = new FormData();
            formData.append('file', blob, 'canvas-image.png');

            setIsUploading(true);
            setRecognizedText('');
            const toastId = toast.loading('Recognizing character...');
            try {
                const response = await fetch('https://lekhsewa.onrender.com/api/sendcanvasimage', {
                    method: 'POST',
                    body: formData,
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error);

                setStatusMessage(`Success! Predicted character: ${result.recognizedText}`);
                setRecognizedText(result.recognizedText);
                toast.success(`Recognized: ${result.recognizedText}`, { id: toastId });
            } catch (error) {
                setStatusMessage(`Error: ${(error as Error).message}`);
                toast.error((error as Error).message, { id: toastId });
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
        setRecognizedText('');
    };

    const handleCopy = () => {
        if (!recognizedText) return;
        navigator.clipboard.writeText(recognizedText);
        toast.success('Copied to clipboard!');
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
                    <SpotifyButton onClick={() => loginWithRedirect()}>
                        Get Started
                    </SpotifyButton>
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
                {recognizedText && (
                    <div className="flex items-center space-x-4 p-4 rounded-lg bg-black border border-neutral-800">
                        <span className="text-4xl font-bold text-green-400 flex-1 text-center">
                            {recognizedText}
                        </span>
                        <button
                            onClick={handleCopy}
                            className="p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
                            title="Copy to clipboard"
                        >
                            <Copy className="w-6 h-6 text-neutral-300" />
                        </button>
                    </div>
                )}

                <div className="h-8 flex items-center justify-center">
                    {!recognizedText && statusMessage && (
                        <p className={`text-base font-medium ${statusMessage.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>
                            {statusMessage}
                        </p>
                    )}
                </div>

                <div className="flex w-full space-x-4">
                    <button
                        onClick={handleClearClick}
                        disabled={isUploading}
                        className="flex-1 ...">
                        Clear
                    </button>
                    <button
                        onClick={handleDoneClick}
                        disabled={isUploading}
                        className="flex-1 ...">
                        {isUploading ? 'Processing...' : 'Recognize'}
                    </button>
                </div>
            </div>

            {/* --- Extra content --- */}
            {/* <div className="w-full max-w-2xl text-left space-y-6 rounded-2xl border border border-neutral-800 bg-neutral-900 p-6 sm:p-8 shadow-lg">
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100">About Lekhsewa</h2>
                <p className="text-neutral-400 leading-relaxed">
                    Lekhsewa is a cutting-edge project designed to bridge the gap between handwritten Nepali script and digital text. Using advanced machine learning models, our application can recognize and transcribe characters drawn on the canvas in real-time.
                </p>
                <p className="text-neutral-400 leading-relaxed">
                    Our mission is to preserve and promote the Nepali language in the digital age. This demo showcases the core recognition functionality of our system. Draw a character, click "Recognize", and see the magic happen!
                </p>
                <div className="h-48"></div>
            </div> */}

            <footer className="mt-8 text-sm text-neutral-500">
                <p>Developed for Lekhsewa Project &copy; 2025</p>
            </footer>
        </main >
    );
}


