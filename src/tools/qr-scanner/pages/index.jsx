"use client";
import QRScannerHero from "../components/QRScannerHero";
import QRCodeFeatures from "../components/QRCodeFeatures";
import QrCodeScannerJsQR from "../components/QrCodeScannerJsQR";

export default function QRScannerApp() {
  return (
    <div className="min-h-screen bg-(--background) text-(--foreground)">
      {/* Hero */}
      <QRScannerHero />

      {/* Scanner Section */}
      <div id="scanner">
        <QrCodeScannerJsQR />
      </div>

      {/* Features */}
      <QRCodeFeatures />
    </div>
  );
}
