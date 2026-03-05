import trending from '../data/trending.json'

export default function TrendingDeals() {
  return (
    <section className="px-6 py-10">
      <h2 className="text-2xl font-bold mb-4">Trending Today</h2>
      <div className="flex gap-6 overflow-x-auto">
        {trending.map((deal, i) => (
          <div
            key={i}
            className="min-w-[260px] rounded-xl overflow-hidden shadow"
          >
            <img src={deal.image} alt={deal.title} />
            <div className="p-3">
              <h4 className="font-semibold">{deal.title}</h4>
              <p className="text-orange-600">{deal.discount}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
