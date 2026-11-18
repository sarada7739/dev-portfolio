"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { createField, type SurfacePoint } from "./field";
import { OrbitMotion } from "./motion";
import { createRenderer, type ParticleRenderer } from "./renderer";

export default function ParticleArtwork() {
  const surfaceRef = useRef<HTMLButtonElement>(null);
  const helpId = useId();
  const toggleRef = useRef<(() => void) | null>(null);
  const [available, setAvailable] = useState(false);
  const [paused, setPaused] = useState(false);
  const interactive = available && !paused;

  useEffect(() => {
    const element = surfaceRef.current;
    if (!element) return;
    const surface = element;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let orbit: OrbitMotion | undefined;
    let renderer: ParticleRenderer | null = null;
    let useGPU = true;
    let width = 1,
      height = 1;
    let inView = false;
    let stopped = false;
    let frame = 0;
    let last = 0;
    let press: {
      id: number;
      x: number;
      y: number;
      anchor: SurfacePoint;
      vx: number;
      vy: number;
      stamp: number;
    } | null = null;
    let dragged = false;
    let targetX = 0,
      targetY = 0,
      x = 0,
      y = 0;

    function render(dt: number) {
      orbit ??= new OrbitMotion(createField());
      if (!renderer) {
        renderer = createRenderer(orbit.points, useGPU);
        if (!renderer) return false;
        const canvas = renderer.canvas;
        canvas.width = width;
        canvas.height = height;
        canvas.setAttribute("aria-hidden", "true");
        canvas.addEventListener("webglcontextlost", lost);
        surface.append(canvas);
        setAvailable(true);
      }
      const smooth = -Math.expm1(-dt * 10);
      x += (targetX - x) * smooth;
      y += (targetY - y) * smooth;
      orbit.step(dt, x, y);
      renderer.draw(orbit.camera);
      if (!renderer.canvas.dataset.ready)
        renderer.canvas.dataset.ready = "true";
      return true;
    }

    function discard() {
      if (!renderer) return;
      renderer.canvas.removeEventListener("webglcontextlost", lost);
      renderer.canvas.remove();
      renderer.dispose();
      renderer = null;
    }

    function lost() {
      useGPU = false;
      discard();
      setAvailable(false);
      sync();
    }

    function tick(now: number) {
      const dt = last ? Math.min((now - last) / 1000, 0.06) : 0;
      last = now;
      if (render(dt)) frame = requestAnimationFrame(tick);
    }

    function sync() {
      cancelAnimationFrame(frame);
      last = 0;
      if (motion.matches || stopped || !inView || document.hidden) {
        release();
        center();
      }
      if (motion.matches) {
        setAvailable(false);
      } else if (inView && !document.hidden) {
        if (renderer) setAvailable(true);
        if (stopped) render(0);
        else frame = requestAnimationFrame(tick);
      }
    }

    function resize() {
      const rect = surface.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      width = Math.max(1, Math.round(rect.width * ratio));
      height = Math.max(1, Math.round(rect.height * ratio));
      if (
        renderer &&
        (width !== renderer.canvas.width || height !== renderer.canvas.height)
      ) {
        renderer.canvas.width = width;
        renderer.canvas.height = height;
      }
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
      if (surface.disabled || event.button !== 0 || !orbit) return;
      dragged = false;
      press = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        anchor: pickAt(event.clientX, event.clientY),
        vx: 0,
        vy: 0,
        stamp: event.timeStamp,
      };
      surface.setPointerCapture(event.pointerId);
    }

    function point(event: PointerEvent) {
      if (surface.disabled || !event.isPrimary) return;
      if (!orbit) return;
      const bounds = surface.getBoundingClientRect();
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
          orbit.grab(press.anchor);
          center();
        }
        const turnX = (dx / bounds.width) * Math.PI,
          turnY = (-dy / bounds.height) * Math.PI;
        const dt = Math.max(0.004, (event.timeStamp - press.stamp) / 1000);
        const mix = -Math.expm1(-dt / 0.042);
        press.vx += (turnX / dt - press.vx) * mix;
        press.vy += (turnY / dt - press.vy) * mix;
        orbit.rotate(turnX, turnY);
        press.x = event.clientX;
        press.y = event.clientY;
        press.stamp = event.timeStamp;
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
      else if (dragged && press) {
        const idle = Math.exp(-Math.max(0, event.timeStamp - press.stamp) / 65);
        orbit?.coast(press.vx * idle, press.vy * idle);
      }
      release();
    }

    function pickAt(clientX: number, clientY: number) {
      const bounds = surface.getBoundingClientRect();
      const scale = Math.min(bounds.width / 800, bounds.height / 640);
      return orbit!.pick(
        (clientX - bounds.left - bounds.width / 2) / scale,
        (clientY - bounds.top - bounds.height / 2) / scale,
      );
    }

    function pulse(event: MouseEvent) {
      if (surface.disabled || (event.detail !== 0 && dragged)) return;
      const bounds = surface.getBoundingClientRect();
      const px =
        event.detail === 0 ? bounds.left + bounds.width / 2 : event.clientX;
      const py =
        event.detail === 0 ? bounds.top + bounds.height / 2 : event.clientY;
      if (
        px < bounds.left ||
        px > bounds.right ||
        py < bounds.top ||
        py > bounds.bottom
      )
        return;
      orbit?.pulse(pickAt(px, py));
    }

    function turn(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || surface.disabled)
        return;
      switch (event.key) {
        case "ArrowLeft":
          orbit?.rotate(-0.2, 0);
          break;
        case "ArrowRight":
          orbit?.rotate(0.2, 0);
          break;
        case "ArrowUp":
          orbit?.rotate(0, 0.2);
          break;
        case "ArrowDown":
          orbit?.rotate(0, -0.2);
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
    observer.observe(surface);
    resizeObserver.observe(surface);
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
      discard();
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
      />
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
