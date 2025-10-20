"use client";
import React, { useEffect, useState, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from 'next/navigation'; // 1. Import the router
import { SpotifyButton } from "@/components/ui/SpotifyButton";
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";

// --- Type Definitions ---
interface FormSummary {
    id: number;
    name: string;
    description: string;
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


export default function FormDeveloperSearchPage() {
    const { isAuthenticated, isLoading: isAuthLoading, loginWithRedirect } = useAuth0();
    const router = useRouter(); // 2. Initialize the router for navigation

    const [query, setQuery] = useState<string>("");
    const [suggestions, setSuggestions] = useState<FormSummary[]>([]);
    const [isSuggestLoading, setIsSuggestLoading] = useState(false);
    const [openList, setOpenList] = useState<boolean>(false);
    const searchRef = useRef<HTMLDivElement | null>(null);
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) setOpenList(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch suggestions from backend (no changes here)
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

    // 3. Handle navigation when a form is clicked
    const handleFormSelect = (form: FormSummary) => {
        setQuery(form.name);
        setOpenList(false);
        // Navigate to the new dynamic page
        router.push(`/form-developer/${form.id}`);
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
        <main className="flex flex-col items-center min-h-screen p-4 pt-24 pb-24 space-y-8">
            <div className="w-full max-w-3xl p-8 text-center border rounded-lg bg-neutral-900 border-neutral-800">
                <h1 className="text-3xl font-bold text-white">Form Search</h1>
                <p className="mt-4 text-lg text-neutral-400">Find the government form you need to fill out. We'll help you draw the rest.</p>
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
                                <button key={site.id} type="button" onClick={() => handleFormSelect(site)} className="w-full px-4 py-3 text-left text-neutral-100 hover:bg-neutral-800">
                                    {site.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}