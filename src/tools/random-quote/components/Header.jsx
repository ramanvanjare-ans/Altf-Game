import { Sparkles } from "lucide-react";
export default function Header() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* PAGE TITLE */}
      <header className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-(--muted/50) border border-(--border) rounded-full px-5 py-2.5 mb-8 shadow-sm">
          <div className="p-1.5 rounded-full bg-(--primary/10)">
            <Sparkles className="w-4 h-4 text-(--primary)" />
          </div>
          <span className="text-(--foreground) text-sm font-semibold tracking-wide">
            DAILY MOTIVATION
          </span>
        </div>
        <h1 className="heading">Random Quote Generator</h1>
        <p className="description text-center mt-2 text-lg">
          Discover powerful quotes from the world&apos;s greatest minds.
          <br />
          <span> Click the button to get inspired!</span>
        </p>
      </header>
    </div>
  );
}
