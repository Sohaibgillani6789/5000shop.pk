"use client";

import { memo, useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./ShoppingBagLoader.module.css";

export interface ShoppingBagLoaderProps {
  /**
   * Renders the loader as a fixed full-viewport #FFFFFF screen when true,
   * or as a centered relative container when false.
   * @default true
   */
  fullScreen?: boolean;
  /**
   * Accessible label announced by assistive technologies.
   * @default "Loading"
   */
  ariaLabel?: string;
  /**
   * Optional progress (0 to 100). If omitted or undefined, will run a smooth continuous loading pulse.
   */
  progress?: number;
  /**
   * Optional additional CSS class name.
   */
  className?: string;
}

/**
 * ShoppingBagLoader
 *
 * Pure white (#FFFFFF) 3D-inspired orange shopping bag loader.
 * Requirements:
 * 1. Bag and handles remain static/still (no floating or rotation on the bag).
 * 2. Floating animation is on the balls (3D spheres bob smoothly).
 * 3. Sweeping circular/elliptical ring visually fills gradually with vivid orange
 *    reflecting real loading progress or smooth indeterminate progression.
 */
function ShoppingBagLoaderComponent({
  fullScreen = true,
  ariaLabel = "Loading",
  progress,
  className,
}: ShoppingBagLoaderProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;
  const rawId = useId().replace(/:/g, "");
  const id = (name: string) => `${name}-${rawId}`;

  // Normalized progress between 0 and 100 (if provided)
  const isDeterminate = typeof progress === "number";
  const clampedProgress = isDeterminate
    ? Math.max(0, Math.min(100, progress))
    : 100;

  // Total orbit path approximate perimeter for dasharray
  const ORBIT_PATH_LENGTH = 540;
  const strokeDashoffset = isDeterminate
    ? ORBIT_PATH_LENGTH * (1 - clampedProgress / 100)
    : 0;

  const containerClassName = [
    styles.container,
    fullScreen ? styles.fullScreen : styles.inline,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={containerClassName}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={
        isDeterminate ? `${ariaLabel} (${Math.round(clampedProgress)}%)` : ariaLabel
      }
    >
      <span className={styles.srOnly}>
        {isDeterminate
          ? `${ariaLabel}: ${Math.round(clampedProgress)}%`
          : ariaLabel}
      </span>

      <div className={styles.stage} aria-hidden="true">
        <svg
          className={styles.sceneSvg}
          viewBox="0 0 340 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* ── Soft Warm Ground Shadow Gradient ── */}
            <radialGradient
              id={id("groundShadow")}
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(166 225) scale(76 11)"
            >
              <stop offset="0%" stopColor="#D86522" stopOpacity="0.28" />
              <stop offset="45%" stopColor="#E68242" stopOpacity="0.12" />
              <stop offset="78%" stopColor="#F2A470" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#F2A470" stopOpacity="0" />
            </radialGradient>

            {/* ── 3D Left Sphere Gradient ── */}
            <radialGradient
              id={id("sphereLeft")}
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(70.5 109.5) rotate(48) scale(16)"
            >
              <stop offset="0%" stopColor="#FFC76B" />
              <stop offset="28%" stopColor="#FF9824" />
              <stop offset="68%" stopColor="#F26A02" />
              <stop offset="100%" stopColor="#C44200" />
            </radialGradient>

            {/* ── 3D Right Sphere Gradient ── */}
            <radialGradient
              id={id("sphereRight")}
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(259.5 180.5) rotate(48) scale(13)"
            >
              <stop offset="0%" stopColor="#FFC76B" />
              <stop offset="30%" stopColor="#FF9620" />
              <stop offset="70%" stopColor="#F06800" />
              <stop offset="100%" stopColor="#C24000" />
            </radialGradient>

            {/* ── Bag Left 3D Gusset Gradient ── */}
            <linearGradient
              id={id("bagGusset")}
              x1="124"
              y1="91"
              x2="142"
              y2="190"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FF9E44" />
              <stop offset="16%" stopColor="#F16E08" />
              <stop offset="58%" stopColor="#D94E00" />
              <stop offset="100%" stopColor="#BC3B00" />
            </linearGradient>

            {/* ── Bag Gusset Inner Fold Crease ── */}
            <linearGradient
              id={id("gussetCrease")}
              x1="129"
              y1="94"
              x2="140"
              y2="189"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#C94500" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#9E2D00" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#852200" stopOpacity="0.5" />
            </linearGradient>

            {/* ── Bag Front Trapezoidal Face Gradient ── */}
            <linearGradient
              id={id("bagFront")}
              x1="206"
              y1="82"
              x2="146"
              y2="188"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FF9E2C" />
              <stop offset="36%" stopColor="#FA820E" />
              <stop offset="74%" stopColor="#EE6802" />
              <stop offset="100%" stopColor="#DF5200" />
            </linearGradient>

            {/* ── Bag Front Top-Left Specular Bevel ── */}
            <linearGradient
              id={id("bagFrontBevel")}
              x1="136"
              y1="88"
              x2="178"
              y2="155"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFC278" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#FFA442" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#F57605" stopOpacity="0" />
            </linearGradient>

            {/* ── Back Handle Gradients ── */}
            <linearGradient
              id={id("backHandleBody")}
              x1="142"
              y1="62"
              x2="176"
              y2="94"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFBA75" />
              <stop offset="50%" stopColor="#F28A30" />
              <stop offset="100%" stopColor="#D96512" />
            </linearGradient>

            {/* ── Front Handle 3D Cream/Ivory Gradients ── */}
            <linearGradient
              id={id("frontHandleUnder")}
              x1="154"
              y1="60"
              x2="192"
              y2="98"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#F9B572" />
              <stop offset="55%" stopColor="#F08D38" />
              <stop offset="100%" stopColor="#E06E16" />
            </linearGradient>

            <linearGradient
              id={id("frontHandleMain")}
              x1="156"
              y1="58"
              x2="190"
              y2="96"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#FDF0E0" />
              <stop offset="85%" stopColor="#FAD8B4" />
              <stop offset="100%" stopColor="#F5BC84" />
            </linearGradient>

            {/* ── Orbit Neutral Unfilled Base Gradients (Subtle Pale Cream & Warm Neutral) ── */}
            <linearGradient
              id={id("orbitBaseEdge")}
              x1="54"
              y1="172"
              x2="268"
              y2="132"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#E2D4C2" />
              <stop offset="50%" stopColor="#EBDDCB" />
              <stop offset="100%" stopColor="#D8C8B5" />
            </linearGradient>

            <linearGradient
              id={id("orbitBaseTop")}
              x1="54"
              y1="168"
              x2="268"
              y2="128"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FAF1E6" />
              <stop offset="50%" stopColor="#FFF8F0" />
              <stop offset="100%" stopColor="#F5E8D6" />
            </linearGradient>

            {/* ── Orbit Active Orange Filling Gradients ── */}
            <linearGradient
              id={id("orbitFillEdge")}
              x1="54"
              y1="172"
              x2="268"
              y2="132"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#D94E00" />
              <stop offset="28%" stopColor="#E85E00" />
              <stop offset="60%" stopColor="#F07F1E" />
              <stop offset="100%" stopColor="#FF9D30" />
            </linearGradient>

            <linearGradient
              id={id("orbitFillTop")}
              x1="54"
              y1="168"
              x2="268"
              y2="128"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#E65800" />
              <stop offset="30%" stopColor="#F07F1E" />
              <stop offset="70%" stopColor="#FF9824" />
              <stop offset="100%" stopColor="#FFC278" />
            </linearGradient>

            {/* ── Orbit Back Left Tail (Cream Fade) ── */}
            <linearGradient
              id={id("orbitBackLeft")}
              x1="108"
              y1="136"
              x2="78"
              y2="152"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FDF1E2" stopOpacity="0" />
              <stop offset="45%" stopColor="#FCEAD5" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#FBE2C4" stopOpacity="0.95" />
            </linearGradient>

            {/* ── Orbit Back Right Arc (Soft Cream-Ivory) ── */}
            <linearGradient
              id={id("orbitBackRight")}
              x1="242"
              y1="93"
              x2="278"
              y2="132"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#F7E5D2" stopOpacity="0.55" />
              <stop offset="35%" stopColor="#FBEBD9" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#FFF3E5" stopOpacity="1" />
            </linearGradient>

            {/* ClipPath for Orbit Filling Progress */}
            {/* The sweeping elliptical guide path starts at back-right (244,91), sweeps around front, and returns */}
            <clipPath id={id("orbitProgressClip")}>
              {isDeterminate ? (
                <path
                  d="M 244 91 C 272 91, 289 101, 282 116 C 275 125, 252 142, 211 161 C 148 184, 85 194, 63 184 C 48 178, 55 165, 77 152 C 96 141, 106 137, 109 140"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="32"
                  strokeLinecap="round"
                  strokeDasharray={ORBIT_PATH_LENGTH}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    transition: shouldAnimate ? "stroke-dashoffset 0.25s ease-out" : "none",
                  }}
                />
              ) : (
                <rect x="0" y="0" width="340" height="260" />
              )}
            </clipPath>
          </defs>

          {/* ============================================================
              1. STATIC SOFT WARM AMBIENT GROUND SHADOW (NO BAG MOVEMENT)
             ============================================================ */}
          <ellipse
            cx="166"
            cy="225"
            rx="76"
            ry="11"
            fill={`url(#${id("groundShadow")})`}
            opacity="0.9"
          />

          {/* ============================================================
              2. BACK SEGMENT OF 3D ORBIT RING (Behind the Bag)
             ============================================================ */}
          <g>
            {/* Base Unfilled Track Behind */}
            <path
              d="M 106 137 C 96 141, 86 146, 77 152 L 85 155 C 93 149, 101 144, 109 140 Z"
              fill={`url(#${id("orbitBackLeft")})`}
              opacity="0.45"
            />
            <path
              d="M 244 91 C 272 91, 289 101, 282 116 C 279 122, 272 128, 263 134 L 252 129 C 260 124, 265 119, 267 114 C 272 103, 259 97, 241 96 Z"
              fill={`url(#${id("orbitBackRight")})`}
              opacity="0.45"
            />

            {/* Active Orange Filled Orbit Segment Behind (Revealed as progress grows) */}
            <g clipPath={`url(#${id("orbitProgressClip")})`}>
              <path
                d="M 244 91 C 272 91, 289 101, 282 116 C 279 122, 272 128, 263 134 L 252 129 C 260 124, 265 119, 267 114 C 272 103, 259 97, 241 96 Z"
                fill={`url(#${id("orbitFillTop")})`}
              />
              <path
                d="M 282 116 C 280 123, 273 130, 263 136 L 263 133 C 272 127, 279 121, 282 116 Z"
                fill={`url(#${id("orbitFillEdge")})`}
              />
            </g>
          </g>

          {/* ============================================================
              3. STATIC 3D ORANGE SHOPPING BAG & DUAL HANDLES (NO ANIMATION)
             ============================================================ */}
          <g>
            {/* ── Back Handle (Behind Bag Top Edge) ── */}
            <g>
              <path
                d="M 141 96 C 138 76, 146 61, 158 61 C 169 61, 176 72, 178 89"
                stroke="#8E4312"
                strokeWidth="7.5"
                strokeLinecap="round"
              />
              <path
                d="M 142 96 C 139.5 76.5, 147 61.5, 158.5 61.5 C 169.5 61.5, 176.5 72.5, 178.5 89"
                stroke={`url(#${id("backHandleBody")})`}
                strokeWidth="6.2"
                strokeLinecap="round"
              />
              <path
                d="M 143.5 92 C 141.5 76, 148 63, 158.5 62.5 C 167 62.5, 173 70, 175.5 84"
                stroke="#FFD8AD"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.75"
              />
            </g>

            {/* ── 3D Left Side Gusset (Extruded Depth Panel) ── */}
            <path
              d="M 123 102 C 122.4 96.5, 125.5 92.8, 130.5 91.5 L 138 89.8 L 150 189.5 L 137.5 190 C 132.5 190.2, 129.2 186.8, 128.6 181.5 Z"
              fill={`url(#${id("bagGusset")})`}
            />

            <path
              d="M 123.3 100 C 123 95.8, 125.8 92.8, 130.5 91.6 L 137 90"
              stroke="#FFC27A"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.85"
            />

            <path
              d="M 129.5 93.5 L 139.5 188.5"
              stroke={`url(#${id("gussetCrease")})`}
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            {/* ── Main Trapezoidal Front Face of the Bag ── */}
            <path
              d="M 134.5 97.5 C 134 92.5, 137.2 88.8, 142.2 87.8 L 198 78.2 C 202.8 77.4, 206.8 80.2, 208.5 84.8 L 235.5 157.5 C 237.6 163.2, 234.4 169.5, 228.5 171.2 L 154.5 189.8 C 148.5 191.2, 143.2 187.2, 142.5 181 Z"
              fill={`url(#${id("bagFront")})`}
            />

            <path
              d="M 143.2 180.5 L 135.2 97 C 134.8 92.8, 137.6 89.4, 142 88.5 L 197 79"
              stroke={`url(#${id("bagFrontBevel")})`}
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />

            <path
              d="M 146 187.5 C 150 190, 155 189.5, 162 187.8 L 228 171"
              stroke="#B83800"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.55"
            />

            {/* ── Front Handle Sockets ── */}
            <ellipse
              cx="156.5"
              cy="100.5"
              rx="5.2"
              ry="6.2"
              transform="rotate(-8 156.5 100.5)"
              fill="#C84300"
              opacity="0.65"
            />
            <ellipse
              cx="156"
              cy="99"
              rx="4.2"
              ry="4.8"
              transform="rotate(-8 156 99)"
              fill="#B33600"
              opacity="0.7"
            />

            <ellipse
              cx="191.5"
              cy="92"
              rx="5"
              ry="5.8"
              transform="rotate(-12 191.5 92)"
              fill="#C84300"
              opacity="0.6"
            />
            <ellipse
              cx="191"
              cy="90.8"
              rx="4"
              ry="4.4"
              transform="rotate(-12 191 90.8)"
              fill="#B33600"
              opacity="0.65"
            />

            {/* ── Front 3D Tubular Cream Handle (Static) ── */}
            <g>
              <path
                d="M 156 99 C 151.5 76, 158 59.5, 170.5 58.8 C 181.5 58.2, 188.5 71, 191 90.5"
                stroke={`url(#${id("frontHandleUnder")})`}
                strokeWidth="8.2"
                strokeLinecap="round"
              />
              <path
                d="M 156 98.2 C 151.5 75.2, 158 58.5, 170.5 57.8 C 181.5 57.2, 188.5 70, 191 89.8"
                stroke={`url(#${id("frontHandleMain")})`}
                strokeWidth="6.8"
                strokeLinecap="round"
              />
              <path
                d="M 154.8 93 C 151.5 73.5, 158 58.2, 170.2 57.2 C 179.8 56.5, 186.5 67.5, 189.5 85"
                stroke="#FFFFFF"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </g>
          </g>

          {/* ============================================================
              4. FRONT SEGMENT OF 3D ORBIT RING (Filling Gradually with Orange)
             ============================================================ */}
          <g>
            {/* Unfilled Base Track (Subtle Warm Cream) */}
            <path
              d="M 77 152 C 55 166, 48 180, 62 187 C 84 198, 148 188, 212 165 C 237 156, 254 145, 263 136 L 263 131 C 253 140, 236 150, 210 159 C 146 182, 85 191, 64 181 C 53 175, 59 164, 81 151 Z"
              fill={`url(#${id("orbitBaseEdge")})`}
              opacity="0.85"
            />
            <path
              d="M 77 152 C 55 165, 49 178, 63 184 C 85 194, 148 184, 211 161 C 236 152, 253 142, 263 133 L 252 129 C 242 137, 226 146, 203 154 C 145 175, 89 184, 70 176 C 59 171, 64 162, 85 155 Z"
              fill={`url(#${id("orbitBaseTop")})`}
              opacity="0.9"
            />

            {/* Active Vibrant Orange Fill Layer - Progressively unclipped by orbitProgressClip */}
            <g clipPath={`url(#${id("orbitProgressClip")})`}>
              {/* Solid 3D Extrusion Orange Edge */}
              <path
                d="M 77 152 C 55 166, 48 180, 62 187 C 84 198, 148 188, 212 165 C 237 156, 254 145, 263 136 L 263 131 C 253 140, 236 150, 210 159 C 146 182, 85 191, 64 181 C 53 175, 59 164, 81 151 Z"
                fill={`url(#${id("orbitFillEdge")})`}
              />

              {/* Glossy Top Orange Ribbon Surface */}
              <path
                d="M 77 152 C 55 165, 49 178, 63 184 C 85 194, 148 184, 211 161 C 236 152, 253 142, 263 133 L 252 129 C 242 137, 226 146, 203 154 C 145 175, 89 184, 70 176 C 59 171, 64 162, 85 155 Z"
                fill={`url(#${id("orbitFillTop")})`}
              />

              {/* Foreground Glossy Specular Accents */}
              <path
                d="M 143 171.2 C 164 166.5, 186 159.8, 206 152.5"
                stroke="#FFFFFF"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.95"
              />
              <path
                d="M 144 178.5 C 166 173.8, 189 166.8, 209 159.5"
                stroke="#FFF6EB"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.8"
              />
            </g>
          </g>

          {/* ============================================================
              5. ANIMATED 3D GLOSSY ORANGE BALLS (SPHERES)
             ============================================================ */}
          {/* Upper-Left 3D Floating Ball */}
          <motion.circle
            className={styles.gpuLayer}
            cx="74"
            cy="114"
            r="10.5"
            fill={`url(#${id("sphereLeft")})`}
            animate={
              shouldAnimate
                ? {
                    y: [0, -12, 0],
                    x: [0, -2, 0],
                    scale: [1, 1.05, 1],
                  }
                : { y: 0, x: 0, scale: 1 }
            }
            transition={
              shouldAnimate
                ? {
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                : undefined
            }
          />

          {/* Lower-Right 3D Floating Ball */}
          <motion.circle
            className={styles.gpuLayer}
            cx="262"
            cy="184"
            r="8.5"
            fill={`url(#${id("sphereRight")})`}
            animate={
              shouldAnimate
                ? {
                    y: [0, 11, 0],
                    x: [0, 2, 0],
                    scale: [1, 1.06, 1],
                  }
                : { y: 0, x: 0, scale: 1 }
            }
            transition={
              shouldAnimate
                ? {
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2,
                  }
                : undefined
            }
          />
        </svg>
      </div>
    </div>
  );
}

export const ShoppingBagLoader = memo(ShoppingBagLoaderComponent);
export default ShoppingBagLoader;
