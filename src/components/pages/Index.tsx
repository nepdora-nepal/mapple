"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedBrand } from "@/components/home/FeaturedBrand";
import { TrendingProducts } from "@/components/home/TrendingProducts";
import { PromoBanners } from "@/components/home/PromoBanners";
import { BestSellers } from "@/components/home/BestSellers";
import { RoutineBuilder } from "@/components/home/RoutineBuilder";

import { ContactSection } from "@/components/home/ContactSection";
import { FAQSection } from "@/components/home/FAQSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <TrendingProducts />
        <FeaturedBrand />
        <PromoBanners />
        <BestSellers />
        <RoutineBuilder />
        <FAQSection />
        <ContactSection />
      </main>
    </div>
  );
};

export default Index;
