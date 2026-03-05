import { useEffect, useState, useRef } from "react";
import { Wrench, Puzzle, Gamepad2, Users } from "lucide-react";

const stats = [
  { value: 100, suffix: "+", label: "Micro Tools", icon: Wrench, color: "text-yellow-400" },
  { value: 100, suffix: "+", label: "Extensions", icon: Puzzle, color: "text-red-400" },
  { value: 100, suffix: "+", label: "Mini Games", icon: Gamepad2, color: "text-blue-400" },
  { value: 50, suffix: "k+", label: "Happy Users", icon: Users, color: "text-green-400" },
];

const AnimatedCounter = ({ value, suffix }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div ref={ref} className="stat-number">
      {count}{suffix}
    </div>
  );
};

const StatsSection = () => {
  const [hoveredStat, setHoveredStat] = useState(null);

  return (
    <section className="stats-section py-24 relative overflow-hidden bg-(--background">
        
  {/* radial background */}
  <div className="absolute inset-0 pointer-events-none">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15),transparent_65%)]" />
</div>


  <div className="container mx-auto px-4 relative z-10">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isHovered = hoveredStat === index;

        return (
          <div
            key={stat.label}
            onMouseEnter={() => setHoveredStat(index)}
            onMouseLeave={() => setHoveredStat(null)}
            className={`relative text-center transition-transform duration-300 ${
              isHovered ? "scale-110" : ""
            }`}
          >
            {/* Icon bubble */}
            <div
              className={`mx-auto mb-5 w-14 h-14 rounded-2xl flex items-center justify-center
              transition-all duration-300
              ${isHovered ? "scale-125 rotate-12" : ""}`}
              style={{
                background:
                  "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(139,92,246,0.18))",
              }}
            >
              <Icon className={`w-6 h-6 ${stat.color}`} />
            </div>

            {/* Number */}
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />

            {/* Label */}
            <p className="mt-2 text-sm text-[#6b7280] font-medium">
              {stat.label}
            </p>

            {/* Hover ring */}
            {isHovered && (
              <div className="absolute -inset-6 rounded-3xl border border-[#3b82f633] animate-pulse pointer-events-none" />
            )}
          </div>
        );
      })}
    </div>
  </div>
</section>

  );
};

export default StatsSection;
