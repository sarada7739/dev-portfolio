import {
  CELL_COUNT,
  SECTORS,
  SLICES,
  surfaceDistance,
  type Particle,
  type SurfacePoint,
} from "./field";

const TAU = 2 * Math.PI;
const WAVE_SPEED = 1.55;
const WAVE_DURATION = 1.9;
const clamp = (x: number, limit: number) =>
  Math.max(-limit, Math.min(limit, x));

export class OrbitMotion {
  time = 0;
  yaw = 0;
  pitch = 0;
  private spinX = 0;
  private spinY = 0;
  private grabTime = -10;
  private readonly distances = new Float32Array(CELL_COUNT + 1);
  private readonly cellYaw = new Float64Array(CELL_COUNT + 1);
  private readonly cellPitch = new Float64Array(CELL_COUNT + 1);
  private readonly basis = new Float32Array((CELL_COUNT + 1) * 4);
  private waves: { start: number; distances: Float32Array }[] = [];
  // カメラ座標を次の入力まで保持し、表示中の手前の粒を選べるようにする。
  readonly camera: Float32Array;
  constructor(readonly points: Particle[]) {
    this.camera = new Float32Array(points.length * 4);
  }

  grab(anchor: SurfacePoint) {
    this.coast(0, 0);
    this.grabTime = this.time;
    for (let i = 0; i < CELL_COUNT; i++) {
      this.distances[i] = surfaceDistance(anchor, {
        u: (Math.floor(i / SLICES) * TAU) / SECTORS,
        v: ((i % SLICES) * TAU) / SLICES,
      });
    }
  }

  rotate(dx: number, dy: number) {
    this.yaw += dx;
    this.pitch = clamp(this.pitch + dy, 1.18);
  }

  coast(vx: number, vy: number) {
    this.spinX = clamp(vx, 5.2);
    this.spinY = clamp(vy, 3.4);
  }

  pulse(anchor: SurfacePoint) {
    if (this.waves.length >= 3) this.waves.shift();
    this.waves.push({
      start: this.time,
      distances: Float32Array.from(this.points, (p) =>
        p.cell === CELL_COUNT ? Infinity : surfaceDistance(p, anchor),
      ),
    });
  }

  pick(px: number, py: number) {
    let best = 0,
      bestScore = Infinity;
    for (let i = 0; i < this.points.length; i++) {
      if (this.points[i].cell === CELL_COUNT) continue;
      const j = i * 4,
        z = this.camera[j + 2];
      const scale = (322 * 3.8) / (3.8 - z);
      const dx = this.camera[j] * scale - px,
        dy = this.camera[j + 1] * scale - py;
      const distance = dx * dx + dy * dy;
      // 指先付近で輪が重なる場合は、奥行きの手前側を優先する。
      const score =
        distance <= 100 ? -1000 - z * 150 + distance * 0.1 : distance;
      if (score < bestScore) {
        bestScore = score;
        best = i;
      }
    }
    return this.points[best];
  }

  step(dt: number, hoverX: number, hoverY: number) {
    this.time += dt;
    const decay = Math.exp(-3.5 * dt);
    this.rotate(
      (this.spinX * (1 - decay)) / 3.5,
      (this.spinY * (1 - decay)) / 3.5,
    );
    this.spinX *= decay;
    this.spinY *= decay;
    const t = this.time;
    while (this.waves.length && t - this.waves[0].start >= WAVE_DURATION)
      this.waves.shift();
    const baseYaw = -0.1 + 0.46 * Math.sin(t * 0.19) + hoverX * 0.1;
    const basePitch = -0.48 + 0.12 * Math.sin(t * 0.16) - hoverY * 0.09;
    const roll = -0.31 + 0.065 * Math.sin(t * 0.13);
    const sr = Math.sin(roll),
      cr = Math.cos(roll);
    for (let i = 0; i <= CELL_COUNT; i++) {
      const distance = this.distances[i];
      const activeDt = Math.min(
        dt,
        Math.max(0, t - this.grabTime - distance * 0.09),
      );
      const follow = -Math.expm1(-activeDt / (0.024 + 0.065 * distance));
      this.cellYaw[i] += (this.yaw - this.cellYaw[i]) * follow;
      this.cellPitch[i] += (this.pitch - this.cellPitch[i]) * follow;
      const yaw = baseYaw + this.cellYaw[i],
        pitch = basePitch + this.cellPitch[i];
      const j = i * 4;
      this.basis[j] = Math.sin(yaw);
      this.basis[j + 1] = Math.cos(yaw);
      this.basis[j + 2] = Math.sin(pitch);
      this.basis[j + 3] = Math.cos(pitch);
    }
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      let displacement = 0,
        lift = 0;
      for (const wave of this.waves) {
        const age = t - wave.start;
        const offset = (wave.distances[i] - age * WAVE_SPEED) / 0.16;
        if (Math.abs(offset) >= 2.5) continue;
        const envelope = Math.exp(-offset * offset) * (1 - age / WAVE_DURATION);
        displacement += 0.16 * envelope * Math.cos(2.25 * offset);
        lift = Math.max(lift, envelope);
      }
      const bx = p.x + p.nx * displacement,
        by = p.y + p.ny * displacement,
        bz = p.z + p.nz * displacement;
      const k = p.cell * 4,
        m = this.basis;
      const x = bx * m[k + 1] + bz * m[k],
        depth = bz * m[k + 1] - bx * m[k];
      const y = by * m[k + 3] - depth * m[k + 2];
      const j = i * 4;
      this.camera[j] = x * cr - y * sr;
      this.camera[j + 1] = x * sr + y * cr;
      this.camera[j + 2] = by * m[k + 2] + depth * m[k + 3];
      this.camera[j + 3] = lift;
    }
  }
}
