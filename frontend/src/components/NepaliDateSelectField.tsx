"use client";

import { useEffect, useState } from "react";
import NepaliDate from "nepali-date-converter";

type Props = {
    label: string;
    fieldName: string;           
    value?: string;            
    onChange: (field: string, value: string) => void;
};

const MONTHS_BS = [
    "बैशाख",
    "जेठ",
    "असार",
    "श्रावण",
    "भदौ",
    "आश्विन",
    "कार्तिक",
    "मंसिर",
    "पौष",
    "माघ",
    "फाल्गुण",
    "चैत्र",
];

export function NepaliDateSelectField({ label, fieldName, value, onChange }: Props) {
    const [year, setYear] = useState<number | "">("");
    const [month, setMonth] = useState<number | "">("");
    const [day, setDay] = useState<number | "">("");


    useEffect(() => {
        if (!value) return;
        const [y, m, d] = value.split("-").map(Number);
        if (!y || !m || !d) return;
        setYear(y);
        setMonth(m);
        setDay(d);
    }, [value]);

    const years: number[] = [];
    for (let y = 2000; y <= 2095; y++) years.push(y);

    const emitChange = (nextYear: number | "", nextMonth: number | "", nextDay: number | "") => {
        if (!nextYear || !nextMonth || !nextDay) return;

        try {
            const bs = new NepaliDate(`${nextYear}-${String(nextMonth).padStart(2, "0")}-${String(nextDay).padStart(2, "0")}`);
            const bsY = bs.getYear();
            const bsM = bs.getMonth() + 1; 
            const bsD = bs.getDate();

            const bsString = `${bsY}-${String(bsM).padStart(2, "0")}-${String(bsD).padStart(2, "0")}`;
            onChange(fieldName, bsString);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            console.warn("Invalid BS date:", nextYear, nextMonth, nextDay);
        }
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const v = e.target.value === "" ? "" : Number(e.target.value);
        setYear(v);
        emitChange(v, month, day);
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const v = e.target.value === "" ? "" : Number(e.target.value);
        setMonth(v);
        emitChange(year, v, day);
    };

    const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const v = e.target.value === "" ? "" : Number(e.target.value);
        setDay(v);
        emitChange(year, month, v);
    };

    const days = Array.from({ length: 32 }, (_, i) => i + 1);

    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-neutral-200">{label}</span>
            <div className="grid grid-cols-3 gap-2">
                <select
                    value={year === "" ? "" : year}
                    onChange={handleYearChange}
                    className="w-full p-3 border rounded-lg bg-black text-neutral-200 border-neutral-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="">Year (BS)</option>
                    {years.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>

                <select
                    value={month === "" ? "" : month}
                    onChange={handleMonthChange}
                    className="w-full p-3 border rounded-lg bg-black text-neutral-200 border-neutral-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="">Month</option>
                    {MONTHS_BS.map((m, idx) => (
                        <option key={m} value={idx + 1}>
                            {m}
                        </option>
                    ))}
                </select>

                <select
                    value={day === "" ? "" : day}
                    onChange={handleDayChange}
                    className="w-full p-3 border rounded-lg bg-black text-neutral-200 border-neutral-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="">Day</option>
                    {days.map((d) => (
                        <option key={d} value={d}>
                            {d}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
