"use client";

import { useState, useRef, useEffect, useCallback, useId, memo } from "react";

/* ================================================================
   EVENT CONSTANTS & DETERMINISTIC ARRAYS (Hydration Safe)
   ================================================================ */
const EVENT = {
  title: "FRESHERS PARTY",
  year: "2026",
  date: "10 OCTOBER 2026",
  day: "SATURDAY",
  time: "9:00 AM TO 1:00 PM",
  venue: "MECHANICAL SEMINAR HALL",
  department: "DEPARTMENT OF MECHANICAL ENGINEERING",
  college: "NARAYANA ENGINEERING COLLEGE (AUTONOMOUS), NELLORE",
};

// Deterministic ambient floating particles
const BG_PARTICLES = [
  { left: "5%", top: "12%", delay: "0.5s", duration: "8s" },
  { left: "94%", top: "16%", delay: "1.2s", duration: "11s" },
  { left: "20%", top: "66%", delay: "2.1s", duration: "9s" },
  { left: "76%", top: "84%", delay: "3.4s", duration: "13s" },
  { left: "48%", top: "14%", delay: "0.2s", duration: "7s" },
  { left: "86%", top: "52%", delay: "1.8s", duration: "10s" },
  { left: "12%", top: "86%", delay: "4.1s", duration: "12s" },
  { left: "95%", top: "40%", delay: "2.7s", duration: "8.5s" },
  { left: "8%", top: "38%", delay: "3.9s", duration: "11.5s" },
  { left: "52%", top: "34%", delay: "0.8s", duration: "9.5s" },
  { left: "66%", top: "20%", delay: "1.5s", duration: "14s" },
  { left: "34%", top: "76%", delay: "2.9s", duration: "7.5s" },
];

// Continuous sparks shooting from meshing gear teeth in Stage 1
const GEAR_MESH_SPARKS_1 = [
  { dx: 42, dy: -32, delay: "0.0s", duration: "0.45s", size: 3.5, color: "#FFFFFF" },
  { dx: 58, dy: 14, delay: "0.12s", duration: "0.6s", size: 4, color: "#FFD000" },
  { dx: -38, dy: 34, delay: "0.22s", duration: "0.5s", size: 2.5, color: "#FF7700" },
  { dx: 48, dy: -44, delay: "0.35s", duration: "0.55s", size: 3, color: "#FFF6A0" },
  { dx: 64, dy: -10, delay: "0.48s", duration: "0.7s", size: 4.5, color: "#FFAA00" },
  { dx: -28, dy: -35, delay: "0.6s", duration: "0.48s", size: 2, color: "#FF4500" },
  { dx: 46, dy: 38, delay: "0.72s", duration: "0.65s", size: 3.5, color: "#FFFFFF" },
  { dx: -48, dy: 18, delay: "0.85s", duration: "0.52s", size: 3, color: "#FFCC00" },
];

const GEAR_MESH_SPARKS_2 = [
  { dx: -35, dy: -38, delay: "0.05s", duration: "0.5s", size: 3, color: "#FFD700" },
  { dx: 45, dy: -25, delay: "0.18s", duration: "0.62s", size: 4, color: "#FFFFFF" },
  { dx: -54, dy: 26, delay: "0.3s", duration: "0.55s", size: 2.5, color: "#FF6600" },
  { dx: 38, dy: 42, delay: "0.45s", duration: "0.68s", size: 3.5, color: "#FFF8B0" },
  { dx: -30, dy: 48, delay: "0.58s", duration: "0.48s", size: 2, color: "#FF8C00" },
  { dx: 58, dy: -14, delay: "0.75s", duration: "0.72s", size: 4.5, color: "#FFFFFF" },
];

// Welding arc sparks cascading down from the robot arm
const ROBOT_WELDING_SPARKS = [
  { dx: -18, dy: 45, delay: "0.05s", duration: "0.35s", size: 2 },
  { dx: 24, dy: 55, delay: "0.15s", duration: "0.42s", size: 3 },
  { dx: -8, dy: 65, delay: "0.25s", duration: "0.48s", size: 2.5 },
  { dx: 15, dy: 75, delay: "0.38s", duration: "0.38s", size: 2 },
  { dx: -22, dy: 58, delay: "0.52s", duration: "0.45s", size: 3 },
  { dx: 30, dy: 68, delay: "0.65s", duration: "0.4s", size: 2 },
];

// REALISTIC BILLOWING VOLUMETRIC SMOKE PLUMES (Multi-layered thermal expansion & turbulent drift)
const SMOKE_PUFFS_LEFT = [
  { left: "18%", bottom: "2%", scale: 2.8, delay: "0.0s", duration: "2.2s", xDrift: "-80px", color: "denseWhite" },
  { left: "22%", bottom: "4%", scale: 3.4, delay: "0.08s", duration: "2.4s", xDrift: "-60px", color: "charcoal" },
  { left: "16%", bottom: "6%", scale: 3.8, delay: "0.16s", duration: "2.6s", xDrift: "-100px", color: "denseWhite" },
  { left: "25%", bottom: "8%", scale: 4.2, delay: "0.24s", duration: "2.8s", xDrift: "-45px", color: "denseWhite" },
  { left: "20%", bottom: "12%", scale: 4.6, delay: "0.32s", duration: "3.0s", xDrift: "-75px", color: "charcoal" },
  { left: "14%", bottom: "16%", scale: 4.8, delay: "0.42s", duration: "3.2s", xDrift: "-110px", color: "denseWhite" },
  { left: "28%", bottom: "20%", scale: 5.0, delay: "0.52s", duration: "3.4s", xDrift: "-35px", color: "denseWhite" },
  { left: "22%", bottom: "24%", scale: 5.2, delay: "0.62s", duration: "3.6s", xDrift: "-65px", color: "charcoal" },
];

const SMOKE_PUFFS_RIGHT = [
  { left: "78%", bottom: "2%", scale: 2.8, delay: "0.02s", duration: "2.2s", xDrift: "80px", color: "denseWhite" },
  { left: "74%", bottom: "4%", scale: 3.4, delay: "0.10s", duration: "2.4s", xDrift: "60px", color: "charcoal" },
  { left: "80%", bottom: "6%", scale: 3.8, delay: "0.18s", duration: "2.6s", xDrift: "100px", color: "denseWhite" },
  { left: "71%", bottom: "8%", scale: 4.2, delay: "0.26s", duration: "2.8s", xDrift: "45px", color: "denseWhite" },
  { left: "76%", bottom: "12%", scale: 4.6, delay: "0.34s", duration: "3.0s", xDrift: "75px", color: "charcoal" },
  { left: "82%", bottom: "16%", scale: 4.8, delay: "0.44s", duration: "3.2s", xDrift: "110px", color: "denseWhite" },
  { left: "68%", bottom: "20%", scale: 5.0, delay: "0.54s", duration: "3.4s", xDrift: "35px", color: "denseWhite" },
  { left: "74%", bottom: "24%", scale: 5.2, delay: "0.64s", duration: "3.6s", xDrift: "65px", color: "charcoal" },
];

// Welcome stage particles
const WELCOME_PARTICLES = [
  { left: "14%", delay: "0.2s", duration: "4.2s" },
  { left: "26%", delay: "0.8s", duration: "5.1s" },
  { left: "40%", delay: "1.5s", duration: "3.8s" },
  { left: "54%", delay: "0.4s", duration: "4.7s" },
  { left: "66%", delay: "1.1s", duration: "5.5s" },
  { left: "80%", delay: "0.6s", duration: "3.9s" },
  { left: "20%", delay: "1.8s", duration: "4.5s" },
  { left: "34%", delay: "0.9s", duration: "5.8s" },
  { left: "48%", delay: "2.1s", duration: "4.1s" },
  { left: "62%", delay: "1.3s", duration: "5.3s" },
  { left: "74%", delay: "0.5s", duration: "3.6s" },
  { left: "86%", delay: "1.7s", duration: "4.9s" },
];

/* ================================================================
   GEAR SVG PATH GENERATOR (Mathematical Precision Involute Teeth)
   ================================================================ */
function generateGearPath(outerR: number, rootR: number, numTeeth: number): string {
  const points: string[] = [];
  const step = (Math.PI * 2) / numTeeth;

  for (let i = 0; i < numTeeth; i++) {
    const a0 = i * step;
    const a1 = a0 + step * 0.22;
    const a2 = a0 + step * 0.44;
    const a3 = a0 + step * 0.66;

    const x0 = (Math.cos(a0) * rootR).toFixed(2);
    const y0 = (Math.sin(a0) * rootR).toFixed(2);
    const x1 = (Math.cos(a1) * outerR).toFixed(2);
    const y1 = (Math.sin(a1) * outerR).toFixed(2);
    const x2 = (Math.cos(a2) * outerR).toFixed(2);
    const y2 = (Math.sin(a2) * outerR).toFixed(2);
    const x3 = (Math.cos(a3) * rootR).toFixed(2);
    const y3 = (Math.sin(a3) * rootR).toFixed(2);

    if (i === 0) points.push(`M ${x0} ${y0}`);
    else points.push(`L ${x0} ${y0}`);
    points.push(`L ${x1} ${y1}`);
    points.push(`A ${outerR} ${outerR} 0 0 1 ${x2} ${y2}`);
    points.push(`L ${x3} ${y3}`);
  }
  points.push("Z");
  return points.join(" ");
}

/* ================================================================
   COMPONENT: REALISTIC 3D METALLIC CHROME GEAR
   ================================================================ */
interface ChromeGearProps {
  size: number;
  outerR: number;
  rootR: number;
  teeth: number;
  spokes?: number;
  speed?: number;
  clockwise?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

function RealisticChromeGear({
  size,
  outerR,
  rootR,
  teeth,
  spokes = 6,
  speed = 18,
  clockwise = true,
  style = {},
  className = "",
}: ChromeGearProps) {
  const gearPath = generateGearPath(outerR, rootR, teeth);
  const spokeHoleR = rootR * 0.48;
  const holeRadius = spokeHoleR * 0.38;

  return (
    <div
      className={`chromeGearWrapper ${className}`}
      style={{
        width: size,
        height: size,
        animation: `${clockwise ? "gearRotateCW" : "gearRotateCCW"} ${speed}s linear infinite`,
        ...style,
      }}
    >
      <svg viewBox="-120 -120 240 240" width="100%" height="100%" style={{ display: "block" }}>
        <path
          d={gearPath}
          fill="url(#globalChromeFace)"
          stroke="url(#globalChromeBevel)"
          strokeWidth="2.2"
          filter="url(#globalGearMetalShadow)"
        />

        <circle
          cx="0"
          cy="0"
          r={Number((rootR * 0.94).toFixed(2))}
          fill="none"
          stroke="url(#globalChromeBevel)"
          strokeWidth="2.5"
        />

        <circle
          cx="0"
          cy="0"
          r={Number((rootR * 0.84).toFixed(2))}
          fill="url(#globalLatheTurnedHub)"
          stroke="#111B24"
          strokeWidth="1.5"
        />

        {Array.from({ length: spokes }).map((_, idx) => {
          const angle = (idx * (Math.PI * 2)) / spokes;
          const hx = (Math.cos(angle) * spokeHoleR).toFixed(2);
          const hy = (Math.sin(angle) * spokeHoleR).toFixed(2);
          const hr = holeRadius.toFixed(2);
          const hrInner = (holeRadius - 2).toFixed(2);
          return (
            <g key={idx}>
              <circle
                cx={hx}
                cy={hy}
                r={hr}
                fill="#070C14"
                stroke="url(#globalChromeFace)"
                strokeWidth="2"
              />
              <circle
                cx={hx}
                cy={hy}
                r={hrInner}
                fill="#070C14"
                stroke="#020509"
                strokeWidth="1"
              />
            </g>
          );
        })}

        <circle
          cx="0"
          cy="0"
          r={Number((rootR * 0.42).toFixed(2))}
          fill="url(#globalChromeFace)"
          stroke="url(#globalChromeBevel)"
          strokeWidth="2.5"
        />

        {Array.from({ length: 6 }).map((_, idx) => {
          const angle = (idx * (Math.PI * 2)) / 6;
          const bx = Number((Math.cos(angle) * (rootR * 0.28)).toFixed(2));
          const by = Number((Math.sin(angle) * (rootR * 0.28)).toFixed(2));
          return (
            <g key={idx}>
              <circle cx={bx} cy={by} r="4" fill="#0D141C" />
              <polygon
                points={`${bx},${by - 3} ${(bx + 2.6).toFixed(2)},${(by - 1.5).toFixed(2)} ${(bx + 2.6).toFixed(2)},${(by + 1.5).toFixed(2)} ${bx},${by + 3} ${(bx - 2.6).toFixed(2)},${(by + 1.5).toFixed(2)} ${(bx - 2.6).toFixed(2)},${(by - 1.5).toFixed(2)}`}
                fill="url(#globalChromeFace)"
                stroke="#FFFFFF"
                strokeWidth="0.5"
              />
            </g>
          );
        })}

        <circle cx="0" cy="0" r={Number((rootR * 0.16).toFixed(2))} fill="url(#globalLatheTurnedHub)" stroke="#FFFFFF" strokeWidth="1.2" />
        <circle cx="0" cy="0" r={Number((rootR * 0.08).toFixed(2))} fill="#0A1017" stroke="url(#globalChromeFace)" strokeWidth="1" />
      </svg>
    </div>
  );
}

/* ================================================================
   BORDER BIKE RACER COMPONENT (Animated Superbike Circuit on Card Borders)
   Features:
   - High-performance direct GPU composited motion (requestAnimationFrame)
   - Zero React re-renders during motion (silky 60-120 FPS, never lags or freezes)
   - Exact rounded-corner trigonometric path calculation (C1 continuous everywhere)
   - Perfectly calibrated on-the-border racing track alignment:
       * Wheelbase scaled to 14px so it tightly hugs 16px-20px corners without cutting inside
       * Wheels roll directly on the glowing cyan neon border rail
       * Pure GPU-cached vector graphics with zero CPU software filter overhead
   - Neon laser guide rail outlining the exact border perimeter
   ================================================================ */

function getBorderTrackPos(dist: number, w: number, h: number, r: number) {
  const safeR = Math.max(8, Math.min(r, Math.min(w, h) / 2 - 1));
  const lTop = Math.max(0, w - 2 * safeR);
  const arc = (Math.PI / 2) * safeR;
  const lRight = Math.max(0, h - 2 * safeR);
  const lBottom = lTop;
  const lLeft = lRight;

  const total = 2 * lTop + 2 * lRight + 4 * arc;
  if (total <= 0) return { x: 0, y: 0, angle: 0 };

  const d = ((dist % total) + total) % total;

  // 1. Top Straight: from (safeR, 0) to (w - safeR, 0)
  if (d <= lTop) {
    return { x: safeR + d, y: 0, angle: 0 };
  }
  let acc = lTop;

  // 2. Top-Right Corner: Arc from (w - safeR, 0) to (w, safeR)
  if (d <= acc + arc) {
    const f = (d - acc) / arc;
    const theta = -Math.PI / 2 + f * (Math.PI / 2);
    return {
      x: w - safeR + safeR * Math.cos(theta),
      y: safeR + safeR * Math.sin(theta),
      angle: f * 90,
    };
  }
  acc += arc;

  // 3. Right Straight: from (w, safeR) to (w, h - safeR)
  if (d <= acc + lRight) {
    return { x: w, y: safeR + (d - acc), angle: 90 };
  }
  acc += lRight;

  // 4. Bottom-Right Corner: Arc from (w, h - safeR) to (w - safeR, h)
  if (d <= acc + arc) {
    const f = (d - acc) / arc;
    const theta = f * (Math.PI / 2);
    return {
      x: w - safeR + safeR * Math.cos(theta),
      y: h - safeR + safeR * Math.sin(theta),
      angle: 90 + f * 90,
    };
  }
  acc += arc;

  // 5. Bottom Straight: from (w - safeR, h) to (safeR, h)
  if (d <= acc + lBottom) {
    return { x: w - safeR - (d - acc), y: h, angle: 180 };
  }
  acc += lBottom;

  // 6. Bottom-Left Corner: Arc from (safeR, h) to (0, h - safeR)
  if (d <= acc + arc) {
    const f = (d - acc) / arc;
    const theta = Math.PI / 2 + f * (Math.PI / 2);
    return {
      x: safeR + safeR * Math.cos(theta),
      y: h - safeR + safeR * Math.sin(theta),
      angle: 180 + f * 90,
    };
  }
  acc += arc;

  // 7. Left Straight: from (0, h - safeR) to (0, safeR)
  if (d <= acc + lLeft) {
    return { x: 0, y: h - safeR - (d - acc), angle: 270 };
  }
  acc += lLeft;

  // 8. Top-Left Corner: Arc from (0, safeR) to (safeR, 0)
  const f = Math.min(1, Math.max(0, (d - acc) / arc));
  const theta = Math.PI + f * (Math.PI / 2);
  return {
    x: safeR + safeR * Math.cos(theta),
    y: safeR + safeR * Math.sin(theta),
    angle: 270 + f * 90,
  };
}

function computePathD(w: number, h: number, radius: number): string {
  const r = Math.max(8, Math.min(radius, Math.min(w, h) / 2 - 1));
  return `M ${r} 0 L ${w - r} 0 Q ${w} 0 ${w} ${r} L ${w} ${h - r} Q ${w} ${h} ${w - r} ${h} L ${r} ${h} Q 0 ${h} 0 ${h - r} L 0 ${r} Q 0 0 ${r} 0 Z`;
}

const BorderBikeTrack = memo(function BorderBikeTrack({ radius = 16, offset = 14 }: { radius?: number; offset?: number }) {
  const uid = useId().replace(/:/g, "_");
  const containerRef = useRef<HTMLDivElement>(null);
  const trackPathRef = useRef<SVGPathElement>(null);
  const bikeRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const distRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      // Use container's exact pixel dimensions for 1:1 outer border tracking
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 30 && h > 30) {
        if (sizeRef.current.width !== w || sizeRef.current.height !== h) {
          sizeRef.current = { width: w, height: h };
          const pathD = computePathD(w, h, radius + offset);
          if (trackPathRef.current) {
            trackPathRef.current.setAttribute("d", pathD);
          }
        }
      }
    };

