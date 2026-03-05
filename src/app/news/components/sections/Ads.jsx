export default function Ads() {
  return (
    <div className="space-y-6">
      {/* Ad 1 */}
      <AdCard
        img="https://images.unsplash.com/photo-1522199710521-72d69614c702?q=80&w=800&auto=format&fit=crop"
        height="h-[250px]"
      />

      {/* Ad 2 */}
      <AdCard
        img="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop"
        height="h-[500px]"
      />
    </div>
  );
}

function AdCard({ img, height }) {
  return (
    <div className="relative overflow-hidden rounded-sm">
      {/* Image */}
      <img
        src={img}
        alt="Sponsored Ad"
        className={`${height} w-full object-cover`}
        loading="lazy"
      />

      {/* Sponsored badge */}
      <div
        className="
          absolute top-3 left-3
          rounded-full
          bg-black/70
          px-3 py-1
          text-xs font-semibold
          text-white
          backdrop-blur-sm
        "
      >
        Sponsored
      </div>
    </div>
  );
}
