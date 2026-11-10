import Hero from "@/components/Hero";
import CategoryBanners from "@/components/CategoryBanners";
import AboutSection from "@/components/AboutSection";
import ThumbnailReel from "@/components/ThumbnailReel";
import ProductCatalog from "@/components/ProductCatalog";
import CuratedProcess from "@/components/CuratedProcess";
import Testimonials from "@/components/Testimonials";
import FaqSection from "@/components/FaqSection";
import WaitlistBanner from "@/components/WaitlistBanner";
import { FloatingCinemaCanvas } from "@/components/CinemaDecorations";

export default function HomePage() {
  return (
    <div className="w-full flex flex-col relative overflow-x-hidden">
      {/* Ambient floating cinema elements filling outer margins and empty space like the pretzels */}
      <FloatingCinemaCanvas />

      {/* 1. Hero with Red Banner, 3D Film Reel & Clapperboard, and Cream Stats */}
      <Hero />

      {/* 2. 4 Rounded Category Banners */}
      <CategoryBanners />

      {/* 3. Team & Story Section (Universidad de Cartagena) */}
      <AboutSection />

      {/* 4. Circular Preview Thumbnail Reel */}
      <ThumbnailReel />

      {/* 5. Our Products / Specialized Reactive Catalog */}
      <ProductCatalog />

      {/* 6. The CineMerch Way (Curated Process framed with 35mm film reels) */}
      <CuratedProcess />

      {/* 7. Verified Collector Testimonials */}
      <Testimonials />

      {/* 8. FAQs Accordion */}
      <FaqSection />

      {/* 9. Waitlist / Lead Capture Banner ("Primeros 100 Cinéfilos" 10% coupon lead capture) */}
      <WaitlistBanner />
    </div>
  );
}