    measure();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => measure());
      ro.observe(container);
    } else {
      window.addEventListener("resize", measure);
    }

    // High performance 60-120fps direct GPU transform animation loop
    let animId: number;
    let lastTime = performance.now();
    let isVisible = false;

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const w = sizeRef.current.width;
      const h = sizeRef.current.height;

      if (w > 30 && h > 30) {
        // High-speed racing cruise: 200 px/sec
        distRef.current += dt * 200;

        const { x, y, angle } = getBorderTrackPos(distRef.current, w, h, radius + offset);
        if (bikeRef.current) {
          bikeRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}deg)`;
          if (!isVisible) {
            isVisible = true;
            bikeRef.current.style.opacity = "1";
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", measure);
    };
  }, [radius, offset]);

  return (
    <div
      ref={containerRef}
      className="cardBorderBikeTrack"
      style={{
        position: "absolute",
        top: -offset,
        left: -offset,
        right: -offset,
        bottom: -offset,
        pointerEvents: "none",
        zIndex: 25,
        overflow: "visible",
      }}
    >
      {/* Crisp glowing neon laser guide rail right outside the border */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
          pointerEvents: "none",
          filter: "drop-shadow(0 0 5px rgba(0, 229, 255, 0.8))",
        }}
      >
        <path
          ref={trackPathRef}
          fill="none"
          stroke="#00E5FF"
          strokeWidth="1.8"
          strokeDasharray="8 6"
          opacity="0.8"
        />
      </svg>

      {/* Hardware-accelerated Miniature Sports Bike (GPU translate3d & rotate, Zero Filters) */}
      <div
        ref={bikeRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          transformOrigin: "0 0",
          willChange: "transform",
          pointerEvents: "none",
          opacity: 0,
          zIndex: 30,
        }}
      >
        <svg
          width="60"
          height="40"
          viewBox="-20 -25 60 40"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            overflow: "visible",
            pointerEvents: "none",
          }}
        >
          <defs>
            <linearGradient id={`bikeHeadlightBeam_${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#00E5FF" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`bikeFairingGrad_${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="50%" stopColor="#0088CC" />
              <stop offset="100%" stopColor="#00FFAA" />
            </linearGradient>
          </defs>

          {/* Forward Headlight Beam Cone */}
          <polygon points="9.5,-5.5 28,-11 28,1" fill={`url(#bikeHeadlightBeam_${uid})`} />
          <circle cx="9.5" cy="-5.5" r="3" fill="#00E5FF" opacity="0.6" />
          <circle cx="9.5" cy="-5.5" r="1.5" fill="#FFFFFF" />

          {/* Nitro Exhaust Flame */}
          <polygon points="-8,-3.8 -14,-3.4 -9,-4.6" fill="#FF5500" />
          <polygon points="-8,-3.8 -12,-3.6 -9,-4.2" fill="#FFDD00" />

          {/* Chrome Exhaust Pipe */}
          <line x1="-1" y1="-4.5" x2="-8" y2="-3.8" stroke="#B0C4D6" strokeWidth="1.2" strokeLinecap="round" />

          {/* Swingarm / Rear Drive */}
          <line x1="-7" y1="-2.8" x2="-1.5" y2="-4.5" stroke="#6C8296" strokeWidth="1.2" />

          {/* Inverted Front Forks */}
          <line x1="7" y1="-2.8" x2="4" y2="-8.5" stroke="#B0C4D6" strokeWidth="1.2" />

          {/* Wheels (Rubber Tires + Glowing Cyan Neon Rims + Chrome Hubs) */}
          <circle cx="-7" cy="-2.8" r="2.8" fill="#0A1118" stroke="#00E5FF" strokeWidth="1" />
          <circle cx="-7" cy="-2.8" r="1" fill="#FFFFFF" />
          <circle cx="7" cy="-2.8" r="2.8" fill="#0A1118" stroke="#00E5FF" strokeWidth="1" />
          <circle cx="7" cy="-2.8" r="1" fill="#FFFFFF" />

          {/* Engine Transmission */}
          <rect x="-3" y="-6" width="4.5" height="3.5" rx="0.8" fill="#1A2634" stroke="#486581" strokeWidth="0.7" />

          {/* Aerodynamic Fairing & Fuel Tank */}
          <path
            d="M -7 -4.5 L -2 -8.5 L 4.5 -8.5 L 9.5 -5.5 L 6.5 -3.5 L 0 -4.2 L -6 -3.8 Z"
            fill={`url(#bikeFairingGrad_${uid})`}
            stroke="#00E5FF"
            strokeWidth="0.8"
          />

          {/* Tinted Aerodynamic Racing Windscreen */}
          <path d="M 3 -8.5 L 7 -8.5 L 6 -11 L 2 -9.5 Z" fill="#00E5FF" opacity="0.9" />

          {/* Crouched Rider in Racing Tuck */}
          <path d="M -4.5 -7.5 Q 0 -12 4.5 -9 L 3 -7 Z" fill="#101820" stroke="#334E68" strokeWidth="0.8" />

          {/* Rider Helmet with Cyan Glow Aura */}
          <circle cx="1.5" cy="-11" r="3.6" fill="#00E5FF" opacity="0.45" />
          <circle cx="1.5" cy="-11" r="2.7" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="0.6" />

          {/* Dark Aerodynamic Racing Visor */}
          <path d="M 2.5 -11.5 Q 4.2 -11 4.2 -10.2 Q 3 -10.2 1.8 -10.8 Z" fill="#050A0F" />
        </svg>
      </div>
    </div>
  );
});

/* ================================================================
   WEB AUDIO SOUND ENGINE (Authentic Physical Engine & Gear Sound)
   Features:
   - High-fidelity multi-oscillator internal combustion model
   - Exact 10,000 RPM harmonic sweep (666.7 Hz V8 firing pulses)
   - Valvetrain metallic clatter & titanium spring resonance
   - Spooling twin-turbocharger turbine whine (1.8kHz -> 6.8kHz)
   - Blow-off valve (BOV) flutter surge ("pssshh-ts-ts-ts")
   - Visceral unburnt fuel exhaust overrun backfires (ANTI-LAG)
   ================================================================ */
class MechanicalAudioEngine {
  private ctx: AudioContext | null = null;
  private gearGainNode: GainNode | null = null;
  private isGearSoundRunning = false;

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AC) {
        this.ctx = new AC();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // 1. LOUD, AUDIBLE ROTATING GEAR AMBIENCE (Motor hum + tooth ratchet clicks)
  startGearAmbience() {
    const ctx = this.initContext();
    if (!ctx) return;

    if (this.isGearSoundRunning && this.gearGainNode) {
      this.gearGainNode.gain.setValueAtTime(0.42, ctx.currentTime);
      return;
    }

    try {
      this.isGearSoundRunning = true;
      const now = ctx.currentTime;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(0.42, now + 0.3);
      masterGain.connect(ctx.destination);
      this.gearGainNode = masterGain;

      // Heavy motor rotation drone
      const motorOsc = ctx.createOscillator();
      motorOsc.type = "sawtooth";
      motorOsc.frequency.setValueAtTime(58, now);

      const motorFilter = ctx.createBiquadFilter();
      motorFilter.type = "lowpass";
      motorFilter.frequency.setValueAtTime(240, now);
      motorFilter.Q.setValueAtTime(2.2, now);

      const motorGain = ctx.createGain();
      motorGain.gain.setValueAtTime(0.7, now);

      motorOsc.connect(motorFilter);
      motorFilter.connect(motorGain);
      motorGain.connect(masterGain);
      motorOsc.start(now);

      // Tooth meshing friction noise with 16Hz ratchet clicks
      const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.9;
      }
      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = noiseBuf;
      noiseSrc.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(1580, now);
      noiseFilter.Q.setValueAtTime(4.0, now);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(16, now);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.4, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.55, now);

      lfo.connect(noiseGain.gain);
      noiseSrc.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);

      lfo.start(now);
      noiseSrc.start(now);
    } catch {
      this.isGearSoundRunning = false;
    }
  }

  stopGearAmbience() {
    if (!this.isGearSoundRunning || !this.gearGainNode || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      this.gearGainNode.gain.linearRampToValueAtTime(0.001, now + 0.3);
      setTimeout(() => {
        this.isGearSoundRunning = false;
      }, 350);
    } catch {
      this.isGearSoundRunning = false;
    }
  }

  // 2. KAWASAKI INLINE-4 CLICK 1: High-Speed Japanese Starter Motor Whine & 4-Cylinder Compression Strokes
  playEngineCrank1() {
    const ctx = this.initContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;

      // Crisp starter relay contact snap
      const relayOsc = ctx.createOscillator();
      const relayGain = ctx.createGain();
      relayOsc.type = "square";
      relayOsc.frequency.setValueAtTime(580, now);
      relayOsc.frequency.exponentialRampToValueAtTime(90, now + 0.04);
      relayGain.gain.setValueAtTime(0.85, now);
      relayGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      relayOsc.connect(relayGain);
      relayGain.connect(ctx.destination);
      relayOsc.start(now);
      relayOsc.stop(now + 0.05);

      // Kawasaki high-speed reduction starter motor whine (lightweight, rapid electric spin)
      const starterOsc = ctx.createOscillator();
      const starterFilter = ctx.createBiquadFilter();
      const starterGain = ctx.createGain();
      starterOsc.type = "sawtooth";
      starterOsc.frequency.setValueAtTime(380, now + 0.03);
      starterOsc.frequency.linearRampToValueAtTime(680, now + 0.16);
      starterOsc.frequency.linearRampToValueAtTime(520, now + 0.28);
      starterOsc.frequency.linearRampToValueAtTime(820, now + 0.48);
      starterFilter.type = "bandpass";
      starterFilter.frequency.setValueAtTime(1400, now);
      starterFilter.Q.setValueAtTime(2.5, now);
      starterGain.gain.setValueAtTime(0.001, now + 0.03);
      starterGain.gain.linearRampToValueAtTime(0.65, now + 0.14);
      starterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);
      starterOsc.connect(starterFilter);
      starterFilter.connect(starterGain);
      starterGain.connect(ctx.destination);
      starterOsc.start(now + 0.03);
      starterOsc.stop(now + 0.6);

      // 4 rapid 180° flat-plane compression pulses (16-valve high compression chug)
      [0.08, 0.20, 0.32, 0.44].forEach((tOffset, i) => {
        const t = now + tOffset;
        const compOsc = ctx.createOscillator();
        const compGain = ctx.createGain();
        compOsc.type = "triangle";
        compOsc.frequency.setValueAtTime(130 - i * 8, t);
        compOsc.frequency.exponentialRampToValueAtTime(45, t + 0.12);
        compGain.gain.setValueAtTime(0.95, t);
        compGain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
        compOsc.connect(compGain);
        compGain.connect(ctx.destination);
        compOsc.start(t);
        compOsc.stop(t + 0.14);
      });

      if ("vibrate" in navigator) {
        try { navigator.vibrate([70, 30, 110]); } catch { /* */ }
      }
    } catch { /* */ }
  }

  // 3. KAWASAKI INLINE-4 CLICK 2: Rapid Starter Surge & 16-Valve Inline-4 Firing Catch (6,000 RPM Blip)
  playEngineCrank2() {
    const ctx = this.initContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;

      // Starter fast surge
      const starterOsc = ctx.createOscillator();
      const starterGain = ctx.createGain();
      starterOsc.type = "sawtooth";
      starterOsc.frequency.setValueAtTime(540, now + 0.02);
      starterOsc.frequency.linearRampToValueAtTime(940, now + 0.3);
      starterGain.gain.setValueAtTime(0.45, now + 0.02);
      starterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
      starterOsc.connect(starterGain);
      starterGain.connect(ctx.destination);
      starterOsc.start(now + 0.02);
      starterOsc.stop(now + 0.38);

      // Instant 4-cylinder combustion ignition catch: "TRA-RA-RA-RUM!"
      const fireT = now + 0.22;
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = "sine";
      thudOsc.frequency.setValueAtTime(180, fireT);
      thudOsc.frequency.exponentialRampToValueAtTime(42, fireT + 0.24);
      thudGain.gain.setValueAtTime(1.8, fireT);
      thudGain.gain.exponentialRampToValueAtTime(0.001, fireT + 0.26);
      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);
      thudOsc.start(fireT);
      thudOsc.stop(fireT + 0.28);

      // Fast, dense 4-cylinder pulses (smooth, high-frequency Kawasaki idle blip)
      const pulses = [0.24, 0.31, 0.38, 0.45, 0.52, 0.60];
      pulses.forEach((pOffset, idx) => {
        const pt = now + pOffset;
        const pOsc = ctx.createOscillator();
        const pFilter = ctx.createBiquadFilter();
        const pGain = ctx.createGain();
        pOsc.type = "sawtooth";
        pOsc.frequency.setValueAtTime(120 + idx * 12, pt); // Ascending RPM rev blip
        pFilter.type = "bandpass";
        pFilter.frequency.setValueAtTime(1400, pt); // Akrapovič 4-into-1 acoustic peak
        pFilter.Q.setValueAtTime(3.2, pt);
        pGain.gain.setValueAtTime(0.95, pt);
        pGain.gain.exponentialRampToValueAtTime(0.001, pt + 0.11);
        pOsc.connect(pFilter);
        pFilter.connect(pGain);
        pGain.connect(ctx.destination);
        pOsc.start(pt);
        pOsc.stop(pt + 0.12);
      });

      // Sharp exhaust throttle crackle
      const popT = now + 0.66;
      const popOsc = ctx.createOscillator();
      const popGain = ctx.createGain();
      popOsc.type = "sawtooth";
      popOsc.frequency.setValueAtTime(220, popT);
      popOsc.frequency.exponentialRampToValueAtTime(35, popT + 0.07);
      popGain.gain.setValueAtTime(1.25, popT);
      popGain.gain.exponentialRampToValueAtTime(0.001, popT + 0.08);
      popOsc.connect(popGain);
      popGain.connect(ctx.destination);
      popOsc.start(popT);
      popOsc.stop(popT + 0.09);

      if ("vibrate" in navigator) {
        try { navigator.vibrate([70, 30, 90, 40, 160]); } catch { /* */ }
      }
    } catch { /* */ }
  }

  // 4. KAWASAKI INLINE-4 CLICK 3: REALISTIC SLOW THROTTLE ROLL-ON (SMOOTH & DEEP)
  // Progressive, authentic superbike throttle climb from deep purr to glorious acoustic rev.
  // No harsh buzzer limiter cuts, no mobile vibration buzzing - pure organic exhaust acoustics!
  playEngineRoarRaw() {
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Studio Master Compressor to maintain warm dynamics without distortion
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-18, now);
      compressor.knee.setValueAtTime(12, now);
      compressor.ratio.setValueAtTime(4, now);
      compressor.attack.setValueAtTime(0.015, now);
      compressor.release.setValueAtTime(0.25, now);
      compressor.connect(ctx.destination);

      const masterRoarGain = ctx.createGain();
      masterRoarGain.gain.setValueAtTime(1.4, now);
      masterRoarGain.connect(compressor);

      // Acoustic Exhaust Chamber Delay (Smooth warm resonance)
      const chamberDelay = ctx.createDelay();
      chamberDelay.delayTime.setValueAtTime(0.0035, now);
      const chamberFeedback = ctx.createGain();
      chamberFeedback.gain.setValueAtTime(0.35, now);
      chamberDelay.connect(chamberFeedback);
      chamberFeedback.connect(chamberDelay);
      chamberDelay.connect(masterRoarGain);

      // ── A. Initial Intake Induction Whoosh (Gentle air suction) ──
      const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.8, ctx.sampleRate);
      const noiseData = noiseBuf.getChannelData(0);
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * Math.sin((i / noiseData.length) * Math.PI);
      }
      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = noiseBuf;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(320, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(800, now + 1.2);
      noiseFilter.Q.setValueAtTime(1.8, now);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.35, now + 0.3);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
      noiseSrc.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterRoarGain);
      noiseSrc.start(now);
      noiseSrc.stop(now + 1.9);

      // ── B. Progressive Slow Throttle Roll-On (Smooth frequency climb) ──
      // 0.0s to 0.4s: Throttle crack (120 Hz)
      // 0.4s to 2.0s: Smooth throttle rise from 120 Hz -> 330 Hz (Kawasaki 10,000 RPM fundamental)
      // 2.0s to 2.7s: High-RPM hold
      // 2.7s to 3.4s: Gentle throttle release

      // 1. Warm Fundamental Cylinder Firing Pulse (Smooth Triangle wave)
      const osc1 = ctx.createOscillator();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(120, now);
      osc1.frequency.setValueAtTime(120, now + 0.1);
      osc1.frequency.exponentialRampToValueAtTime(330, now + 0.82); // Responsive progressive throttle rise to 10k RPM!
      osc1.frequency.exponentialRampToValueAtTime(170, now + 1.25);

      // 2. Octave Harmonic (Warm Sawtooth through smooth lowpass)
      const osc2 = ctx.createOscillator();
      osc2.type = "sawtooth";
      osc2.frequency.setValueAtTime(240, now);
      osc2.frequency.setValueAtTime(240, now + 0.1);
      osc2.frequency.exponentialRampToValueAtTime(660, now + 0.82);
      osc2.frequency.exponentialRampToValueAtTime(340, now + 1.25);

      // 3. Singing 5th Harmonic (Pure Sine wave)
      const osc3 = ctx.createOscillator();
      osc3.type = "sine";
      osc3.frequency.setValueAtTime(360, now);
      osc3.frequency.setValueAtTime(360, now + 0.1);
      osc3.frequency.exponentialRampToValueAtTime(990, now + 0.82);
      osc3.frequency.exponentialRampToValueAtTime(510, now + 1.25);

      // 4. Sub-Bass Rumble (Sine wave foundation)
      const oscSub = ctx.createOscillator();
      oscSub.type = "sine";
      oscSub.frequency.setValueAtTime(60, now);
      oscSub.frequency.setValueAtTime(60, now + 0.1);
      oscSub.frequency.exponentialRampToValueAtTime(165, now + 0.82);
      oscSub.frequency.exponentialRampToValueAtTime(85, now + 1.25);

      // Acoustic Lowpass Filter (Warm muffler resonance, opens up smoothly as throttle rolls on)
      const exhaustFilter = ctx.createBiquadFilter();
      exhaustFilter.type = "lowpass";
      exhaustFilter.Q.setValueAtTime(1.8, now);
      exhaustFilter.frequency.setValueAtTime(420, now);
      exhaustFilter.frequency.exponentialRampToValueAtTime(2600, now + 0.82);
      exhaustFilter.frequency.exponentialRampToValueAtTime(400, now + 1.25);

      // Gentle Tube Warmth (Low-order soft saturation, NO buzzing)
      const softSat = ctx.createWaveShaper();
      const n = 256;
      const curve = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const x = (i * 2) / n - 1;
        curve[i] = (1.5 * x) / (1 + 0.5 * Math.abs(x)); // Soft analog compression curve
      }
      softSat.curve = curve;

      // Master Throttle Volume Envelope (Crisp 1.3s envelope, cleanly subsides before Stage 3 voiceover)
      const roarGain = ctx.createGain();
      roarGain.gain.setValueAtTime(0.001, now);
      roarGain.gain.linearRampToValueAtTime(0.7, now + 0.12);
      roarGain.gain.linearRampToValueAtTime(1.35, now + 0.82); // Peak rev at 0.82s
      roarGain.gain.setValueAtTime(1.2, now + 0.95);
      roarGain.gain.exponentialRampToValueAtTime(0.001, now + 1.28); // Completely silent by 1.3s!

      // Connect oscillators
      osc1.connect(exhaustFilter);
      osc2.connect(exhaustFilter);
      osc3.connect(exhaustFilter);
      oscSub.connect(exhaustFilter);

      exhaustFilter.connect(softSat);
      softSat.connect(chamberDelay);
      softSat.connect(roarGain);
      roarGain.connect(masterRoarGain);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);
      oscSub.start(now);

      osc1.stop(now + 1.3);
      osc2.stop(now + 1.3);
      osc3.stop(now + 1.3);
      oscSub.stop(now + 1.3);
    } catch { /* ignore */ }
  }

  // 5. HYDRAULIC PRESSURE HISS & LOCK CLANKS
  playHydraulicHiss() {
    const ctx = this.initContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.9, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.5);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(2600, now);
      bp.Q.setValueAtTime(2.5, now);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.5, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      src.connect(bp);
      bp.connect(g);
      g.connect(ctx.destination);
      src.start(now);
      src.stop(now + 0.9);
    } catch { /* */ }
  }

  playLockClank() {
    const ctx = this.initContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.15);
      g.gain.setValueAtTime(0.6, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch { /* */ }
  }

  // 6. WELCOME ENTRY CHIME & VIP ANNOUNCEMENT TONE
  playWelcomeEntryChime() {
    const ctx = this.initContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Sub-bass cinematic warm hit
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(85, now);
      subOsc.frequency.exponentialRampToValueAtTime(40, now + 0.45);
      subGain.gain.setValueAtTime(0.45, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.6);

      // Bright titanium chime harmonic
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = "sine";
      chimeOsc.frequency.setValueAtTime(880, now);
      chimeOsc.frequency.exponentialRampToValueAtTime(587.33, now + 0.55);
      chimeGain.gain.setValueAtTime(0.25, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start(now);
      chimeOsc.stop(now + 0.75);
    } catch { /* ignore */ }
  }
}

