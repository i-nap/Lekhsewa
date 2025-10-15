'use client';

import React, { useRef, useEffect, useState } from 'react';

interface DrawingCanvasProps {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ canvasRef }) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;
        contextRef.current = context;

     
        const handleResize = () => {
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            context.putImageData(imageData, 0, 0);
            context.lineCap = 'round';
            context.strokeStyle = 'black';
            context.lineWidth = 3;
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(canvas);
        handleResize();
        return () => {
            resizeObserver.disconnect();
        };
    }, [canvasRef]);

    const getCoordinates = (event: MouseEvent | TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { offsetX: 0, offsetY: 0 };

        const rect = canvas.getBoundingClientRect();
        const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            offsetX: (clientX - rect.left) * scaleX,
            offsetY: (clientY - rect.top) * scaleY,
        };
    };

    const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
        if (!contextRef.current) return;
        const { offsetX, offsetY } = getCoordinates(event.nativeEvent);
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const stopDrawing = () => {
        if (!contextRef.current) return;
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const draw = (event: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || !contextRef.current) return;
        const { offsetX, offsetY } = getCoordinates(event.nativeEvent);
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    return (
        <canvas
            ref={canvasRef as React.RefObject<HTMLCanvasElement>}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchEnd={stopDrawing}
            onTouchMove={draw}
            className="w-full h-full"
        />
    );
};

export default DrawingCanvas;