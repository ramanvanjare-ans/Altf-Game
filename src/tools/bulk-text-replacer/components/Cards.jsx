import {
  Zap,
  Lock,
  Target,
  Code,
  Copy,
  Rocket
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Replace at Scale",
    desc: "Edit hundreds or thousands of lines instantly with zero lag."
  },
  {
    icon: Lock,
    title: "100% Private",
    desc: "Your text never leaves your browser. No uploads. No tracking."
  },
  {
    icon: Target,
    title: "Smart Matching",
    desc: "Control case-sensitive replacements for precise results."
  },
  {
    icon: Code,
    title: "Developer Friendly",
    desc: "Perfect for code refactors, logs, JSON, and config files."
  },
  {
    icon: Copy,
    title: "One-Click Copy",
    desc: "Copy output instantly without formatting issues."
  },
  {
    icon: Rocket,
    title: "Blazing Fast",
    desc: "Runs fully in your browser for lightning-fast performance."
  }
];

export default function Cards() {
  return (
    <section className="mt-28">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-3xl md:text-4xl font-semibold text-(--foreground) mb-12">
          Why people love this tool?
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="
                  group relative rounded-2xl p-6
                  border border-(--border)
                  bg-(--card)
                  transition-all duration-300
                  hover:shadow-lg
                  hover:-translate-y-1
                "
              >
                <div className="space-y-4">

                  {/* Icon Box */}
                  <div
                    className="
                      w-12 h-12 rounded-xl
                      bg-(--muted)
                      flex items-center justify-center
                    "
                  >
                    <Icon className="w-6 h-6 text-(--primary)" />
                  </div>

                  <h3 className="text-lg font-semibold text-(--foreground)">
                    {item.title}
                  </h3>

                  <p className="text-sm text-(--muted-foreground) leading-relaxed">
                    {item.desc}
                  </p>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
