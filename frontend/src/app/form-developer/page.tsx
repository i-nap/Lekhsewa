"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { CanvasModal } from "@/components/CanvasModal";
import { SpotifyButton } from "@/components/ui/SpotifyButton"; // still used for login button
import { toast } from "sonner";

interface FormField {
    field: string;  // e.g., "first_name"
    type: string;   // e.g., "text", "number", "email"
    label: string;  // e.g., "पहिलो नाम"
}

const formSites = [
    { id: "none", name: "Select a form..." },
    { id: "lok_sewa", name: "Lok Sewa Aayog (Public Service Commission)" },
    { id: "vehicle_reg", name: "Online Vehicle Registration" },
    { id: "e_passport", name: "E-Passport Application" },
];

export default function FormDeveloperPage() {
    const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

    // selection state
    const [selectedForm, setSelectedForm] = useState<string>("none");

    // search UI state for replacing <select>
    const [query, setQuery] = useState<string>("");
    const [openList, setOpenList] = useState<boolean>(false);
    const searchRef = useRef<HTMLDivElement | null>(null);

    // form schema + data
    const [fields, setFields] = useState<FormField[]>([]);
    const [formData, setFormData] = useState<Record<string, string>>({});

    // canvas modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentField, setCurrentField] = useState<{ field: string; label: string } | null>(null);

    // close the dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setOpenList(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // derive filtered list for the search
    const filteredSites = useMemo(() => {
        const q = query.trim().toLowerCase();
        const base = formSites.filter(s => s.id !== "none");
        if (!q) return base;
        return base.filter(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
    }, [query]);

    // load fields when a form is picked
    useEffect(() => {
        if (selectedForm === "none") {
            setFields([]);
            setFormData({});
            return;
        }

        let mockData: FormField[] = [];
        if (selectedForm === "lok_sewa") {
            mockData = [
                { field: "first_name", type: "text", label: "पहिलो नाम" },
                { field: "last_name", type: "text", label: "थर" },
                { field: "father_name", type: "text", label: "बुबाको नाम" },
                { field: "age", type: "number", label: "उमेर" },
            ];
        } else if (selectedForm === "e_passport") {
            mockData = [
                { field: "given_name", type: "text", label: "Given Name" },
                { field: "surname", type: "text", label: "Surname" },
                { field: "nationality", type: "text", label: "Nationality" },
            ];
        } else if (selectedForm === "vehicle_reg") {
            mockData = [
                { field: "owner_name", type: "text", label: "Owner Name" },
                { field: "vehicle_number", type: "text", label: "Vehicle Number" },
                { field: "engine_no", type: "text", label: "Engine Number" },
            ];
        }

        setFields(mockData);
        setFormData({});
    }, [selectedForm]);

    // open canvas on click
    const handleInputClick = (field: string, label: string) => {
        setCurrentField({ field, label });
        setIsModalOpen(true);
    };

    const handleRecognize = (text: string) => {
        if (currentField) {
            setFormData(prev => ({
                ...prev,
                [currentField.field]: text,
            }));
            toast.success(`Filled ${currentField.label}`);
        }
    };

    // allow typing to override recognized value
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // UI gates
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
                    <SpotifyButton onClick={() => loginWithRedirect()}>Log In</SpotifyButton>
                </div>
            </main>
        );
    }

    return (
        <>
            <main className="flex flex-col items-center min-h-screen p-4 pt-24 pb-24 space-y-8">
                {/* Welcome */}
                <div className="w-full max-w-3xl text-center p-8 bg-neutral-900 rounded-lg border border-neutral-800">
                    <h1 className="text-3xl font-bold text-white">Welcome, Form Developer!</h1>
                    <p className="text-lg text-neutral-400 mt-4">
                        Pick a form with the search box, then click any field to draw it in the canvas.
                    </p>
                </div>

                {/* Searchable form picker */}
                <div className="w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8 space-y-6">
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Search an Online Form
                    </label>
                    <div ref={searchRef} className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setOpenList(true);
                            }}
                            onFocus={() => setOpenList(true)}
                            placeholder="Type to search (e.g., 'passport', 'lok sewa')"
                            className="w-full p-3 rounded-md bg-neutral-800 text-neutral-100 border border-neutral-700
                         focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {openList && (
                            <div
                                className="absolute z-20 mt-2 w-full max-h-64 overflow-auto rounded-md border border-neutral-800
                           bg-black shadow-lg"
                                role="listbox"
                            >
                                {filteredSites.length === 0 ? (
                                    <div className="px-4 py-3 text-neutral-400">No matches</div>
                                ) : (
                                    filteredSites.map(site => (
                                        <button
                                            key={site.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedForm(site.id);
                                                setQuery(site.name);
                                                setOpenList(false);
                                            }}
                                            className="w-full text-left px-4 py-3 hover:bg-neutral-800 text-neutral-100"
                                            role="option"
                                        >
                                            {site.name}
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Selected form summary */}
                    {selectedForm !== "none" && (
                        <div className="text-sm text-neutral-400">
                            Selected:{" "}
                            <span className="text-neutral-200">
                                {formSites.find(f => f.id === selectedForm)?.name}
                            </span>
                        </div>
                    )}

                    {/* Dynamic fields, no form wrapper, no submit */}
                    {fields.length > 0 && (
                        <div className="mt-4 space-y-6">
                            {fields.map((field) => (
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
                                        value={formData[field.field] || ""}
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
                        </div>
                    )}
                </div>
            </main>

            <CanvasModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRecognize={handleRecognize}
                fieldName={currentField?.label || "Field"}
            />
        </>
    );
}
