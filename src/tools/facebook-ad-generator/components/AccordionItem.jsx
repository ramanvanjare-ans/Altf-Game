import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-(--border)">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className={`
          flex justify-between items-center w-full py-4 text-left font-semibold
          text-(--foreground) 
          hover:text-(--primary)
          transition-colors duration-200
        `}
      >
        <span>{question}</span>

        <ChevronDown
          className={`
            w-5 h-5 transition-transform duration-300
            ${isOpen ? "rotate-180 text-(--primary)" : "text-(--muted-foreground)"}
          `}
        />
      </button>

      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? "max-h-96 opacity-100 py-3" : "max-h-0 opacity-0"}
        `}
        style={{ transitionProperty: "max-height, opacity, padding" }}
      >
        <p className="text-(--muted-foreground) leading-relaxed pb-2">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default AccordionItem;
