import type { Particle } from "./field";

const vertex = `
attribute vec4 camera;
attribute vec3 tint;
attribute vec3 style;
uniform vec2 viewport;
uniform float scale;
varying mediump vec4 color;
varying mediump float glow;
varying mediump float diameter;
void main() {
  float perspective = 3.8 / (3.8 - camera.z);
  vec2 xy = camera.xy * vec2(1., -1.) * (644. * scale * perspective) / viewport;
  gl_Position = vec4(xy, 0., 1.);
  glow = max(style.z, smoothstep(.05, .5, camera.w));
  float radius = style.x * scale * perspective * (1. + .6 * camera.w);
  diameter = max(1., 2. * radius * mix(1., 2.25, glow));
  gl_PointSize = diameter;
  color = vec4(mix(tint, vec3(.86, 1., .96), camera.w * .75), style.y);
}`;

const fragment = `
precision mediump float;
varying mediump vec4 color;
varying mediump float glow;
varying mediump float diameter;
void main() {
  float r = length(gl_PointCoord * 2. - 1.);
  float edge = min(.45, 1. / diameter);
  float coreRadius = 1. / mix(1., 2.25, glow);
  float body = 1. - smoothstep(coreRadius - edge, coreRadius + edge, r);
  float halo = glow * .20 * (1. - smoothstep(.20, 1., r));
  float core = glow * (1. - smoothstep(.08, .29, r));
  gl_FragColor = vec4(mix(color.rgb, vec3(.92, 1., .98), core), max(color.a * body, halo));
}`;

export type ParticleRenderer = {
  canvas: HTMLCanvasElement;
  draw(camera: Float32Array): void;
  dispose(): void;
};

function gpu(points: Particle[]): ParticleRenderer | null {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl", {
    alpha: false,
    depth: false,
    stencil: false,
    antialias: false,
  });
  if (!gl) return null;
  const program = gl.createProgram();
  if (!program) return null;
  for (const [type, source] of [
    [gl.VERTEX_SHADER, vertex],
    [gl.FRAGMENT_SHADER, fragment],
  ] as const) {
    const shader = gl.createShader(type);
    if (!shader) {
      gl.deleteProgram(program);
      return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
    gl.deleteShader(shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  gl.useProgram(program);
  const styles = new Float32Array(points.length * 6);
  points.forEach((p, i) => {
    const rgb = parseInt(p.color.slice(1), 16);
    styles.set(
      [
        (rgb >> 16) / 255,
        ((rgb >> 8) & 255) / 255,
        (rgb & 255) / 255,
        p.radius,
        p.opacity,
        Number(p.glint),
      ],
      i * 6,
    );
  });
  const styleBuffer = gl.createBuffer(),
    moving = gl.createBuffer();
  if (!styleBuffer || !moving) {
    gl.deleteBuffer(styleBuffer);
    gl.deleteBuffer(moving);
    gl.deleteProgram(program);
    return null;
  }
  const attribute = (
    name: string,
    size: number,
    stride: number,
    offset: number,
  ) => {
    const loc = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride, offset);
  };
  gl.bindBuffer(gl.ARRAY_BUFFER, styleBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, styles, gl.STATIC_DRAW);
  attribute("tint", 3, 24, 0);
  attribute("style", 3, 24, 12);
  gl.bindBuffer(gl.ARRAY_BUFFER, moving);
  gl.bufferData(gl.ARRAY_BUFFER, points.length * 16, gl.DYNAMIC_DRAW);
  attribute("camera", 4, 0, 0);
  const viewport = gl.getUniformLocation(program, "viewport"),
    scale = gl.getUniformLocation(program, "scale");
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  return {
    canvas,
    draw(camera) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(viewport, canvas.width, canvas.height);
      gl.uniform1f(scale, Math.min(canvas.width / 800, canvas.height / 640));
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, camera);
      gl.drawArrays(gl.POINTS, 0, points.length);
    },
    dispose() {
      gl.deleteProgram(program);
      gl.deleteBuffer(styleBuffer);
      gl.deleteBuffer(moving);
    },
  };
}

function sprites(points: Particle[]): ParticleRenderer | null {
  const canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return null;
  const colors = [...new Set(points.map((p) => p.color))];
  const atlas = document.createElement("canvas");
  atlas.width = colors.length * 32;
  atlas.height = 64;
  const brush = atlas.getContext("2d");
  if (!brush) return null;
  for (const [i, color] of colors.entries()) {
    for (const glint of [false, true]) {
      const x = i * 32 + 16,
        y = glint ? 48 : 16;
      const gradient = brush.createRadialGradient(x, y, 0, x, y, 16);
      gradient.addColorStop(0, glint ? "#edfff9" : color);
      gradient.addColorStop(glint ? 0.32 : 0.78, color);
      if (glint) gradient.addColorStop(0.52, color + "40");
      gradient.addColorStop(1, color + "00");
      brush.fillStyle = gradient;
      brush.fillRect(x - 16, y - 16, 32, 32);
    }
  }
  const tiles = points.map((p) => colors.indexOf(p.color) * 32);
  return {
    canvas,
    dispose() {},
    draw(camera) {
      const scale = Math.min(canvas.width / 800, canvas.height / 640);
      ctx.setTransform(scale, 0, 0, scale, canvas.width / 2, canvas.height / 2);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#000";
      ctx.fillRect(
        -canvas.width / 2 / scale,
        -canvas.height / 2 / scale,
        canvas.width / scale,
        canvas.height / scale,
      );
      for (let i = 0; i < points.length; i++) {
        const p = points[i],
          j = i * 4,
          perspective = 3.8 / (3.8 - camera[j + 2]);
        const lift = camera[j + 3],
          glint = p.glint || lift > 0.2,
          r = p.radius * perspective * (glint ? 2.25 : 1) * (1 + lift * 0.6);
        ctx.globalAlpha = p.opacity;
        ctx.drawImage(
          atlas,
          tiles[i],
          glint ? 32 : 0,
          32,
          32,
          camera[j] * 322 * perspective - r,
          camera[j + 1] * 322 * perspective - r,
          2 * r,
          2 * r,
        );
      }
    },
  };
}

export function createRenderer(points: Particle[], useGPU = true) {
  return (useGPU && gpu(points)) || sprites(points);
}
