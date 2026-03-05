import Link from "next/link";

const VARIANTS = {
  primary: [
    "bg-[var(--primary)] text-white",
    "hover:-translate-y-0.5 hover:brightness-90",
    "focus:ring-[var(--primary)]",
  ].join(" "),

  outline: [
    "border border-[var(--border)]",
    "bg-transparent",
    "text-[var(--primary)]",
    "hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
    "shadow-[0px_1px_8.2px_0px_#9DA3AF40]",
  ].join(" "),
};

export default function CTAButton({
  text,
  href,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
}) {
  if (!text) return null;

  const classes = [
    "inline-flex items-center justify-center",
    "h-12 px-8",
    "rounded-md",
    "text-lg font-medium",
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    VARIANTS[variant],
    className,
  ].join(" ");

  // 👉 ACTION BUTTON
  if (!href) {
    return (
      <button type={type} onClick={onClick} className={classes}>
        {text}
      </button>
    );
  }

  // 👉 NAVIGATION BUTTON
  return (
    <Link href={href} className={classes}>
      {text}
    </Link>
  );
}
