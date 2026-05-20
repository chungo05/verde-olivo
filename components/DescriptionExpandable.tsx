"use client";

import { useState } from "react";

interface DescriptionExpandableProps {
  description1: string;
  description2: string;
  readMoreLabel: string;
  readLessLabel: string;
}

export default function DescriptionExpandable({
  description1,
  description2,
  readMoreLabel,
  readLessLabel,
}: DescriptionExpandableProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div
        className="prose prose-slate max-w-none text-nordic-muted leading-relaxed overflow-hidden transition-all duration-300"
        style={{ maxHeight: expanded ? "1000px" : "4.5rem" }}
      >
        <p className="mb-4">{description1}</p>
        <p>{description2}</p>
      </div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-4 text-mosque font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
      >
        {expanded ? readLessLabel : readMoreLabel}
        <span
          className="material-icons text-sm transition-transform duration-300"
          style={{ transform: expanded ? "rotate(180deg)" : "none" }}
        >
          {expanded ? "expand_less" : "arrow_forward"}
        </span>
      </button>
    </div>
  );
}
