"use client";
import React, { useRef, useState } from 'react';
import DrawingCanvas from '@/components/DrawingCanvas';
import { SpotifyButton } from './ui/SpotifyButton';
import { toast } from 'sonner';

interface CanvasModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRecognize: (text: string) => void;
    fieldName: string;
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

        canvas.toBlob(async (blob) => {
            if (!blob) return;

            const formData = new FormData();
            formData.append('file', blob, 'canvas-image.png');

            setIsUploading(true);
            const toastId = toast.loading('Recognizing character...');

            try {
                const response = await fetch('https://lekhsewa.onrender.com/api/sendcanvasimage', {
                    method: 'POST',
                    body: formData,
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error);
                onRecognize(result.recognizedText);
                toast.success(`Set field to: ${result.recognizedText}`, { id: toastId });
                onClose();
            } catch (error) {
                toast.error((error as Error).message, { id: toastId });
            } finally {
                setIsUploading(false);
            }
        }, 'image/png');
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-8 space-y-6"
                onClick={(e) => e.stopPropagation()} 
            >
                <button
                    onClick={onClose}
                    className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-black font-bold text-lg"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-bold text-center text-white">
                    Draw for field: <span className="text-[#1ED760]">{fieldName}</span>
                </h2>

                <div className="w-full aspect-video rounded-lg bg-white border border-neutral-800 overflow-hidden">
                    <DrawingCanvas canvasRef={canvasRef} />
                </div>

                <div className="flex w-full space-x-4">
                    <button
                        onClick={handleClearClick}
                        disabled={isUploading}
                        className="flex-1 px-6 py-3 bg-neutral-800 text-neutral-300 font-semibold rounded-lg border border-neutral-700
                       hover:bg-neutral-700 disabled:opacity-50 transition-colors"
                    >
                        Clear
                    </button>

                    <SpotifyButton
                        onClick={handleRecognizeClick}
                        disabled={isUploading}
                        className="flex-1 py-3"
                    >
                        {isUploading ? 'Recognizing...' : 'Recognize'}
                    </SpotifyButton>
                </div>
            </div>
        </div>
    );
};