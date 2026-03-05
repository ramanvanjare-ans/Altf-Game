"use client";

import { useRef, useState } from "react";

const animations = [
  "zoomIn",
  "zoomOut",
  "slideLeft",
  "slideRight",
  "fade",
  "zoomFade",
  "slideFade",
];

export default function FileUploader({ onDone }) {
  const inputRef = useRef(null);
  const [selectedAnimation, setSelectedAnimation] = useState(animations[0]);

  const generateVideo = async (files) => {
    if (!files.length) return alert("Please select images");

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 720;
    canvas.height = 1280;

    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    const chunks = [];

    recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    recorder.onstop = () =>
      onDone(URL.createObjectURL(new Blob(chunks, { type: "video/webm" })));

    const images = await Promise.all(
      files.map(
        (file) =>
          new Promise((res) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => res(img);
          })
      )
    );

    let index = 0;
    let start = null;
    recorder.start();

    function draw(t) {
      if (!start) start = t;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

   const DURATION = 2000; // 2 second
const progress = Math.min((t - start) / DURATION, 1);


      switch (selectedAnimation) {
        case "zoomIn":
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.scale(0.8 + 0.2 * progress, 0.8 + 0.2 * progress);
          ctx.drawImage(
            images[index],
            -canvas.width / 2,
            -canvas.height / 2,
            canvas.width,
            canvas.height
          );
          ctx.restore();
          break;

        case "zoomOut":
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.scale(1.2 - 0.2 * progress, 1.2 - 0.2 * progress);
          ctx.drawImage(
            images[index],
            -canvas.width / 2,
            -canvas.height / 2,
            canvas.width,
            canvas.height
          );
          ctx.restore();
          break;

        case "slideLeft":
          ctx.drawImage(
            images[index],
            canvas.width * (1 - progress),
            0,
            canvas.width,
            canvas.height
          );
          break;

        case "slideRight":
          ctx.drawImage(
            images[index],
            -canvas.width * (1 - progress),
            0,
            canvas.width,
            canvas.height
          );
          break;

        case "fade":
          ctx.globalAlpha = progress;
          ctx.drawImage(images[index], 0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = 1;
          break;

        case "zoomFade":
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.scale(0.8 + 0.2 * progress, 0.8 + 0.2 * progress);
          ctx.globalAlpha = progress;
          ctx.drawImage(
            images[index],
            -canvas.width / 2,
            -canvas.height / 2,
            canvas.width,
            canvas.height
          );
          ctx.restore();
          ctx.globalAlpha = 1;
          break;

        case "slideFade":
          ctx.globalAlpha = progress;
          ctx.drawImage(
            images[index],
            canvas.width * (1 - progress),
            0,
            canvas.width,
            canvas.height
          );
          ctx.globalAlpha = 1;
          break;

        default:
          ctx.drawImage(images[index], 0, 0, canvas.width, canvas.height);
      }

      if (t - start > 1500) {
        index++;
        start = t;
        if (index >= images.length) return recorder.stop();
      }

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">

      {/* Animation Selector */}
      <div className="relative w-full">
        <select
          value={selectedAnimation}
          onChange={(e) => setSelectedAnimation(e.target.value)}
          className="
            w-full
            px-5 py-3
            rounded-xl
            bg-(--card)
            text-(--foreground)
            border border-(--border)
            focus:outline-none
            focus:ring-2 focus:ring-(--primary)
            appearance-none
            cursor-pointer
            transition
          "
        >
          {animations.map((anim) => (
            <option key={anim} value={anim}>
              {anim}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-(--muted-foreground)">
          ▼
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => generateVideo([...e.target.files])}
      />

      {/* Upload Button */}
      <button
        onClick={() => inputRef.current?.click()}
        className="
          w-full
          px-6 py-3
          rounded-xl
          bg-(--primary)
          text-(--primary-foreground)
          font-semibold
          hover:opacity-90
          transition
          shadow-md
        "
      >
        Upload Images
      </button>
    </div>
  );
}
