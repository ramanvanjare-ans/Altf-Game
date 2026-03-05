import AdToolCard from "./AdToolCard";

export default function AdPairRow({ ads }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {ads.map((ad, i) => (
        <AdToolCard key={i} ad={ad} />
      ))}
    </div>
  );
}
