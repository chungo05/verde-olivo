"use client";

import { useEffect, useRef } from "react";

interface Props {
  active: boolean;
  onDone: () => void;
}

const COLORS = [
  "#006655", // verde brand
  "#D9ECC8", // verde claro brand
  "#19322F", // dark brand
  "#FFD700", // dorado
  "#FF6B6B", // coral
  "#4ECDC4", // teal
  "#45B7D1", // azul claro
  "#FFA07A", // salmon
  "#98D8C8", // menta
  "#F7DC6F", // amarillo
];

const DURATION = 3000; // ms

export default function ConfettiOverlay({ active, onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles
    const count = 140;
    const particles = Array.from({ length: count }, () => {
      const size = Math.random() * 8 + 4;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height * 0.5 - size,
        w: size,
        h: size * (Math.random() * 1.2 + 0.5),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 3 + 2,
        opacity: 1,
        isRect: Math.random() > 0.35, // mix of rects and diamonds
      };
    });

    startRef.current = null;

    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / DURATION, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        // Fade out in last 30%
        p.opacity = progress < 0.7 ? 1 : 1 - (progress - 0.7) / 0.3;

        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.isRect) {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          // Diamond shape
          ctx.beginPath();
          ctx.moveTo(0, -p.h / 2);
          ctx.lineTo(p.w / 2, 0);
          ctx.lineTo(0, p.h / 2);
          ctx.lineTo(-p.w / 2, 0);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onDone();
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [active, onDone]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}
