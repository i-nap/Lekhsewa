"use client";
import React, { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { SpotifyButton } from '@/components/ui/SpotifyButton';
import { toast } from 'sonner';

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            toast.success("Message sent! We'll get back to you soon.");
            setIsSubmitting(false);
            (e.target as HTMLFormElement).reset();
        }, 1500);
    };

    return (
        <main className="flex flex-col items-center min-h-screen p-4 pt-24 pb-24 space-y-16">
            <div className="w-full max-w-3xl text-center space-y-4">
                <h1 className="text-4xl sm:text-5xl font-bold text-white">
                    Get in Touch
                </h1>
                <p className="text-xl text-neutral-400">
                    Have questions about our enterprise solutions or need support? We're here to help.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl">
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-white">Contact Information</h2>
                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <MapPin className="w-6 h-6 text-green-500 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-white">Our Office</h3>
                                <p className="text-neutral-400">
                                    Lekhsewa HQ, IT Park<br />
                                    Kavrepalanchok, Banepa, Nepal
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Mail className="w-6 h-6 text-blue-500" />
                            <div>
                                <h3 className="text-lg font-semibold text-white">Email Us</h3>
                                <p className="text-neutral-400">support@lekhsewa.com.np</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Phone className="w-6 h-6 text-purple-500" />
                            <div>
                                <h3 className="text-lg font-semibold text-white">Call Us</h3>
                                <p className="text-neutral-400">+977 9800000000</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-64 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-500">
                        [ Map of IT Park, Kavre ]
                    </div>
                </div>

                <div className="p-8 rounded-2xl border border-neutral-800 bg-neutral-900">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                required
                                className="w-full p-3 rounded-lg bg-black border border-neutral-800 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                required
                                className="w-full p-3 rounded-lg bg-black border border-neutral-800 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-neutral-300 mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                rows={5}
                                required
                                className="w-full p-3 rounded-lg bg-black border border-neutral-800 text-white focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
                                placeholder="How can we help you?"
                            />
                        </div>
                        <SpotifyButton type="submit" disabled={isSubmitting} className="w-full py-3">
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </SpotifyButton>
                    </form>
                </div>
            </div>
        </main>
    );
}