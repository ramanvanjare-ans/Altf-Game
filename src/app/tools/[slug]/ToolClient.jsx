"use client";

import dynamic from "next/dynamic";
import { toolRuntimeMap } from "@/platform/registry/toolRuntimeMap";
import { useAds } from "@/ads/AdsProvider";
import useDevice from "@/hooks/useDevice";
import AdSidebar from "@/ads/layouts/shared/AdSidebar";
import AdBottomBanner from "@/ads/layouts/shared/AdBottomBanner";

export default function ToolClient({ slug }) {
  const loadTool = toolRuntimeMap[slug];
  const device = useDevice();

  if (!loadTool) {
    return (
      <div className="p-10 text-center text-sm text-red-500">
        Tool not registered
      </div>
    );
  }

  const Tool = dynamic(() => loadTool(), {
    ssr: false,
    loading: () => (
      <div className="p-10 text-center text-sm text-[var(--color-muted-foreground)]">
        Loading tool…
      </div>
    ),
  });

  const leftAd = useAds({
    placement: "tool_detail_left",
    layout: "sidebar",
    device,
  })[0];

  const rightAd = useAds({
    placement: "tool_detail_right",
    layout: "sidebar",
    device,
  })[0];

  const bottomAd = useAds({
    placement: "tool_detail_bottom",
    layout: "banner",
    device,
  })[0];

  return (
    <div className="flex justify-center gap-8 py-10">
      
      {/* LEFT STICKY AD */}
      <div className="hidden xl:block">
        <AdSidebar ad={leftAd?.content} />
      </div>

      {/* TOOL CONTENT */}
      <div className="flex-1 max-w-7xl">
        <Tool />
        <AdBottomBanner ad={bottomAd?.content} />
      </div>

      {/* RIGHT STICKY AD */}
      <div className="hidden xl:block">
        <AdSidebar ad={rightAd?.content} />
      </div>

    </div>
  );
}
