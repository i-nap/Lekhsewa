"use client";
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { CanvasModal } from '@/components/CanvasModal';
import { SpotifyButton } from '@/components/ui/SpotifyButton';
import { toast } from 'sonner';

interface FormField {
    field: string;  // e.g., "first_name"
    type: string;  // e.g., "text", "number", "email"
    label: string; // e.g., "पहिलो नाम" (First Name)
}

const formSites = [
    { id: 'none', name: 'Select a form...' },
    { id: 'lok_sewa', name: 'Lok Sewa Aayog (Public Service Commission)' },
    { id: 'vehicle_reg', name: 'Online Vehicle Registration' },
    { id: 'e_passport', name: 'E-Passport Application' },
];

export default function FormDeveloperPage() {
    const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
    const [selectedForm, setSelectedForm] = useState<string>('none');
    const [fields, setFields] = useState<FormField[]>([]);
    const [formData, setFormData] = useState<Record<string, string>>({});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentField, setCurrentField] = useState<{ field: string, label: string } | null>(null);

    useEffect(() => {
        if (selectedForm === 'none') {
            setFields([]);
            return;
        }

        // --- MOCK BACKEND FETCH ---
        // const response = await fetch(`/api/get-form-fields?formId=${selectedForm}`);
        // const data = await response.json();

        let mockData: FormField[] = [];
        if (selectedForm === 'lok_sewa') {
            mockData = [
                { field: 'first_name', type: 'text', label: 'पहिलो नाम' },
                { field: 'last_name', type: 'text', label: 'थर' },
                { field: 'father_name', type: 'text', label: 'बुबाको नाम' },
                { field: 'age', type: 'number', label: 'उमेर' },
            ];
        } else if (selectedForm === 'e_passport') {
            mockData = [
                { field: 'given_name', type: 'text', label: 'Given Name' },
                { field: 'surname', type: 'text', label: 'Surname' },
                { field: 'nationality', type: 'text', label: 'Nationality' },
            ];
        }
        setFields(mockData);
        setFormData({});
    }, [selectedForm]);

    // --- Modal & Form Handlers ---
    const handleInputClick = (field: string, label: string) => {
        setCurrentField({ field, label });
        setIsModalOpen(true);
    };

    const handleRecognize = (text: string) => {
        if (currentField) {
            setFormData(prevData => ({
                ...prevData,
                [currentField.field]: text,
            }));
        }
    };

    // Update form data on normal typing
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevData => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Form Submitted!");
        console.log("Form Data:", formData);
        // Here you would POST this `formData` to your backend API
    };

    // --- Render Logic ---

    if (isLoading) {
        return <main className="text-center p-24">Loading session...</main>;
    }

    if (!isAuthenticated) {
        return (
            <main className="flex flex-col items-center justify-center min-h-[80vh] p-4">
                <div className="text-center w-full max-w-lg p-8 bg-neutral-900 rounded-lg border border-neutral-800">
                    <h1 className="text-3xl font-bold text-white">Access Denied</h1>
                    <p className="text-lg text-neutral-400 mt-4 mb-8">
                        You must be logged in to use the Form Developer.
                    </p>
                    <SpotifyButton onClick={() => loginWithRedirect()}>
                        Log In
                    </SpotifyButton>
                </div>
            </main>
        );
    }

    return (
        <>
            <main className="flex flex-col items-center min-h-screen p-4 pt-24 pb-24 space-y-8">
                {/* 1. Welcome Card */}
                <div className="w-full max-w-3xl text-center p-8 bg-neutral-900 rounded-lg border border-neutral-800">
                    <h1 className="text-3xl font-bold text-white">Welcome, Form Developer!</h1>
                    <p className="text-lg text-neutral-400 mt-4">
                        Tired of typing in Nepali? Select a form below, and use our canvas to
                        draw your entries instead. We'll handle the rest.
                    </p>
                </div>

                {/* 2. Dropdown & Form Card */}
                <div className="w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8 space-y-6">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="form-select" className="block text-sm font-medium text-neutral-300">
                            Select an Online Form
                        </label>
                        <select
                            id="form-select"
                            value={selectedForm}
                            onChange={(e) => setSelectedForm(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-3 text-base text-white
                         bg-neutral-800 border-neutral-700 rounded-md
                         focus:outline-none focus:ring-green-500 focus:border-green-500"
                        >
                            {formSites.map(site => (
                                <option key={site.id} value={site.id} disabled={site.id === 'none'}>
                                    {site.name}
                                </option>
                            ))}
                        </select>

                        {fields.length > 0 && (
                            <div className="mt-8 space-y-6">
                                {fields.map(field => (
                                    <div key={field.field}>
                                        <label
                                            htmlFor={field.field}
                                            className="block text-lg font-medium text-neutral-200 mb-2"
                                        >
                                            {field.label}
                                        </label>
                                        <input
                                            type={field.type}
                                            id={field.field}
                                            name={field.field}
                                            value={formData[field.field] || ''}
                                            onChange={handleInputChange}
                                            onClick={() => handleInputClick(field.field, field.label)}
                                            placeholder={`Click to draw or type for ${field.label}...`}
                                            className="w-full p-4 rounded-lg bg-black text-neutral-200
                                 border border-neutral-800 caret-green-500
                                 focus:outline-none focus:ring-2 focus:ring-green-500
                                 cursor-pointer"
                                            readOnly
                                        />
                                    </div>
                                ))}

                                <SpotifyButton type="submit" className="w-full py-4">
                                    Submit Form
                                </SpotifyButton>
                            </div>
                        )}
                    </form>
                </div>
            </main>

            <CanvasModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRecognize={handleRecognize}
                fieldName={currentField?.label || 'Field'}
            />
        </>
    );
}