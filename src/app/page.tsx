import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { ProductFeatures } from "@/components/ProductFeatures";
import { RevealObserver } from "@/components/RevealObserver";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-ink px-4 py-2 font-display text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="overflow-x-clip">
        {/* 1. Hero */}
        <Hero />
        {/* 2. Product / Features */}
        <ProductFeatures />
      </main>
      {/* 3. Thank-you / Footer */}
      <Footer />
      <RevealObserver />
    </>
  );
}
