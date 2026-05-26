"use client";

import { useEffect, useRef, useCallback } from "react";
import { useGyro } from "./gyro-provider";

type Props = {
  children: React.ReactNode;
  rotateAmplitude?: number;
  scaleOnHover?: number;
  className?: string;
  glare?: boolean;
};

export default function TiltedCard({
  children,
  rotateAmplitude = 10,
  scaleOnHover = 1.03,
  className = "",
  glare = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ rx: 0, ry: 0, scale: 1, gx: 50, gy: 50 });
  const currentRef = useRef({ rx: 0, ry: 0, scale: 1, gx: 50, gy: 50 });
  const interactingRef = useRef(false);

  const { enabled: gyroEnabled } = useGyro();

  const animate = useCallback(() => {
    const t = targetRef.current;
    const c = currentRef.current;
    const ease = 0.12;
    c.rx += (t.rx - c.rx) * ease;
    c.ry += (t.ry - c.ry) * ease;
    c.scale += (t.scale - c.scale) * ease;
    c.gx += (t.gx - c.gx) * ease;
    c.gy += (t.gy - c.gy) * ease;

    if (innerRef.current) {
      innerRef.current.style.transform = `perspective(900px) rotateX(${c.rx.toFixed(2)}deg) rotateY(${c.ry.toFixed(2)}deg) scale(${c.scale.toFixed(3)})`;
    }
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${c.gx.toFixed(1)}% ${c.gy.toFixed(1)}%, rgba(255,255,255,0.35), rgba(255,255,255,0) 55%)`;
    }
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") return;
    if (!ref.current) return;
    interactingRef.current = true;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const cx = px - 0.5;
    const cy = py - 0.5;
    targetRef.current.rx = -cy * rotateAmplitude * 2;
    targetRef.current.ry = cx * rotateAmplitude * 2;
    targetRef.current.scale = scaleOnHover;
    targetRef.current.gx = px * 100;
    targetRef.current.gy = py * 100;
  }

  function handlePointerLeave() {
    interactingRef.current = false;
    if (!gyroEnabled) {
      targetRef.current.rx = 0;
      targetRef.current.ry = 0;
      targetRef.current.scale = 1;
      targetRef.current.gx = 50;
      targetRef.current.gy = 50;
    }
  }

  const handleOrientation = useCallback(
    (e: DeviceOrientationEvent) => {
      if (interactingRef.current) return;
      const beta = e.beta ?? 0;
      const gamma = e.gamma ?? 0;
      const clampedBeta = Math.max(-30, Math.min(30, beta - 30));
      const clampedGamma = Math.max(-30, Math.min(30, gamma));
      const rx = -(clampedBeta / 30) * rotateAmplitude;
      const ry = (clampedGamma / 30) * rotateAmplitude;
      targetRef.current.rx = rx;
      targetRef.current.ry = ry;
      targetRef.current.gx = 50 + (clampedGamma / 30) * 30;
      targetRef.current.gy = 50 + (clampedBeta / 30) * 30;
    },
    [rotateAmplitude]
  );

  useEffect(() => {
    if (!gyroEnabled || typeof window === "undefined") return;
    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, [gyroEnabled, handleOrientation]);

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative [perspective:900px] ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        ref={innerRef}
        className="relative will-change-transform"
        style={{ transformStyle: "preserve-3d", transition: "transform 80ms linear" }}
      >
        {children}
        {glare && (
          <div
            ref={glareRef}
            className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay"
            style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0), rgba(255,255,255,0))" }}
          />
        )}
      </div>
    </div>
  );
}
