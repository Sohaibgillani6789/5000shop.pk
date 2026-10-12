import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import WebsiteLoader from "@/components/WebsiteLoader";

// Body font: clean, modern, highly legible
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Display font: bold, impactful for headlines
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050708",
};

export const metadata: Metadata = {
  title: "5 Hazaar Tak — Pakistan's Smartest Marketplace | Everything Under ₨5,000",
  description:
    "Discover curated Fashion, Beauty, Electronics, Home & Accessories — all under ₨5,000. Premium quality at unbeatable prices, delivered across Pakistan.",
  keywords: [
    "Pakistan shopping",
    "under 5000",
    "affordable fashion Pakistan",
    "online shopping Pakistan",
    "5 hazaar tak",
    "budget electronics",
    "beauty products Pakistan",
  ],
  openGraph: {
    title: "5 Hazaar Tak — Everything Under ₨5,000",
    description:
      "Pakistan's smartest marketplace. Curated quality across 5 categories, all under ₨5,000.",
    type: "website",
    locale: "en_PK",
    siteName: "5 Hazaar Tak",
  },
  twitter: {
    card: "summary_large_image",
    title: "5 Hazaar Tak — Everything Under ₨5,000",
    description:
      "Pakistan's smartest marketplace. Curated quality across 5 categories, all under ₨5,000.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "name": "5 Hazaar Tak",
    "url": "https://5hazaartak.pk",
    "description": "Pakistan's smartest marketplace — curated Fashion, Beauty, Electronics, Home & Accessories under ₨5,000.",
    "currenciesAccepted": "PKR",
    "paymentAccepted": "Cash on Delivery, Mobile Wallet, Credit Card",
    "priceRange": "₨1 - ₨5000",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PK",
    },
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <body>
        <WebsiteLoader />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScrollProvider>
          <Navbar />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
