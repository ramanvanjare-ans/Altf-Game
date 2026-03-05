import { Zap, Laugh, Briefcase, Heart } from "lucide-react";

// Configuration for tone options
export const TONE_OPTIONS = [
  {
    value: "Urgent (FOMO)",
    label: "Urgent / FOMO",
    icon: Zap,
    color: "bg-blue-500 hover:bg-blue-600",
    text: "text-blue-500",
  },
  {
    value: "Playful & Humorous",
    label: "Playful / Humorous",
    icon: Laugh,
    color: "bg-yellow-500 hover:bg-yellow-600",
    text: "text-yellow-500",
  },
  {
    value: "Professional & Trustworthy",
    label: "Professional / Trustworthy",
    icon: Briefcase,
    color: "bg-red-500 hover:bg-red-600",
    text: "text-blue-500",
  },
  {
    value: "Emotional & Aspirational",
    label: "Emotional / Aspirational",
    icon: Heart,
    color: "bg-pink-500 hover:bg-pink-600",
    text: "text-pink-500",
  },
];

// JSON Schema for the AI response
// export const ResponseSchema = {
//   type: "OBJECT",
//   properties: {
//     primaryText: {
//       type: "STRING",
//       description:
//         "The main, long-form body copy for the Facebook ad (max 100 words).",
//     },
//     headlines: {
//       type: "ARRAY",
//       description:
//         "An array of exactly 3 high-converting, short headlines (max 8 words each).",
//       items: { type: "STRING" },
//     },
//   },
//   required: ["primaryText", "headlines"],
// };

export const ResponseSchema = {
  type: "object",
  properties: {
    primaryText: {
      type: "string",
      description:
        "The main long-form body copy for the Facebook ad (max 100 words).",
    },
    headlines: {
      type: "array",
      description:
        "An array of exactly 3 high-converting, short headlines (max 8 words).",
      items: { type: "string" },
    },
  },
  required: ["primaryText", "headlines"],
};
