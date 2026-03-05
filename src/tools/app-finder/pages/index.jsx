// import React, { useState } from "react";
// import { Search, ExternalLink, Sparkles, Eye, Code, SearchIcon, Settings2Icon } from "lucide-react";

// // Demo apps data
// const demoApps = [
//   {
//     title: "Instagram",
//     snippet: "Photo & Video sharing app with Stories, Reels and messaging.",
//     link: "https://apps.apple.com/app/instagram/id389801252"
//   },
//   {
//     title: "Spotify",
//     snippet: "Music streaming with playlists, podcasts & offline listening.",
//     link: "https://apps.apple.com/app/spotify-music/id324684580"
//   },
//   {
//     title: "Snapchat",
//     snippet: "Share short-lived snaps, chat and creative AR filters.",
//     link: "https://apps.apple.com/app/snapchat/id447188370"
//   }
// ];

// export default function ToolHome() {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState(demoApps);
//   const [loading, setLoading] = useState(false);

//   const toast = (message) => {
//     alert(message); // Simple fallback toast
//   };

//   const searchApps = async () => {
//     if (!query.trim()) {
//       toast("Please enter a search term");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch(
//         `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=software&limit=12`
//       );
//       const data = await res.json();

//       const appleApps = (data.results || []).map((app) => ({
//         title: app.trackName,
//         snippet: app.description,
//         link: app.trackViewUrl
//       }));

//       setResults(appleApps.length ? appleApps : demoApps);
//     } catch (error) {
//       console.error(error);
//       setResults(demoApps);
//       toast("Failed to fetch results. Showing demo apps.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const short = (text, maxLength = 90) =>
//     text.length > maxLength ? text.slice(0, maxLength) + "…" : text;

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       searchApps();
//     }
//   };

//   return (
//     <div className="space-y-8 p-6 bg-(--background) text-(--background) ">

//     <div>
//       <h1 className="heading text-center pt-4">Find Your Mobile App</h1>
//       <p className="description text-center pt-2">Search for your favorite apps and discover new ones.</p>
//     </div>

//  <div className=" border border-(--border) rounded-lg">
//    {/* Search Section */}
//       <div className=" m-8 p-6 bg-(--background) text-(--foreground) border border-gray-200 rounded-lg">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder="Search apps (Spotify, Instagram...)"
//             className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <button
//             onClick={searchApps}
//             disabled={loading}
//             className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 flex items-center justify-center gap-2"
//           >
//             <Search className="w-4 h-4" />
//             {loading ? "Searching..." : "Search"}
//           </button>
//         </div>
//       </div>

//       {/* Features */}
//       <div className=" m-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-(--background) text-(--foreground)  rounded-lg">
//         <div className="p-4 border border-(--border) rounded-lg">
//           <div className="flex items-center gap-2 mb-2">
//             <span className="text-lg">⚡</span>
//             <h3 className="subheading">Fast Search</h3>
//           </div>
//           <p className="description">Instant results from multiple stores.</p>
//         </div>
//         <div className="p-4 border border-(--border) rounded-lg">
//           <div className="flex items-center gap-2 mb-2">
//             <span className="text-lg">🔒</span>
//             <h3 className="subheading">Safe & Secure</h3>
//           </div>
//           <p className="description">No login required. 100% safe.</p>
//         </div>
//         <div className="p-4 border border-(--border) rounded-lg">
//           <div className="flex items-center gap-2 mb-2">
//             <span className="text-lg">🌍</span>
//             <h3 className="subheading">Global Apps</h3>
//           </div>
//           <p className="description">Find apps from all around the world.</p>
//         </div>
//       </div>
//       {/* Results */}
//       <div className=" m-8 p-6 bg-(--background) text-(--foreground) border border-(--border) rounded-lg">
//         <h2 className="subheading mb-4">Search Results</h2>
//         {loading ? (
//           <div className="flex justify-center items-center h-32">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {results.map((app, index) => (
//               <div key={index} className="p-4 border border-(--border) rounded-lg hover:shadow-md transition-shadow">
//                 <h3 className="subheading mb-2">{app.title}</h3>
//                 <p className="content mb-3">{short(app.snippet)}</p>
//                 <a
//                   href={app.link}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-flex items-center text-sm text-blue-500 hover:underline gap-1"
//                 >
//                   View App <ExternalLink className="w-3 h-3" />
//                 </a>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//  </div>

// </div>

//   );
// }

"use client";

import { useState } from "react";

import { Globe, Shield, Zap } from "lucide-react";
import { SearchBar } from "../components/SearchBar";
import { FeatureCard } from "../components/FeatureCard";
import { AppCard } from "../components/AppCard";
import { truncateText } from "../utils/helper";
import { demoApps } from "../utils/appService";
import { fetchApps } from "../utils/appService";

export default function ToolHome() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(demoApps);
  const [loading, setLoading] = useState(false);

  const toast = (message) => {
    const toastEl = document.createElement("div");
    toastEl.className =
      "fixed bottom-8 right-4 bg-red-800 text-white px-6 py-3 rounded-lg shadow-2xl z-50 animate-pulse";
    toastEl.textContent = message;
    document.body.appendChild(toastEl);
    setTimeout(() => toastEl.remove(), 3000);
  };

  const searchApps = async () => {
    if (!query.trim()) {
      toast("⚠️ Please enter a search App");
      return;
    }

    setLoading(true);

    try {
      const apps = await fetchApps(query);
      setResults(apps.length ? apps : demoApps);
      if (!apps.length) {
        toast("No results found. Showing popular apps.");
      }
    } catch (error) {
      console.error(error);
      setResults(demoApps);
      toast("❌ Failed to fetch results. Showing demo apps.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Get instant search results from the App Store in milliseconds.",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "No login required. Your privacy is our priority.",
      gradient: "from-green-400 to-emerald-600",
    },
    {
      icon: Globe,
      title: "Global Discovery",
      description: "Find apps from all around the world in one place.",
      gradient: "from-blue-400 to-cyan-600",
    },
  ];

  return (
    <div className="min-h-screenbg-(--background)">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="heading text-center pt-5 animate-fade-up">Find Your Mobile App</h1>
          <p className="description text-center pt-2 animate-fade-up">
            Search for your favorite apps and discover new ones.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-16 max-w-3xl mx-auto">
          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={searchApps}
            loading={loading}
          />
        </div>

        {/* Features Grid */}
        <div className=" m-4 grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Results Section */}
        <div className=" rounded-3xl shadow-2xl border-2 border-(--border) p-8 md:p-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="subheading">
              {loading
                ? "Searching..."
                : query
                  ? "Search Results"
                  : "Popular Apps"}
            </h2>
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {results.length} Apps
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-gray-500 font-medium">
                Finding the best apps for you...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((app, index) => (
                <AppCard key={index} app={app} short={truncateText} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