// Global audio engine singleton
const audioEngine = new MechanicalAudioEngine();

/* ================================================================
   MAIN APPLICATION COMPONENT
   Stages:
     1. "gears"      -> Realistic Chrome Gears + Meshing Sparks + Loud Gear Sound + YES/NO Question
     2. "engine"     -> 3-Click Engine Start Button (Crank 1 -> Crank 2 -> 10,000 RPM RAW ROAR + Realistic Volumetric Smoke + Doors)
     3. "welcome"    -> Cinematic "WELCOME TO THE CLUB" voice-over banner
     4. "invitation" -> Full Official Invitation (Countdown removed!)
   ================================================================ */
type Stage = "gears" | "engine" | "welcome" | "invitation";

export default function FreshersExperience({ mode = "auto" }: { mode?: "mobile" | "pc" | "auto" }) {
  const [stage, setStage] = useState<Stage>("gears");

  const [soundActive, setSoundActive] = useState(true);
  const [engineClicks, setEngineClicks] = useState<number>(0);
  const [displayedRpm, setDisplayedRpm] = useState<number>(0);
  const [smokeActive, setSmokeActive] = useState(false);
  const [welcomeSmoke, setWelcomeSmoke] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const [welcomeSpoken, setWelcomeSpoken] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState("");
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const [noAttempts, setNoAttempts] = useState(0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  /* ── AUDIO TOGGLE ── */
  const toggleSound = useCallback(() => {
    if (soundActive) {
      audioEngine.stopGearAmbience();
      setSoundActive(false);
    } else {
      audioEngine.startGearAmbience();
      setSoundActive(true);
    }
  }, [soundActive]);

  /* ── STAGE 1: AUTOMATIC ROTATING GEAR AMBIENCE ON LOAD/CLICK ── */
  useEffect(() => {
    audioEngine.startGearAmbience();

    const handleFirstGesture = () => {
      audioEngine.startGearAmbience();
      setSoundActive(true);
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
    };

    window.addEventListener("click", handleFirstGesture);
    window.addEventListener("touchstart", handleFirstGesture);

    return () => {
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
    };
  }, []);

  /* ── PRE-LOAD AND CACHE SPEECH SYNTHESIS VOICES FOR FLUENT ANNOUNCEMENT ── */
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const populateVoices = () => {
      try {
        const v = window.speechSynthesis.getVoices();
        if (v && v.length > 0) {
          setAvailableVoices(v);
        }
      } catch { /* ignore */ }
    };
    populateVoices();
    window.speechSynthesis.addEventListener("voiceschanged", populateVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", populateVoices);
    };
  }, []);

  /* ── STAGE 1: YES BUTTON PRESSED -> DIRECT SEQUENCING TO STAGE 2 (ENGINE CHAMBER) ── */
  const handleYes = useCallback(() => {
    audioEngine.playLockClank();
    audioEngine.stopGearAmbience();
    setSoundActive(false);
    setStage("engine");
  }, []);

  /* ── STAGE 1: NO BUTTON ESCAPE MECHANISM ── */
  const escapeNo = useCallback(() => {
    setNoAttempts((prev) => prev + 1);
    audioEngine.playLockClank();

    const dirX = Math.random() > 0.5 ? 1 : -1;
    const dirY = Math.random() > 0.5 ? 1 : -1;
    setNoOffset({
      x: dirX * (60 + Math.floor(Math.random() * 90)),
      y: dirY * (40 + Math.floor(Math.random() * 70)),
    });
  }, []);

  /* ── STAGE 2: 3-CLICK ENGINE CRANK & SMOOTH SLOW THROTTLE KAWASAKI INLINE-4 ROAR ── */
  const handleEngineStartClick = useCallback(() => {
    if (engineClicks >= 3) return;

    const nextClicks = engineClicks + 1;
    setEngineClicks(nextClicks);

    if (nextClicks === 1) {
      // 1st Click: 2,200 RPM Kawasaki High-Rev Starter Crank
      setDisplayedRpm(2200);
      audioEngine.playEngineCrank1();
    } else if (nextClicks === 2) {
      // 2nd Click: 5,400 RPM Crank + early smoke puffs
      setDisplayedRpm(5400);
      audioEngine.playEngineCrank2();
      setSmokeActive(true);
    } else if (nextClicks === 3) {
      // 3rd Click: Pure organic throttle climb (No buzzer vibration, deep superbike acoustics)
      audioEngine.playEngineRoarRaw();
      setSmokeActive(true);

      // Fast, responsive throttle rev up to 10,000 RPM in ~0.82s (reduced from 1.6s)
      let currentRpm = 5400;
      const interval = setInterval(() => {
        currentRpm += 165;
        if (currentRpm >= 10000) {
          currentRpm = 10000;
          setDisplayedRpm(10000);
          clearInterval(interval);
        } else {
          setDisplayedRpm(currentRpm);
        }
      }, 30);

      // Hydraulic hiss & blast doors open smoothly at 0.95s
      setTimeout(() => {
        audioEngine.playHydraulicHiss();
        setDoorOpen(true);
      }, 950);

      // Seamlessly sequence into Stage 3 ("welcome to the club") at 1.35s (reduced from 2.8s)
      setTimeout(() => {
        setStage("welcome");
      }, 1350);
    }
  }, [engineClicks]);

  /* ── STAGE 3 -> 4: PROCEED TO INVITATION WITH SMOKE EFFECT ── */
  const handleProceedToInvitation = useCallback(() => {
    setWelcomeSmoke(true);
    audioEngine.playHydraulicHiss();
    audioEngine.playLockClank();
    setTimeout(() => {
      setStage("invitation");
    }, 500);
  }, []);

  /* ── FLUENT VOICE-OVER ENGINE ("WELCOME TO THE CLUB") ── */
  const playFluentWelcomeVoice = useCallback(
    (onFinished?: () => void) => {
      // 1. Sleek VIP entry chime
      audioEngine.playWelcomeEntryChime();

      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        if (onFinished) onFinished();
        return;
      }

      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.cancel();

        // 2. Natural, crisp English utterance without punctuation pauses
        const speech = new SpeechSynthesisUtterance("Welcome to the club.");
        speech.rate = 0.92; // Deliberate, clear, articulate cadence so every word is heard
        speech.pitch = 1.0; // Clear, resonant human pitch (no robotic distortion)
        speech.volume = 1.0;

        // 3. Priority Voice Selector for Natural & Fluent Delivery
        const voiceList =
          window.speechSynthesis.getVoices().length > 0
            ? window.speechSynthesis.getVoices()
            : availableVoices;

        if (voiceList && voiceList.length > 0) {
          const preferredVoice =
            voiceList.find(
              (v) =>
                v.lang.startsWith("en") &&
                (v.name.includes("Natural") ||
                  v.name.includes("Neural") ||
                  v.name.includes("Google US English") ||
                  v.name.includes("Google UK English Male") ||
                  v.name.includes("Microsoft David") ||
                  v.name.includes("Microsoft Mark") ||
                  v.name.includes("Microsoft George") ||
                  v.name.includes("Daniel") ||
                  v.name.includes("Guy") ||
                  v.name.includes("Male"))
            ) ||
            voiceList.find((v) => v.lang === "en-US" || v.lang === "en_US") ||
            voiceList.find((v) => v.lang.startsWith("en")) ||
            voiceList[0];

          if (preferredVoice) {
            speech.voice = preferredVoice;
          }
        }

        // 4. Retain reference in ref to prevent V8 garbage-collection cutoff mid-speech
        activeUtteranceRef.current = speech;

        let hasFinished = false;
        const finishOnce = () => {
          if (hasFinished) return;
          hasFinished = true;
          activeUtteranceRef.current = null;
          // Give 1.1s so every word has completely finished playing through speaker buffers
          setTimeout(() => {
            if (onFinished) onFinished();
          }, 1100);
        };

        speech.onend = finishOnce;
        speech.onerror = finishOnce;

        // 5. Short 60ms delay prevents Chromium from silently discarding speak() after cancel()
        setTimeout(() => {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
          window.speechSynthesis.speak(speech);
        }, 60);
      } catch {
        if (onFinished) onFinished();
      }
    },
    [availableVoices]
  );

  /* ── STAGE 3: "WELCOME TO THE CLUB" VOICE-OVER -> SMOKE EFFECT -> OPEN INVITATION ── */
  useEffect(() => {
    if (stage === "welcome" && !welcomeSpoken) {
      setWelcomeSpoken(true);
      let triggered = false;

      const triggerSmokeAndOpenInvitation = () => {
        if (triggered) return;
        triggered = true;

        // 1. Add smoke effect & hydraulic hiss
        setWelcomeSmoke(true);
        audioEngine.playHydraulicHiss();

        // 2. Open invitation seamlessly after smoke rolls out (no loading overlay)
        setTimeout(() => {
          setStage("invitation");
        }, 1100);
      };

      // Play fluent voiceover, then trigger smoke and invitation on completion
      playFluentWelcomeVoice(() => {
        triggerSmokeAndOpenInvitation();
      });

      // Safe fallback timer (5.0s) in case speech synthesis is blocked, muted, or delayed
      const fallbackTimer = setTimeout(() => {
        triggerSmokeAndOpenInvitation();
      }, 5000);

      return () => {
        clearTimeout(fallbackTimer);
      };
    }
  }, [stage, welcomeSpoken, playFluentWelcomeVoice]);

  /* ── SHARING UTILITIES ── */
  const handleCopyLink = useCallback(() => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopyFeedback("COPIED!");
        setTimeout(() => setCopyFeedback(""), 2500);
      });
    }
  }, []);

  const handleShareWhatsApp = useCallback(() => {
    if (typeof window !== "undefined") {
      const msg = `⚙️ *FRESHERS PARTY 2026*\n🏛️ *Dept. of Mechanical Engineering*\n📍 Mechanical Seminar Hall\n🗓️ 10 OCTOBER 2026 (9:00 AM - 1:00 PM)\n\n👉 Open your interactive invitation:\n${window.location.href}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
    }
  }, []);

  const handleAddCalendar = useCallback(() => {
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Mechanical Engineering Freshers Party 2026")}&dates=20261010T033000Z/20261010T073000Z&details=${encodeURIComponent("Department of Mechanical Engineering Freshers Party 2026. Where gears turn and legends begin!")}&location=${encodeURIComponent("Mechanical Seminar Hall, Narayana Engineering College, Nellore")}`;
    window.open(calendarUrl, "_blank");
  }, []);

  const handleRestart = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    activeUtteranceRef.current = null;
    setEngineClicks(0);
    setDisplayedRpm(0);
    setSmokeActive(false);
    setWelcomeSmoke(false);
    setDoorOpen(false);
    setWelcomeSpoken(false);
    setNoOffset({ x: 0, y: 0 });
    setNoAttempts(0);
    setStage("gears");
    audioEngine.startGearAmbience();
    setSoundActive(true);
  }, []);

  return (
    <main className="mechUniverse" ref={containerRef}>
      {/* ── GLOBAL SVG DEFS & TURBULENT SMOKE FILTER ── */}
      <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
        <defs>
          {/* Chrome Face Linear Gradient */}
          <linearGradient id="globalChromeFace" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="14%" stopColor="#E2EBF4" />
            <stop offset="32%" stopColor="#8EA3B5" />
            <stop offset="48%" stopColor="#354452" />
            <stop offset="52%" stopColor="#1B2630" />
            <stop offset="68%" stopColor="#7E94A8" />
            <stop offset="85%" stopColor="#DDE7F2" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>

          {/* Chrome Bevel Gradient */}
          <linearGradient id="globalChromeBevel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#9AB2C6" />
            <stop offset="65%" stopColor="#334350" />
            <stop offset="100%" stopColor="#0B1117" />
          </linearGradient>

          {/* Lathe-Turned Circular Radial Gradient */}
          <radialGradient id="globalLatheTurnedHub" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="20%" stopColor="#A8BCCF" />
            <stop offset="38%" stopColor="#3E4F5E" />
            <stop offset="58%" stopColor="#CBD9E7" />
            <stop offset="78%" stopColor="#222F3A" />
            <stop offset="92%" stopColor="#879DB0" />
            <stop offset="100%" stopColor="#4A5B6B" />
          </radialGradient>

          {/* Metallic 3D Drop Shadow */}
          <filter id="globalGearMetalShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000000" floodOpacity="0.85" />
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#00E5FF" floodOpacity="0.3" />
          </filter>

          {/* ORGANIC REALISTIC TURBULENT SMOKE DISPLACEMENT FILTER */}
          <filter id="realisticTurbulentSmoke" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" result="smokeNoise" />
            <feDisplacementMap in="SourceGraphic" in2="smokeNoise" scale="36" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* ── REALISTIC METALLIC CHROME BACKGROUND TEXTURES ── */}
      <div className="steelDiamondGrid" />
      <div className="brushedMetalGrain" />
      <div className="chromePerimeterFrame" />
      <div className="industrialFog" />

      {/* ══════════════════════════════════════════════════════════════
          BACKGROUND REALISTIC MECHANICAL ASSETS (Engine Parts, Robot Arm, Drone)
      ══════════════════════════════════════════════════════════════ */}

      {/* 1. KAWASAKI INLINE-4 RECIPROCATING ENGINE BLOCK CUTAWAY (Left Background) */}
      <aside
        className={`bgTwinEngineCutaway ${engineClicks >= 3 ? "engineRedline" : engineClicks > 0 ? "engineCranking" : ""}`}
        title="Kawasaki 1000cc 16-Valve DOHC Inline-4 Mechanical Engine Block"
        aria-hidden="true"
      >
        <svg viewBox="0 0 240 320" width="100%" height="100%">
          <defs>
            <linearGradient id="pistonMetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#B0C4D6" />
              <stop offset="55%" stopColor="#3A4A58" />
              <stop offset="100%" stopColor="#141E28" />
            </linearGradient>
            <linearGradient id="cylinderSleeveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1A2530" />
              <stop offset="20%" stopColor="#4A5C6D" />
              <stop offset="80%" stopColor="#4A5C6D" />
              <stop offset="100%" stopColor="#1A2530" />
            </linearGradient>
          </defs>

          {/* Outer Engine Block Frame */}
          <rect x="15" y="20" width="210" height="280" rx="8" fill="#0A111A" stroke="url(#globalChromeFace)" strokeWidth="2" />
          
          {/* Engine Model Stamp */}
          <text x="120" y="38" textAnchor="middle" fill="#00E5FF" fontSize="9" fontFamily="'Share Tech Mono', monospace" letterSpacing="1.5">
            KAWASAKI 1000cc • 16-VALVE INLINE-4
          </text>

          {/* Cylinder 1 Sleeve (Left) */}
          <rect x="25" y="48" width="85" height="150" fill="url(#cylinderSleeveGrad)" stroke="#6C8296" strokeWidth="1.5" />
          {/* Honing cross-hatch marks */}
          <line x1="30" y1="65" x2="105" y2="110" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="30" y1="110" x2="105" y2="65" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />

          {/* Cylinder 2 Sleeve (Right) */}
          <rect x="130" y="48" width="85" height="150" fill="url(#cylinderSleeveGrad)" stroke="#6C8296" strokeWidth="1.5" />
          <line x1="135" y1="65" x2="210" y2="110" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="135" y1="110" x2="210" y2="65" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />

          {/* Piston 1 Reciprocating Assembly (Moves Up/Down) */}
          <g className="piston1Reciprocate">
            {/* Piston Crown & Skirt */}
            <rect x="30" y="55" width="75" height="48" rx="4" fill="url(#pistonMetalGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
            {/* 3 Compression & Oil Control Rings */}
            <line x1="30" y1="64" x2="105" y2="64" stroke="#050B12" strokeWidth="2.5" />
            <line x1="30" y1="72" x2="105" y2="72" stroke="#050B12" strokeWidth="2.5" />
            <line x1="30" y1="80" x2="105" y2="80" stroke="#050B12" strokeWidth="2.5" />
            {/* Wrist Pin */}
            <circle cx="67" cy="88" r="8" fill="#FFFFFF" stroke="#0F1720" strokeWidth="2" />
            {/* Forged H-Beam Connecting Rod */}
            <path d="M62 88 L58 178 L76 178 L72 88 Z" fill="url(#pistonMetalGrad)" stroke="#111B24" strokeWidth="1.5" />
            {/* Rod Big-End Journal Cap */}
            <circle cx="67" cy="178" r="13" fill="url(#globalLatheTurnedHub)" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>

          {/* Piston 2 Reciprocating Assembly (180 deg Counter-Phase) */}
          <g className="piston2Reciprocate">
            <rect x="135" y="55" width="75" height="48" rx="4" fill="url(#pistonMetalGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="135" y1="64" x2="210" y2="64" stroke="#050B12" strokeWidth="2.5" />
            <line x1="135" y1="72" x2="210" y2="72" stroke="#050B12" strokeWidth="2.5" />
            <line x1="135" y1="80" x2="210" y2="80" stroke="#050B12" strokeWidth="2.5" />
            <circle cx="172" cy="88" r="8" fill="#FFFFFF" stroke="#0F1720" strokeWidth="2" />
            <path d="M167 88 L163 178 L181 178 L177 88 Z" fill="url(#pistonMetalGrad)" stroke="#111B24" strokeWidth="1.5" />
            <circle cx="172" cy="178" r="13" fill="url(#globalLatheTurnedHub)" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>

          {/* Heavy Billet Counterweighted Crankshaft */}
          <g className="crankshaftAssembly">
            <circle cx="120" cy="235" r="48" fill="none" stroke="rgba(0,229,255,0.35)" strokeWidth="2" strokeDasharray="6 4" />
            {/* Left Counterweight */}
            <path d="M72 235 A48 48 0 0 1 120 187 L120 235 Z" fill="url(#pistonMetalGrad)" stroke="#111922" strokeWidth="2" />
            {/* Right Counterweight */}
            <path d="M120 235 L120 283 A48 48 0 0 1 168 235 Z" fill="url(#pistonMetalGrad)" stroke="#111922" strokeWidth="2" />
            {/* Crankshaft Center Hub & Oil Passage */}
            <circle cx="120" cy="235" r="16" fill="#060C14" stroke="#00E5FF" strokeWidth="2.5" />
            <circle cx="120" cy="235" r="6" fill="#00E5FF" />
          </g>

          {/* Overhead Camshaft & Dual Valves */}
          <g className="camshaftValves">
            {/* Left Intake Valve */}
            <line x1="50" y1="48" x2="50" y2="28" stroke="#FFFFFF" strokeWidth="3" />
            <circle cx="50" cy="28" r="6" fill="#FF7700" className="sparkPlugFlash" />
            {/* Right Exhaust Valve */}
            <line x1="190" y1="48" x2="190" y2="28" stroke="#FFFFFF" strokeWidth="3" />
            <circle cx="190" cy="28" r="6" fill="#FF7700" className="sparkPlugFlash" />
          </g>
        </svg>
      </aside>

      {/* 2. ARTICULATED INDUSTRIAL ROBOT ARM (Right Background) */}
      <aside className="bgRobotArmAssembly" title="Industrial 6-Axis Welding Robot Arm" aria-hidden="true">
        <svg viewBox="0 0 220 340" width="100%" height="100%">
          <defs>
            <linearGradient id="robotArmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#9AB2C6" />
              <stop offset="60%" stopColor="#2A3846" />
              <stop offset="100%" stopColor="#0E1620" />
            </linearGradient>
          </defs>

          {/* Heavy Steel Pedestal Base & Anchor Bolts */}
          <rect x="55" y="295" width="110" height="35" rx="5" fill="url(#robotArmGrad)" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="70" cy="312" r="4" fill="#0B131C" stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="150" cy="312" r="4" fill="#0B131C" stroke="#FFFFFF" strokeWidth="1" />
          
          {/* Turntable Rotational Joint */}
          <circle cx="110" cy="280" r="28" fill="#14202D" stroke="#00E5FF" strokeWidth="2.5" />
          <circle cx="110" cy="280" r="12" fill="url(#robotArmGrad)" stroke="#0E1620" strokeWidth="1.5" />

          {/* Lower Articulated Boom Arm */}
          <g className="robotArmBoom">
            <rect x="98" y="150" width="24" height="130" rx="6" fill="url(#robotArmGrad)" stroke="#0B121A" strokeWidth="2" />
            
            {/* Hydraulic Counterbalance Actuator */}
            <line x1="88" y1="265" x2="88" y2="165" stroke="#00E5FF" strokeWidth="7" strokeLinecap="round" />
            <circle cx="110" cy="150" r="20" fill="#152230" stroke="#FFFFFF" strokeWidth="2" />

            {/* Forearm & Articulated Wrist Joint */}
            <g className="robotForearm">
              <rect x="100" y="50" width="20" height="100" rx="5" fill="url(#robotArmGrad)" stroke="#0B121A" strokeWidth="2" />
              
              {/* Electric Servo Drive Housing */}
              <circle cx="110" cy="50" r="16" fill="#101C28" stroke="#00E5FF" strokeWidth="2" />
              
              {/* Welding Torch Nozzle & Gas Diffuser */}
              <path d="M102 50 L110 12 L118 50 Z" fill="url(#robotArmGrad)" stroke="#080E14" strokeWidth="1.5" />
              
              {/* Blinding Electric Arc Flash & Sparks */}
              <circle cx="110" cy="10" r="8" fill="#00E5FF" className="weldingArcFlare" />
              <circle cx="110" cy="10" r="4" fill="#FFFFFF" />
            </g>
          </g>
        </svg>

        {/* Cascading Molten Welding Sparks */}
        <div className="weldingSparkFountain">
          {ROBOT_WELDING_SPARKS.map((spk, idx) => (
            <div
              key={idx}
              className="weldingSpark"
              style={{
                ["--dx" as string]: `${spk.dx}px`,
                ["--dy" as string]: `${spk.dy}px`,
                width: `${spk.size}px`,
                height: `${spk.size * 2}px`,
                animationDelay: spk.delay,
                animationDuration: spk.duration,
              }}
            />
          ))}
        </div>
      </aside>

      {/* 3. AUTONOMOUS PATROL DRONE WITH SCANNING VOLUMETRIC LASER (Top Area) */}
      <aside className="bgPatrolDrone" title="Autonomous Facility Patrol Drone" aria-hidden="true">
        <svg viewBox="0 0 200 160" width="100%" height="100%">
          <defs>
            <linearGradient id="droneTitaniumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#A2B6C8" />
              <stop offset="70%" stopColor="#263442" />
              <stop offset="100%" stopColor="#0B1117" />
            </linearGradient>
            <linearGradient id="volumetricLaserCone" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#00E5FF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Sweeping Laser Searchlight Cone */}
          <polygon points="100,72 15,160 185,160" fill="url(#volumetricLaserCone)" className="droneScanBeam" />

          {/* Quad Carbon-Fiber Arms */}
          <line x1="55" y1="58" x2="25" y2="44" stroke="url(#droneTitaniumGrad)" strokeWidth="6" strokeLinecap="round" />
          <line x1="145" y1="58" x2="175" y2="44" stroke="url(#droneTitaniumGrad)" strokeWidth="6" strokeLinecap="round" />
          
          {/* Spinning Propeller Rotors */}
          <ellipse cx="25" cy="44" rx="22" ry="7" fill="#060C14" stroke="#00E5FF" strokeWidth="1.5" />
          <line x1="5" y1="44" x2="45" y2="44" stroke="#FFFFFF" strokeWidth="3" className="rotorBlades" />
          
          <ellipse cx="175" cy="44" rx="22" ry="7" fill="#060C14" stroke="#00E5FF" strokeWidth="1.5" />
          <line x1="155" y1="44" x2="195" y2="44" stroke="#FFFFFF" strokeWidth="3" className="rotorBlades" />

          {/* Aerodynamic Drone Chassis Body */}
          <ellipse cx="100" cy="58" rx="44" ry="18" fill="url(#droneTitaniumGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
          <ellipse cx="100" cy="52" rx="26" ry="10" fill="#0A121B" stroke="#00E5FF" strokeWidth="1.5" />
          
          {/* Gyro-Stabilized Camera Gimbal & Navigation Eye */}
          <circle cx="100" cy="68" r="7" fill="#00E5FF" className="droneSensorEye" />

          {/* Navigation Strobe Lights (Port Red, Starboard Green) */}
          <circle cx="25" cy="44" r="3.5" fill="#FF0044" className="navStrobePort" />
          <circle cx="175" cy="44" r="3.5" fill="#00FF66" className="navStrobeStarboard" />
        </svg>
      </aside>

      {/* 4. PERFORMANCE TURBOCHARGER ASSEMBLY (Lower Left Ambient) */}
      <aside className="bgTurbochargerAssembly" title="Twin-Scroll Performance Turbocharger" aria-hidden="true">
        <svg viewBox="0 0 140 140" width="100%" height="100%">
          {/* Turbo Snail Volute Scroll Housing */}
          <path
            d="M70 15 A55 55 0 1 1 20 85 L20 125 L45 125 A55 55 0 0 0 125 70 A55 55 0 0 0 70 15 Z"
            fill="url(#globalChromeFace)"
            stroke="url(#globalChromeBevel)"
            strokeWidth="2"
          />
          {/* Compressor Bellmouth Inlet */}
          <circle cx="70" cy="70" r="34" fill="#080E16" stroke="url(#globalChromeFace)" strokeWidth="2.5" />
          {/* Spinning Curved Billet Impeller Wheel */}
          <g className="turboImpellerSpinning">
            <circle cx="70" cy="70" r="30" fill="none" stroke="#00E5FF" strokeWidth="1" strokeDasharray="3 3" />
            {Array.from({ length: 8 }).map((_, idx) => {
              const ang = (idx * (Math.PI * 2)) / 8;
              const ix2 = (70 + Math.cos(ang) * 28).toFixed(2);
              const iy2 = (70 + Math.sin(ang) * 28).toFixed(2);
              return (
                <path
                  key={idx}
                  d={`M 70 70 Q ${(70 + Math.cos(ang + 0.3) * 16).toFixed(2)} ${(70 + Math.sin(ang + 0.3) * 16).toFixed(2)} ${ix2} ${iy2}`}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  fill="none"
                />
              );
            })}
            <circle cx="70" cy="70" r="7" fill="#CCD8E4" stroke="#0A1017" strokeWidth="1.5" />
          </g>
        </svg>
      </aside>

      {/* 5. VENTILATED CROSS-DRILLED DISC BRAKE & RED CALIPER (Lower Right Ambient) */}
      <aside className="bgBremboBrakeAssembly" title="Cross-Drilled Racing Ventilated Disc Brake" aria-hidden="true">
        <svg viewBox="0 0 140 140" width="100%" height="100%">
          {/* Ventilated Steel Rotor Disc */}
          <circle cx="70" cy="70" r="58" fill="url(#globalLatheTurnedHub)" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="70" cy="70" r="42" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="1" strokeDasharray="6 4" />
          <circle cx="70" cy="70" r="26" fill="#141E28" stroke="url(#globalChromeFace)" strokeWidth="2" />
          {/* Wheel Stud Bolts */}
          {Array.from({ length: 5 }).map((_, idx) => {
            const ang = (idx * (Math.PI * 2)) / 5;
            const sx = (70 + Math.cos(ang) * 16).toFixed(2);
            const sy = (70 + Math.sin(ang) * 16).toFixed(2);
            return <circle key={idx} cx={sx} cy={sy} r="3" fill="#CCD8E4" stroke="#05090F" strokeWidth="1" />;
          })}
          {/* Racing Red Monoblock Caliper */}
          <path
            d="M20 30 Q 70 12 110 32 L 105 54 Q 70 38 28 50 Z"
            fill="#D31010"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
          <text x="65" y="38" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold" fontFamily="'Orbitron', sans-serif">
            BREMBO
          </text>
        </svg>
      </aside>

      {/* Ambient floating metallic particles */}
      <div className="ambientParticles">
        {BG_PARTICLES.map((p, i) => (
          <div
            key={i}
            className="ambientParticle"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      {/* ── PERSISTENT CHROME AUDIO CONTROLLER (TOP RIGHT) ── */}
      <header className="topUtilityBar">
        <div className="deptBadge">
          <span className="badgeIcon">⚙</span>
          <span className="badgeText">MECH DEPT • 2026</span>
        </div>
        <button
          type="button"
          className={`chromeAudioBtn ${soundActive ? "audioOn" : "audioOff"}`}
          onClick={toggleSound}
          title="Toggle Rotating Gear Sound"
        >
          <span className="audioSpeaker">{soundActive ? "🔊" : "🔇"}</span>
          <span className="audioLabel">GEAR SOUND: {soundActive ? "LOUD" : "MUTED"}</span>
        </button>
      </header>

      {/* ══════════════════════════════════════════════════════════════
          STAGE 1: REALISTIC CHROME GEARS + SPARKS + GEAR SOUND + YES/NO QUESTION
      ══════════════════════════════════════════════════════════════ */}
      {stage === "gears" && (
        <section className="stageSection stageGears">
          <div className="stageGearsHeader">
            <h1 className="subHeadingTag lightSweep">DEPARTMENT OF MECHANICAL ENGINEERING</h1>
          </div>

          {/* ── REALISTIC INTERLOCKING CHROME GEAR TRAIN ── */}
          <div className="gearTrainContainer">
            {/* Gear 1: Main Chrome Driver Gear (20 teeth, Clockwise) */}
            <div className="gearNode gearNode1">
              <RealisticChromeGear
                size={250}
                outerR={115}
                rootR={92}
                teeth={20}
                spokes={6}
                speed={16}
                clockwise={true}
              />
            </div>

            {/* Gear 2: Secondary Interlocking Gear (14 teeth, Counter-Clockwise) */}
            <div className="gearNode gearNode2">
              <RealisticChromeGear
                size={182}
                outerR={82}
                rootR={64}
                teeth={14}
                spokes={5}
                speed={11.2}
                clockwise={false}
              />
            </div>

            {/* Gear 3: Planetary High-Speed Pinion Gear (10 teeth, Counter-Clockwise) */}
            <div className="gearNode gearNode3">
              <RealisticChromeGear
                size={134}
                outerR={60}
                rootR={47}
                teeth={10}
                spokes={4}
                speed={8}
                clockwise={false}
              />
            </div>

            {/* Sparks at Mesh Contact Point 1 */}
            <div className="gearMeshPoint meshPoint1">
              <div className="frictionHotspot" />
              {GEAR_MESH_SPARKS_1.map((spk, idx) => (
                <div
                  key={idx}
                  className="meshSpark"
                  style={{
                    ["--dx" as string]: `${spk.dx}px`,
                    ["--dy" as string]: `${spk.dy}px`,
                    ["--sparkColor" as string]: spk.color,
                    width: `${spk.size}px`,
                    height: `${spk.size * 2}px`,
                    animationDelay: spk.delay,
                    animationDuration: spk.duration,
                  }}
                />
              ))}
            </div>

            {/* Sparks at Mesh Contact Point 2 */}
            <div className="gearMeshPoint meshPoint2">
              <div className="frictionHotspot" />
              {GEAR_MESH_SPARKS_2.map((spk, idx) => (
                <div
                  key={idx}
                  className="meshSpark"
                  style={{
                    ["--dx" as string]: `${spk.dx}px`,
                    ["--dy" as string]: `${spk.dy}px`,
                    ["--sparkColor" as string]: spk.color,
                    width: `${spk.size}px`,
                    height: `${spk.size * 2}px`,
                    animationDelay: spk.delay,
                    animationDuration: spk.duration,
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── YES / NO QUESTION CARD ── */}
          <div className="questionCardArmor">
            {/* Miniature Sports Motorcycle Driving Along Card Border */}
            <BorderBikeTrack radius={16} />
            <div className="qArmorCornerTL" />
            <div className="qArmorCornerTR" />
            <div className="qArmorCornerBL" />
            <div className="qArmorCornerBR" />

            <div className="questionInner">
              <p className="qCardSub">AUTHENTICATION CHALLENGE</p>
              <h2 className="qCardTitle chromeHeading">
                ARE YOU A <br />
                <span className="chromeShimmer">MECHANICAL ENGINEER?</span>
              </h2>

              <div className="qActionButtons">
                {/* YES BUTTON (Advances to Engine Stage) */}
                <button type="button" className="chromeYesBtn" onClick={handleYes}>
                  <span className="yesBtnText">⚙️ YES, I AM</span>
                  <span className="yesBtnGlow" />
                </button>

                {/* NO BUTTON (Evasive / Dodging) */}
                <button
                  type="button"
                  className="chromeNoBtn"
                  style={{
                    transform: `translate(${noOffset.x}px, ${noOffset.y}px) rotate(${noAttempts * 4}deg)`,
                  }}
                  onMouseEnter={escapeNo}
                  onTouchStart={(e) => { e.preventDefault(); escapeNo(); }}
                  onClick={(e) => { e.preventDefault(); escapeNo(); }}
                >
                  <span className="noBtnText">NO</span>
                </button>
              </div>

              {noAttempts > 0 && (
                <p className="noAttemptWarning">
                  {noAttempts === 1 && "ACCESS CANNOT BE CANCELLED • SELECT YES!"}
                  {noAttempts === 2 && "MECHANICAL BLOOD DETECTED • YOU CANNOT ESCAPE!"}
                  {noAttempts >= 3 && "NICE TRY! ONLY MECHANICAL ENGINEERS CAN PROCEED!"}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          STAGE 2: ENGINE IGNITION ROOM (10,000 RPM TACHOMETER + 3 CLICKS + RAW ROAR)
          (Abort / No button REMOVED!)
      ══════════════════════════════════════════════════════════════ */}
      {stage === "engine" && (
        <section className="stageSection stageEngine">
          {/* REALISTIC TURBULENT VOLUMETRIC EXHAUST SMOKE BILLOWS */}
          {smokeActive && (
            <div className="smokeVessel">
              {/* Dual Glowing Exhaust Pipe Outlets */}
              <div className="exhaustTailpipe pipeLeft">
                <div className="pipeCoreGlow" />
              </div>
              <div className="exhaustTailpipe pipeRight">
                <div className="pipeCoreGlow" />
              </div>

              {/* Left Exhaust Smoke Plumes */}
              {SMOKE_PUFFS_LEFT.map((puff, idx) => (
                <div
                  key={`left-${idx}`}
                  className={`billowSmoke ${puff.color === "charcoal" ? "smokeCharcoal" : "smokePearl"}`}
                  style={{
                    left: puff.left,
                    bottom: puff.bottom,
                    animationDelay: puff.delay,
                    animationDuration: puff.duration,
                    ["--xDrift" as string]: puff.xDrift,
                    ["--targetScale" as string]: puff.scale,
                  }}
                />
              ))}

              {/* Right Exhaust Smoke Plumes */}
              {SMOKE_PUFFS_RIGHT.map((puff, idx) => (
                <div
                  key={`right-${idx}`}
                  className={`billowSmoke ${puff.color === "charcoal" ? "smokeCharcoal" : "smokePearl"}`}
                  style={{
                    left: puff.left,
                    bottom: puff.bottom,
                    animationDelay: puff.delay,
                    animationDuration: puff.duration,
                    ["--xDrift" as string]: puff.xDrift,
                    ["--targetScale" as string]: puff.scale,
                  }}
                />
              ))}

              {/* Rolling Floor Fog */}
              <div className="rollingFloorFog" />
              <div className="exhaustFlameBurst" />
            </div>
          )}

          {/* Heavy Steel Blast Doors Enclosure */}
          <div className={`blastDoorRig ${doorOpen ? "doorsOpen" : "doorsClosed"}`}>
            <div className="heavyDoor heavyDoorLeft">
              <div className="doorSteelTexture" />
              <div className="hazardChevrons" />
              <div className="hydraulicPiston pistonLeft">
                <div className="pistonRod" />
                <div className="pistonBase" />
              </div>
            </div>

            <div className="heavyDoor heavyDoorRight">
              <div className="doorSteelTexture" />
              <div className="hazardChevrons" />
              <div className="hydraulicPiston pistonRight">
                <div className="pistonRod" />
                <div className="pistonBase" />
              </div>
            </div>

            <div className="doorSeamGlow" />
          </div>

          {/* Front Ignition Console */}
          <div className={`ignitionConsole ${engineClicks > 0 ? "consoleEngaged" : ""}`}>
            {/* Miniature Sports Motorcycle Driving Along Card Border */}
            <BorderBikeTrack radius={20} />
            <div className="consoleHeader">
              {/* ── 10,000 RPM RACING TACHOMETER DASHBOARD ── */}
              <div className="racingCluster">
                {/* 16-Segment Formula 1 Shift Light Bar */}
                <div className="shiftLightArray">
                  {/* Green LEDs (0-3.5K) */}
                  <span className={`shiftLed ledGreen ${displayedRpm >= 1000 ? "lit" : ""}`} />
                  <span className={`shiftLed ledGreen ${displayedRpm >= 1800 ? "lit" : ""}`} />
                  <span className={`shiftLed ledGreen ${displayedRpm >= 2600 ? "lit" : ""}`} />
                  <span className={`shiftLed ledGreen ${displayedRpm >= 3400 ? "lit" : ""}`} />
                  {/* Yellow/Amber LEDs (3.5K-7K) */}
                  <span className={`shiftLed ledAmber ${displayedRpm >= 4200 ? "lit" : ""}`} />
                  <span className={`shiftLed ledAmber ${displayedRpm >= 5000 ? "lit" : ""}`} />
                  <span className={`shiftLed ledAmber ${displayedRpm >= 5800 ? "lit" : ""}`} />
                  <span className={`shiftLed ledAmber ${displayedRpm >= 6600 ? "lit" : ""}`} />
                  {/* Red LEDs (7K-9K) */}
                  <span className={`shiftLed ledRed ${displayedRpm >= 7400 ? "lit" : ""}`} />
                  <span className={`shiftLed ledRed ${displayedRpm >= 8200 ? "lit" : ""}`} />
                  <span className={`shiftLed ledRed ${displayedRpm >= 9000 ? "lit" : ""}`} />
                  <span className={`shiftLed ledRed ${displayedRpm >= 9500 ? "lit" : ""}`} />
                  {/* Flashing Overrev Redline LEDs (10,000 RPM) */}
                  <span className={`shiftLed ledRedline ${displayedRpm >= 10000 ? "flashingRedline" : ""}`} />
                  <span className={`shiftLed ledRedline ${displayedRpm >= 10000 ? "flashingRedline" : ""}`} />
                </div>

                {/* Digital Big Number RPM Readout */}
                <div className="digitalRpmDisplay">
                  <div className="rpmMainNumber">
                    <span className={`rpmDigits ${displayedRpm >= 10000 ? "rpmRedlineActive" : ""}`}>
                      {displayedRpm === 0 ? "0000" : displayedRpm.toLocaleString()}
                    </span>
                    <span className="rpmUnit">RPM</span>
                  </div>
                </div>

                {/* 10,000 RPM Scale Dial Numbers */}
                <div className="rpmScaleTicks">
                  <span>0</span>
                  <span>2K</span>
                  <span>4K</span>
                  <span>6K</span>
                  <span>8K</span>
                  <span className="scaleRedline">10,000 RPM</span>
                </div>

                {/* Tachometer Bar Gauge */}
                <div className="rpmTachometer">
                  <div
                    className={`rpmBarFill ${displayedRpm >= 10000 ? "rpmBarMax" : ""}`}
                    style={{
                      width: `${Math.min(100, (displayedRpm / 10000) * 100)}%`, // 10,000 RPM = 100% full scale!
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ── SUPERCAR CHROME ENGINE START BUTTON (NO ABORT BUTTON!) ── */}
            <div className="engineStartHarness">
              <div className="knurledChromeRing">
                <div className="hexBolt b1" />
                <div className="hexBolt b2" />
                <div className="hexBolt b3" />
                <div className="hexBolt b4" />

                <div className={`ignitionHalo ${engineClicks > 0 ? "haloActive" : ""}`}>
                  <button
                    type="button"
                    className={`engineStartButton ${engineClicks === 3 ? "pressedState" : ""}`}
                    onClick={handleEngineStartClick}
                    onTouchStart={handleEngineStartClick}
                    disabled={engineClicks >= 3}
                  >
                    <div className="buttonSteelFace">
                      <span className="btnSubTop">ENGINE</span>
                      <span className="btnMainText">START</span>
                      <span className="btnSubBottom">
                        {engineClicks === 0 && "CLICK 1/3"}
                        {engineClicks === 1 && "CLICK 2/3"}
                        {engineClicks === 2 && "CLICK 3/3"}
                        {engineClicks >= 3 && "10,000 RPM"}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* ── MECHANICAL ENGINEERING QUOTATION PLAQUE (UNDER START BUTTON) ── */}
              <div className="engineQuotePlaque">
                <span className="quoteCornerBolt qcb-tl" />
                <span className="quoteCornerBolt qcb-tr" />
                <span className="quoteCornerBolt qcb-bl" />
                <span className="quoteCornerBolt qcb-br" />

                <div className="quoteEmblemRow">
                  <span className="quoteGearIcon">⚙️</span>
                  <span className="quoteBadgeText">MECHANICAL ENGINEERS’ CREED</span>
                  <span className="quoteGearIcon">⚙️</span>
                </div>

                <blockquote className="quoteStatement">
                  “The engine is the heart of a machine, but the engineer is its soul.”
                </blockquote>

                <div className="quoteFooter">
                  <span className="quoteDividerLine" />
                  <span className="quoteAuthor">DEPARTMENT OF MECHANICAL ENGINEERING</span>
                  <span className="quoteDividerLine" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          STAGE 3: "WELCOME TO THE CLUB" (AFTER DOORS OPEN)
      ══════════════════════════════════════════════════════════════ */}
      {stage === "welcome" && (
        <section className="stageSection stageWelcome">
          {/* VOLUMETRIC SMOKE EFFECT (TRIGGERED AFTER VOICEOVER) */}
          {welcomeSmoke && (
            <div className="welcomeSmokeVessel">
              {SMOKE_PUFFS_LEFT.map((puff, idx) => (
                <div
                  key={`w-left-${idx}`}
                  className={`billowSmoke ${puff.color === "charcoal" ? "smokeCharcoal" : "smokePearl"}`}
                  style={{
                    left: puff.left,
                    bottom: puff.bottom,
                    animationDelay: puff.delay,
                    animationDuration: puff.duration,
                    ["--xDrift" as string]: puff.xDrift,
                    ["--targetScale" as string]: puff.scale,
                  }}
                />
              ))}
              {SMOKE_PUFFS_RIGHT.map((puff, idx) => (
                <div
                  key={`w-right-${idx}`}
                  className={`billowSmoke ${puff.color === "charcoal" ? "smokeCharcoal" : "smokePearl"}`}
                  style={{
                    left: puff.left,
                    bottom: puff.bottom,
                    animationDelay: puff.delay,
                    animationDuration: puff.duration,
                    ["--xDrift" as string]: puff.xDrift,
                    ["--targetScale" as string]: puff.scale,
                  }}
                />
              ))}
              <div className="rollingFloorFog" />
            </div>
          )}

          <div className="welcomeToTheClubBanner">
            {/* Miniature Sports Motorcycle Driving Along Card Border */}
            <BorderBikeTrack radius={20} />
            <div className="voiceSoundWave">
              <span className="bar b1" />
              <span className="bar b2" />
              <span className="bar b3" />
              <span className="bar b4" />
              <span className="bar b5" />
              <span className="bar b6" />
              <span className="bar b7" />
            </div>
            <p className="welcomeSupTitle lightSweep">WELCOME</p>
            <h2 className="welcomeClubTitle chromeLarge chromeShimmer">TO THE CLUB</h2>
            <div className="welcomeParticleStream">
              {WELCOME_PARTICLES.map((p, i) => (
                <div
                  key={i}
                  className="welcomeSparkle"
                  style={{
                    left: p.left,
                    animationDelay: p.delay,
                    animationDuration: p.duration,
                  }}
                />
              ))}
            </div>

            <div className="welcomeNextWrap">
              <button
                type="button"
                className="chromeActionBtn"
                onClick={handleProceedToInvitation}
              >
                <span className="btnInnerChrome">
                  <span>VIEW OFFICIAL INVITATION</span>
                  <span className="btnArrow">→</span>
                </span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          STAGE 4: THE INVITATION (COUNTDOWN FULLY REMOVED!)
      ══════════════════════════════════════════════════════════════ */}
      {stage === "invitation" && (
        <section className="stageSection stageInvitation">
          {/* AMBIENT SMOKE DISPERSAL INTO INVITATION */}
          {welcomeSmoke && (
            <div className="invitationSmokeVessel">
              <div className="rollingFloorFog" />
            </div>
          )}

          {/* Header */}
          <div className="invitationHeader">
            <h1 className="eventMasterTitle chromeHeading">
              <span className="titleFreshers">FRESHERS</span>{" "}
              <span className="titleParty">PARTY</span>
            </h1>
            <div className="yearMedallion">
              <span className="yearText">2026</span>
            </div>
            <p className="deptSubtitle">{EVENT.department}</p>
          </div>

          {/* ── BRUSHED TITANIUM & CHROME INVITATION ARMOR PLATE ── */}
          <div className="invitationArmorPlate">
            {/* Miniature Sports Motorcycle Driving Along Card Border */}
            <BorderBikeTrack radius={20} />
            {/* 4 Corner Heavy 3D Hex Rivets */}
            <div className="armorHexRivet rivetTL" />
            <div className="armorHexRivet rivetTR" />
            <div className="armorHexRivet rivetBL" />
            <div className="armorHexRivet rivetBR" />

            <div className="armorPlateInner">
              {/* College Logo with Chrome Bezel */}
              <div className="collegeLogoBezel">
                <img
                  src="/logo.png"
                  alt="Narayana Engineering College, Nellore"
                  className="collegeLogoImg"
                />
              </div>

              <div className="collegeLabelWrap">
                <p className="collegeHeading">{EVENT.college}</p>
                <p className="deptTagline">DEPARTMENT OF MECHANICAL ENGINEERING</p>
              </div>

              <div className="chromePlateDivider" />

              {/* ── HEARTILY WELCOME TO ALL INVITATION BANNER ── */}
              <div className="heartyWelcomeCard">
                <div className="heartyWelcomeAura" />
                <div className="welcomeEmblemRow">
                  <span className="welcomeGearIcon spinSlow">⚙️</span>
                  <span className="welcomeBadgeText">GRAND INVITATION</span>
                  <span className="welcomeGearIcon spinSlowRev">⚙️</span>
                </div>
                <h2 className="heartyWelcomeTitle chromeShimmer">
                  HEARTILY WELCOME TO ALL
                </h2>
                <p className="heartyWelcomeSub">
                  CORDIALLY INVITING ALL FACULTY MEMBERS &amp; FRESHERS
                </p>
                <div className="welcomeDividerBar">
                  <span className="welcomeDivDot" />
                </div>
              </div>

              <div className="chromePlateDivider" />

              {/* Event Details Grid (Metallic Chrome Badges) */}
              <div className="eventBadgesGrid">
                {/* DATE BADGE */}
                <div className="chromeBadgeCard">
                  <div className="badgeIconBox">📅</div>
                  <div className="badgeContent">
                    <span className="badgeLabel">EVENT DATE</span>
                    <strong className="badgeValue">{EVENT.date}</strong>
                    <span className="badgeSub">{EVENT.day}</span>
                  </div>
                </div>

                {/* TIME BADGE */}
                <div className="chromeBadgeCard">
                  <div className="badgeIconBox">⏰</div>
                  <div className="badgeContent">
                    <span className="badgeLabel">SCHEDULED TIME</span>
                    <strong className="badgeValue">{EVENT.time}</strong>
                    <span className="badgeSub">IST (ASIA/KOLKATA)</span>
                  </div>
                </div>

                {/* VENUE BADGE */}
                <div className="chromeBadgeCard">
                  <div className="badgeIconBox">📍</div>
                  <div className="badgeContent">
                    <span className="badgeLabel">EVENT VENUE</span>
                    <strong className="badgeValue">{EVENT.venue}</strong>
                    <span className="badgeSub">CAMPUS MAIN BLOCK</span>
                  </div>
                </div>
              </div>

              <div className="chromePlateDivider" />

              {/* Mechanical Creed & Tagline (Countdown REMOVED!) */}
              <div className="creedSection">
                <p className="creedLine1">WHERE GEARS TURN</p>
                <p className="creedLine2">AND LEGENDS BEGIN</p>
                <div className="creedSubPill">
                  <span>START YOUR ENGINE</span> • <span>FEEL THE POWER</span> • <span>OWN THE LIFE.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="armorActionsBar">
                <button type="button" className="plateBtn whatsappPlateBtn" onClick={handleShareWhatsApp}>
                  <span className="btnIcon">💬</span>
                  <span className="btnLabel">SHARE ON WHATSAPP</span>
                </button>

                <button type="button" className="plateBtn calendarPlateBtn" onClick={handleAddCalendar}>
                  <span className="btnIcon">📅</span>
                  <span className="btnLabel">ADD TO CALENDAR</span>
                </button>

                <button type="button" className="plateBtn copyPlateBtn" onClick={handleCopyLink}>
                  <span className="btnIcon">🔗</span>
                  <span className="btnLabel">{copyFeedback || "COPY LINK"}</span>
                </button>
              </div>

              {/* Replay Sequence Button */}
              <div className="replaySection">
                <button type="button" className="replayExperienceBtn" onClick={handleRestart}>
                  <span className="replayIcon">🔄</span>
                  <span className="replayText">REPLAY EXPERIENCE FROM STAGE 1</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          CSS STYLES (REALISTIC BRUSHED STEEL & CHROME THEME)
      ══════════════════════════════════════════════════════════════ */}
      <style jsx global>{`
        /* ── ROOT CONFIG & FONTS ── */
        :root {
          --chrome-bright: #FFFFFF;
          --chrome-mid: #A0B4C8;
          --chrome-dark: #2A3644;
          --chrome-accent: #00E5FF;
          --amber-fire: #FF7700;
          --steel-plate: #0C121D;
        }

        /* ── REALISTIC METALLIC CHROME BACKGROUND ── */
        .mechUniverse {
          min-height: 100vh;
          background: 
            radial-gradient(ellipse at 50% 0%, rgba(220, 235, 255, 0.16) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 80%, rgba(0, 229, 255, 0.14) 0%, transparent 50%),
            radial-gradient(ellipse at 15% 70%, rgba(255, 120, 0, 0.10) 0%, transparent 45%),
            repeating-linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.025) 0px,
              rgba(255, 255, 255, 0.025) 1px,
              transparent 1px,
              transparent 4px
            ),
            linear-gradient(90deg, #0A101A 0%, #15202E 25%, #223246 50%, #15202E 75%, #0A101A 100%);
          color: #DDE8F4;
          font-family: 'Rajdhani', sans-serif;
          position: relative;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
        }

        .steelDiamondGrid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          background-image: 
            linear-gradient(45deg, rgba(255, 255, 255, 0.035) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(255, 255, 255, 0.035) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.035) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.035) 75%);
          background-size: 32px 32px;
          background-position: 0 0, 0 16px, 16px -16px, -16px 0px;
          opacity: 0.7;
        }

        .brushedMetalGrain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          background: repeating-linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.015) 0px,
            rgba(0, 0, 0, 0.04) 2px,
            rgba(255, 255, 255, 0.02) 4px
          );
        }

        .chromePerimeterFrame {
          position: fixed;
          inset: 8px;
          pointer-events: none;
          z-index: 2;
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: inset 0 0 45px rgba(0, 0, 0, 0.85);
        }

        .industrialFog {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 2;
          background: 
            radial-gradient(ellipse at 50% 20%, rgba(0, 229, 255, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse at 50% 85%, rgba(255, 119, 0, 0.06) 0%, transparent 60%);
        }

        /* ── BACKGROUND MECHANICAL ASSETS ── */
        /* 1. Twin-Cylinder Engine Cutaway (Left) */
        .bgTwinEngineCutaway {
          position: fixed;
          left: 10px;
          bottom: 35px;
          width: 175px;
          height: 235px;
          pointer-events: none;
          z-index: 2;
          opacity: 0.55;
          filter: drop-shadow(0 0 20px rgba(0, 229, 255, 0.25));
          transition: opacity 0.3s ease, transform 0.2s ease;
          will-change: transform;
          transform: translateZ(0);
        }
        .piston1Reciprocate {
          animation: pistonCycleKinematics 0.8s cubic-bezier(0.42, 0, 0.58, 1) infinite;
          will-change: transform;
          transform: translateZ(0);
        }
        .piston2Reciprocate {
          animation: pistonCycleKinematics 0.8s cubic-bezier(0.42, 0, 0.58, 1) infinite;
          animation-delay: -0.6s; /* 270° crossplane crank phasing */
          will-change: transform;
          transform: translateZ(0);
        }
        @keyframes pistonCycleKinematics {
          0% { transform: translate3d(0, 0px, 0); }
          50% { transform: translate3d(0, 42px, 0); }
          100% { transform: translate3d(0, 0px, 0); }
        }
        .crankshaftAssembly {
          transform-origin: 120px 235px;
          animation: crankSpin 0.8s linear infinite;
          will-change: transform;
          transform: translateZ(0);
        }
        @keyframes crankSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .sparkPlugFlash {
          animation: sparkPulse 0.45s infinite alternate;
        }
        @keyframes sparkPulse {
          from { fill: #FF4400; opacity: 0.3; }
          to { fill: #00E5FF; opacity: 1; filter: drop-shadow(0 0 6px #00E5FF); }
        }

        /* Cranking Phase: Fast starter spin */
        .engineCranking .piston1Reciprocate {
          animation-duration: 0.34s;
        }
        .engineCranking .piston2Reciprocate {
          animation-duration: 0.34s;
          animation-delay: -0.255s;
        }
        .engineCranking .crankshaftAssembly {
          animation-duration: 0.34s;
        }

        /* 10,000 RPM Max Redline: Blazing speed & vibration */
        .engineRedline {
          opacity: 0.9 !important;
          filter: drop-shadow(0 0 25px rgba(255, 60, 0, 0.75)) !important;
          animation: engineBlockVibe 0.08s infinite alternate;
        }
        .engineRedline .piston1Reciprocate {
          animation-duration: 0.11s;
        }
        .engineRedline .piston2Reciprocate {
          animation-duration: 0.11s;
          animation-delay: -0.082s;
        }
        .engineRedline .crankshaftAssembly {
          animation-duration: 0.11s;
        }
        @keyframes engineBlockVibe {
          0% { transform: translate3d(-1px, 1px, 0); }
          100% { transform: translate3d(1px, -1px, 0); }
        }

        /* 2. Industrial 6-Axis Robot Arm (Right) */
        .bgRobotArmAssembly {
          position: fixed;
          right: 10px;
          bottom: 25px;
          width: 185px;
          height: 280px;
          pointer-events: none;
          z-index: 2;
          opacity: 0.55;
          filter: drop-shadow(0 0 20px rgba(0, 229, 255, 0.25));
          will-change: transform;
          transform: translateZ(0);
        }
        .robotArmBoom {
          transform-origin: 110px 280px;
          animation: robotArmSwing 7s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate;
          will-change: transform;
          transform: translateZ(0);
        }
        @keyframes robotArmSwing {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(-18deg); }
          100% { transform: rotate(12deg); }
        }
        .robotForearm {
          transform-origin: 110px 150px;
          animation: robotForearmBend 4.5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate;
          will-change: transform;
          transform: translateZ(0);
        }
        @keyframes robotForearmBend {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(28deg); }
        }
        .weldingArcFlare {
          animation: arcFlash 0.15s infinite alternate;
        }
        @keyframes arcFlash {
          from { opacity: 0.3; transform: scale(0.6); }
          to { opacity: 1; transform: scale(1.6); filter: drop-shadow(0 0 12px #00E5FF); }
        }
        .weldingSparkFountain {
          position: absolute;
          top: 30px;
          right: 80px;
          width: 10px;
          height: 10px;
          pointer-events: none;
        }
        .weldingSpark {
          position: absolute;
          border-radius: 50%;
          background: #FFFFFF;
          box-shadow: 0 0 6px #00E5FF, 0 0 12px #FFD700;
          opacity: 0;
          animation: weldSparkDrop linear infinite;
        }
        @keyframes weldSparkDrop {
          0% { transform: translate3d(0, 0, 0) scale(1); opacity: 1; }
          100% { transform: translate3d(var(--dx), var(--dy), 0) scale(0); opacity: 0; }
        }

        /* 3. Autonomous Patrol Drone (Top Area) */
        .bgPatrolDrone {
          position: fixed;
          left: 20%;
          top: 75px;
          width: 150px;
          height: 120px;
          pointer-events: none;
          z-index: 2;
          opacity: 0.65;
          animation: dronePatrolFlight 18s cubic-bezier(0.42, 0, 0.58, 1) infinite alternate;
          will-change: transform;
          transform: translateZ(0);
        }
        @keyframes dronePatrolFlight {
          0% { transform: translate3d(0, 0, 0) rotate(0deg); }
          25% { transform: translate3d(90px, 15px, 0) rotate(4deg); }
          65% { transform: translate3d(220px, -8px, 0) rotate(-3.5deg); }
          100% { transform: translate3d(320px, 22px, 0) rotate(2.5deg); }
        }
        .rotorBlades {
          animation: rotorSpin 0.08s linear infinite;
        }
        @keyframes rotorSpin {
          from { transform: scaleX(1); }
          to { transform: scaleX(-1); }
        }
        .droneScanBeam {
          animation: beamSweep 3.2s ease-in-out infinite alternate;
        }
        @keyframes beamSweep {
          0% { opacity: 0.25; transform: skewX(-7deg); }
          100% { opacity: 0.65; transform: skewX(9deg); }
        }
        .droneSensorEye {
          animation: sensorBlink 1.2s infinite alternate;
        }
        @keyframes sensorBlink {
          from { fill: #00E5FF; }
          to { fill: #FF0055; filter: drop-shadow(0 0 8px #FF0055); }
        }
        .navStrobePort {
          animation: navFlashRed 0.8s infinite alternate;
        }
        @keyframes navFlashRed {
          0% { opacity: 0.2; }
          100% { opacity: 1; filter: drop-shadow(0 0 6px #FF0044); }
        }
        .navStrobeStarboard {
          animation: navFlashGreen 0.8s infinite alternate 0.4s;
        }
        @keyframes navFlashGreen {
          0% { opacity: 0.2; }
          100% { opacity: 1; filter: drop-shadow(0 0 6px #00FF66); }
        }

        /* 4. Ambient Turbocharger (Lower Left) */
        .bgTurbochargerAssembly {
          position: fixed;
          left: 195px;
          bottom: 25px;
          width: 95px;
          height: 95px;
          pointer-events: none;
          z-index: 2;
          opacity: 0.4;
          filter: drop-shadow(0 0 14px rgba(0, 229, 255, 0.2));
        }
        .turboImpellerSpinning {
          transform-origin: 70px 70px;
          animation: turboSpin 0.3s linear infinite;
        }
        @keyframes turboSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* 5. Ambient Brembo Disc Brake (Lower Right) */
        .bgBremboBrakeAssembly {
          position: fixed;
          right: 205px;
          bottom: 25px;
          width: 95px;
          height: 95px;
          pointer-events: none;
          z-index: 2;
          opacity: 0.4;
          filter: drop-shadow(0 0 14px rgba(255, 40, 0, 0.2));
        }

        .ambientParticles {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 3;
        }
        .ambientParticle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #00E5FF;
          border-radius: 50%;
          box-shadow: 0 0 6px #00E5FF;
          opacity: 0;
          animation: ambientFloat linear infinite;
        }
        @keyframes ambientFloat {
          0% { transform: translateY(0); opacity: 0; }
          25% { opacity: 0.8; }
          75% { opacity: 0.4; }
          100% { transform: translateY(-160px); opacity: 0; }
        }

        /* ── TOP UTILITY BAR ── */
        .topUtilityBar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          backdrop-filter: blur(12px);
          background: rgba(8, 14, 24, 0.85);
          border-bottom: 2px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
        }

        .deptBadge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Orbitron', sans-serif;
          font-size: 12px;
          letter-spacing: 2px;
          color: #00E5FF;
        }
        .badgeIcon {
          animation: spinSmall 10s linear infinite;
        }
        @keyframes spinSmall {
          to { transform: rotate(360deg); }
        }

        .chromeAudioBtn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 20px;
          font-family: 'Orbitron', sans-serif;
          font-size: 11px;
          letter-spacing: 1.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          background: linear-gradient(180deg, #243548 0%, #101B27 100%);
          color: #CFE0F0;
          border: 1px solid rgba(255, 255, 255, 0.35);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.5);
        }
        .chromeAudioBtn:hover {
          border-color: #00E5FF;
          box-shadow: 0 0 14px rgba(0, 229, 255, 0.6);
          transform: translateY(-1px);
        }
        .audioOn {
          color: #00E5FF;
          border-color: rgba(0, 229, 255, 0.8);
          box-shadow: 0 0 14px rgba(0, 229, 255, 0.5);
        }

        /* ── CHROME TYPOGRAPHY UTILITIES ── */
        .chromeHeading {
          font-family: 'Orbitron', sans-serif;
          font-weight: 800;
          letter-spacing: 2px;
          background: linear-gradient(
            180deg,
            #FFFFFF 0%,
            #E0ECF6 22%,
            #94A8BC 46%,
            #32404E 50%,
            #1D2732 54%,
            #7A92A6 72%,
            #D4E2EE 90%,
            #FFFFFF 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.9));
        }
        .chromeLarge {
          font-size: clamp(24px, 4.5vw, 42px);
          line-height: 1.15;
          text-align: center;
        }

        .chromeShimmer {
          background: linear-gradient(
            90deg,
            #8EA6BC 0%,
            #FFFFFF 25%,
            #00E5FF 50%,
            #FFFFFF 75%,
            #8EA6BC 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: chromeShimmerMove 4s linear infinite;
        }
        @keyframes chromeShimmerMove {
          to { background-position: 200% center; }
        }

        .lightSweep {
          position: relative;
          overflow: hidden;
        }

        /* ── STAGE CONTAINERS ── */
        .stageSection {
          position: relative;
          z-index: 10;
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 85px 20px 45px;
        }

        /* ══════════════════════════════════════════════════════════════
           STAGE 1: GEARS & YES/NO QUESTION
        ══════════════════════════════════════════════════════════════ */
        .stageGearsHeader {
          text-align: center;
          margin-bottom: 20px;
        }
        .subHeadingTag {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(14px, 3.2vw, 20px);
          font-weight: 700;
          letter-spacing: clamp(3px, 1vw, 6px);
          color: #00E5FF;
          margin: 0 0 10px;
          text-shadow: 0 0 14px rgba(0, 229, 255, 0.6);
        }
        .statusReadout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          letter-spacing: 2px;
          color: #8BA0B4;
          margin-top: 10px;
        }
        .liveDot {
          width: 8px;
          height: 8px;
          background: #00E5FF;
          border-radius: 50%;
          box-shadow: 0 0 10px #00E5FF;
          animation: pulseDot 1s ease-in-out infinite alternate;
        }
        @keyframes pulseDot {
          from { opacity: 0.4; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1.3); }
        }

        .gearTrainContainer {
          position: relative;
          width: 100%;
          max-width: 560px;
          height: 340px;
          margin: 5px auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gearNode {
          position: absolute;
          will-change: transform;
          transform: translateZ(0);
        }
        .gearNode1 {
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) translateZ(0);
          z-index: 5;
        }
        .gearNode2 {
          left: 65%;
          top: 26%;
          z-index: 4;
        }
        .gearNode3 {
          left: 12%;
          top: 16%;
          z-index: 4;
        }

        .chromeGearWrapper {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        @keyframes gearRotateCW {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes gearRotateCCW {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        /* Sparks at Meshing Points */
        .gearMeshPoint {
          position: absolute;
          z-index: 10;
          pointer-events: none;
        }
        .meshPoint1 {
          left: 69%;
          top: 46%;
        }
        .meshPoint2 {
          left: 36%;
          top: 35%;
        }

        .frictionHotspot {
          position: absolute;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, #FFFFFF 0%, #FFD700 40%, #FF5500 70%, transparent 100%);
          box-shadow: 0 0 20px #FFAA00, 0 0 35px #FF5500;
          animation: frictionPulse 0.15s infinite alternate;
          will-change: transform;
        }
        @keyframes frictionPulse {
          from { transform: translate(-50%, -50%) scale(0.8); opacity: 0.7; }
          to { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
        }

        .meshSpark {
          position: absolute;
          border-radius: 50%;
          background: var(--sparkColor);
          box-shadow: 0 0 6px var(--sparkColor), 0 0 12px #FF5500;
          opacity: 0;
          animation: sparkFly linear infinite;
          will-change: transform, opacity;
          transform: translateZ(0);
        }
        @keyframes sparkFly {
          0% {
            transform: translate3d(0, 0, 0) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translate3d(var(--dx), var(--dy), 0) scale(0);
            opacity: 0;
          }
        }

        /* Question Armor Card */
        .questionCardArmor {
          position: relative;
          max-width: 520px;
          width: 100%;
          border-radius: 16px;
          padding: 3px;
          background: linear-gradient(
            135deg,
            #FFFFFF 0%,
            #8FA3B5 30%,
            #1A2532 50%,
            #B0C4D6 70%,
            #FFFFFF 100%
          );
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 229, 255, 0.2);
        }

        .qArmorCornerTL, .qArmorCornerTR, .qArmorCornerBL, .qArmorCornerBR {
          position: absolute;
          width: 12px;
          height: 12px;
          background: #FFFFFF;
          border-radius: 2px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
          z-index: 5;
        }
        .qArmorCornerTL { top: 8px; left: 8px; }
        .qArmorCornerTR { top: 8px; right: 8px; }
        .qArmorCornerBL { bottom: 8px; left: 8px; }
        .qArmorCornerBR { bottom: 8px; right: 8px; }

        .questionInner {
          background: linear-gradient(180deg, #14202E 0%, #0A111A 100%);
          border-radius: 14px;
          padding: 28px 24px 24px;
          text-align: center;
        }
        .qCardSub {
          font-family: 'Orbitron', sans-serif;
          font-size: 11px;
          letter-spacing: 4px;
          color: #00E5FF;
          margin: 0 0 8px;
        }
        .qCardTitle {
          font-size: clamp(20px, 4vw, 28px);
          line-height: 1.25;
          margin-bottom: 22px;
        }

        .qActionButtons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          min-height: 60px;
          position: relative;
        }

        .chromeYesBtn {
          position: relative;
          padding: 14px 34px;
          border-radius: 10px;
          background: linear-gradient(180deg, #00E5FF 0%, #0088AA 100%);
          border: 1px solid #FFFFFF;
          color: #050B12;
          font-family: 'Orbitron', sans-serif;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 2px;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(0, 229, 255, 0.6), 0 4px 15px rgba(0, 0, 0, 0.8);
          transition: all 0.2s ease;
        }
        .chromeYesBtn:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 0 30px rgba(0, 229, 255, 0.8), 0 6px 20px rgba(0, 0, 0, 0.9);
        }

        .chromeNoBtn {
          padding: 12px 28px;
          border-radius: 8px;
          background: rgba(22, 34, 48, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #8BA2B6;
          font-family: 'Orbitron', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 2px;
          cursor: pointer;
          transition: transform 0.15s cubic-bezier(0.2, 0.9, 0.3, 1.2);
        }

        .noAttemptWarning {
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          letter-spacing: 1.5px;
          color: #FF7700;
          margin-top: 14px;
        }

        /* ══════════════════════════════════════════════════════════════
           STAGE 2: ENGINE IGNITION (10,000 RPM TACHOMETER & VOLUMETRIC SMOKE)
        ══════════════════════════════════════════════════════════════ */
        .stageEngine {
          overflow: hidden;
        }

        /* REALISTIC VOLUMETRIC EXHAUST SMOKE & TAILPIPES */
        .smokeVessel {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 25;
          overflow: hidden;
        }

        /* Dual Chrome Exhaust Tailpipe Outlets */
        .exhaustTailpipe {
          position: absolute;
          bottom: 12px;
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: #03060A;
          border: 4px solid #A2B6C8;
          box-shadow: 0 0 20px rgba(0,0,0,0.9), inset 0 0 15px rgba(255, 80, 0, 0.7);
        }
        .pipeLeft { left: 16%; }
        .pipeRight { right: 16%; }
        .pipeCoreGlow {
          position: absolute;
          inset: 6px;
          border-radius: 50%;
          background: radial-gradient(circle, #FFAA00 0%, #FF3300 60%, transparent 100%);
          box-shadow: 0 0 25px #FF5500;
          animation: pipePulse 0.2s infinite alternate;
        }
        @keyframes pipePulse {
          from { opacity: 0.7; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1.15); }
        }

        .billowSmoke {
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          filter: url(#realisticTurbulentSmoke) blur(14px);
          opacity: 0;
          animation: smokeVolumetricErupt ease-out forwards;
        }
        .smokePearl {
          background: radial-gradient(
            circle at 40% 40%,
            rgba(255, 255, 255, 0.96) 0%,
            rgba(205, 222, 238, 0.85) 35%,
            rgba(125, 145, 165, 0.5) 65%,
            rgba(40, 52, 65, 0.2) 85%,
            transparent 100%
          );
        }
        .smokeCharcoal {
          background: radial-gradient(
            circle at 40% 40%,
            rgba(165, 182, 198, 0.85) 0%,
            rgba(85, 102, 118, 0.7) 40%,
            rgba(35, 46, 58, 0.45) 70%,
            transparent 100%
          );
        }

        @keyframes smokeVolumetricErupt {
          0% {
            transform: translate(0, 0) scale(0.2) rotate(0deg);
            opacity: 0.98;
          }
          30% {
            opacity: 0.92;
          }
          70% {
            opacity: 0.65;
          }
          100% {
            transform: translate(var(--xDrift), -480px) scale(var(--targetScale)) rotate(180deg);
            opacity: 0;
          }
        }

        .rollingFloorFog {
          position: absolute;
          bottom: 0;
          left: -10%;
          right: -10%;
          height: 160px;
          background: radial-gradient(
            ellipse at 50% 100%,
            rgba(225, 238, 250, 0.55) 0%,
            rgba(165, 185, 205, 0.35) 45%,
            transparent 80%
          );
          filter: blur(25px);
          animation: fogRoll 2.5s ease-out infinite alternate;
        }
        @keyframes fogRoll {
          from { transform: translateY(0) scaleY(0.9); }
          to { transform: translateY(-20px) scaleY(1.2); }
        }

        .exhaustFlameBurst {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 380px;
          background: radial-gradient(
            ellipse at 50% 100%,
            rgba(255, 140, 0, 0.85) 0%,
            rgba(255, 60, 0, 0.5) 40%,
            rgba(0, 229, 255, 0.2) 65%,
            transparent 85%
          );
          animation: flamePulse 2.4s ease-out forwards;
          pointer-events: none;
        }
        @keyframes flamePulse {
          0% { opacity: 0; transform: scale(0.7); }
          15% { opacity: 1; transform: scale(1.25); }
          55% { opacity: 0.7; }
          100% { opacity: 0; transform: scale(1.4); }
        }

        /* Heavy Blast Doors Rig */
        .blastDoorRig {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 15;
          display: flex;
        }
        .heavyDoor {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 50%;
          background: linear-gradient(90deg, #101824 0%, #172232 50%, #0F1622 100%);
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(0, 0, 0, 0.9);
          transition: transform 1.2s cubic-bezier(0.77, 0, 0.175, 1);
        }
        .heavyDoorLeft {
          left: 0;
          border-right: 3px solid #00E5FF;
          transform: translateX(0);
        }
        .heavyDoorRight {
          right: 0;
          border-left: 3px solid #00E5FF;
          transform: translateX(0);
        }
        .doorsOpen .heavyDoorLeft {
          transform: translateX(-102%);
        }
        .doorsOpen .heavyDoorRight {
          transform: translateX(102%);
        }

        .doorSeamGlow {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 4px;
          transform: translateX(-50%);
          background: #00E5FF;
          box-shadow: 0 0 25px #00E5FF, 0 0 60px #00E5FF;
          opacity: 0.8;
        }
        .doorsOpen .doorSeamGlow {
          opacity: 1;
          width: 14px;
          box-shadow: 0 0 70px #00E5FF, 0 0 140px #00E5FF;
        }

        /* Ignition Console */
        .ignitionConsole {
          position: relative;
          z-index: 20;
          max-width: 560px;
          width: 100%;
          text-align: center;
          padding: 35px 25px;
          border-radius: 20px;
          background: linear-gradient(180deg, rgba(16, 26, 38, 0.96) 0%, rgba(8, 14, 22, 0.98) 100%);
          border: 2px solid rgba(255, 255, 255, 0.32);
          box-shadow: 
            0 0 40px rgba(0, 0, 0, 0.92),
            0 0 30px rgba(0, 229, 255, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.45);
        }
        .consoleEngaged {
          animation: consoleShake 0.25s infinite;
        }
        @keyframes consoleShake {
          0% { transform: translate(0, 0); }
          25% { transform: translate(2px, -2px); }
          50% { transform: translate(-2px, 1px); }
          75% { transform: translate(1px, -1px); }
          100% { transform: translate(0, 0); }
        }

        .consoleStatusBadge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 14px;
          background: rgba(255, 60, 0, 0.2);
          border: 1px solid rgba(255, 90, 0, 0.6);
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 2px;
          color: #FFAA00;
          margin-bottom: 14px;
        }
        .pulseRed {
          width: 8px;
          height: 8px;
          background: #FF3B00;
          border-radius: 50%;
          box-shadow: 0 0 10px #FF3B00;
          animation: redPulse 0.8s infinite alternate;
        }
        @keyframes redPulse {
          from { opacity: 0.5; }
          to { opacity: 1; transform: scale(1.2); }
        }

        /* ── 10,000 RPM RACING TACHOMETER DASHBOARD ── */
        .racingCluster {
          background: #050B12;
          border: 2px solid rgba(255, 255, 255, 0.18);
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 22px;
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.9), 0 0 15px rgba(0, 229, 255, 0.15);
        }

        /* 16-Segment F1 Shift Light Bar */
        .shiftLightArray {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4px;
          padding: 4px 6px;
          background: #08101A;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 12px;
        }
        .shiftLed {
          flex: 1;
          height: 9px;
          border-radius: 2px;
          background: #141F2B;
          transition: all 0.1s ease;
        }
        .ledGreen.lit {
          background: #00FF66 !important;
          box-shadow: 0 0 8px #00FF66, 0 0 14px #00FF66;
        }
        .ledAmber.lit {
          background: #FFB300 !important;
          box-shadow: 0 0 8px #FFB300, 0 0 14px #FFB300;
        }
        .ledRed.lit {
          background: #FF2200 !important;
          box-shadow: 0 0 10px #FF2200, 0 0 18px #FF2200;
        }
        .flashingRedline {
          background: #FF0055 !important;
          box-shadow: 0 0 14px #FF0055, 0 0 25px #FF0055 !important;
          animation: redlineStrobe 0.12s infinite alternate;
        }
        @keyframes redlineStrobe {
          from { filter: brightness(0.9); transform: scaleY(0.9); }
          to { filter: brightness(1.6); transform: scaleY(1.3); }
        }

        .digitalRpmDisplay {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .rpmMainNumber {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }
        .rpmDigits {
          font-family: 'Share Tech Mono', monospace;
          font-size: clamp(28px, 6vw, 42px);
          font-weight: 700;
          color: #00E5FF;
          letter-spacing: 2px;
          text-shadow: 0 0 15px rgba(0, 229, 255, 0.6);
        }
        .rpmUnit {
          font-family: 'Orbitron', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #8BA2B6;
        }
        .clusterTelemetry {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 1.5px;
          color: #FFAA00;
        }

        .rpmRedlineActive {
          color: #FF0033 !important;
          text-shadow: 0 0 20px #FF0000, 0 0 35px #FF3300 !important;
          animation: redlineShake 0.15s infinite alternate;
        }
        @keyframes redlineShake {
          from { transform: scale(1); }
          to { transform: scale(1.05); }
        }

        .rpmScaleTicks {
          display: flex;
          justify-content: space-between;
          font-family: 'Orbitron', sans-serif;
          font-size: 10px;
          color: #6C8296;
          margin-bottom: 4px;
          padding: 0 2px;
        }
        .scaleRedline {
          color: #FF3B00;
          font-weight: 700;
        }

        .rpmTachometer {
          width: 100%;
          height: 10px;
          border-radius: 5px;
          background: #091018;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.8);
        }
        .rpmBarFill {
          height: 100%;
          background: linear-gradient(90deg, #00E5FF 0%, #FFCC00 65%, #FF2200 85%, #FF0000 100%);
          transition: width 0.15s cubic-bezier(0.1, 0.9, 0.2, 1);
          box-shadow: 0 0 12px #FF5500;
        }
        .rpmBarMax {
          box-shadow: 0 0 20px #FF0000, 0 0 35px #FF5500 !important;
          animation: barFlash 0.12s infinite alternate;
        }
        @keyframes barFlash {
          from { filter: brightness(1); }
          to { filter: brightness(1.5); }
        }

        .consoleTitle {
          font-size: clamp(20px, 3.8vw, 32px);
          margin-bottom: 6px;
        }
        .consoleSubtext {
          font-family: 'Share Tech Mono', monospace;
          font-size: 13px;
          letter-spacing: 2px;
          color: #7E96AC;
          margin-bottom: 25px;
        }

        /* ── SUPERCAR ENGINE START BUTTON ── */
        .engineStartHarness {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 10px 0 15px;
        }
        .knurledChromeRing {
          position: relative;
          width: 175px;
          height: 175px;
          border-radius: 50%;
          background: 
            radial-gradient(circle, #253342 0%, #0E1722 65%, #050A10 100%),
            repeating-conic-gradient(from 0deg, #FFFFFF 0deg 2deg, #6C8296 2deg 4deg, #1B2633 4deg 6deg);
          border: 4px solid #FFFFFF;
          box-shadow: 
            0 0 35px rgba(0, 0, 0, 0.9),
            0 0 25px rgba(255, 60, 0, 0.4),
            inset 0 0 20px rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hexBolt {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #CCD8E4;
          border-radius: 2px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
        }
        .b1 { top: 6px; left: 50%; transform: translateX(-50%); }
        .b2 { bottom: 6px; left: 50%; transform: translateX(-50%); }
        .b3 { left: 6px; top: 50%; transform: translateY(-50%); }
        .b4 { right: 6px; top: 50%; transform: translateY(-50%); }

        .ignitionHalo {
          width: 136px;
          height: 136px;
          border-radius: 50%;
          background: #000000;
          box-shadow: 0 0 18px rgba(255, 60, 0, 0.6), inset 0 0 14px rgba(255, 90, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .haloActive {
          box-shadow: 0 0 35px rgba(255, 90, 0, 0.9), 0 0 60px rgba(255, 40, 0, 0.7);
        }

        .engineStartButton {
          position: relative;
          width: 118px;
          height: 118px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          background: linear-gradient(145deg, #1E2B38, #0D1620);
          box-shadow: 
            0 8px 18px rgba(0, 0, 0, 0.9),
            0 0 18px rgba(255, 60, 0, 0.45),
            inset 0 2px 3px rgba(255, 255, 255, 0.4),
            inset 0 -3px 8px rgba(0, 0, 0, 0.8);
          transition: transform 0.12s ease, box-shadow 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .engineStartButton:hover {
          transform: scale(1.04);
          box-shadow: 
            0 10px 24px rgba(0, 0, 0, 0.9),
            0 0 25px rgba(255, 80, 0, 0.75),
            inset 0 2px 4px rgba(255, 255, 255, 0.6);
        }
        .engineStartButton:active,
        .pressedState {
          transform: scale(0.94) translateY(3px);
          box-shadow: 
            0 2px 8px rgba(0, 0, 0, 0.9),
            0 0 45px rgba(255, 100, 0, 1),
            inset 0 4px 10px rgba(0, 0, 0, 0.9);
        }

        .buttonSteelFace {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Orbitron', sans-serif;
          color: #FFFFFF;
          text-shadow: 0 0 10px rgba(255, 120, 0, 0.8);
        }
        .btnSubTop {
          font-size: 11px;
          letter-spacing: 3px;
          color: #A6BACD;
        }
        .btnMainText {
          font-size: 21px;
          font-weight: 900;
          letter-spacing: 3px;
          color: #FF5500;
          text-shadow: 0 0 12px #FF5500, 0 0 24px #FF2200;
        }
        .btnSubBottom {
          font-size: 10px;
          letter-spacing: 1.5px;
          color: #FFAA00;
        }

        .startHintText {
          font-family: 'Orbitron', sans-serif;
          font-size: 13px;
          letter-spacing: 2px;
          font-weight: 700;
          color: #FFAA00;
          margin-top: 14px;
          text-shadow: 0 0 8px rgba(255, 150, 0, 0.6);
        }

        /* ── MECHANICAL ENGINEERING QUOTATION PLAQUE (UNDER START BUTTON) ── */
        .engineQuotePlaque {
          position: relative;
          max-width: 540px;
          width: 94%;
          margin: 18px auto 6px;
          padding: 16px 24px 14px;
          border-radius: 8px;
          background: linear-gradient(145deg, rgba(16, 26, 38, 0.94) 0%, rgba(6, 12, 18, 0.97) 100%);
          border: 1px solid rgba(0, 229, 255, 0.4);
          box-shadow: 
            0 12px 32px rgba(0, 0, 0, 0.85),
            inset 0 1px 2px rgba(255, 255, 255, 0.35),
            0 0 20px rgba(0, 229, 255, 0.18);
          text-align: center;
          backdrop-filter: blur(10px);
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          animation: quotePlaqueGlow 4s ease-in-out infinite alternate;
        }
        @keyframes quotePlaqueGlow {
          0% {
            border-color: rgba(0, 229, 255, 0.35);
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.85), 0 0 16px rgba(0, 229, 255, 0.15);
          }
          100% {
            border-color: rgba(0, 229, 255, 0.7);
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.85), 0 0 26px rgba(0, 229, 255, 0.35);
          }
        }
        .engineQuotePlaque::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #00E5FF 50%, transparent 100%);
          box-shadow: 0 0 10px #00E5FF;
        }
        .quoteCornerBolt {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #A0B4C8;
          box-shadow: inset 0 1px 1px #FFFFFF, 0 1px 2px rgba(0, 0, 0, 0.9);
        }
        .qcb-tl { top: 6px; left: 8px; }
        .qcb-tr { top: 6px; right: 8px; }
        .qcb-bl { bottom: 6px; left: 8px; }
        .qcb-br { bottom: 6px; right: 8px; }

        .quoteEmblemRow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .quoteGearIcon {
          font-size: 13px;
          filter: drop-shadow(0 0 6px #00E5FF);
          animation: spinSmall 8s linear infinite;
        }
        .quoteBadgeText {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: 3px;
          font-weight: 700;
          color: #00E5FF;
          text-shadow: 0 0 8px rgba(0, 229, 255, 0.6);
        }
        .quoteStatement {
          margin: 0;
          font-family: 'Rajdhani', 'Orbitron', sans-serif;
          font-size: clamp(14px, 2.3vw, 17px);
          font-weight: 600;
          font-style: italic;
          letter-spacing: 0.8px;
          line-height: 1.45;
          color: #F0F6FC;
          text-shadow: 0 0 12px rgba(0, 229, 255, 0.45);
        }
        .quoteFooter {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 8px;
        }
        .quoteDividerLine {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.4), transparent);
        }
        .quoteAuthor {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 2px;
          font-weight: 700;
          color: #FFAA00;
          text-shadow: 0 0 8px rgba(255, 170, 0, 0.6);
          white-space: nowrap;
        }

        /* ══════════════════════════════════════════════════════════════
           STAGE 3: "WELCOME TO THE CLUB" (AFTER DOORS OPEN)
        ══════════════════════════════════════════════════════════════ */
        .stageWelcome {
          text-align: center;
        }
        .welcomeToTheClubBanner {
          position: relative;
          max-width: 580px;
          width: 94%;
          margin: 0 auto 25px;
          text-align: center;
          padding: 38px 26px 32px;
          border-radius: 20px;
          background: linear-gradient(180deg, rgba(16, 26, 38, 0.9) 0%, rgba(8, 14, 22, 0.96) 100%);
          border: 1.5px solid rgba(0, 229, 255, 0.35);
          box-shadow: 
            0 0 40px rgba(0, 0, 0, 0.92),
            0 0 30px rgba(0, 229, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        .voiceSoundWave {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 40px;
          margin-bottom: 16px;
        }
        .voiceSoundWave .bar {
          width: 3px;
          background: #00E5FF;
          border-radius: 2px;
          box-shadow: 0 0 10px #00E5FF;
          animation: waveJump 0.8s ease-in-out infinite alternate;
        }
        .b1 { height: 14px; animation-delay: 0.1s; }
        .b2 { height: 26px; animation-delay: 0.3s; }
        .b3 { height: 38px; animation-delay: 0.5s; }
        .b4 { height: 22px; animation-delay: 0.2s; }
        .b5 { height: 34px; animation-delay: 0.4s; }
        .b6 { height: 24px; animation-delay: 0.15s; }
        .b7 { height: 16px; animation-delay: 0.35s; }

        @keyframes waveJump {
          from { transform: scaleY(0.4); opacity: 0.5; }
          to { transform: scaleY(1.35); opacity: 1; }
        }

        .welcomeSupTitle {
          font-family: 'Orbitron', sans-serif;
          font-size: 20px;
          font-weight: 500;
          letter-spacing: 8px;
          color: #E2ECF6;
          margin: 0;
        }
        .welcomeClubTitle {
          font-size: clamp(28px, 6vw, 54px);
          letter-spacing: clamp(4px, 2vw, 12px);
          margin: 8px 0 0;
        }

        .welcomeParticleStream {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .welcomeSparkle {
          position: absolute;
          bottom: 0;
          width: 2px;
          height: 2px;
          background: #00E5FF;
          border-radius: 50%;
          box-shadow: 0 0 6px #00E5FF;
          animation: sparkleRise linear infinite;
        }
        @keyframes sparkleRise {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 0.9; }
          80% { opacity: 0.4; }
          100% { transform: translateY(-130px); opacity: 0; }
        }

        .welcomeNextWrap {
          margin-top: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ══════════════════════════════════════════════════════════════
           STAGE 4: THE INVITATION (COUNTDOWN FULLY REMOVED!)
        ══════════════════════════════════════════════════════════════ */
        .invitationHeader {
          text-align: center;
          margin-bottom: 25px;
        }
        .eventMasterTitle {
          font-size: clamp(32px, 6.5vw, 54px);
          margin: 0;
          line-height: 1.1;
        }
        .titleFreshers {
          color: #FFFFFF;
        }
        .titleParty {
          color: #00E5FF;
          text-shadow: 0 0 25px rgba(0, 229, 255, 0.7);
        }

        .yearMedallion {
          display: inline-block;
          margin-top: 8px;
          padding: 4px 18px;
          background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.15), transparent);
          border-top: 1px solid rgba(0, 229, 255, 0.4);
          border-bottom: 1px solid rgba(0, 229, 255, 0.4);
        }
        .yearText {
          font-family: 'Orbitron', sans-serif;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 8px;
          color: #FFFFFF;
        }
        .deptSubtitle {
          font-family: 'Share Tech Mono', monospace;
          font-size: 13px;
          letter-spacing: 3px;
          color: #8CA0B2;
          margin-top: 8px;
        }

        /* ── BRUSHED STEEL & CHROME INVITATION ARMOR PLATE ── */
        .invitationArmorPlate {
          position: relative;
          max-width: 650px;
          width: 100%;
          margin: 0 auto 30px;
          border-radius: 20px;
          padding: 3px;
          background: linear-gradient(
            135deg,
            #FFFFFF 0%,
            #8FA3B5 25%,
            #1A2532 50%,
            #B0C4D6 75%,
            #FFFFFF 100%
          );
          box-shadow: 
            0 0 45px rgba(0, 0, 0, 0.95),
            0 0 30px rgba(0, 229, 255, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }

        .armorHexRivet {
          position: absolute;
          width: 14px;
          height: 14px;
          background: linear-gradient(135deg, #FFFFFF, #6C8296);
          border-radius: 3px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.9);
          z-index: 5;
        }
        .rivetTL { top: 10px; left: 10px; }
        .rivetTR { top: 10px; right: 10px; }
        .rivetBL { bottom: 10px; left: 10px; }
        .rivetBR { bottom: 10px; right: 10px; }

        .armorPlateInner {
          background: linear-gradient(180deg, #101925 0%, #080D15 100%);
          border-radius: 18px;
          padding: 35px 25px 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .collegeLogoBezel {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: #FFFFFF;
          padding: 6px;
          box-shadow: 0 0 20px rgba(0, 229, 255, 0.4), 0 6px 16px rgba(0, 0, 0, 0.8);
          border: 3px solid #8FA3B5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }
        .collegeLogoImg {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .collegeLabelWrap {
          text-align: center;
        }
        .collegeHeading {
          font-family: 'Orbitron', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: #DDE7F0;
          margin: 0;
        }
        .deptTagline {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 2px;
          color: #00E5FF;
          margin: 4px 0 0;
        }

        .chromePlateDivider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), #00E5FF, rgba(255, 255, 255, 0.3), transparent);
          margin: 20px 0;
        }

        .eventBadgesGrid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 15px;
        }

        .chromeBadgeCard {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-radius: 12px;
          background: linear-gradient(180deg, #152230 0%, #0C1520 100%);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .chromeBadgeCard:hover {
          transform: translateY(-2px);
          border-color: #00E5FF;
        }

        .badgeIconBox { font-size: 24px; }
        .badgeContent { display: flex; flex-direction: column; }
        .badgeLabel {
          font-family: 'Orbitron', sans-serif;
          font-size: 10px;
          letter-spacing: 2px;
          color: #00E5FF;
        }
        .badgeValue {
          font-family: 'Rajdhani', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: 1px;
        }
        .badgeSub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: #7E94A8;
        }

        /* Mechanical Creed (Countdown REMOVED!) */
        .creedSection {
          text-align: center;
          margin: 10px 0 20px;
        }
        .creedLine1 {
          font-family: 'Orbitron', sans-serif;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 4px;
          color: #FFFFFF;
          margin: 0;
        }
        .creedLine2 {
          font-family: 'Orbitron', sans-serif;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 4px;
          color: #00E5FF;
          text-shadow: 0 0 15px rgba(0, 229, 255, 0.6);
          margin: 4px 0 12px;
        }
        .creedSubPill {
          display: inline-block;
          padding: 6px 18px;
          border-radius: 20px;
          background: rgba(0, 229, 255, 0.08);
          border: 1px solid rgba(0, 229, 255, 0.25);
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          letter-spacing: 2px;
          color: #DDE8F4;
        }

        /* Actions Bar */
        .armorActionsBar {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 10px;
        }
        @media (min-width: 600px) {
          .armorActionsBar {
            flex-direction: row;
          }
        }

        .plateBtn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 18px;
          border-radius: 10px;
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 1.5px;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.25);
          transition: all 0.2s ease;
        }

        .whatsappPlateBtn {
          background: linear-gradient(180deg, #1E8E3E 0%, #135A27 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 15px rgba(30, 142, 62, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        .whatsappPlateBtn:hover {
          background: linear-gradient(180deg, #24A84A 0%, #16682E 100%);
          box-shadow: 0 6px 20px rgba(30, 142, 62, 0.6);
          transform: translateY(-2px);
        }

        .calendarPlateBtn {
          background: linear-gradient(180deg, #E65100 0%, #9C3600 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 15px rgba(230, 81, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        .calendarPlateBtn:hover {
          background: linear-gradient(180deg, #FF6A00 0%, #B84000 100%);
          box-shadow: 0 6px 20px rgba(230, 81, 0, 0.6);
          transform: translateY(-2px);
        }

        .copyPlateBtn {
          background: linear-gradient(180deg, #1A2634 0%, #0E1620 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        .copyPlateBtn:hover {
          border-color: #00E5FF;
          box-shadow: 0 0 15px rgba(0, 229, 255, 0.35);
          transform: translateY(-2px);
        }

        .replaySection {
          margin-top: 25px;
        }
        .replayExperienceBtn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px dashed rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          padding: 8px 18px;
          color: #8EA4B8;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .replayExperienceBtn:hover {
          color: #00E5FF;
          border-color: #00E5FF;
          background: rgba(0, 229, 255, 0.08);
        }

        /* ── BUTTON STYLES FOR STAGE 3 ── */
        .chromeActionBtn {
          position: relative;
          padding: 2px;
          border-radius: 12px;
          background: linear-gradient(135deg, #FFFFFF 0%, #8FA4B8 40%, #202D3A 60%, #FFFFFF 100%);
          border: none;
          cursor: pointer;
          box-shadow: 0 0 25px rgba(0, 229, 255, 0.35), 0 8px 24px rgba(0, 0, 0, 0.7);
          transition: all 0.25s ease;
        }
        .chromeActionBtn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 0 35px rgba(0, 229, 255, 0.6), 0 12px 30px rgba(0, 0, 0, 0.85);
        }
        .btnInnerChrome {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 32px;
          background: linear-gradient(180deg, #162230 0%, #0A1018 100%);
          border-radius: 10px;
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 2px;
          color: #FFFFFF;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
        }
        .btnArrow {
          font-size: 18px;
          color: #00E5FF;
          transition: transform 0.2s ease;
        }
        .chromeActionBtn:hover .btnArrow {
          transform: translateX(5px);
        }

        /* ── HEARTILY WELCOME TO ALL INVITATION BANNER ── */
        .heartyWelcomeCard {
          position: relative;
          margin: 18px 0 24px;
          padding: 22px 20px 20px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(12, 19, 29, 0.95) 50%, rgba(0, 229, 255, 0.06) 100%);
          border-radius: 12px;
          border: 1.5px solid rgba(255, 255, 255, 0.3);
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.45),
            inset 0 -1px 0 rgba(0, 0, 0, 0.8),
            0 8px 30px rgba(0, 0, 0, 0.6),
            0 0 25px rgba(0, 229, 255, 0.15);
          text-align: center;
          overflow: hidden;
        }

        .heartyWelcomeAura {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle at 50% 30%, rgba(0, 229, 255, 0.18) 0%, transparent 70%);
        }

        .welcomeEmblemRow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .welcomeGearIcon {
          font-size: 15px;
          filter: drop-shadow(0 0 8px #00E5FF);
        }

        .spinSlow {
          animation: emblemSpin 10s linear infinite;
        }

        .spinSlowRev {
          animation: emblemSpin 10s linear infinite reverse;
        }

        @keyframes emblemSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .welcomeBadgeText {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 3px;
          color: #00E5FF;
          font-weight: 700;
          text-transform: uppercase;
        }

        .heartyWelcomeTitle {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(22px, 5.5vw, 36px);
          font-weight: 900;
          letter-spacing: clamp(2px, 0.8vw, 5px);
          margin: 0 0 10px 0;
          line-height: 1.15;
          text-transform: uppercase;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 229, 255, 0.4);
        }

        .heartyWelcomeSub {
          font-family: 'Rajdhani', sans-serif;
          font-size: clamp(13px, 2.5vw, 16px);
          font-weight: 600;
          color: #B5CBDD;
          letter-spacing: 2px;
          margin: 0 0 12px 0;
          text-transform: uppercase;
        }

        .welcomeDividerBar {
          position: relative;
          height: 1px;
          max-width: 280px;
          margin: 0 auto;
          background: linear-gradient(90deg, transparent 0%, rgba(0, 229, 255, 0.8) 50%, transparent 100%);
        }

        .welcomeDivDot {
          position: absolute;
          top: -2.5px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00E5FF;
          box-shadow: 0 0 10px #00E5FF;
        }



        /* ── WELCOME & INVITATION SMOKE EFFECT ── */
        .welcomeSmokeVessel,
        .invitationSmokeVessel {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 8;
          overflow: hidden;
          animation: welcomeSmokeBloom 0.4s ease-out forwards;
        }

        @keyframes welcomeSmokeBloom {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }

        .welcomeSmokeVessel .billowSmoke,
        .invitationSmokeVessel .billowSmoke {
          filter: url(#realisticTurbulentSmoke) drop-shadow(0 0 45px rgba(0, 0, 0, 0.9));
        }

        /* ── RESPONSIVE TWEAKS ── */
        @media (max-width: 600px) {
          .gearTrainContainer {
            transform: scale(0.85);
            margin: 0 auto 10px;
          }
          .heavyDoor {
            width: 50%;
          }
          .armorPlateInner {
            padding: 25px 15px 20px;
          }
          .bgTwinEngineCutaway,
          .bgRobotArmAssembly {
            opacity: 0.35;
            transform: scale(0.8);
          }
          .bgTurbochargerAssembly,
          .bgBremboBrakeAssembly {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
