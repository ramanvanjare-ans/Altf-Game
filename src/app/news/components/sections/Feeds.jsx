"use client";

import { useMemo } from "react";
import NewsCard from "../ui/NewsCard";
import newsData from "../../../../../public/data/newsdata.json";
import { filterNews } from "../../lib/filterNews";
import { useAds } from "@/ads/AdsProvider";
import useDevice from "@/hooks/useDevice";
import { injectRandomFeedAds } from "@/ads/adInjector";
import AdNewsCard from "@/ads/layouts/news/AdNewsCard";

export default function Feeds({ type = "all" }) {
  const device = useDevice();

  const filteredNews = useMemo(
    () => filterNews(newsData.news, type),
    [type]
  );

  const newsAds = useAds({
    placement: "news_feed",
    layout: "news_card",
    device,
  });

  const newsWithAds = useMemo(() => {
    return injectRandomFeedAds(filteredNews, newsAds, 3);
  }, [filteredNews, newsAds]);

  return (
    <main className="space-y-6">
      <h1 className="text-xl font-bold capitalize">
        {type === "all" ? "Latest News" : type}
      </h1>

      {newsWithAds.map((item) => {
        if (item.type === "ad-single") {
          return <AdNewsCard key={item.id} ad={item.ad} />;
        }

        return <NewsCard key={item.id} news={item} />;
      })}
    </main>
  );
}
