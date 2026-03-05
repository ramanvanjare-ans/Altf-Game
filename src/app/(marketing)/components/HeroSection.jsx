"use client";

import { PencilRuler, Gamepad2, DatabaseZap, Newspaper } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import Lottie from "lottie-react";
import robotAnimation from "../../../../public/assets/robot.json";
import { motion } from "framer-motion";
import CTAButton from "@/shared/ui/CTAButton";
import {
  Calculator,
  FileText,
  Image,
  Database,
  Chrome,
  Calendar,
} from "lucide-react";

const floatingIcons = [
  { icon: Calculator, top: "10%", left: "15%", size: 40, duration: 12, color: "#3B82F6", opacity: 0.15 },
  { icon: FileText, top: "30%", left: "80%", size: 36, duration: 16, color: "#22C55E", opacity: 0.08 },
  { icon: Image, top: "70%", left: "10%", size: 42, duration: 18, color: "#F59E0B", opacity: 0.09 },
  { icon: Gamepad2, top: "60%", left: "75%", size: 38, duration: 14, color: "#EF4444", opacity: 0.12 },
  { icon: Database, top: "6%", left: "60%", size: 34, duration: 20, color: "#8B5CF6", opacity: 0.05 },
  { icon: Chrome, top: "90%", left: "70%", size: 30, duration: 17, color: "#06B6D4", opacity: 0.1 },
  { icon: Calendar, top: "40%", left: "5%", size: 36, duration: 15, color: "#EC4899", opacity: 0.06 },
];



const HeroSection = () => {
  const { theme } = useTheme();

  const features = [
    {
      icon: PencilRuler,
      title: "200+ Tools & Extensions",
      description: "Works for everyone",
      style: "bg-[#FA913C] text-white",
    },
    {
      icon: Gamepad2,
      title: "Online Games",
      description: "Play free online games",
      style: "bg-[#3B81F5] text-white",
    },
    {
      icon: Newspaper,
      title: "News",
      description: "Stay updated with latest News",
      style: "bg-[#22C45E] text-white",
    },
    {
      icon: DatabaseZap,
      title: "Powerful",
      description: "Small tools, big impact",
      style: "bg-[#EE4444] text-white",
    },
  ];

  // Animation variants
  const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8 }
  },
};


  return (
    <section className="relative z-10 flex justify-center px-8 md:px-14 lg:px-20 overflow-hidden bg-background pb-8 pt-12 lg:pb-16 lg:pt-20">
      <div
        aria-hidden
        className="absolute top-1/4 -left-64 w-[500px] h-[500px] rounded-full blur-[120px] opacity-40 animate-float-slow  animate-pulse-soft"
        style={{
          background:
            "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
        }}
      />

      <div
        aria-hidden
        className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] rounded-full blur-[120px] opacity-40 animate-float-slow animate-pulse-soft"
        style={{
          animationDelay: "6s",
          background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* LEFT CONTENT */}
          <motion.div
            className="w-full md:max-w-[652px] text-center md:text-left"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.3,
                },
              },
            }}
          >
            <motion.h1
              className="mb-6 font-bold text-transparent text-3xl sm:text-4xl lg:text-[60px] tracking-[0.5px] leading-tight"
              variants={fadeUp}
            >
              <span className="text-gradient-hero">All Your Daily Tools.</span>
              <br />
              <span className="text-(--foreground)">One Powerful</span>
              <br />
              <span className="text-gradient-hero">Platform.</span>
            </motion.h1>

            <motion.p
              className="mb-8 text-[#9DA3AF] text-xl text-muted-foreground md:text-xl"
              variants={fadeUp}
            >
              Convert, calculate, analyze, and get things done faster with
              clean, ad-free micro tools.
            </motion.p>

            {/* ACTION BUTTONS */}
            <motion.div
              className="flex flex-wrap lg:flex-nowrap gap-4 justify-center md:justify-start"
              variants={fadeUp}
            >
              <CTAButton text="Try Now" href="/tools" />

              <CTAButton text="Explore Tools" href="/tools" variant="outline" />
            </motion.div>
          </motion.div>

          {/* RIGHT — ROBOT IMAGE */}
          <div className="relative flex items-center justify-center mt-8 lg:mt-0">
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
  {floatingIcons.map((item, i) => {
    const Icon = item.icon;
    return (
      <motion.div
        key={i}
        className="absolute text-primary/20"
        style={{
          top: item.top,
          left: item.left,
        }}
        animate={{
          y: [0, -30, 0],
          rotate: [0, 8, -8, 0],
        }}
        transition={{
          duration: item.duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
       <Icon
  style={{
    width: item.size,
    height: item.size,
    color: item.color,
    filter: "blur(0.5px)",
  }}
/>


      </motion.div>
    );
  })}
</div>

            <motion.div
  animate={{ y: [0, -15, 0] }}
  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
>
  <Lottie
    animationData={robotAnimation}
    loop
    autoplay
    className="h-auto w-full max-w-md drop-shadow-2xl"
  />
</motion.div>

          </div>
        </div>

        {/* FEATURE CARDS */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
              whileHover={{ y: -6 }}
  transition={{ type: "spring", stiffness: 200 }}
                key={index}
                className={`flex items-center gap-3 rounded-xl p-3 transition-colors ${
                  theme === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-[#F8F9FA] text-foreground"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className={`grid place-items-center h-12 w-12 shrink-0 rounded-xl ${feature.style}`}
                >
                  <Icon className="h-6 w-6 block" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3
                    className={`font-semibold truncate ${theme === "dark" ? "text-white" : "text-foreground"}`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`text-sm leading-tight ${theme === "dark" ? "text-gray-300" : "text-muted-foreground"}`}
                  >
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
