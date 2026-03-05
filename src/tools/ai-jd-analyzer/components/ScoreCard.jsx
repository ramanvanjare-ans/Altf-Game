import { BriefcaseBusiness, CheckCircle, FileWarning, Lightbulb, Star, TrendingUp, User } from 'lucide-react';
import React from 'react';
import { ErrorIcon } from 'react-hot-toast';



const SCORE_CATEGORIES = {
    readability: { label: 'Readability', icon: TrendingUp },
    inclusivity: { label: 'Inclusivity', icon: User },
    clarity: { label: 'Clarity', icon: Lightbulb },
    marketFit: { label: 'Market Fit', icon: BriefcaseBusiness },
};


const colorMap = {
  green: {
    text: "text-green-700",
    bgSoft: "bg-green-500/10",
    border: "border-green-500/40",
    shadow: "shadow-[0_10px_30px_rgba(34,197,94,0.2)]",
    chip: "bg-green-600 text-white",
  },
  red: {
    text: "text-red-700",
    bgSoft: "bg-red-500/10",
    border: "border-red-500/40",
    shadow: "shadow-[0_10px_30px_rgba(239,68,68,0.2)]",
    chip: "bg-red-600 text-white",
  },
  indigo: {
    text: "text-indigo-700",
    bgSoft: "bg-indigo-500/10",
    border: "border-indigo-500/40",
    shadow: "shadow-[0_10px_30px_rgba(99,102,241,0.2)]",
    chip: "bg-indigo-600 text-white",
  },
  yellow: {
    text: "text-yellow-700",
    bgSoft: "bg-yellow-500/10",
    border: "border-yellow-500/40",
    shadow: "shadow-[0_10px_30px_rgba(234,179,8,0.2)]",
    chip: "bg-yellow-500 text-black",
  },
};

const getScoreData = (score) => {
    if (score >= 80) return { color: 'success', label: 'Excellent', Icon: CheckCircle };
    if (score >= 60) return { color: 'warning', label: 'Good', Icon: FileWarning };
    return { color: 'error', label: 'Needs Improvement', Icon: ErrorIcon };
};

const ScoreCard = ({ scores }) => {

    const scoreValues = Object.values(scores);
    const overallScore = Math.round(
        scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length
    );
    const overallData = getScoreData(overallScore);

    const ScoreItem = ({ categoryKey, value }) => {
        const { label, icon: ItemIcon } = SCORE_CATEGORIES[categoryKey];
        const { color, Icon: StatusIcon } = getScoreData(value);

        return (
            <div
  className="
    mb-2 p-3 rounded-lg transition duration-300
   
 "
>
  {/* HEADER ROW */}
  <div className="flex items-center justify-between mb-2">
    {/* LEFT: ICON + LABEL */}
    <div className="flex items-center gap-2">
      <ItemIcon className="w-4 h-4 " />
      <span className="text-sm font-semibold text-(--foreground)">
        {label}
      </span>
    </div>

    {/* RIGHT: VALUE + STATUS */}
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold ">
        {value}
      </span>
      <StatusIcon className="w-[1.1rem] h-[1.1rem] " />
    </div>
  </div>

  {/* PROGRESS BAR */}
  <div
    className="
      w-full h-2.5 rounded-full
     
      overflow-hidden
    "
  >
    <div
      className="
        h-full rounded-full
        
        transition-all duration-500 ease-linear
      "   
    />
  </div>
</div>

        );
    };

    return (
      <div
  className="
    p-8 rounded-2xl
    bg-(--background)
  "
>
  {/* HEADER */}
  <h2
    className="
      subheading 
    "
  >
     Content Assessment Scorecard
  </h2>

  {/* OVERALL SCORE */}
  <div
    className="
      text-center my-8 p-6 rounded-xl
      border border-(--border)
     "
  >
    <Star
      className="mx-auto mb-2 w-10 h-10 "
    />

    <p className="subheading">
      Overall Performance
    </p>

    <div
      className="
        text-6xl font-extrabold my-2
        tracking-tight
        "
    >
      {overallScore}
    </div>

    {/* CHIP */}
    <span
      className="
        inline-flex items-center gap-2
        px-4 py-1.5 mt-2
        rounded-full text-sm font-bold
        
      "
    >
      <overallData.Icon className="w-4 h-4" />
      {overallData.label}
    </span>
  </div>

  {/* SECTION TITLE */}
  <h3 className="subheading mb-4">
    Individual Criteria Breakdown
  </h3>

  {/* GRID */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {Object.keys(SCORE_CATEGORIES).map((key) => (
      <div key={key}>
        <ScoreItem categoryKey={key} value={scores[key]} />
      </div>
    ))}
  </div>
</div>

    );
};

export default ScoreCard;