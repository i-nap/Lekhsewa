"use client";
import React, { useRef, useState } from 'react';
import DrawingCanvas from '@/components/DrawingCanvas';
import { SpotifyButton } from './ui/SpotifyButton';
import { toast } from 'sonner';
import { postCanvasImage } from '@/api';

interface CanvasModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRecognize: (text: string) => void;
    fieldName: string;
}

function isCanvasEmpty(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) return true;
    const pixelBuffer = new Uint32Array(context.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
    return !pixelBuffer.some(color => color !== 0);
}

export const CanvasModal: React.FC<CanvasModalProps> = ({ isOpen, onClose, onRecognize, fieldName }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    if (!isOpen) return null;

    const handleClearClick = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        context?.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleRecognizeClick = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (isCanvasEmpty(canvas)) {
            toast.error("Canvas is empty. Please draw something.");
            return;
        }

        canvas.toBlob(async (blob) => {
            if (!blob) return;

            setIsUploading(true);
            const toastId = toast.loading('Recognizing character...');

            try {
                // Use the API service function
                const result = await postCanvasImage(blob);

                const text = result.recognizedText || result.FileName;
                onRecognize(text);
                toast.success(`Set field to: ${text}`, { id: toastId });
                onClose();
            } catch (error) {
                toast.error((error as Error).message, { id: toastId });
            } finally {
                setIsUploading(false);
            }
        }, 'image/png');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-2xl p-8 space-y-6 border rounded-2xl bg-neutral-900 border-neutral-800" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute w-8 h-8 font-bold text-black bg-white rounded-full -top-3 -right-3 text-lg">&times;</button>
                <h2 className="text-2xl font-bold text-center text-white">Draw for field: <span className="text-[#1ED760]">{fieldName}</span></h2>
                <div className="w-full overflow-hidden border rounded-lg aspect-video bg-white border-neutral-800">
                    <DrawingCanvas canvasRef={canvasRef} />
                </div>
                <div className="flex w-full space-x-4">
                    <button onClick={handleClearClick} disabled={isUploading} className="flex-1 px-6 py-3 font-semibold transition-colors border rounded-lg bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700 disabled:opacity-50">Clear</button>
                    <SpotifyButton onClick={handleRecognizeClick} disabled={isUploading} className="flex-1 py-3">{isUploading ? 'Recognizing...' : 'Recognize'}</SpotifyButton>
                </div>
            </div>
        </div>
    );
};