import Hero from "@/components/Hero";
import CategoryShowcase from "@/components/CategoryShowcase";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";
import Footer from "@/components/Footer";
import { getFeaturedProducts } from "@/lib/supabase/products";

export default async function Home() {
  const products = await getFeaturedProducts();

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
          <FeaturedProductsSection products={products} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
