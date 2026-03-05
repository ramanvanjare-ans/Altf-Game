import { useState } from "react";
import postingTimes from "../data/postingTimes";
import SelectField from "./SelectField";
import ResultBox from "./ResultBox";

const timezones = { UTC:0, IST:5.5, EST:-5, PST:-8 };

const convertTime = (time, offset) => {
  let [h,m] = time.split(":").map(Number);
  h += offset;
  if(h>=24) h-=24;
  if(h<0) h+=24;
  return `${String(Math.floor(h)).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
};

const BestTimeCalculator = () => {
  const [platform,setPlatform] = useState("");
  const [industry,setIndustry] = useState("");
  const [timezone,setTimezone] = useState("UTC");
  const [result,setResult] = useState([]);

  const calculate = () => {
    if(!platform || !industry) return;
    const baseTimes = postingTimes[platform][industry] || [];
    setResult(baseTimes.map(t => convertTime(t, timezones[timezone])));
  };

  const toggleTheme = () => {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  };

  // Industry options: default placeholder if platform not selected
  const industryOptions = platform
    ? Object.keys(postingTimes[platform])
    : ["Select a Platform first"];

  return (
    <section className="relative w-full max-w-xl mx-auto p-8 rounded-3xl shadow-lg bg-(--card) transition mb-12">

      <h2 className="font-heading text-3xl font-bold mb-6 text-(--foreground) text-center">
        Calculate Best Posting Time
      </h2>
      
      <div className="space-y-4">
        {/* Platform */}
        <SelectField 
          label="Platform" 
          value={platform} 
          options={Object.keys(postingTimes)} 
          onChange={(val)=>{ setPlatform(val); setIndustry(""); }} 
        />

        {/* Industry - always visible */}
        <SelectField 
          label="Industry" 
          value={industry} 
          options={industryOptions} 
          onChange={setIndustry} 
        />

        {/* Timezone */}
        <SelectField 
          label="Time Zone" 
          value={timezone} 
          options={Object.keys(timezones)} 
          onChange={setTimezone} 
        />

        <button
          className="w-full py-3 rounded-lg font-semibold text-(--primary-foreground) bg-(--primary) hover:scale-105 hover:shadow-lg transition transform duration-200"
          onClick={calculate}
        >
          Calculate
        </button>
      </div>

      <ResultBox times={result} />
    </section>
  );
};

export default BestTimeCalculator;
