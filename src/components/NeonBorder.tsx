"use client";

import { useEffect, useRef } from "react";

interface NeonBorderProps {
  color?: string;
  rounded?: number;
  thickness?: number;
  borderSize?: number;
  glow?: number;
  movement?: "continuous" | "pulse" | "static";
  speed?: number;
}

export default function NeonBorder({
  color = "#FFD700",
  rounded = 20,
  thickness = 2,
  borderSize = 40,
  glow = 30,
  movement = "continuous",
  speed = 10,
}: NeonBorderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const progressRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const resizeObserver = new ResizeObserver(() => {
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    });

    resizeObserver.observe(parent);
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Parse hex color to rgb
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 255, g: 215, b: 0 };
    };

    const rgb = hexToRgb(color);

    const getPerimeter = (w: number, h: number, r: number) => {
      const straightX = w - 2 * r;
      const straightY = h - 2 * r;
      const corners = 2 * Math.PI * r;
      return 2 * straightX + 2 * straightY + corners;
    };

    // Get point on rounded rect border at t (0..1)
    const pointOnRoundedRect = (
      t: number,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) => {
      const perimeter = getPerimeter(w, h, r);
      let dist = ((t % 1) + 1) % 1 * perimeter;

      const segments = [
        { len: w - 2 * r, type: "line", x1: x + r,   y1: y,       dx: 1,  dy: 0  },
        { len: (Math.PI / 2) * r, type: "arc", cx: x + w - r, cy: y + r,     startAngle: -Math.PI / 2 },
        { len: h - 2 * r, type: "line", x1: x + w,   y1: y + r,   dx: 0,  dy: 1  },
        { len: (Math.PI / 2) * r, type: "arc", cx: x + w - r, cy: y + h - r, startAngle: 0            },
        { len: w - 2 * r, type: "line", x1: x + w - r, y1: y + h, dx: -1, dy: 0  },
        { len: (Math.PI / 2) * r, type: "arc", cx: x + r,     cy: y + h - r, startAngle: Math.PI / 2  },
        { len: h - 2 * r, type: "line", x1: x,       y1: y + h - r, dx: 0, dy: -1 },
        { len: (Math.PI / 2) * r, type: "arc", cx: x + r,     cy: y + r,     startAngle: Math.PI      },
      ] as const;

      for (const seg of segments) {
        if (dist <= seg.len) {
          if (seg.type === "line") {
            const frac = dist / seg.len;
            return {
              px: seg.x1 + frac * seg.dx * seg.len,
              py: seg.y1 + frac * seg.dy * seg.len,
            };
          } else {
            const angle = seg.startAngle + (dist / seg.len) * (Math.PI / 2);
            return {
              px: (seg as any).cx + r * Math.cos(angle),
              py: (seg as any).cy + r * Math.sin(angle),
            };
          }
        }
        dist -= seg.len;
      }
      return { px: x + r, py: y };
    };

    const draw = (timestamp: number) => {
      const w = canvas.width;
      const h = canvas.height;

      // === TIME-DELTA BASED MOVEMENT (smooth, no blinking) ===
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const delta = (timestamp - lastTimeRef.current) / 1000; // seconds
      lastTimeRef.current = timestamp;

      if (movement === "continuous") {
        // speed controls how many full laps per second (e.g. speed=10 → 0.1 lap/s → 10s per lap)
        progressRef.current = (progressRef.current + delta * (speed / 1000)) % 1;
      }

      ctx.clearRect(0, 0, w, h);

      const pad = thickness / 2;
      const rw = w - thickness;
      const rh = h - thickness;

      // ── 1. Base dim border ──
      ctx.beginPath();
      ctx.roundRect(pad, pad, rw, rh, rounded);
      ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.18)`;
      ctx.lineWidth = thickness;
      ctx.stroke();

      // ── 2. Comet trail ──
      // The trail length as a fraction of the perimeter
      const trailFraction = borderSize / 100;
      const TRAIL_STEPS = 120; // more steps = smoother trail

      // Build an array of points along the trail (from tail → head)
      const points: { px: number; py: number }[] = [];
      for (let i = 0; i <= TRAIL_STEPS; i++) {
        const frac = i / TRAIL_STEPS; // 0 = tail, 1 = head
        const t = ((progressRef.current - trailFraction * (1 - frac)) + 1) % 1;
        points.push(pointOnRoundedRect(t, pad, pad, rw, rh, rounded));
      }

      // Draw trail as gradient strokes (wide→thin, dim→bright)
      // Split into segments and draw each with decreasing opacity toward tail
      for (let i = 0; i < points.length - 1; i++) {
        const frac = i / (points.length - 1); // 0=tail, 1=head
        const alpha = frac * frac; // quadratic falloff → smooth comet fade
        const lineW = thickness * 0.8 + frac * thickness * 1.8;

        ctx.beginPath();
        ctx.moveTo(points[i].px, points[i].py);
        ctx.lineTo(points[i + 1].px, points[i + 1].py);
        ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha * 0.9})`;
        ctx.lineWidth = lineW;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      // ── 3. Bright head glow ──
      const head = points[points.length - 1];

      // Outer soft glow
      const outerGlow = ctx.createRadialGradient(
        head.px, head.py, 0,
        head.px, head.py, glow
      );
      outerGlow.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},0.55)`);
      outerGlow.addColorStop(0.4, `rgba(${rgb.r},${rgb.g},${rgb.b},0.18)`);
      outerGlow.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);

      ctx.beginPath();
      ctx.arc(head.px, head.py, glow, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      // Bright core dot
      const coreGlow = ctx.createRadialGradient(
        head.px, head.py, 0,
        head.px, head.py, glow * 0.35
      );
      coreGlow.addColorStop(0, `rgba(255,255,255,1)`);
      coreGlow.addColorStop(0.3, `rgba(${rgb.r},${rgb.g},${rgb.b},0.95)`);
      coreGlow.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);

      ctx.beginPath();
      ctx.arc(head.px, head.py, glow * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = coreGlow;
      ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      resizeObserver.disconnect();
      lastTimeRef.current = null;
    };
  }, [color, rounded, thickness, borderSize, glow, movement, speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
