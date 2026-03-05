import HeroCarousel from "./components/HeroCarousel";
import CategoryGrid from "./components/CategoryGrid";
import FlashDeals from "./components/FlashDeals";
import GrabTheDeal from "./components/GrabTheDeal";
import FlashDealCarousel from "./components/FlashDealCarousel";
import LifestylePromo from "./components/LifestylePromo";
import PersonalizedRecommendations from "./components/PersonalizedRecommendations";
import TrendingNow from "./components/TrendingNow";
import BrandShowcase from "./components/BrandShowcase";
import UserReviews from "./components/UserReviews";
// import SocialProof from "./components/SocialProof";
// import NewsletterPopup from "./components/NewsletterPopup";


import saleData from "./data/saleData";

export default function SaleLocatorPage() {
  return (
    <div className="min-h-screen bg-(--background) text-(--foreground)">

      {/* Hero Carousel */}
      <HeroCarousel banners={saleData.heroBanners} />

      {/* Category Grid */}
      <CategoryGrid categories={saleData.categories} />
      <LifestylePromo />
      {/* Flash Deals Carousel */}
      <FlashDealCarousel banners={saleData.flashDealsBanners} />
      {/* Flash Deals */}
      <FlashDeals deals={saleData.flashDeals} />
      {/* NEW: Personalized Recommendations - AI-powered suggestions */}
      <PersonalizedRecommendations recommendations={saleData.recommendations} />

      {/* Featured Offers */}
      <GrabTheDeal offers={saleData.featuredOffers} />

      {/* NEW: Trending Now - Live trending deals with tabs */}
      <TrendingNow trendingDeals={saleData.trendingDeals} />

      {/* NEW: Brand Showcase - Featured partner brands */}
      <BrandShowcase brands={saleData.brands} />

      {/* NEW: User Reviews - Social proof with testimonials */}
      <UserReviews reviews={saleData.reviews} />

      {/* Footer CTA */}
      <section className="py-20 bg-(--primary)">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">

          <h2 className="text-3xl md:text-4xl font-bold text-(--primary-foreground) mb-5">
            Don’t Miss Out!
          </h2>

          <p className="text-(--primary-foreground) opacity-80 max-w-lg mx-auto mb-10">
            Subscribe to our newsletter and be the first to know about exclusive deals and offers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">

            <input
              type="email"
              placeholder="Enter your email"
              className="
                flex-1
                px-5 py-3
                rounded-xl
                bg-(--card)
                text-(--foreground)
                placeholder:text-(--muted-foreground)
                border border-(--border)
                focus:outline-none
                focus:border-(--primary)
                transition
              "
            />

            <button
              className="
                px-6 py-3
                bg-(--background)
                text-(--foreground)
                font-semibold
                rounded-xl
                hover:opacity-90
                transition
              "
            >
              Subscribe
            </button>

          </div>

        </div>
      </section>
      {/* NEW: Social Proof - Live activity feed (floating widget) */}
      {/* <SocialProof activities={saleData.activities} /> */}

      {/* NEW: Newsletter Popup - Engaging subscription modal */}
      {/* <NewsletterPopup /> */}
    </div>
  );
}
