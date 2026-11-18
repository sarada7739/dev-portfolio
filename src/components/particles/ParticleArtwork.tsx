"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { createField, drawField, RIPPLE_DURATION, type Ripple } from "./field";

export default function ParticleArtwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const surfaceRef = useRef<HTMLButtonElement>(null);
  const helpId = useId();
  const toggleRef = useRef<(() => void) | null>(null);
  const [available, setAvailable] = useState(false);
  const [paused, setPaused] = useState(false);
  const interactive = available && !paused;

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d", { alpha: false });
    const element = surfaceRef.current;
    if (!ctx || !element) return;
    const surface = element;
    const canvas = ctx.canvas;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let field: ReturnType<typeof createField> | undefined;
    let inView = false;
    let stopped = false;
    let frame = 0;
    let elapsed = 0;
    let last = 0;
    let yaw = 0;
    let pitch = 0;
    const ripples: Ripple[] = [];
    let press: {
      id: number;
      x: number;
      y: number;
      yaw: number;
      pitch: number;
    } | null = null;
    let dragged = false;
    let targetX = 0,
      targetY = 0,
      x = 0,
      y = 0;

    const render = () => {
      field ??= createField();
      while (
        ripples.length &&
        elapsed - ripples[0].startedAt >= RIPPLE_DURATION
      ) {
        ripples.shift();
      }
      drawField(ctx, field, elapsed, {
        yaw: yaw + 0.1 * x,
        pitch: pitch - 0.09 * y,
        ripples,
      });
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
      if (motion.matches || stopped || !inView || document.hidden) {
        release();
        center();
      }
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

    function release() {
      if (!press) return;
      const { id } = press;
      press = null;
      delete surface.dataset.dragging;
      if (surface.hasPointerCapture(id)) surface.releasePointerCapture(id);
    }

    function begin(event: PointerEvent) {
      if (!event.isPrimary) {
        dragged = true;
        release();
        return;
      }
      if (surface.disabled || event.button !== 0) return;
      dragged = false;
      press = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        yaw,
        pitch,
      };
      surface.setPointerCapture(event.pointerId);
    }

    function point(event: PointerEvent) {
      if (surface.disabled || !event.isPrimary) return;
      const bounds = canvas.getBoundingClientRect();
      if (press && event.pointerId === press.id) {
        const dx = event.clientX - press.x;
        const dy = event.clientY - press.y;
        if (!dragged) {
          if (Math.hypot(dx, dy) < 6) return;
          dragged = true;
          if (event.pointerType === "touch" && Math.abs(dy) > Math.abs(dx)) {
            release();
            return;
          }
          surface.dataset.dragging = "true";
          center();
        }
        yaw = press.yaw + (dx / bounds.width) * Math.PI;
        pitch = Math.max(
          -1,
          Math.min(1, press.pitch - (dy / bounds.height) * Math.PI),
        );
      } else if (
        event.pointerType === "mouse" &&
        finePointer.matches &&
        !event.buttons
      ) {
        targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      }
    }

    function end(event: PointerEvent) {
      if (event.pointerId !== press?.id) return;
      if (event.type !== "pointerup") dragged = true;
      release();
    }

    function pulse(event: MouseEvent) {
      if (surface.disabled || (event.detail !== 0 && dragged)) return;
      const bounds = canvas.getBoundingClientRect();
      const px =
        event.detail === 0 ? 0.5 : (event.clientX - bounds.left) / bounds.width;
      const py =
        event.detail === 0 ? 0.5 : (event.clientY - bounds.top) / bounds.height;
      if (px < 0 || px > 1 || py < 0 || py > 1) return;
      // 連打しても1フレームで計算する波の数を一定に保つ。
      if (ripples.length === 3) ripples.shift();
      ripples.push({ x: px, y: py, startedAt: elapsed });
    }

    function turn(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || surface.disabled)
        return;
      switch (event.key) {
        case "ArrowLeft":
          yaw -= 0.2;
          break;
        case "ArrowRight":
          yaw += 0.2;
          break;
        case "ArrowUp":
          pitch = Math.min(1, pitch + 0.2);
          break;
        case "ArrowDown":
          pitch = Math.max(-1, pitch - 0.2);
          break;
        default:
          return;
      }
      event.preventDefault();
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
    const listeners = new AbortController();
    const options = { signal: listeners.signal };
    surface.addEventListener("pointerdown", begin, options);
    surface.addEventListener("pointermove", point, options);
    surface.addEventListener("pointerup", end, options);
    surface.addEventListener("pointercancel", end, options);
    surface.addEventListener("lostpointercapture", end, options);
    surface.addEventListener("pointerleave", center, options);
    surface.addEventListener("click", pulse, options);
    surface.addEventListener("keydown", turn, options);
    return () => {
      toggleRef.current = null;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      listeners.abort();
      release();
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
      <button
        ref={surfaceRef}
        className="particle-surface"
        type="button"
        disabled={!interactive}
        aria-hidden={!interactive}
        aria-label="粒子の輪に波紋を広げる"
        aria-describedby={interactive ? helpId : undefined}
      >
        <canvas ref={canvasRef} aria-hidden="true" />
      </button>
      {interactive && (
        <span className="sr-only" id={helpId}>
          Enterまたはスペースキーで波紋を広げ、矢印キーで輪を回転できます。
        </span>
      )}
      {available && (
        <button
          type="button"
          className="motion-toggle"
          onClick={() => toggleRef.current?.()}
          aria-label={paused ? "粒子の動きを再開" : "粒子の動きを一時停止"}
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
