"use client";
import React from 'react';
import { PenTool, FileText, Database, Globe, Cpu, ShieldCheck } from 'lucide-react';

export default function ServicesPage() {
    const services = [
        {
            icon: <PenTool className="w-10 h-10 text-green-500" />,
            title: 'Handwriting Recognition',
            description: 'Our core AI model accurately converts handwritten Nepali characters into digital text in milliseconds.',
        },
        {
            icon: <FileText className="w-10 h-10 text-blue-500" />,
            title: 'Digital Form Filling',
            description: 'Directly fill out complex government and organizational forms by simply drawing your answers on screen.',
        },
        {
            icon: <Database className="w-10 h-10 text-purple-500" />,
            title: 'Document Digitization',
            description: 'We help organizations convert their physical archives of handwritten Nepali documents into searchable digital databases.',
        },
        {
            icon: <Cpu className="w-10 h-10 text-red-500" />,
            title: 'API Integration',
            description: 'Developers can integrate our recognition engine into their own apps using our robust and scalable REST API.',
        },
        {
            icon: <Globe className="w-10 h-10 text-yellow-500" />,
            title: 'Language Preservation',
            description: 'We are committed to building open-source datasets to help preserve the Nepali language for future AI generations.',
        },
        {
            icon: <ShieldCheck className="w-10 h-10 text-teal-500" />,
            title: 'Secure Data Processing',
            description: 'Your data is processed securely with enterprise-grade encryption and is never used for training without explicit consent.',
        },
    ];

    return (
        <main className="flex flex-col items-center min-h-screen p-4 pt-24 pb-24 space-y-16">
            <div className="w-full max-w-3xl text-center space-y-4">
                <h1 className="text-4xl sm:text-5xl font-bold text-white">
                    Our Services
                </h1>
                <p className="text-xl text-neutral-400">
                    Bridging the gap between traditional Nepali script and the digital world.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="p-8 rounded-2xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 transition-colors duration-300"
                    >
                        <div className="mb-6 p-3 inline-block rounded-xl bg-neutral-800/50">
                            {service.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                        <p className="text-neutral-400 leading-relaxed">
                            {service.description}
                        </p>
                    </div>
                ))}
            </div>
        </main>
    );
}