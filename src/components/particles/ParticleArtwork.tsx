"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createField, drawField } from "./field";

export default function ParticleArtwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toggleRef = useRef<(() => void) | null>(null);
  const [available, setAvailable] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d", { alpha: false });
    if (!ctx) return;
    const canvas = ctx.canvas;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let field: ReturnType<typeof createField> | undefined;
    let inView = false;
    let stopped = false;
    let frame = 0;
    let elapsed = 0;
    let last = 0;
    let targetX = 0,
      targetY = 0,
      x = 0,
      y = 0;

    const render = () => {
      field ??= createField();
      drawField(ctx, field, elapsed, x, y);
      canvas.dataset.ready = "true";
    };

    function tick(now: number) {
      if (!last || now - last >= 1000 / 30) {
        if (last) elapsed += Math.min(now - last, 80) / 1000;
        last = now;
        x += (targetX - x) * 0.12;
        y += (targetY - y) * 0.12;
        render();
      }
      frame = requestAnimationFrame(tick);
    }

    function sync() {
      cancelAnimationFrame(frame);
      last = 0;
      if (motion.matches) {
        delete canvas.dataset.ready;
      } else if (inView && !document.hidden) {
        if (stopped) render();
        else frame = requestAnimationFrame(tick);
      }
      setAvailable(!motion.matches);
    }

    function resize() {
      const { width, height } = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      sync();
    }

    function point(event: PointerEvent) {
      if (!finePointer.matches || stopped || motion.matches) return;
      const bounds = canvas.getBoundingClientRect();
      targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    }

    function center() {
      targetX = 0;
      targetY = 0;
    }

    toggleRef.current = () => {
      stopped = !stopped;
      setPaused(stopped);
      sync();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    const resizeObserver = new ResizeObserver(resize);
    resize();
    observer.observe(canvas);
    resizeObserver.observe(canvas);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    canvas.addEventListener("pointermove", point);
    canvas.addEventListener("pointerleave", center);
    return () => {
      toggleRef.current = null;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      canvas.removeEventListener("pointermove", point);
      canvas.removeEventListener("pointerleave", center);
    };
  }, []);

  return (
    <div className="particle-art">
      <Image
        src="/images/particle-orbit.webp"
        alt=""
        width={1200}
        height={960}
        sizes="(min-width: 1440px) 790px, (min-width: 760px) 57vw, 100vw"
        loading="eager"
        fetchPriority="high"
        className="particle-poster"
      />
      <canvas ref={canvasRef} aria-hidden="true" />
      {available && (
        <button
          type="button"
          className="motion-toggle"
          onClick={() => toggleRef.current?.()}
          aria-label={paused ? "粒子の動きを再開" : "粒子の動きを一時停止"}
          title={paused ? "粒子の動きを再開" : "粒子の動きを一時停止"}
        >
          <span
            aria-hidden="true"
            className={paused ? "play-icon" : "pause-icon"}
          />
        </button>
      )}
    </div>
  );
}
