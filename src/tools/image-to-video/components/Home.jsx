"use client";

import { useState } from "react";
import FileUploader from "./FileUploader";
import VideoPlayer from "./VideoPlayer";
import Cards from "./Cards";
import Header from "./Headers";


export default function Home() {
  const [videoUrl, setVideoUrl] = useState(null);

  return (
    <div className="min-h-screen bg-(--background) text-(--foreground)">

      {/* Header */}
     <Header/>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-14">

          {/* Left Content */}
          <div>
            <h2 className="text-2xl sm:text-4xl font-bold leading-tight">
              Convert Images into <br />
              <span className="text-(--primary)">Simple Videos</span>
            </h2>

            <p className="mt-4 max-w-md text-(--muted-foreground)">
              Upload multiple images and instantly generate a video.
              No login. No server. Works fully in your browser.
            </p>

            <ul className="mt-6 space-y-2 text-sm text-(--muted-foreground)">
              <li>✔ No API / No backend</li>
              <li>✔ Offline capable</li>
              <li>✔ Perfect for reels & mockups</li>
            </ul>
          </div>

          {/* Right Tool Card */}
          <div className="flex justify-center">
            <div className="w-full max-w-md bg-(--card) border border-(--border) rounded-2xl p-6 shadow-lg">

              {/* Upload Area */}
              <div className="h-[220px] flex items-center justify-center border-2 border-dashed border-(--border) rounded-xl">
                <FileUploader onDone={setVideoUrl} />
              </div>

              {/* Preview Area */}
              <div className="mt-4 h-[260px] flex items-center justify-center bg-(--muted) rounded-xl overflow-hidden">
                {videoUrl ? (
                  <VideoPlayer src={videoUrl} />
                ) : (
                  <p className="text-(--muted-foreground) text-sm">
                    Video preview will appear here
                  </p>
                )}
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Feature Cards */}
     <Cards/>

      {/* Footer */}
      <footer className="text-center text-xs text-(--muted-foreground) mt-20 pb-6">
        Built by Shalini · 100% Frontend · No uploads
      </footer>
    </div>
  );
}
