import {
  Mail,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  Globe,
  Pin,
} from "lucide-react";
import clsx from "clsx";

const SOCIAL_CONFIG = {
  // gmail: {
  //   label: "Email",
  //   href: "mailto:altftool@gmail.com",
  //   icon: Mail,
  // },
  facebook: {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61586134133885",
    icon: Facebook,
  },
  instagram: {
    label: "Instagram",
    href: "https://www.instagram.com/altftools/",
    icon: Instagram,
  },
  threads: {
    label: "Threads",
    href: "https://www.threads.com/@altftools",
    icon: MessageCircle,
  },
  x: {
    label: "X (Twitter)",
    href: "https://x.com/altftool17279",
    icon: Twitter,
  },
  // medium: {
  //   label: "Medium",
  //   href: "https://medium.com/@altftool",
  //   icon: Globe,
  // },
  pinterest: {
    label: "Pinterest",
    href: "https://www.pinterest.com/altftool/",
    icon: Pin,
  },
};

export default function SocialLinks({
  platforms = Object.keys(SOCIAL_CONFIG),
  className,
  iconClassName = "w-4 h-4",
}) {
  return (
    <div className={clsx("flex gap-3", className)}>
      {platforms.map((key) => {
        const { label, href, icon: Icon } = SOCIAL_CONFIG[key];

        return (
          <a
            key={key}
            href={href}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-label={label}
            title={label} // native tooltip replacement
            className="inline-flex items-center justify-center rounded-full border border-border p-2 hover:bg-(--muted) transition"
          >
            <Icon className={clsx(iconClassName, "text-(--primary)")} />
          </a>
        );
      })}
    </div>
  );
}
