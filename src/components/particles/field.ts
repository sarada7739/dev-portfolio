const TAU = Math.PI * 2;
const colors = [
  "#a47aff",
  "#d5b5ff",
  "#ffba3c",
  "#fff2d9",
  "#5cd9b6",
  "#f29dc9",
];
const shades = [0.23, 0.51, 0.8, 1];

type Particle = {
  x: number;
  y: number;
  z: number;
  radius: number;
  dx: number;
  dy: number;
};

type Layer = { color: string; opacity: number; particles: Particle[] };

function seededRandom() {
  let state = 0x39a7124;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
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
    angle: number,
    color: number,
    light: number,
  ) {
    const shade = Math.max(
      0,
      Math.min(shades.length - 1, Math.floor(light * shades.length)),
    );
    layers[shade * colors.length + color].particles.push({
      x,
      y,
      z,
      radius,
      dx: Math.cos(angle),
      dy: Math.sin(angle),
    });
  }

  for (let row = 0; row < 128; row++) {
    for (let col = 0; col < 34; col++) {
      const u = ((row + random() * 0.6) / 128) * TAU;
      const v = ((col + random() * 0.65) / 34) * TAU;
      const fold = v + 0.7 * Math.sin(2 * u - 0.4);
      const radius =
        0.3 + 0.075 * Math.cos(2 * u + 0.6) + 0.025 * Math.sin(3 * v + 2 * u);
      const loosen = random() < 0.11 ? random() * 0.085 : random() * 0.011;
      const tube = radius + loosen;
      const x = (0.72 + tube * Math.cos(fold)) * Math.cos(u);
      const y = (0.58 + tube * Math.cos(fold)) * Math.sin(u);
      const z =
        tube * Math.sin(fold) +
        0.28 * Math.sin(2 * u - 0.35) +
        0.12 * Math.cos(u);
      const band =
        Math.sin(2 * u - 1.6 * Math.cos(v + 0.8) + 1.25 * Math.sin(v + u)) +
        0.48 * Math.sin(2 * v - 2 * u) +
        (random() - 0.5) * 0.32;
      let color =
        band > 0.62
          ? 2
          : band > 0.22
            ? 3
            : band > -0.06
              ? 4
              : band > -0.64
                ? 0
                : 1;
      if (random() < 0.065) color = 5;
      const light = 0.36 + z * 0.52 + Math.sin(fold) * 0.2 + random() * 0.25;
      add(
        x,
        y,
        z,
        1.1 + random() ** 1.5 * 2.5,
        u + 0.8 * v + random() * 0.6,
        color,
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
      0.75 + random() ** 3 * 4.5,
      random() * TAU,
      Math.floor(random() * colors.length),
      random() * 0.48,
    );
  }
  return layers;
}

export function drawField(
  ctx: CanvasRenderingContext2D,
  layers: Layer[],
  t: number,
  pointerX = 0,
  pointerY = 0,
) {
  const { width, height } = ctx.canvas;
  const scale = Math.min(width / 800, height / 640);
  ctx.setTransform(scale, 0, 0, scale, width / 2, height / 2);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#000";
  ctx.fillRect(
    -width / (2 * scale),
    -height / (2 * scale),
    width / scale,
    height / scale,
  );

  const yaw = -0.1 + 0.46 * Math.sin(t * 0.19) + 0.1 * pointerX;
  const pitch = -0.48 + 0.12 * Math.sin(t * 0.16) - 0.09 * pointerY;
  const sy = Math.sin(yaw),
    cy = Math.cos(yaw);
  const sx = Math.sin(pitch),
    cx = Math.cos(pitch);
  const roll = -0.31 + 0.065 * Math.sin(t * 0.13);
  const sr = Math.sin(roll),
    cr = Math.cos(roll);
  const spin = Math.sin(t * 0.21) * 0.26;
  const ss = Math.sin(spin),
    cs = Math.cos(spin);
  ctx.lineWidth = 1.08;
  ctx.lineJoin = "round";

  for (const layer of layers) {
    ctx.strokeStyle = layer.color;
    ctx.globalAlpha = layer.opacity;
    ctx.beginPath();
    for (const p of layer.particles) {
      const x = p.x * cy + p.z * sy;
      const depth = p.z * cy - p.x * sy;
      const y = p.y * cx - depth * sx;
      const perspective = 3.8 / (3.8 - (p.y * sx + depth * cx));
      const px = 322 * (x * cr - y * sr) * perspective;
      const py = 322 * (x * sr + y * cr) * perspective;
      const size = p.radius * perspective;
      const dx = (p.dx * cs - p.dy * ss) * size;
      const dy = (p.dx * ss + p.dy * cs) * size;
      ctx.moveTo(px + dx, py + dy);
      ctx.lineTo(px - 0.57 * dx - 0.72 * dy, py - 0.57 * dy + 0.72 * dx);
      ctx.lineTo(px - 0.57 * dx + 0.72 * dy, py - 0.57 * dy - 0.72 * dx);
      ctx.closePath();
    }
    ctx.stroke();
    if (layer.opacity >= 0.8) {
      ctx.fillStyle = layer.color;
      ctx.globalAlpha = layer.opacity * 0.32;
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}
