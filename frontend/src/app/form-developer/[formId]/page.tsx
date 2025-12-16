"use client";

import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from "next/navigation";
import { CanvasModal } from "@/components/CanvasModal";
import { SpotifyButton } from "@/components/ui/SpotifyButton";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getFormById } from "../../api";
import NepaliDate from "nepali-date-converter";
import { NepaliDateSelectField } from "@/components/NepaliDateSelectField";
import Link from "next/link";
import { Copy } from "lucide-react";


// --- Type Definitions ---
interface FieldOptionDTO {
    value: string;
    label: string;
}
interface FieldDTO {
    id: number;
    label: string;
    field_name: string;
    type: string;
    required: boolean;
    nepali_text: boolean;
    options: FieldOptionDTO[];
}
interface FormDTO {
    id: number;
    name: string;
    description: string;
}

export default function FormDisplayPage() {
    const params = useParams();
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth0();

    const [formDetails, setFormDetails] = useState<FormDTO | null>(null);
    const [fields, setFields] = useState<FieldDTO[]>([]);
    const [isFormLoading, setIsFormLoading] = useState(true);
    const [formData, setFormData] = useState<Record<string, string>>({});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentField, setCurrentField] = useState<{
        field: string;
        label: string;
    } | null>(null);


    useEffect(() => {
        const formId = params.formId as string;
        if (!formId) return;

        setIsFormLoading(true);
        getFormById(formId)
            .then((data) => {
                setFormDetails(data.form);
                setFields(data.fields || []);
                setFormData({});
            })
            .catch((err) => toast.error((err as Error).message))
            .finally(() => setIsFormLoading(false));
    }, [params.formId]);

    const handleInputClick = (field: FieldDTO) => {
        if (field.nepali_text) {
            setCurrentField({ field: field.field_name, label: field.label });
            setIsModalOpen(true);
        }
    };

    const handleRecognize = (text: string) => {
        if (currentField) {
            setFormData((prev) => ({ ...prev, [currentField.field]: text }));
            toast.success(`Filled ${currentField.label}`);
        }
    };

    const handleFieldChange = (fieldName: string, value: string) => {
        setFormData((prev) => ({ ...prev, [fieldName]: value }));

        try {
            if (fieldName === "dobLoc") {
                const [bsY, bsM, bsD] = value.split("-").map(Number);
                if (!bsY || !bsM || !bsD) return;

                // NepaliDate(year, monthIndex, day) treats as BS
                const adDate: Date = new NepaliDate(bsY, bsM - 1, bsD).toJsDate();

                // Use local getters, NOT toISOString(), to avoid timezone day-shift
                const yyyy = adDate.getFullYear();
                const mm = String(adDate.getMonth() + 1).padStart(2, "0");
                const dd = String(adDate.getDate()).padStart(2, "0");
                const adString = `${yyyy}-${mm}-${dd}`;

                setFormData((prev) => ({
                    ...prev,
                    dobLoc: value,
                    dob: adString,
                }));
            }

            if (fieldName === "dob") {
                const [y, m, d] = value.split("-").map(Number);
                if (!y || !m || !d) return;

                // Create a local Date (year, monthIndex, day)
                const adDate = new Date(y, m - 1, d);
                const bsNepaliDate = new NepaliDate(adDate); // from AD → BS

                const bsY = bsNepaliDate.getYear();
                const bsM = String(bsNepaliDate.getMonth() + 1).padStart(2, "0");
                const bsD = String(bsNepaliDate.getDate()).padStart(2, "0");
                const bsString = `${bsY}-${bsM}-${bsD}`;

                setFormData((prev) => ({
                    ...prev,
                    dob: value,
                    dobLoc: bsString,
                }));
            }
        } catch (error) {
            console.warn("Invalid date for conversion:", fieldName, value, error);
        }
    };

    if (isAuthLoading)
        return <main className="flex justify-center p-24">Loading session...</main>;
    if (!isAuthenticated)
        return (
            <main className="flex items-center justify-center min-h-[80vh] p-4">
                ...
            </main>
        );

    return (
        <>
            <main className="flex flex-col items-center min-h-screen p-4 pt-24 pb-24 space-y-8">
                <div className="w-full max-w-4xl">
                    <Link
                        href="/form-developer"
                        className="flex items-center gap-2 mb-6 text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Form Search
                    </Link>

                    {isFormLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
                        </div>
                    ) : (
                        <div className="p-6 space-y-8 border rounded-2xl sm:p-8 bg-neutral-900 border-neutral-800">
                            {/* Form Header */}
                            <div className="text-center">
                                <h1 className="text-3xl font-bold text-white">
                                    {formDetails?.name}
                                </h1>
                                {formDetails?.description && (
                                    <p className="mt-2 text-lg text-neutral-400">
                                        {formDetails.description}
                                    </p>
                                )}
                            </div>

                            {/* Form Grid */}
                            {fields.length > 0 && (
                                <div className="pt-6 border-t border-neutral-800">
                                    <div className="space-y-6">
                                        {fields.map((field) => (
                                            <div
                                                key={field.id}
                                                className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 items-center"
                                            >
                                                <div className="flex items-center justify-between md:justify-end gap-2">
                                                    <label
                                                        htmlFor={field.field_name}
                                                        className="block text-sm font-medium text-neutral-200 md:text-right"
                                                    >
                                                        {field.label}{" "}
                                                        {field.required && <span className="text-red-500">*</span>}
                                                    </label>

                                                    {/* Copy icon */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const value = formData[field.field_name] || "";
                                                            if (!value) return toast.error("Nothing to copy");
                                                            navigator.clipboard.writeText(value);
                                                            toast.success(`Copied: ${field.label}`);
                                                        }}
                                                        className="p-1.5 rounded-md border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 transition"
                                                    >
                                                        <Copy className="w-3 h-3 text-neutral-300" />
                                                    </button>
                                                </div>

                                                <div className="md:col-span-2">
                                                    {field.type === "select" ? (
                                                        <select
                                                            id={field.field_name}
                                                            name={field.field_name}
                                                            value={formData?.[field.field_name] ?? ""}
                                                            onChange={(e) =>
                                                                handleFieldChange(
                                                                    field.field_name,
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="w-full p-4 border rounded-lg bg-black text-neutral-200 border-neutral-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                            required={field.required}
                                                        >
                                                            <option value="" disabled>
                                                                Select {field.label}
                                                            </option>
                                                            {field.options.map((opt) => (
                                                                <option key={opt.value} value={opt.value}>
                                                                    {opt.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : field.field_name === "dobLoc" ? (
                                                        <NepaliDateSelectField
                                                            label={field.label}
                                                            fieldName={field.field_name}
                                                            value={formData[field.field_name] || ""}
                                                            onChange={handleFieldChange}
                                                        />
                                                    ) : (
                                                        <input
                                                            type={field.type}
                                                            id={field.field_name}
                                                            name={field.field_name}
                                                            value={formData[field.field_name] || ""}
                                                            onChange={(e) =>
                                                                handleFieldChange(
                                                                    field.field_name,
                                                                    e.target.value
                                                                )
                                                            }
                                                            onClick={() => handleInputClick(field)}
                                                            placeholder={
                                                                field.nepali_text
                                                                    ? `Click to draw ${field.label}...`
                                                                    : `Enter ${field.label}...`
                                                            }
                                                            className={`w-full p-4 border rounded-lg bg-black text-neutral-200 border-neutral-800 caret-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 ${field.nepali_text
                                                                ? "cursor-pointer hover:border-green-500/50"
                                                                : ""
                                                                }`}
                                                            readOnly={field.nepali_text}
                                                            required={field.required}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8">
                                        <SpotifyButton
                                            className="w-full py-4"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toast.success("Form submission coming soon!");
                                            }}
                                        >
                                            Submit Application
                                        </SpotifyButton>
                                    </div>
                                </div>
                            )}
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
