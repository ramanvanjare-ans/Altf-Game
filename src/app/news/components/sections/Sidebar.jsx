import Link from "next/link";
import { usePathname } from "next/navigation";
import { Twitter, Facebook, Instagram } from "lucide-react";
import Image from "next/image";

const pagesLinks = [
  { label: "News", href: "/news" },
  { label: "Trending", href: "/news/trending" },
  { label: "Local News", href: "/news/local" },
  { label: "Headlines", href: "/news/headlines" },
  { label: "Newsletter", href: "/news/newsletter" },
  { label: "Topics", href: "/news/topics" },
];

const socialLinks = [
  { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
];

const legalLinks = [
  { label: "About Us", href: "/policypages/about" },
  { label: "Privacy Policy", href: "/policypages/privacy" },
  { label: "Terms of Service", href: "/policypages/termsandconditions" },
  { label: "Cookie Policy", href: "/policypages/cookie" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-[260px] space-y-6">
      {/* Logo */}
      <div>
        <Image
          src="/assets/newslogo.png"
          width={140}
          height={40}
          alt="NewsRoom Logo"
          className="w-full max-w-[140px]"
          priority
        />
      </div>

      {/* Main links */}
      <div className="space-y-1 border-b border-[var(--border)] pb-4">
        {pagesLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded-md px-3 py-2 text-sm transition
              ${
                pathname === link.href
                  ? "bg-[var(--muted)] font-semibold text-[var(--primary)]"
                  : "hover:bg-[var(--muted)] hover:text-[var(--primary)]"
              }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Social */}
      <div>
        <p className="mb-2 text-sm text-[var(--muted-foreground)]">
          Follow Us
        </p>
        <div className="flex gap-2">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md p-2 transition hover:bg-[var(--muted)] hover:text-[var(--primary)]"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>

      {/* Legal */}
      <div className="border-t border-[var(--border)] pt-4">
        <p className="mb-2 text-sm text-[var(--muted-foreground)]">
          About NewsRoom
        </p>
        <div className="space-y-1">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-md px-3 py-2 text-sm transition hover:bg-[var(--muted)]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
