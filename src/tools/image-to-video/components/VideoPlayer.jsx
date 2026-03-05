"use client";

export default function VideoPlayer({ src }) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-(--border) bg-(--card)">
      <video
        src={src}
        controls
        autoPlay
        loop
        className="w-full h-full object-contain"
      />
    </div>
  );
}
