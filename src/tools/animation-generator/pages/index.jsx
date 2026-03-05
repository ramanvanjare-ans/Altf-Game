import React, { useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Copy,
  Download,
  Settings,
  Eye,
  Code,
  Sparkles,
  Check,
} from "lucide-react";


const animations = {
  fadeIn: {
    name: "Fade In",
    keyframes: `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`,
  },
  fadeOut: {
    name: "Fade Out",
    keyframes: `@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }`,
  },
  slideUp: {
    name: "Slide Up",
    keyframes: `@keyframes slideUp {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }`,
  },
  slideDown: {
    name: "Slide Down",
    keyframes: `@keyframes slideDown {
      from { transform: translateY(-50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }`,
  },
  rotate: {
    name: "Rotate",
    keyframes: `@keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }`,
  },
  bounce: {
    name: "Bounce",
    keyframes: `@keyframes bounce {
      0%,100% { transform: translateY(0); }
      50% { transform: translateY(-30px); }
    }`,
  },
  pulse: {
    name: "Pulse",
    keyframes: `@keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.15); }
      100% { transform: scale(1); }
    }`,
  },
};

const easingOptions = ["ease", "linear", "ease-in", "ease-out", "ease-in-out"];
const iterationOptions = ["1", "2", "3", "5", "10", "infinite"];
const directionOptions = ["normal", "reverse", "alternate"];

export default function ToolHome(){
  const [animation, setAnimation] = useState("fadeIn");
  const [controls, setControls] = useState({
    duration: "1",
    delay: "0",
    easing: "ease",
    iterations: "1",
    direction: "normal",
    fill: "forwards",
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");

  const updateControl = (key, value) =>
    setControls((p) => ({ ...p, [key]: value }));

  const handleReplay = () => {
    setIsPlaying(false);
    setTimeout(() => {
      setAnimationKey((p) => p + 1);
      setIsPlaying(true);
    }, 50);
  };

  const cssCode = `.animated-element {
  animation: ${animation} ${controls.duration}s ${controls.easing}
             ${controls.delay}s ${controls.iterations}
             ${controls.direction} ${controls.fill};
}

${animations[animation].keyframes}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
   
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([cssCode], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "animation.css";
    a.click();
    URL.revokeObjectURL(url);
  };

  const animationStyle = isPlaying
    ? `${animation} ${controls.duration}s ${controls.easing} ${controls.delay}s ${controls.iterations} ${controls.direction} ${controls.fill}`
    : "none";

  return (
    <div className="p-6space-y-6">

      {/* Keyframes Inject */}
      <style>{Object.values(animations).map(a => a.keyframes).join("\n")}</style>

      {/* Header */}
      <div className="p-6  ">
        <h1 className="heading text-center aniamte-fade-up ">
           Animation Generator
        </h1>
        <p className="description text-center ">Create beautiful animations for your projects in easy way</p>
      </div>

      <div className=" m-8 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Controls */}
        <div className="space-y-4 border p-4 rounded-xl">

          <label>Animation</label>
          <select
            className="border p-2 rounded w-full bg-(--card) text-(--foreground) cursor-pointer"
            value={animation}
            onChange={(e) => { setAnimation(e.target.value); handleReplay(); }}
          >
            {Object.entries(animations).map(([k, v]) =>
              <option key={k} value={k}>{v.name}</option>
            )}
          </select>

          <label>Duration</label>
          <input
            type="number"
            value={controls.duration}
            onChange={e => updateControl("duration", e.target.value)}
            className="border p-2 rounded w-full"
          />

          <label>Easing</label>
          <select
            className="border p-2 rounded w-full bg-(--card) text-(--foreground) cursor-pointer"
            value={controls.easing}
            onChange={e => updateControl("easing", e.target.value)}
          >
            {easingOptions.map(o => <option key={o}>{o}</option>)}
          </select>

          <div className="flex gap-2">
            <button onClick={handleReplay} className="border px-4 py-2 rounded">
              <RotateCcw /> Replay
            </button>

            <button onClick={() => setIsPlaying(p => !p)} className="border px-4 py-2 rounded">
              {isPlaying ? <Pause /> : <Play />}
            </button>
          </div>

        </div>

        {/* Preview + Code */}
        <div className="border p-4 rounded-xl">

          {/* Tabs */}
          <div className="flex gap-3 mb-4">
            <button onClick={() => setActiveTab("preview")} className="border px-3 py-2 rounded cursor-pointer">Preview</button>
            <button onClick={() => setActiveTab("code")} className="border px-3 py-2 rounded">CSS</button>
          </div>

          {activeTab === "preview" && (
            <div className="h-48 flex items-center justify-center bg-(--card) text-(--foreground) rounded">
              <div
                key={animationKey}
                style={{ animation: animationStyle }}
                className="w-24 h-24 bg-(--primary)  rounded-lg flex items-center justify-center text-3xl"
              >
                ✨
              </div>
            </div>
          )}

          {activeTab === "code" && (
            <>
              <pre className="bg-(--card) text-(--foreground)  p-4 rounded text-sm overflow-x-auto">
                {cssCode}
              </pre>

              <div className="flex gap-3 mt-3">
                <button onClick={handleCopy} className="border px-3 py-2 rounded cursor-pointer">
                  {copied ? <Check /> : <Copy />}
                </button>

                <button onClick={handleDownload} className="border px-3 py-2 rounded cursor-pointer">
                  <Download />
                </button>
              </div>
            </>
          )}

        </div>

      </div>

     

    </div>
  );
};


