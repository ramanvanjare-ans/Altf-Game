"use client";

import { ChevronDown } from "lucide-react";

const AccordionItem = ({ title, content, isOpen, toggle }) => (
  <div className="border-b border-(--border)">
    <button
      onClick={toggle}
      aria-expanded={isOpen}
      className="flex w-full items-center justify-between py-4 text-left font-semibold text-(--foreground) transition-colors hover:text-(--primary)"
    >
      <span>{title}</span>

      <ChevronDown
        className={`h-5 w-5 transition-transform duration-300 ${
          isOpen ? "rotate-180" : "rotate-0"
        }`}
      />
    </button>

    {isOpen && (
      <div className="pb-4 text-sm leading-relaxed text-(--muted-foreground)">
        {content}
      </div>
    )}
  </div>
);

export default AccordionItem;
