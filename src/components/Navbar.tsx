"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Search, User, Truck } from "lucide-react";
import { AnchorLink } from "./SmoothScroll";
import { useCart } from "@/components/cart/CartProvider";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#categories", label: "Shop" },
  { href: "#categories", label: "Categories" },
  { href: "#categories", label: "Deals" },
  { href: "#categories", label: "New Arrivals" },
  { href: "#contact", label: "Track Order" },
];

export default function Navbar() {
  const { itemCount, openCart, isHydrated } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [announcementHeight, setAnnouncementHeight] = useState(0);
  const announcementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const bar = announcementRef.current;
    if (!bar) return;
    const ro = new ResizeObserver(() => setAnnouncementHeight(bar.offsetHeight));
    ro.observe(bar);
    setAnnouncementHeight(bar.offsetHeight);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isPanelOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isPanelOpen]);

  const closePanel = useCallback(() => setIsPanelOpen(false), []);

  return (
    <>
      <header
        id="site-header"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1060,
        }}
      >
        {/* Announcement Bar — always visible, even when panel is open */}
        <div
          id="top-announcement-bar"
          ref={announcementRef}
          style={{
            background:
              "linear-gradient(90deg, #DF5E03 0%, #F47514 50%, #DF5E03 100%)",
            padding: "0.3rem 0.5rem",
            overflow: "hidden",
            position: "relative",
            zIndex: 1070,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
              fontFamily: "var(--font-outfit), sans-serif",
              fontSize: "clamp(0.5625rem, 2.2vw, 0.72rem)",
              fontWeight: 700,
              color: "#000000",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              lineHeight: 1.2,
            }}
          >
            <Truck size={13} strokeWidth={2.5} style={{ flexShrink: 0 }} />
            <span>FREE DELIVERY ON ORDERS ABOVE RS. 5000</span>
          </div>
        </div>

        {/* Main Nav — hidden when panel is open */}
        <nav
          id="navbar"
          style={{
            position: "relative",
            width: "100%",
            transition: "opacity 0.25s ease, transform 0.25s ease, background 0.4s ease, border-color 0.4s ease",
            background: "transparent",
            borderBottom: isScrolled
              ? "1px solid rgba(244, 117, 20, 0.2)"
              : "1px solid transparent",
            opacity: isPanelOpen ? 0 : 1,
            pointerEvents: isPanelOpen ? "none" : "auto",
          }}
        >
          <div
            style={{
              maxWidth: "1440px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              height: "64px",
              padding: "0 0 0 0",
              position: "relative",
            }}
          >
            {/* Left: MENU trigger — text only, flush to left */}
            <button
              id="menu-open-btn"
              onClick={() => setIsPanelOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isPanelOpen}
              className="hamburger-btn"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "5px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "0.4rem 0.5rem",
                margin: 0,
                flexShrink: 0,
              }}
            >
              <span className="hb-line hb-top" />
              <span className="hb-line hb-mid" />
              <span className="hb-line hb-bot" />
            </button>



            {/* Right: Icons */}
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: "0.15rem",
              }}
            >
              <button
                aria-label="Search"
                className="nav-icon-btn desktop-only-icon"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                }}
              >
                <Search size={19} strokeWidth={2} />
              </button>

              <button
                aria-label="Account"
                className="nav-icon-btn desktop-only-icon"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                }}
              >
                <User size={19} strokeWidth={2} />
              </button>

              <button
                type="button"
                onClick={openCart}
                aria-label={`Open shopping cart with ${isHydrated ? itemCount : 0} items`}
                className="nav-icon-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                  position: "relative",
                }}
              >
                <ShoppingCart size={19} strokeWidth={2} />
                <span
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    minWidth: "16px",
                    height: "16px",
                    padding: "0 3px",
                    borderRadius: "8px",
                    background: "#F47514",
                    color: "#000",
                    fontSize: "0.6rem",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                  }}
                >
                  {isHydrated ? itemCount : 0}
                </span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Left Slide Panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <>
            {/* Backdrop — starts below announcement bar */}
            <motion.div
              key="panel-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={closePanel}
              style={{
                position: "fixed",
                top: announcementHeight,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1040,
                background: "rgba(0,0,0,0.72)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            />

            {/* Panel — starts below announcement bar */}
            <motion.aside
              key="nav-panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              style={{
                position: "fixed",
                top: announcementHeight,
                left: 0,
                bottom: 0,
                width: "min(280px, 82vw)",
                zIndex: 1080,
                background: "#F47514",
                borderRight: "none",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
              }}
            >
              {/* Panel header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.25rem 1.5rem",
                  borderBottom: "1px solid rgba(0,0,0,0.15)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#000000",
                  }}
                >
                  Menu
                </span>
                <button
                  onClick={closePanel}
                  aria-label="Close menu"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "none",
                    border: "none",
                    padding: "4px",
                    color: "#000000",
                    cursor: "pointer",
                    opacity: 0.75,
                    transition: "opacity 0.2s ease",
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "0.75")}
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Nav links */}
              <nav style={{ padding: "1rem 0", flex: 1 }}>
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.055, duration: 0.3 }}
                  >
                    <AnchorLink
                      href={link.href}
                      onClick={closePanel}
                      className="panel-nav-link"
                    >
                      {link.label}
                    </AnchorLink>
                  </motion.div>
                ))}
              </nav>

              {/* Panel footer */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42 }}
                style={{
                  padding: "1.5rem",
                  borderTop: "1px solid rgba(0,0,0,0.15)",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    closePanel();
                    openCart();
                  }}
                  className="panel-cta-btn"
                  style={{
                    marginBottom: "0.5rem",
                    background: "#000000",
                    color: "#FFFFFF",
                  }}
                >
                  <ShoppingCart size={17} />
                  <span>View Cart ({isHydrated ? itemCount : 0})</span>
                </button>

                <AnchorLink
                  href="#categories"
                  onClick={closePanel}
                  className="panel-cta-btn"
                >
                  <ShoppingCart size={17} />
                  <span>Shop Now</span>
                </AnchorLink>

                <div
                  style={{
                    marginTop: "1.25rem",
                    color: "rgba(0,0,0,0.55)",
                    fontSize: "0.75rem",
                    fontFamily: "var(--font-outfit), sans-serif",
                    lineHeight: 1.6,
                  }}
                >
                  <p style={{ margin: 0 }}>Everything under Rs 5,000</p>
                  <p style={{ margin: "0.2rem 0 0" }}>Made for Pakistan</p>
                </div>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .hamburger-btn {
          position: relative;
        }
        .hb-line {
          display: block;
          width: 26px;
          height: 2.5px;
          border-radius: 2px;
          transition: transform 0.25s ease, opacity 0.25s ease, width 0.25s ease;
        }
        .hb-top  { background: #F47514; }
        .hb-mid  { background: #ffffff; width: 20px; }
        .hb-bot  { background: #F47514; }
        .hamburger-btn:hover .hb-top { transform: translateX(3px); }
        .hamburger-btn:hover .hb-mid { width: 26px; }
        .hamburger-btn:hover .hb-bot { transform: translateX(-3px); }
        .nav-icon-btn:hover {
          color: #f47514 !important;
          background: rgba(244, 117, 20, 0.08) !important;
        }
        .panel-nav-link {
          display: block;
          padding: 0.95rem 1.5rem;
          color: rgba(0, 0, 0, 0.85);
          text-decoration: none;
          font-size: 1.125rem;
          font-weight: 700;
          font-family: var(--font-outfit), sans-serif;
          letter-spacing: 0.01em;
          border-left: 3px solid transparent;
          transition: all 0.22s ease;
        }
        .panel-nav-link:hover,
        .panel-nav-link:active {
          color: #000000;
          border-left-color: #000000;
          background: rgba(0, 0, 0, 0.1);
          padding-left: 1.75rem;
        }
        .panel-cta-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          border-radius: 10px;
          background: #000000;
          color: #F47514;
          font-size: 0.9375rem;
          font-weight: 700;
          font-family: var(--font-outfit), sans-serif;
          text-decoration: none;
          min-height: 48px;
          width: 100%;
          transition: all 0.3s ease;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.3);
        }
        .panel-cta-btn:hover {
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.45);
          transform: translateY(-1px);
        }
        .panel-cta-btn:active {
          transform: scale(0.98);
        }
        .panel-close-btn:hover {
          background: rgba(0, 0, 0, 0.22) !important;
        }
        .navbar-logo-box {
          position: relative;
          width: 54px;
          height: 54px;
        }
        @media (max-width: 480px) {
          .navbar-logo-box {
            width: 44px;
            height: 44px;
          }
          .desktop-only-icon {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
