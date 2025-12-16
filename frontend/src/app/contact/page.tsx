"use client";
import React, { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { SpotifyButton } from '@/components/ui/SpotifyButton';
import { toast } from 'sonner';
import { sendContactMessage } from '@/app/api';

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await sendContactMessage(formData.name, formData.email, formData.message);
            toast.success("Message sent! We'll get back to you soon.");
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            toast.error((error as Error).message || 'Failed to send message');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex flex-col items-center min-h-screen p-4 pt-24 pb-24 space-y-16">
            <div className="w-full max-w-3xl text-center space-y-4">
                <h1 className="text-4xl sm:text-5xl font-bold text-white">
                    Get in Touch
                </h1>
                <p className="text-xl text-neutral-400">
                    Have questions about our enterprise solutions or need support? We are here to help.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl">
                <div className="space-y-8">
                    <div className="p-8 rounded-2xl border border-neutral-800 bg-neutral-900">
                        <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <MapPin className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Our Office</h3>
                                    <p className="text-neutral-400">
                                        Lekhsewa Nepal, Basantapur<br />
                                        Kathmandu, Nepal
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <Mail className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Email Us</h3>
                                    <p className="text-neutral-400">support@lekhsewa.com.np</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <Phone className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Call Us</h3>
                                    <p className="text-neutral-400">+977 9703001706</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-2xl border border-neutral-800 bg-neutral-900">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Our Location</h2>
                        <div className="w-full h-80 rounded-xl overflow-hidden border border-neutral-700">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56525.4073216181!2d85.2799972!3d27.69140275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19cb05097d61%3A0x66d083a187176a11!2sVIRINCHI%20COLLEGE!5e0!3m2!1sen!2snp!4v1763142939641!5m2!1sen!2snp"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Virinchi College Location"
                            ></iframe>
                        </div>
                    </div>
                </div>

                <div className="p-8 rounded-2xl border border-neutral-800 bg-neutral-900 h-fit">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">Send us a Message</h2>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
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
                                value={formData.email}
                                onChange={handleChange}
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
                                value={formData.message}
                                onChange={handleChange}
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