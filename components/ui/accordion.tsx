"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left hover:text-primary transition-colors"
        aria-expanded={isOpen}
      >
        <h3 className="font-semibold text-gray-900 dark:text-white pr-4 text-center">
          {title}
        </h3>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[5000px] pb-4" : "max-h-0"
        }`}
      >
        <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
}

export function Accordion({ children, className = "" }: AccordionProps) {
  return (
    <div className={`divide-y divide-gray-200 dark:divide-gray-700 ${className}`}>
      {children}
    </div>
  );
}