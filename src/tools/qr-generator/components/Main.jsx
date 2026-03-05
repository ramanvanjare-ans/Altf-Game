"use client";

import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, QrCode, Palette, Smartphone } from "lucide-react";
import Header from "./Header";

export default function MainComponent() {
  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState(220);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fgColor, setFgColor] = useState("#000000");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  const downloadQR = () => {
    if (!isClient) return;

    const canvas = document.getElementById("qr-code");
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "qr-code.png";
      link.click();
    }
  };

  return (
    <div className="space-y-8 text-(--foreground) p-7">
      {/* Intro Card */}
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="bg-(--card) border border-(--border) rounded-2xl p-6 space-y-6">
          <h2 className="font-semibold text-lg">Customize QR Code</h2>

          {/* Text Input */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Text or URL</label>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter URL or text"
              className="
                w-full px-4 py-2 rounded-lg
                bg-(--background)
                border border-(--border)
                text-(--foreground)
                placeholder:text-(--muted-foreground)
                focus:ring-2 focus:ring-(--primary) outline-none
              "
            />
          </div>

          {/* Size */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Size</label>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="
                w-full px-4 py-2 rounded-lg
                bg-(--background)
                border border-(--border)
                text-(--foreground)
                focus:ring-2 focus:ring-(--primary) outline-none
              "
            >
              <option value={150}>Small (150px)</option>
              <option value={220}>Medium (220px)</option>
              <option value={300}>Large (300px)</option>
            </select>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-10 w-14 rounded cursor-pointer border border-(--border)"
                />
                <span className="text-sm text-(--muted-foreground)">
                  {bgColor}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Foreground Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="h-10 w-14 rounded cursor-pointer border border-(--border)"
                />
                <span className="text-sm text-(--muted-foreground)">
                  {fgColor}
                </span>
              </div>
            </div>
          </div>

          {/* Download */}
          <button
            onClick={downloadQR}
            disabled={!text.trim()}
            className="
              w-full py-3 rounded-xl
              bg-(--primary)
              text-(--primary-foreground)
              font-semibold
              hover:opacity-90
              disabled:opacity-50
              transition
              flex items-center justify-center gap-2 cursor-pointer
            "
          >
            <Download className="w-4 h-4" />
            Download QR Code
          </button>
        </div>

        {/* Preview */}
        <div className="bg-(--card) border border-(--border) rounded-2xl p-6 flex flex-col items-center justify-center">
          {isClient ? (
            <>
              <div className="bg-(--background) border border-(--border) rounded-lg p-4">
                <QRCodeCanvas
                  id="qr-code"
                  value={text || " "}
                  size={size}
                  bgColor={bgColor}
                  fgColor={fgColor}
                  level="H"
                  includeMargin
                />
              </div>

              <p className="mt-4 text-sm text-(--muted-foreground) text-center">
                Scan using your phone camera to test
              </p>
            </>
          ) : (
            <div className="h-40 w-40 bg-(--muted) rounded-lg animate-pulse" />
          )}
        </div>
      </div>

      {/* Features */}
      <div className="bg-(--card) border border-(--border) rounded-2xl p-6">
        <h2 className="font-semibold text-lg mb-4 text-center sm:text-start">
          Features
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: <QrCode className="w-5 h-5 text-(--primary)" />,
              title: "Instant Generation",
              desc: "QR updates in real-time as you type",
            },
            {
              icon: <Palette className="w-5 h-5 text-(--primary)" />,
              title: "Custom Colors",
              desc: "Match your brand colors easily",
            },
            {
              icon: <Smartphone className="w-5 h-5 text-(--primary)" />,
              title: "Mobile Friendly",
              desc: "Works perfectly on all devices",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="flex gap-3 p-4 border border-(--border) rounded-xl bg-(--background)"
            >
              {f.icon}
              <div>
                <h3 className="font-medium">{f.title}</h3>
                <p className="text-sm text-(--muted-foreground)">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-(--card) border border-(--border) rounded-2xl p-6">
        <h2 className="font-semibold text-lg mb-4 text-center sm:text-start">
          QR Code Tips
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 text-sm text-(--muted-foreground)">
          <ul className="space-y-1">
            <li>• Keep URLs short for better scanning</li>
            <li>• Use high contrast colors</li>
            <li>• Always test before sharing</li>
          </ul>
          <ul className="space-y-1">
            <li>• Website & landing pages</li>
            <li>• WiFi credentials</li>
            <li>• Business cards</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
