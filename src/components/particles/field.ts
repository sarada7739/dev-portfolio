const TAU = Math.PI * 2;
const colors = [
  "#36baa6",
  "#81e3c6",
  "#cdf6e7",
  "#80cbdf",
  "#b3acec",
  "#ffc6b8",
];
const shades = [0.19, 0.39, 0.67, 0.95];
export const RIPPLE_DURATION = 1.35;

export type Ripple = { x: number; y: number; startedAt: number };
type View = { yaw: number; pitch: number; ripples: readonly Ripple[] };
type Particle = {
  x: number;
  y: number;
  z: number;
  radius: number;
  glint: boolean;
};
type Layer = { color: string; opacity: number; particles: Particle[] };

function seededRandom() {
  let state = 0x39a7124;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function bandColor(band: number, seam: number) {
  if (band > 0.52 && seam > 0.83) return 5;
  if (band > 0.45) return 4;
  if (band > 0.06) return 3;
  if (seam > 0.75) return 2;
  return band > -0.53 ? 1 : 0;
}

export function createField() {
  const random = seededRandom();
  const layers: Layer[] = shades.flatMap((opacity) =>
    colors.map((color) => ({ color, opacity, particles: [] })),
  );

  function add(
    x: number,
    y: number,
    z: number,
    radius: number,
    color: number,
    light: number,
  ) {
    const shade = Math.max(
      0,
      Math.min(shades.length - 1, Math.floor(light * shades.length)),
    );
    const glint = light > 0.68 && radius > 1.85 && random() < 0.18;
    layers[shade * colors.length + color].particles.push({
      x,
      y,
      z,
      radius,
      glint,
    });
  }

  for (let row = 0; row < 144; row++) {
    for (let col = 0; col < 30; col++) {
      const u = ((row + random() * 0.42) / 144) * TAU;
      const v = ((col + random() * 0.45) / 30) * TAU;
      const fold = v + u + 0.62 * Math.sin(2 * u - 0.4);
      const seam = Math.cos(3 * fold - 2 * u + 0.4);
      const radius =
        0.3 + 0.075 * Math.cos(2 * u + 0.6) + 0.025 * Math.sin(3 * v + 2 * u);
      const loosen = random() < 0.085 ? random() * 0.075 : random() * 0.011;
      const tube = radius + loosen;
      const x = (0.72 + tube * Math.cos(fold)) * Math.cos(u);
      const y = (0.58 + tube * Math.cos(fold)) * Math.sin(u);
      const z =
        tube * Math.sin(fold) +
        0.28 * Math.sin(2 * u - 0.35) +
        0.12 * Math.cos(u);
      const band =
        0.68 * Math.cos(u - 0.6) +
        0.31 * Math.cos(fold + 2 * u - 1.5) +
        (random() - 0.5) * 0.13;
      const light =
        0.42 + z * 0.52 + Math.sin(fold) * 0.17 + seam * 0.12 + random() * 0.21;
      add(
        x,
        y,
        z,
        0.72 + random() ** 1.6 * 1.88 + 0.22 * seam,
        bandColor(band, seam),
        light,
      );
    }
  }

  for (let i = 0; i < 125; i++) {
    const angle = random() * TAU;
    const distance = 1.04 + random() ** 1.4 * 0.68;
    add(
      Math.cos(angle) * distance,
      Math.sin(angle) * distance * 0.76,
      random() - 0.5,
      0.55 + random() ** 3 * 1.8,
      Math.floor(random() * 5),
      random() * 0.47,
    );
  }
  return layers;
}

function circle(
  path: CanvasRenderingContext2D | Path2D,
  x: number,
  y: number,
  radius: number,
) {
  path.moveTo(x + radius, y);
  path.arc(x, y, radius, 0, TAU);
}

export function drawField(
  ctx: CanvasRenderingContext2D,
  layers: Layer[],
  t: number,
  view?: View,
) {
  const { width, height } = ctx.canvas;
  const scale = Math.min(width / 800, height / 640);
  const fieldWidth = width / scale;
  const fieldHeight = height / scale;
  ctx.setTransform(scale, 0, 0, scale, width / 2, height / 2);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#000";
  ctx.fillRect(-fieldWidth / 2, -fieldHeight / 2, fieldWidth, fieldHeight);

  const yaw = -0.1 + 0.46 * Math.sin(t * 0.19) + (view?.yaw ?? 0);
  const pitch = -0.48 + 0.12 * Math.sin(t * 0.16) + (view?.pitch ?? 0);
  const sy = Math.sin(yaw),
    cy = Math.cos(yaw);
  const sx = Math.sin(pitch),
    cx = Math.cos(pitch);
  const roll = -0.31 + 0.065 * Math.sin(t * 0.13);
  const sr = Math.sin(roll),
    cr = Math.cos(roll);

  const fronts = (view?.ripples ?? [])
    .filter(
      ({ startedAt }) => t >= startedAt && t - startedAt < RIPPLE_DURATION,
    )
    .map((ripple) => {
      const progress = (t - ripple.startedAt) / RIPPLE_DURATION;
      return {
        x: (ripple.x - 0.5) * fieldWidth,
        y: (ripple.y - 0.5) * fieldHeight,
        radius: 5 + 470 * progress,
        strength: (1 - progress) ** 1.35,
      };
    });
  for (const front of fronts) {
    ctx.strokeStyle = "#9bead9";
    ctx.globalAlpha = front.strength * 0.48;
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    circle(ctx, front.x, front.y, front.radius);
    ctx.stroke();
  }

  const halos = new Path2D();
  const cores = new Path2D();
  for (const layer of layers) {
    ctx.fillStyle = layer.color;
    ctx.globalAlpha = layer.opacity;
    ctx.beginPath();
    for (const p of layer.particles) {
      const x = p.x * cy + p.z * sy;
      const depth = p.z * cy - p.x * sy;
      const y = p.y * cx - depth * sx;
      const perspective = 3.8 / (3.8 - (p.y * sx + depth * cx));
      let px = 322 * (x * cr - y * sr) * perspective;
      let py = 322 * (x * sr + y * cr) * perspective;
      let lift = 0;
      for (const front of fronts) {
        const dx = px - front.x,
          dy = py - front.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const crest = 1 - Math.abs(distance - front.radius) / 34;
        if (crest <= 0) continue;
        const strength = crest * crest * front.strength;
        const push = (strength * 18) / Math.max(distance, 1);
        px += dx * push;
        py += dy * push;
        lift = Math.max(lift, strength);
      }
      const size = p.radius * perspective * (1 + lift * 0.6);
      circle(ctx, px, py, size);
      if (p.glint || lift > 0.26) {
        circle(halos, px, py, size * 2.25);
        circle(cores, px, py, size * 0.55);
      }
    }
    ctx.fill();
  }
  // 明るい粒だけ芯とにじみを重ね、毎粒のぼかし処理を省く。
  ctx.fillStyle = "#a9ece9";
  ctx.globalAlpha = 0.17;
  ctx.fill(halos);
  ctx.fillStyle = "#ebfff9";
  ctx.globalAlpha = 0.93;
  ctx.fill(cores);
  ctx.globalAlpha = 1;
}
