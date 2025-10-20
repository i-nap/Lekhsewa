"use client";
import React, { useEffect, useState, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { CanvasModal } from "@/components/CanvasModal";
import { SpotifyButton } from "@/components/ui/SpotifyButton";
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";

// --- Type Definitions based on your Backend DTOs ---
interface FormSummary {
    id: number;
    name: string;
    description: string;
}

interface FieldOptionDTO {
    value: string;
    label: string;
}

interface FieldDTO {
    id: number;
    label: string;
    field_name: string;
    type: string; // e.g., "text", "number", "select", "date"
    required: boolean;
    nepali_text: boolean;
    options: FieldOptionDTO[];
}

// --- Debounce Hook for Search ---
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

// --- Helper for Grid Layout ---
const getFieldSpan = (fieldName: string): string => {
    if (['firstName', 'middleName', 'lastName'].includes(fieldName)) return 'md:col-span-2';
    if (['dob', 'age', 'gender'].includes(fieldName)) return 'md:col-span-2';
    if (['province', 'district', 'wardNo'].includes(fieldName)) return 'md:col-span-2';
    if (['citizenshipNo', 'issuingDistrict'].includes(fieldName)) return 'md:col-span-3';
    return 'md:col-span-6';
};

export default function FormDeveloperPage() {
    const { isAuthenticated, isLoading: isAuthLoading, loginWithRedirect } = useAuth0();

    const [selectedForm, setSelectedForm] = useState<FormSummary | null>(null);
    const [query, setQuery] = useState<string>("");
    const [suggestions, setSuggestions] = useState<FormSummary[]>([]);
    const [isSuggestLoading, setIsSuggestLoading] = useState(false);
    const [openList, setOpenList] = useState<boolean>(false);
    const searchRef = useRef<HTMLDivElement | null>(null);
    const debouncedQuery = useDebounce(query, 300);

    const [fields, setFields] = useState<FieldDTO[]>([]);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [formData, setFormData] = useState<Record<string, string>>({});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentField, setCurrentField] = useState<{ field: string; label: string } | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) setOpenList(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 1. Fetch suggestions from backend
    useEffect(() => {
        if (debouncedQuery.trim()) {
            setIsSuggestLoading(true);
            fetch(`https://lekhsewa.onrender.com/api/suggest?q=${debouncedQuery}&limit=8`)
                .then(res => res.json())
                .then(data => setSuggestions(data.content || []))
                .catch(err => toast.error("Could not load suggestions"))
                .finally(() => setIsSuggestLoading(false));
        } else {
            setSuggestions([]);
        }
    }, [debouncedQuery]);

    // 2. Fetch form fields from backend
    useEffect(() => {
        if (!selectedForm?.id) {
            setFields([]);
            return;
        }
        setIsFormLoading(true);
        fetch(`https://lekhsewa.onrender.com/api/getformdata/${selectedForm.id}`)
            .then(res => {
                if (!res.ok) throw new Error("Form details not found");
                return res.json();
            })
            .then(data => {
                setFields(data.fields || []);
                setFormData({}); // Reset form data on new form selection
            })
            .catch(err => toast.error(err.message))
            .finally(() => setIsFormLoading(false));
    }, [selectedForm]);

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
                    <p className="mt-4 mb-8 text-lg text-neutral-400">You must be logged in to use the Form Developer.</p>
                    <SpotifyButton onClick={() => loginWithRedirect()}>Log In</SpotifyButton>
                </div>
            </main>
        );
    }
    return (
        <>
            <main className="flex flex-col items-center min-h-screen p-4 pt-24 pb-24 space-y-8">
                <div className="w-full max-w-3xl p-8 text-center border rounded-lg bg-neutral-900 border-neutral-800">
                    <h1 className="text-3xl font-bold text-white">Welcome, Form Developer!</h1>
                    <p className="mt-4 text-lg text-neutral-400">Search for a form, then click any field that requires Nepali text to draw your entry.</p>
                </div>

                <div className="w-full max-w-3xl p-6 space-y-6 border rounded-2xl sm:p-8 bg-neutral-900 border-neutral-800">
                    <label className="block mb-2 text-sm font-medium text-neutral-300">Search an Online Form</label>
                    <div ref={searchRef} className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="w-5 h-5 text-neutral-500" />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setOpenList(true); }}
                            onFocus={() => setOpenList(true)}
                            placeholder="Type to search (e.g., 'passport', 'lok sewa')"
                            className="w-full p-3 pl-10 border rounded-md bg-neutral-800 text-neutral-100 border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {openList && (
                            <div className="absolute z-20 w-full mt-2 overflow-auto border rounded-md shadow-lg max-h-64 bg-black border-neutral-800">
                                {isSuggestLoading && <div className="flex items-center justify-center p-4 text-neutral-400"><Loader2 className="w-5 h-5 mr-2 animate-spin" /></div>}
                                {!isSuggestLoading && suggestions.length === 0 && <div className="px-4 py-3 text-neutral-400">{debouncedQuery ? "No matches found" : "Start typing to search"}</div>}
                                {suggestions.map(site => (
                                    <button key={site.id} type="button" onClick={() => { setSelectedForm(site); setQuery(site.name); setOpenList(false); }} className="w-full px-4 py-3 text-left text-neutral-100 hover:bg-neutral-800">{site.name}</button>
                                ))}
                            </div>
                        )}
                    </div>
                    {isFormLoading && <div className="flex justify-center items-center h-40"><Loader2 className="w-8 h-8 text-green-500 animate-spin" /></div>}
                    {fields.length > 0 && !isFormLoading && (
                        <div className="pt-6 mt-8 border-t border-neutral-800">
                            <h2 className="mb-6 text-2xl font-bold text-white">{selectedForm?.name}</h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
                                {fields.map((field) => (
                                    <div key={field.id} className={getFieldSpan(field.field_name)}>
                                        <label htmlFor={field.field_name} className="block mb-2 text-sm font-medium text-neutral-200">{field.label}</label>
                                        {field.type === 'select' ? (
                                            <select
                                                id={field.field_name}
                                                name={field.field_name}
                                                value={formData[field.field_name] || ''}
                                                onChange={handleInputChange}
                                                className="w-full p-4 border rounded-lg bg-black text-neutral-200 border-neutral-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            >
                                                <option value="" disabled>Select an option</option>
                                                {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                            </select>
                                        ) : (
                                            <input
                                                type={field.type}
                                                id={field.field_name}
                                                name={field.field_name}
                                                value={formData[field.field_name] || ""}
                                                onChange={handleInputChange}
                                                onClick={() => handleInputClick(field)}
                                                placeholder={field.nepali_text ? `Click to draw ${field.label}...` : `Enter ${field.label}...`}
                                                className={`w-full p-4 border rounded-lg bg-black text-neutral-200 border-neutral-800 caret-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 ${field.nepali_text ? 'cursor-pointer' : ''}`}
                                                readOnly={field.nepali_text}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <CanvasModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRecognize={handleRecognize} fieldName={currentField?.label || "Field"} />
        </>
    );
}
