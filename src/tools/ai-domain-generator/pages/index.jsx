// import { useEffect, useMemo, useRef, useState } from "react";
// import {
  
//   Globe,
  
// } from "lucide-react";
// import { checkAvailability, getCachedAvailability } from "../services/availability";
// import { validateIdeaInput, validateSelectedTlds } from "../services/validation";
// import { generateDomainsOpenAI } from "../services/api";
// import { DomainCard } from "../components/domainCard";
// import { DomainDetailsPanel } from "../components/DomainDetails";


// /* ---------------- constants ---------------- */

// const ALL_TLDS = [
//   { tld: ".com", label: ".com", enabled: true },
//   { tld: ".ai", label: ".ai", enabled: true },
//   { tld: ".io", label: ".io", enabled: true },
//   { tld: ".app", label: ".app", enabled: true },
//   { tld: ".co", label: ".co", enabled: true },
//   { tld: ".dev", label: ".dev", enabled: true },
//   { tld: ".net", label: ".net", enabled: true },
//   { tld: ".org", label: ".org", enabled: true },
//   { tld: ".xyz", label: ".xyz", enabled: false, reasonDisabled: "Unavailable" },
//   { tld: ".shop", label: ".shop", enabled: false, reasonDisabled: "Unavailable" },
// ];

// function uid() {
//   return Math.random().toString(16).slice(2) + Date.now().toString(16);
// }

// function dedupe(arr) {
//   const out = [];
//   const s = new Set();
//   for (const v of arr) {
//     const k = String(v);
//     if (s.has(k)) continue;
//     s.add(k);
//     out.push(v);
//   }
//   return out;
// }



// export default function ToolHome() {
//   const [idea, setIdea] = useState("");
//   const [style, setStyle] = useState("brandable");
//   const [selectedTlds, setSelectedTlds] = useState([".com", ".ai"]);
//   const [tldToAdd, setTldToAdd] = useState(".io");

//   const [isGenerating, setIsGenerating] = useState(false);
//   const [results, setResults] = useState([]);
//   const [selectedDomainId, setSelectedDomainId] = useState(null);
//   const [details, setDetails] = useState(null);

//   const [availabilityLoading, setAvailabilityLoading] = useState({});
//   const [availabilityErrors, setAvailabilityErrors] = useState({});
//   const [toast, setToast] = useState(null);

//   const ideaValidation = useMemo(() => validateIdeaInput(idea), [idea]);
//   const tldValidation = useMemo(
//     () => validateSelectedTlds(selectedTlds),
//     [selectedTlds]
//   );

//   const canGenerate = ideaValidation.ok && tldValidation.ok && !isGenerating;
//   const lastQueryRef = useRef("");

//   const enabledTlds = ALL_TLDS.filter((t) => t.enabled);
//   const disabledTlds = ALL_TLDS.filter((t) => !t.enabled);

//   /* ---------------- helpers ---------------- */

//   function addTld(tld) {
//     if (!tld || selectedTlds.includes(tld)) return;
//     setSelectedTlds((p) => [...p, tld]);
//   }

//   function removeTld(tld) {
//     setSelectedTlds((p) => p.filter((x) => x !== tld));
//   }

//   async function runAvailability(domains) {
//     const next = domains.map((d) => {
//       const cached = getCachedAvailability(d.name);
//       return cached
//         ? { ...d, availability: cached, checkedAt: Date.now() }
//         : { ...d, availability: "unknown" };
//     });

//     setResults(next);

//     for (const d of next) {
//       if (getCachedAvailability(d.name)) continue;

//       setAvailabilityLoading((m) => ({ ...m, [d.id]: true }));
//       try {
//         const status = await checkAvailability(d.name);
//         setResults((p) =>
//           p.map((x) =>
//             x.id === d.id ? { ...x, availability: status } : x
//           )
//         );
//       } catch {
//         setAvailabilityErrors((m) => ({
//           ...m,
//           [d.id]: "Unable, check availability",
//         }));
//       } finally {
//         setAvailabilityLoading((m) => ({ ...m, [d.id]: false }));
//       }
//     }
//   }

