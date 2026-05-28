// src/components/DenominationSelect.tsx
"use client";

import { useEffect, useState } from "react";

export const DENOMINATIONS = [
  { value: "non-denominational", label: "Non-denominational" },
  { value: "baptist", label: "Baptist" },
  { value: "catholic", label: "Catholic" },
  { value: "pentecostal", label: "Pentecostal" },
  { value: "methodist", label: "Methodist" },
  { value: "presbyterian", label: "Presbyterian" },
  { value: "lutheran", label: "Lutheran" },
] as const;

export type Denomination = (typeof DENOMINATIONS)[number]["value"];

const STORAGE_KEY = "fcai_denomination";

export function getDenominationNote(d: string): string {
  if (!d || d === "non-denominational") return "";
  const label = DENOMINATIONS.find((x) => x.value === d)?.label ?? d;
  return ` Please frame this from a ${label} Christian perspective and tradition.`;
}

export function readDenomination(): Denomination {
  if (typeof window === "undefined") return "non-denominational";
  return (localStorage.getItem(STORAGE_KEY) as Denomination) || "non-denominational";
}

export default function DenominationSelect({
  className = "",
}: {
  className?: string;
}) {
  const [value, setValue] = useState<Denomination>("non-denominational");

  useEffect(() => {
    setValue(readDenomination());
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value as Denomination;
    setValue(v);
    localStorage.setItem(STORAGE_KEY, v);
    // Dispatch a storage event so other components can react if needed
    window.dispatchEvent(new Event("denomination-changed"));
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      className={className}
      title="Your Christian tradition"
      aria-label="Denomination"
    >
      {DENOMINATIONS.map((d) => (
        <option key={d.value} value={d.value}>
          {d.label}
        </option>
      ))}
    </select>
  );
}
export { DenominationSelect };
