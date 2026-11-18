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
export const SECTORS = 36;
export const SLICES = 8;
export const CELL_COUNT = SECTORS * SLICES;

export type SurfacePoint = { u: number; v: number };
export type Particle = SurfacePoint & {
  x: number;
  y: number;
  z: number;
  nx: number;
  ny: number;
  nz: number;
  cell: number;
  color: string;
  opacity: number;
  radius: number;
  glint: boolean;
};

export function surfaceDistance(a: SurfacePoint, b: SurfacePoint) {
  const du = Math.abs(a.u - b.u) % TAU;
  const dv = Math.abs(a.v - b.v) % TAU;
  return Math.hypot(
    0.72 * Math.min(du, TAU - du),
    0.3 * Math.min(dv, TAU - dv),
  );
}
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
  const particles: Particle[] = [];

  function add(
    x: number,
    y: number,
    z: number,
    radius: number,
    color: number,
    light: number,
    u = -1,
    v = 0,
  ) {
    const shade = Math.max(
      0,
      Math.min(shades.length - 1, Math.floor(light * shades.length)),
    );
    const glint = light > 0.68 && radius > 1.85 && random() < 0.18;
    const sector = Math.round((u / TAU) * SECTORS) % SECTORS;
    const slice = ((Math.round((v / TAU) * SLICES) % SLICES) + SLICES) % SLICES;
    particles.push({
      x,
      y,
      z,
      u,
      v,
      radius,
      glint,
      color: colors[color],
      opacity: shades[shade],
      cell: u < 0 ? CELL_COUNT : sector * SLICES + slice,
      nx: Math.cos(u) * Math.cos(v),
      ny: Math.sin(u) * Math.cos(v),
      nz: Math.sin(v),
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
        u,
        fold,
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
  return particles.sort((a, b) => a.opacity - b.opacity);
}
