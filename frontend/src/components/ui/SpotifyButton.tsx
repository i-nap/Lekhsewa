"use client";
import React from "react";

interface SpotifyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const SpotifyButton: React.FC<SpotifyButtonProps> = ({
    children,
    className,
    ...props
}) => {
    return (
        <button
            className={`
        px-12 py-4 rounded-full bg-[#1ED760] font-bold text-black 
        tracking-widest uppercase transform hover:scale-105 
        hover:bg-[#21e065] transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className} 
      `}
            {...props}
        >
            {children}
        </button>
    );
};