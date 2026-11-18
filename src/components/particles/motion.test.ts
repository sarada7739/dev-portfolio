import { describe, expect, it } from "vitest";
import { type Particle, surfaceDistance, SECTORS, SLICES } from "./field";
import { OrbitMotion } from "./motion";

const front: Particle = {
  u: 0,
  v: 0,
  x: 0.8,
  y: 0.12,
  z: 0.24,
  nx: 1,
  ny: 0,
  nz: 0,
  cell: 0,
  color: "#fff",
  opacity: 1,
  radius: 1,
  glint: false,
};
const back: Particle = {
  ...front,
  v: Math.PI,
  z: -0.24,
  nx: -1,
  cell: SLICES / 2,
};
const opposite: Particle = {
  ...front,
  u: Math.PI,
  x: -0.8,
  nx: -1,
  cell: (SECTORS / 2) * SLICES,
};

describe("輪の表面と慣性", () => {
  it("同じ画面位置では手前の粒から波を起こす", () => {
    const m = new OrbitMotion([back, front]);
    m.camera.set([0, 0, -0.25, 0, 0, 0, 0.25, 0]);
    expect(m.pick(0, 0)).toBe(front);
  });

  it("角度の継ぎ目を越えて近い粒へ伝わる", () => {
    expect(
      surfaceDistance(front, { u: 2 * Math.PI - 0.01, v: 2 * Math.PI + 0.01 }),
    ).toBeLessThan(0.01);
  });

  it("波は奥の面と反対側へ順に届き、3次元座標を変える", () => {
    const m = new OrbitMotion([front, back, opposite]);
    const still = new OrbitMotion(m.points);
    m.pulse(front);
    m.step(0, 0, 0);
    still.step(0, 0, 0);
    expect(m.camera[3]).toBeCloseTo(1);
    expect(m.camera[7]).toBe(0);
    expect(m.camera[11]).toBe(0);
    let backArrival = 0,
      farArrival = 0,
      changesDepth = false;
    for (let i = 0; i < 120; i++) {
      m.step(1 / 60, 0, 0);
      still.step(1 / 60, 0, 0);
      if (!backArrival && m.camera[7] > 0.1) backArrival = m.time;
      if (!farArrival && m.camera[11] > 0.1) farArrival = m.time;
      if (Math.abs(m.camera[6] - still.camera[6]) > 0.001) changesDepth = true;
    }
    expect(backArrival).toBeGreaterThan(0.1);
    expect(farArrival).toBeGreaterThan(backArrival);
    expect(changesDepth).toBe(true);
    expect(m.camera).toEqual(still.camera);
  });

  it("つかんだ側が先に動き、リリース後の角度変化は減衰する", () => {
    const m = new OrbitMotion([front, opposite]),
      still = new OrbitMotion(m.points);
    m.grab(front);
    m.rotate(0.25, 0.1);
    m.step(0.04, 0, 0);
    still.step(0.04, 0, 0);
    expect(m.camera[2]).not.toBeCloseTo(still.camera[2], 3);
    expect(m.camera[6]).toBe(still.camera[6]);
    m.coast(2, 0);
    const start = m.yaw;
    m.step(0.05, 0, 0);
    const early = m.yaw - start;
    for (let i = 0; i < 40; i++) m.step(0.025, 0, 0);
    const later = m.yaw;
    m.step(0.05, 0, 0);
    expect(early).toBeGreaterThan(0.05);
    expect(m.yaw - later).toBeLessThan(early * 0.05);
    expect(m.yaw).toBeGreaterThan(later);
  });
});
