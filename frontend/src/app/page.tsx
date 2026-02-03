'use client';

import { useRef, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Copy, Undo } from 'lucide-react';
import { toast } from 'sonner';
import { SpotifyButton } from '@/components/ui/SpotifyButton';
import DrawingCanvas from '@/components/DrawingCanvas';
import { postCanvasImage, getUserQuota } from './api';
import { useUser } from '@/contexts/UserContext';

// Helper function to check if the canvas is empty
function isCanvasEmpty(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d');
  if (!context) return true;
  const pixelBuffer = new Uint32Array(context.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
  return !pixelBuffer.some(color => color !== 0);
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [quota, setQuota] = useState<number>(0);
  const [loadingQuota, setLoadingQuota] = useState(false);
  const { isAuthenticated, isLoading, loginWithRedirect, error } = useAuth0();
  const { sub, plan } = useUser();
  const isFreeUser = plan === 'free';

  // Fetch quota when user is authenticated
  useEffect(() => {
    if (isAuthenticated && sub) {
      fetchQuota();
    }
  }, [isAuthenticated, sub]);

  const fetchQuota = async () => {
    if (!sub) return;
    try {
      setLoadingQuota(true);
      const quotaValue = await getUserQuota(sub);
      setQuota(quotaValue);
    } catch (error) {
      console.error('Error fetching quota:', error);
      toast.error('Failed to load quota');
    } finally {
      setLoadingQuota(false);
    }
  };

  // --- API and Clear Logic ---
  const handleDoneClick = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isCanvasEmpty(canvas)) {
      toast.error("Canvas is empty. Please draw a character first.");
      return;
    }
    // Create a temp canvas with white background
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;

    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // draw the real canvas on top
    ctx.drawImage(canvas, 0, 0);

    exportCanvas.toBlob(async (blob) => {
      if (!blob) return;

      setIsUploading(true);
      setRecognizedText('');
      const toastId = toast.loading('Recognizing character...');

      try {
        const result = await postCanvasImage(blob, sub || '');

        const text = result.word;
        setStatusMessage(`Success! Predicted character: ${text}`);
        setRecognizedText(text);
        toast.success(`Recognized: ${text}`, { id: toastId });
        // Refresh quota after recognition
        await fetchQuota();

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
    setStatusMessage('');
  };

  const handleCopy = () => {
    if (!recognizedText) return;
    navigator.clipboard.writeText(recognizedText);
    toast.success('Copied to clipboard!');
  };

  const handleStrokeStart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    // Capture current state before new stroke
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev, imageData]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Get the last saved state
    const previousState = history[history.length - 1];

    // Restore it
    context.putImageData(previousState, 0, 0);

    // Remove it from stack
    setHistory((prev) => prev.slice(0, -1));
  };

  // --- Auth Render Logic ---
  if (isLoading) {
    return <main className="flex items-center justify-center min-h-[80vh]"><p>Loading Session...</p></main>;
  }
  if (error) {
    return <main className="flex items-center justify-center min-h-[80vh]"><p>Authentication Error: {error.message}</p></main>;
  }
  if (!isAuthenticated) {
    return (
      <main className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center w-full max-w-lg p-8 bg-neutral-900 rounded-lg border border-neutral-800">
          <h1 className="text-3xl font-bold text-white">Welcome to Lekhsewa</h1>
          <p className="mt-4 mb-8 text-lg text-neutral-400">Please log in to use the Nepali Character Canvas.</p>
          <SpotifyButton onClick={() => loginWithRedirect()}>Get Started</SpotifyButton>
        </div>
      </main>
    );
  }

  // --- Authenticated Render ---
  return (
    <main className="flex flex-col items-center min-h-screen p-4 pt-24 pb-24 space-y-8 sm:space-y-4">
      {/* Quota Display - Only for Free Users */}
      {isAuthenticated && isFreeUser && (
        <div className="w-full max-w-2xl">
          <div className="p-4 text-center bg-neutral-900 border border-neutral-800 rounded-lg">
            <p className="text-sm text-neutral-400">Daily Quota</p>
            <p className="text-2xl font-bold text-green-400">{loadingQuota ? '...' : `${quota}/6`}</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl p-4 space-y-6 border rounded-2xl sm:p-8 bg-neutral-900 border-neutral-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold sm:text-4xl text-neutral-100">Nepali Character Canvas</h1>
          <p className="mt-2 text-md sm:text-lg text-neutral-400">Draw a Nepali character in the box below.</p>
        </div>
        <div className="w-full overflow-hidden border rounded-lg aspect-video bg-white border-neutral-800 touch-none">
          <DrawingCanvas canvasRef={canvasRef} onStrokeStart={handleStrokeStart} />
        </div>

        {recognizedText && (
          <div className="flex items-center p-4 space-x-4 bg-black border rounded-lg border-neutral-800">
            <span className="flex-1 text-4xl font-bold text-center text-green-400">{recognizedText}</span>
            <button onClick={handleCopy} className="p-3 transition-colors rounded-lg bg-neutral-800 hover:bg-neutral-700" title="Copy to clipboard">
              <Copy className="w-6 h-6 text-neutral-300" />
            </button>
          </div>
        )}
        <div className="flex items-center justify-center h-8">
          {!recognizedText && statusMessage && (
            <p className={`text-base font-medium ${statusMessage.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>{statusMessage}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full pt-2">
          <div className="flex gap-2 sm:gap-4 justify-center">
            <button
              onClick={handleUndo}
              disabled={isUploading || history.length === 0}
              className="px-3 sm:px-4 py-2 sm:py-3 font-semibold transition-colors border rounded-lg bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 disabled:opacity-50 flex items-center justify-center"
              title="Undo last stroke"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button onClick={handleClearClick} disabled={isUploading} className="px-4 sm:px-8 py-2 sm:py-3 font-semibold transition-colors border rounded-lg bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 disabled:opacity-50">Clear</button>
          </div>
          <button onClick={handleDoneClick} disabled={isUploading} className="px-4 sm:px-8 py-2 sm:py-3 font-bold text-neutral-900 transition-colors bg-white rounded-lg hover:bg-neutral-200 disabled:opacity-50 w-full">
            {isUploading ? 'Processing...' : 'Recognize'}
          </button>
        </div>
      </div>
      <footer className="mt-8 text-sm text-neutral-500"><p>Developed for Lekhsewa Project &copy; 2025</p></footer>
    </main>
  );
}