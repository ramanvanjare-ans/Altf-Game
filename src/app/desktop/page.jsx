"use client";

import HeroSlider from "./components/HeroSlider";
import Sidebar from "./components/Sidebar";
import TopCharts from "./components/TopCharts";
import Events from "./components/Events";
import SpotlightBanner from "./components/SpotlightBanner";
import SocialNetwork from "./components/SocialNetwork";
import SoftwareListSection from "./components/SoftwareListSection";
import Recommended from "./components/Recommended";

const topFreeApps = [
  { title: "WhatsApp", image: "/images/whatsapp.png" },
  { title: "Instagram", image: "/images/instagram.png" },
  { title: "Facebook", image: "/images/facebook.png" },
  { title: "Spotify", image: "/images/spotify.png" },
  { title: "Netflix", image: "/images/netflix.png" },
];

export default function Page() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">

      {/* Hero Slider */}
      <HeroSlider />

      {/* Sidebar */}
      <div className="mt-8">
        <Sidebar apps={topFreeApps} />
      </div>

      {/* Spotlight Banner */}
      <div className="mt-8">
        <SpotlightBanner />
      </div>

      {/* Top Charts */}
      <div className="mt-8">
        <TopCharts />
      </div>

      {/* Events */}
      <div className="mt-8">
        <Events />
      </div>

      {/* Social Networking */}
      <div className="mt-8">
        <SocialNetwork />
      </div>

      {/* Trending Software Section (Gap reduced here ) */}
      <div className="mt-4">
        <SoftwareListSection />
      </div>

      {/* Recommended */}
      <div className="mt-8">
        <Recommended />
      </div>

    </div>
  );
}
