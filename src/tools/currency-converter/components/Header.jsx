"use client";
import { useState } from "react";
import { TrendingUp, Menu, X } from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-(--card)/80 backdrop-blur-sm shadow-xl py-4 mb-10 border-b border-(--border)">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <div className="group flex cursor-pointer items-center">
          <TrendingUp className="mr-2 inline h-6 w-6 text-pink-400 transition-colors duration-300 group-hover:text-(--foreground)" />

          <h1 className="heading">Currency Converter</h1>
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden space-x-6 text-sm font-medium sm:flex">
          <a
            className="transition text-(--foreground) hover:text-pink-400"
            href="#works"
          >
            How it works
          </a>
          <a
            className="transition text-(--foreground) hover:text-pink-400"
            href="#privacy"
          >
            Privacy Policy
          </a>
          <a
            className="transition text-(--foreground) hover:text-pink-400"
            href="#Faqs"
          >
            FAQs
          </a>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="cursor-pointer p-2 text-(--foreground) transition hover:text-(--primary) sm:hidden"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {menuOpen && (
        <div className="animate-slideDown sm:hidden cursor-pointer space-y-3 border-t border-(--border) bg-(--card) px-6 py-4 text-center">
          <a
            className="block transition text-(--foreground) hover:text-pink-400"
            href="#works"
          >
            How it works
          </a>

          <a
            className="block transition text-(--foreground) hover:text-pink-400"
            href="#privacy"
          >
            Privacy Policy
          </a>

          <a
            className="block transition text-(--foreground) hover:text-pink-400"
            href="#Faqs"
          >
            FAQs
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
