import React from "react";
import { Box, Typography, Paper, Stack } from "@mui/material";

const HeroSection = () => {
    const brandGradient =
        "linear-gradient(135deg, #FF5C24 0%, #FF2F7A 40%, #8A2BE2 100%)";

    return (
        <div
  className="
    w-full min-h-[70vh]
    flex flex-col md:flex-row
    items-center justify-between
    px-4 sm:px-6 md:px-12
    py-8 md:py-12
    gap-8 md:gap-0
  "
>
  {/* LEFT SIDE */}
  <div className="max-w-full md:max-w-[45%] text-center md:text-left">
    <h1
      className="
        font-extrabold leading-tight
        text-[30px] sm:text-[36px] md:text-[48px]
        bg-gradient-to-r from-pink-500 to-orange-400
        bg-clip-text text-transparent
      "
    >
      Reveal the Hidden Journey Behind Every Job Description
    </h1>

    <p
      className="
        mt-4 text-[#4a4a4a] font-medium
        text-[15px] sm:text-[17px] md:text-[18px]
        max-w-full md:max-w-[85%]
        mx-auto md:mx-0
      "
    >
      Instantly visualize job roles, understand expectations, and
      uncover every insight hidden inside a JD.
    </p>
  </div>

  {/* RIGHT SIDE */}
  <div
    className="
      w-full sm:w-[420px] md:w-[380px]
      rounded-2xl
      p-6
      bg-white/70 backdrop-blur-xl
      shadow-[0_20px_40px_rgba(255,60,120,0.25)]
      mx-auto md:mx-0
    "
  >
    <p className="mb-4 font-semibold text-center md:text-left">
      Analysis Steps
    </p>

    <div className="space-y-4">
      {[
        { num: 1, text: "Extracting Skills" },
        { num: 2, text: "Analyzing Responsibilities" },
        { num: 3, text: "Identifying Role Expectations" },
        { num: 4, text: "Generating Summary" },
      ].map((step) => (
        <div
          key={step.num}
          className="
            flex items-center justify-between
            p-4 rounded-xl
            
            border border-gray-100
            shadow-[0_4px_12px_rgba(0,0,0,0.05)]
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                w-8 h-8 rounded-full
                flex items-center justify-center
                text-(--foreground) font-bold
                
                shadow-[0_4px_10px_rgba(255,60,120,0.35)]
              "
            >
              {step.num}
            </div>

            <span className="font-semibold">{step.text}</span>
          </div>

          <span className="text-xs opacity-70">
            {20 + step.num * 30}ms
          </span>
        </div>
      ))}
    </div>

    <p
      className="
        text-right mt-4 font-bold
        bg-gradient-to-r from-pink-500 to-orange-400
        bg-clip-text text-transparent
      "
    >
      Total: 250ms
    </p>
  </div>
</div>

    );
};

export default HeroSection;
