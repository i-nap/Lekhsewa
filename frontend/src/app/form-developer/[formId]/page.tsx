"use client";
import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CanvasModal } from "@/components/CanvasModal";
import { SpotifyButton } from "@/components/ui/SpotifyButton";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getFormById } from "@/api"; // Import from new API folder

// --- Type Definitions based on your Backend DTOs ---
interface FieldOptionDTO { value: string; label: string; }
interface FieldDTO { id: number; label: string; field_name: string; type: string; required: boolean; nepali_text: boolean; options: FieldOptionDTO[]; }
interface FormDTO { id: number; name: string; description: string; }

// --- Helper for Grid Layout ---
const getFieldSpan = (fieldName: string): string => {
    if (['firstName', 'middleName', 'lastName', 'dob', 'age', 'gender', 'province', 'district', 'wardNo'].includes(fieldName)) return 'md:col-span-2';
    if (['citizenshipNo', 'issuingDistrict'].includes(fieldName)) return 'md:col-span-3';
    return 'md:col-span-6';
};

export default function FormDisplayPage() {
    const params = useParams();
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth0();

    const [formDetails, setFormDetails] = useState<FormDTO | null>(null);
    const [fields, setFields] = useState<FieldDTO[]>([]);
    const [isFormLoading, setIsFormLoading] = useState(true);
    const [formData, setFormData] = useState<Record<string, string>>({});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentField, setCurrentField] = useState<{ field: string; label: string } | null>(null);

    useEffect(() => {
        const formId = params.formId as string;
        if (!formId) return;

        setIsFormLoading(true);
        // Use the API service function
        getFormById(formId)
            .then(data => {
                setFormDetails(data.form);
                setFields(data.fields || []);
                setFormData({});
            })
            .catch(err => toast.error((err as Error).message))
            .finally(() => setIsFormLoading(false));
    }, [params.formId]); // Correctly depend on params.formId

    const handleInputClick = (field: FieldDTO) => {
        if (field.nepali_text) {
            setCurrentField({ field: field.field_name, label: field.label });
            setIsModalOpen(true);
        }
    };

    const handleRecognize = (text: string) => {
        if (currentField) {
            setFormData(prev => ({ ...prev, [currentField.field]: text }));
            toast.success(`Filled ${currentField.label}`);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    if (isAuthLoading) return <main className="flex justify-center p-24">Loading session...</main>;
    if (!isAuthenticated) {
        return (
            <main className="flex items-center justify-center min-h-[80vh] p-4">
                <div className="w-full max-w-lg p-8 text-center border rounded-lg bg-neutral-900 border-neutral-800">
                    <h1 className="text-3xl font-bold text-white">Access Denied</h1>
                    <p className="mt-4 mb-8 text-lg text-neutral-400">You must be logged in to view this page.</p>
                    <SpotifyButton onClick={() => loginWithRedirect()}>Log In</SpotifyButton>
                </div>
            </main>
        );
    }

    return (
        <>
            <main className="flex flex-col items-center min-h-screen p-4 pt-24 pb-24 space-y-8">
                <div className="w-full max-w-4xl">
                    <Link href="/form-developer" className="flex items-center gap-2 mb-6 text-sm text-neutral-400 hover:text-neutral-200 transition-colors">
                        <ArrowLeft size={16} /> Back to Form Search
                    </Link>

                    {isFormLoading ? (
                        <div className="flex justify-center items-center h-64"><Loader2 className="w-10 h-10 text-green-500 animate-spin" /></div>
                    ) : (
                        <div className="p-6 space-y-8 border rounded-2xl sm:p-8 bg-neutral-900 border-neutral-800">
                            <div className="text-center">
                                <h1 className="text-3xl font-bold text-white">{formDetails?.name}</h1>
                                {formDetails?.description && <p className="mt-2 text-lg text-neutral-400">{formDetails.description}</p>}
                            </div>
                            {fields.length > 0 && (
                                <div className="pt-6 border-t border-neutral-800">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
                                        {fields.map((field) => (
                                            <div key={field.id} className={getFieldSpan(field.field_name)}>
                                                <label htmlFor={field.field_name} className="block mb-2 text-sm font-medium text-neutral-200">{field.label}</label>
                                                {field.type === 'select' ? (
                                                    <select id={field.field_name} name={field.field_name} value={formData[field.field_name] || ''} onChange={handleInputChange} className="w-full p-4 border rounded-lg bg-black text-neutral-200 border-neutral-800 focus:outline-none focus:ring-2 focus:ring-green-500">
                                                        <option value="" disabled>Select an option</option>
                                                        {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                                    </select>
                                                ) : (
                                                    <input type={field.type} id={field.field_name} name={field.field_name} value={formData[field.field_name] || ""} onChange={handleInputChange} onClick={() => handleInputClick(field)} placeholder={field.nepali_text ? `Click to draw ${field.label}...` : `Enter ${field.label}...`} className={`w-full p-4 border rounded-lg bg-black text-neutral-200 border-neutral-800 caret-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 ${field.nepali_text ? 'cursor-pointer' : ''}`} readOnly={field.nepali_text} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <CanvasModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRecognize={handleRecognize} fieldName={currentField?.label || "Field"} />
        </>
    );
}