export const animations = {
  "animate-fade": {
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
    options: { duration: 300, easing: "ease-out", fill: "both" },
  },
  "animate-fade-up": {
    keyframes: [
      { opacity: 0, transform: "translateY(16px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    options: { duration: 550, easing: "ease-out", fill: "both" },
  },
  "animate-scale-in": {
  keyframes: [
    { opacity: 0, transform: "scale(0.96)" },
    { opacity: 1, transform: "scale(1)" },
  ],
  options: (el) => ({
    duration: 560,
    easing: "ease-out",
    fill: "both",
    delay: (Number(el.dataset.index) || 0) * 40,
  }),
},

  "animate-slide-up": {
    keyframes: [
      { opacity: 0, transform: "translateY(24px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    options: { duration: 350, easing: "ease-out", fill: "both" },
  },

  "animate-slide-down": {
    keyframes: [
      { opacity: 0, transform: "translateY(-24px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    options: { duration: 350, easing: "ease-out", fill: "both" },
  },

  "animate-slide-left": {
    keyframes: [
      { opacity: 0, transform: "translateX(24px)" },
      { opacity: 1, transform: "translateX(0)" },
    ],
    options: { duration: 350, easing: "ease-out", fill: "both" },
  },

  "animate-slide-right": {
    keyframes: [
      { opacity: 0, transform: "translateX(-24px)" },
      { opacity: 1, transform: "translateX(0)" },
    ],
    options: { duration: 550, easing: "ease-out", fill: "both" },
  },
  "animate-fade-out": {
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
    options: { duration: 200, easing: "ease-in", fill: "both" },
  },

  "animate-slide-out-up": {
    keyframes: [
      { opacity: 1, transform: "translateY(0)" },
      { opacity: 0, transform: "translateY(-16px)" },
    ],
    options: { duration: 250, easing: "ease-in", fill: "both" },
  },
  "animate-pop": {
    keyframes: [
      { transform: "scale(1)" },
      { transform: "scale(1.05)" },
      { transform: "scale(1)" },
    ],
    options: { duration: 180, easing: "ease-out" },
  },

  "animate-shake-x": {
    keyframes: [
      { transform: "translateX(0)" },
      { transform: "translateX(-6px)" },
      { transform: "translateX(6px)" },
      { transform: "translateX(0)" },
    ],
    options: { duration: 300, easing: "ease-in-out" },
  },
  "animate-blur-in": {
    keyframes: [
      { opacity: 0, filter: "blur(6px)" },
      { opacity: 1, filter: "blur(0)" },
    ],
    options: { duration: 300, easing: "ease-out", fill: "both" },
  },

  "animate-stagger-fade": {
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
    options: { duration: 200, easing: "ease-out", fill: "both" },
  },
};
