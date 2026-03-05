"use client";

import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import SocialLinks from "../SocialLinks";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-14 py-12 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12">
          
          {/* Brand & Socials */}
          <div>
            <a href="/" className="mb-6 inline-block">
              <span className="text-2xl font-bold text-white">Alt F</span>
            </a>

            <p className="mb-6 max-w-sm text-sm leading-relaxed text-zinc-400">
              Altftools is a modern micro-tool platform offering fast, focused
              utilities that solve real-world problems in seconds. No clutter,
              no complexity — just tools that work.
            </p>

            <SocialLinks
              variant="ghost"
              className="justify-start"
              iconClassName="w-5 h-5"
            />
          </div>

         {/* Quick Links */}
          <div className="lg:justify-self-end">
            <h3 className="font-semibold text-white mb-4 text-lg">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-md text-white hover:text-(--primary) transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/policypages/contact"
                  className="text-md text-white hover:text-(--primary) transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  className="text-md text-white hover:text-(--primary) transition-colors"
                >
                  All Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div className="lg:justify-self-end">
            <h3 className="font-semibold text-white mb-4 text-lg">
              Our Policy
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/policypages/privacy"
                  className="text-md text-white hover:text-(--primary) transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/policypages/affiliate"
                  className="text-md text-white hover:text-(--primary) transition-colors"
                >
                  Affiliate Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/policypages/cookie"
                  className="text-md text-white hover:text-(--primary) transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Sitemap*/}
          <div className="lg:justify-self-end">
            <h3 className="font-semibold text-white mb-4 text-lg">
              Site Map
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/policypages/about"
                  className="text-md text-white hover:text-(--primary) transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/policypages/disclaimer"
                  className="text-md text-white hover:text-(--primary) transition-colors"
                >
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  href="/policypages/termsandconditions"
                  className="text-md text-white hover:text-(--primary) transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-700 bg-zinc-750">
        <div className="text-center px-4 py-6 text-sm text-(--muted)">
          <p>© 2024 Alt F — All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
