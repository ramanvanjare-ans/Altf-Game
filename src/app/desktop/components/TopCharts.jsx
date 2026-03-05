"use client";
import React from "react";

const topApps = [
  {
    name: "WhatsApp",
    category: "Social",
    rating: 4.7,
    icon: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
    link: "https://www.whatsapp.com/download",
  },
  {
    name: "Instagram",
    category: "Social",
    rating: 4.6,
    icon: "https://img.icons8.com/color/240/instagram-new.png",
    link: "https://www.instagram.com/download/",
  },
  {
    name: "Facebook",
    category: "Social",
    rating: 4.3,
    icon: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png",
    link: "https://www.facebook.com/mobile/",
  },
  {
    name: "Spotify",
    category: "Music",
    rating: 4.5,
    icon: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    link: "https://www.spotify.com/download/other/",
  },

  

  {
    name: "YouTube",
    category: "Video",
    rating: 4.6,
    icon: "https://img.icons8.com/color/240/youtube-play.png",
    link: "https://www.youtube.com",
  },
  {
    name: "Telegram",
    category: "Messaging",
    rating: 4.5,
    icon: "https://img.icons8.com/color/240/telegram-app.png",
    link: "https://desktop.telegram.org/",
  },
  {
    name: "Snapchat",
    category: "Social",
    rating: 4.4,
    icon: "https://img.icons8.com/color/240/snapchat.png",
    link: "https://www.snapchat.com/download",
  },
  {
    name: "Twitter (X)",
    category: "Social",
    rating: 4.2,
    icon: "https://img.icons8.com/color/240/twitter--v1.png",
    link: "https://twitter.com/download",
  },
  {
    name: "Netflix",
    category: "Entertainment",
    rating: 4.6,
    icon: "https://img.icons8.com/color/240/netflix.png",
    link: "https://www.netflix.com",
  },
  {
    name: "Amazon Prime Video",
    category: "Entertainment",
    rating: 4.4,
    icon: "https://img.icons8.com/color/240/amazon-prime-video.png",
    link: "https://www.primevideo.com",
  },
];

export default function TopFreeApps() {
  return (
    <section className="px-8 sm:px-8 md:px-16 py-8 md:py-16 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
        Top Charts
      </h2>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-10">
        <button className="px-5 sm:px-6 py-2 bg-green-100 text-green-800 rounded-full font-medium hover:bg-green-200 transition">
          Top free
        </button>

        <button className="px-5 sm:px-6 py-2 border border-[var(--border)] rounded-full font-medium hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition">
          Top grossing
        </button>

        <button className="px-5 sm:px-6 py-2 border border-[var(--border)] rounded-full font-medium hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition">
          Top paid
        </button>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-10">
        {topApps.map((app, index) => (
          <a
            key={index}
            href={app.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-[var(--card)] border border-[var(--border)] rounded-3xl hover:shadow-xl hover:scale-105 transition-shadow duration-300 cursor-pointer"
          >

            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center bg-gray-50 rounded-2xl">
              <img
                src={app.icon}
                alt={app.name}
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
              />
            </div>

            <div className="text-center">
              <h3 className="subheading">{app.name}</h3>
              <p className="description">{app.category}</p>
              <p className="text-yellow-500 font-semibold">{app.rating} ★</p>
            </div>

          </a>
        ))}
      </div>
    </section>
  );
}
