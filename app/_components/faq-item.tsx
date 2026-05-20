"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";

export default function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`rounded-xl border transition-colors duration-300 ${
        open ? "border-indigo-300 bg-indigo-50/30" : "border-slate-200 bg-white"
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full p-5 flex items-center justify-between gap-4 text-left"
      >
        <span className="font-semibold">{question}</span>
        <span
          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
            open ? "bg-indigo-600 text-white rotate-45" : "bg-slate-100 text-slate-500"
          }`}
        >
          <Plus className="w-4 h-4" />
        </span>
      </button>

      <div
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
        }}
        className="grid transition-[grid-template-rows] duration-300 ease-out"
      >
        <div className="overflow-hidden">
          <div
            ref={contentRef}
            className={`px-5 pb-5 text-slate-600 text-sm transition-opacity duration-300 ${
              open ? "opacity-100" : "opacity-0"
            }`}
          >
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}