//   async function generate() {
//     if (!ideaValidation.ok || !tldValidation.ok) return;

//     const queryKey = JSON.stringify({
//       idea: ideaValidation.trimmed,
//       style,
//       tlds: selectedTlds,
//     });

//     if (lastQueryRef.current === queryKey && results.length) {
//       setToast("Using cached results");
//       return;
//     }

//     setIsGenerating(true);

//     try {
//       const count = 12;
//       const openai = await generateDomainsOpenAI({
//         idea: ideaValidation.trimmed,
//         style,
//         tlds: selectedTlds,
//         count,
//       });

//       const suggestions = openai.suggestions || [];
//       const normalized = dedupe(suggestions)
//         .map((s) => s.toLowerCase().replace(/\s+/g, ""))
//         .map((domain) => {
//           const idx = domain.lastIndexOf(".");
//           return {
//             id: uid(),
//             name: domain,
//             sld: domain.slice(0, idx),
//             tld: domain.slice(idx),
//             style,
//             availability: "unknown",
//           };
//         });

//       setResults(normalized);
//       lastQueryRef.current = queryKey;
//       await runAvailability(normalized);
//     } catch {
//       setToast("Generation failed");
//     } finally {
//       setIsGenerating(false);
//     }
//   }

//   function onPickDomain(d) {
//     setSelectedDomainId(d.id);
//     setDetails(buildDetails(ideaValidation.trimmed || idea.trim(), d));
//   }

//   useEffect(() => {
//     const d = results.find((x) => x.id === selectedDomainId);
//     if (d) setDetails(buildDetails(ideaValidation.trimmed || idea.trim(), d));
//   }, [results, selectedDomainId, idea]);

//   const errorList = [...ideaValidation.errors, ...tldValidation.errors];

//   /* ---------------- UI ---------------- */

//   return (
//     <div className="min-h-screen bg-(--background) p-6">
      

      
//         <div>
//           <h1 className="heading text-center animate-fade-up pt-5 "> Domain Generator</h1>
//           <p className="description text-center animate-fade-up pt-2">
//             Generate and check domain availability
//           </p>
//         </div>
     

//       <div className=" m-8 mb-6 grid gap-4 md:grid-cols-3">
//         <input
//           className="rounded border p-2"
//           placeholder="Your idea"
//           value={idea}
//           onChange={(e) => setIdea(e.target.value)}
//         />

//         <select
//           className="rounded border p-2"
//           value={style}
//           onChange={(e) => setStyle(e.target.value)}
//         >
//           <option value="brandable">Brandable</option>
//           <option value="seo">SEO</option>
//           <option value="short">Short</option>
//           <option value="startup">Startup</option>
//         </select>

//         <button
//           className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
//           onClick={generate}
//           disabled={!canGenerate}
//         >
//           {isGenerating ? "Generating..." : "Generate"}
//         </button>
//       </div>

//       {errorList.length > 0 && (
//         <ul className="mb-4 list-disc pl-5 text-sm text-red-600">
//           {errorList.map((e) => (
//             <li key={e}>{e}</li>
//           ))}
//         </ul>
//       )}

//       <div className="grid gap-6 lg:grid-cols-12">
//         <div className="lg:col-span-7 space-y-3">
//           {results.map((d) => (
//             <div key={d.id} onClick={() => onPickDomain(d)}>
//               <DomainCard
//                 domain={d}
//                 isChecking={availabilityLoading[d.id]}
//                 availabilityError={availabilityErrors[d.id]}
//                 onCopy={(v) => navigator.clipboard.writeText(v)}
//                 onRegenerateOne={generate}
//               />
//             </div>
//           ))}
//         </div>

//         <div className="lg:col-span-5">
//           <DomainDetailsPanel details={details} />
//         </div>
//       </div>
//     </div>
//   );
// }








"use client";



import React from "react";

import DomainGeneratorPage from "../components/DomainGeneratorPage";

export default function ToolHome() {
  

  return (
    <div className="min-h-screen bg-(--background) flex flex-col">
     
      <main className="grow">
        <DomainGeneratorPage />
      </main>
    </div>
  );
};