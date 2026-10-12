import Hero from "@/components/Hero";
import CategoryShowcase from "@/components/CategoryShowcase";

import FeaturedProductsSection from "@/components/FeaturedProductsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    /* Single unified dark canvas — sections blend via internal gradients */
    <div style={{ background: "#050708", color: "white", position: "relative", width: "100%", maxWidth: "100%", overflowX: "clip" }}>
      <main style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "100%", overflowX: "clip" }}>
        <Hero />
        {/* Synced continuous background: White to Light Cream Off-white */}
        <div
          style={{
            background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
            position: "relative",
            width: "100%",
          }}
        >
          <CategoryShowcase />
          <FeaturedProductsSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
