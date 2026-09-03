/**
 * The shared WebGL surface. DESIGN.md 13.3; tech plan Decision 3.
 *
 * One rendering stack, Three.js, lazy-loaded per page. The homepage spends
 * the budget on a real 3D scene; every other page runs this same fragment
 * shader on a fullscreen quad in a masthead band, with per-page uniforms.
 *
 * The shader draws a five-fold quasiperiodic field - the sum of five plane
 * waves at 72-degree increments, which is the standard construction of a
 * quasicrystal and the mathematics underneath girih tiling. So the interior
 * pages are not decorated with a pattern; they are lit by the same geometry
 * the hero is built from, seen as light rather than as structure.
 *
 * The engineering floor is not optional and is implemented here once, so no
 * page has to get it right again:
 *
 *   - device pixel ratio capped at 2
 *   - IntersectionObserver stops the loop when the canvas leaves the viewport
 *   - prefers-reduced-motion renders exactly ONE frame at uTime 3.7 and then
 *     stops, with uConstruction forced to 1.0 so the still page becomes a
 *     diagram of its own construction (5.4)
 *   - webglcontextlost calls preventDefault and falls back to the CSS
 *     gradient rather than showing a black rectangle
 *   - geometries, materials and the renderer are disposed on unmount
 */

import type {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three';

/* ------------------------------------------------------------------ */
/* Tokens, as 0-1 vec3. These are the section 1 hexes and nothing else. */

export const PALETTE = {
  paper: '#F8FAF7',
  paperWarm: '#EEF3EC',
  paperCool: '#E3EBE3',
  ink: '#14261C',
  slateDeep: '#0F1F17',
  sienna: '#2F6B45',
  slate: '#2C6157',
  amber: '#A3DC7A',
  fillApricot: '#D9EDC6',
  fillSky: '#93C4B4',
} as const;

export function hexToVec3(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/* ------------------------------------------------------------------ */
/* 13.3 - the shader, as specified.                                     */

export const VERTEX_SHADER = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uTime;          // seconds
  uniform vec2  uRes;           // canvas px
  uniform vec4  uWindowRect;    // x,y,w,h normalised; w = 0.0 disables
  uniform vec2  uLightOrigin;   // normalised; where light enters
  uniform vec3  uPaletteA;      // dark end   (sRGB 0-1, converted to OKLab in shader)
  uniform vec3  uPaletteB;      // mid
  uniform vec3  uPaletteC;      // light end
  uniform vec3  uStrapColor;
  uniform float uDensity;       // 2.0 .. 6.0   frequency of the quasiperiodic field
  uniform float uStrapWidth;    // 0.0 .. 0.035 ; 0.0 = pure light, no isolines
  uniform float uGlow;          // 0.0 .. 1.0
  uniform float uDrift;         // 0.0 .. 1.0   animation amplitude
  uniform float uConstruction;  // 0.0 .. 1.0   secondary contour visibility
  uniform float uGrain;         // 0.0 .. 0.05
  uniform float uOpacity;       // 0.0 .. 1.0

  #define PI 3.14159265359

  // --- five-fold quasiperiodic field -------------------------------------
  float girihField(vec2 p, float density, float phase) {
    float s = 0.0;
    for (int k = 0; k < 5; k++) {
      float a = float(k) * (2.0 * PI / 5.0);          // 72 degrees
      vec2  d = vec2(cos(a), sin(a));
      s += cos(dot(p, d) * density + phase * (0.35 + 0.15 * float(k)));
    }
    return s * 0.2;                                    // -1 .. 1
  }

  // --- OKLab mixing -------------------------------------------------------
  // sRGB midpoints between sienna and slate go grey and muddy. OKLab does not.
  vec3 srgbToOklab(vec3 c) {
    c = pow(c, vec3(2.2));
    float l = 0.4122214708*c.r + 0.5363325363*c.g + 0.0514459929*c.b;
    float m = 0.2119034982*c.r + 0.6806995451*c.g + 0.1073969566*c.b;
    float s = 0.0883024619*c.r + 0.2817188376*c.g + 0.6299787005*c.b;
    l = pow(l, 1.0/3.0); m = pow(m, 1.0/3.0); s = pow(s, 1.0/3.0);
    return vec3(0.2104542553*l + 0.7936177850*m - 0.0040720468*s,
                1.9779984951*l - 2.4285922050*m + 0.4505937099*s,
                0.0259040371*l + 0.7827717662*m - 0.8086757660*s);
  }
  vec3 oklabToSrgb(vec3 c) {
    float l = c.x + 0.3963377774*c.y + 0.2158037573*c.z;
    float m = c.x - 0.1055613458*c.y - 0.0638541728*c.z;
    float s = c.x - 0.0894841775*c.y - 1.2914855480*c.z;
    l = l*l*l; m = m*m*m; s = s*s*s;
    vec3 rgb = vec3( 4.0767416621*l - 3.3077115913*m + 0.2309699292*s,
                    -1.2684380046*l + 2.6097574011*m - 0.3413193965*s,
                    -0.0041960863*l - 0.7034186147*m + 1.7076147010*s);
    return pow(max(rgb, 0.0), vec3(1.0/2.2));
  }
  vec3 mixOk(vec3 a, vec3 b, float t) {
    return oklabToSrgb(mix(srgbToOklab(a), srgbToOklab(b), t));
  }

  // --- fBm for the light field -------------------------------------------
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    f = f*f*(3.0 - 2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), f.x),
               mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv  = gl_FragCoord.xy / uRes;
    vec2 p   = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
    float t  = uTime * 0.06 * uDrift;

    // 1. the light field: domain-warped fBm, very low frequency
    vec2  w = vec2(fbm(p * 1.6 + t), fbm(p * 1.6 - t + 4.7));
    float L = fbm(p * 1.9 + w * 0.9);

    // 2. distance from where the light enters
    float d = distance(uv, uLightOrigin);
    L = clamp(L * 0.75 + (1.0 - smoothstep(0.05, 1.05, d)) * (0.55 + 0.45 * uGlow), 0.0, 1.0);

    // 3. colour, mixed in OKLab
    vec3 col = L < 0.5 ? mixOk(uPaletteA, uPaletteB, L * 2.0)
                       : mixOk(uPaletteB, uPaletteC, (L - 0.5) * 2.0);

    // 4. strapwork isolines of the quasiperiodic field
    if (uStrapWidth > 0.0001) {
      float f  = girihField(p * 3.0, uDensity, t * 4.0);
      float aa = fwidth(f) * 1.5;
      float strap = 1.0 - smoothstep(uStrapWidth, uStrapWidth + aa, abs(f));
      // secondary "construction" contours at |f| = 0.62
      float cons  = 1.0 - smoothstep(uStrapWidth * 0.45, uStrapWidth * 0.45 + aa, abs(abs(f) - 0.62));
      col = mix(col, uStrapColor, strap * 0.85);
      col = mix(col, uStrapColor, cons * 0.40 * uConstruction);
    }

    // 5. the Window: light opens, pattern gets out of the way
    //
    // This was min(e.x, e.y) against a 0.05 feather - a SQUARE boundary with
    // sharp corners, crisp on the three sides that fell inside the viewport
    // and absent on the fourth, which is exactly why it read as a pasted
    // panel rather than as light. A rounded-box distance with a wide falloff
    // gives all four sides the same treatment and no corners to catch on.
    if (uWindowRect.z > 0.0) {
      vec2 wmin = uWindowRect.xy, wmax = uWindowRect.xy + uWindowRect.zw;
      vec2 centre = (wmin + wmax) * 0.5;
      vec2 halfSize = (wmax - wmin) * 0.5;   // 'half' is reserved in GLSL ES
      float r = min(halfSize.x, halfSize.y) * 0.75;
      vec2 q = abs(uv - centre) - (halfSize - r);
      float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
      float inside = 1.0 - smoothstep(-0.11, 0.07, d);
      col = mixOk(col, uPaletteC, inside * 0.55);
    }

    // 6. grain
    col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * uGrain;

    gl_FragColor = vec4(col, uOpacity);
  }
`;

/* ------------------------------------------------------------------ */
/* 13.3 - the per-page presets, complete.                              */

export interface Preset {
  a: string;
  b: string;
  c: string;
  strap: string;
  density: number;
  strapWidth: number;
  glow: number;
  drift: number;
  construction: number;
  grain: number;
  opacity: number;
  lightOrigin: [number, number];
}

const P = PALETTE;

export const PRESETS = {
  /*
   * uWindowRect is vec4(0) on every preset except the two homepage ones,
   * which are driven from the DOM by the hero (13.2).
   *
   * There is no warm hue in any preset. The field mixes green-dark to
   * green-light in OKLab, so what reads as "light coming through the screen"
   * is a pale sage-white rather than gold or clay. The token NAMES below are
   * historical - P.sienna is a moss green and P.fillApricot is a pale leaf.
   */
  'home-backdrop': { a: P.ink,       b: P.slate,  c: P.fillApricot, strap: P.paper, density: 3.2, strapWidth: 0.0, glow: 0.45, drift: 1.0, construction: 0.0, grain: 0.012, opacity: 1.0, lightOrigin: [0.5, 0.5] },
  'home-flat':     { a: P.ink,       b: P.slate,  c: P.fillApricot, strap: P.paper, density: 3.2, strapWidth: 0.014, glow: 0.45, drift: 1.0, construction: 0.3, grain: 0.012, opacity: 1.0, lightOrigin: [0.5, 0.5] },
  story:    { a: P.paper,     b: P.paperWarm,   c: P.fillSky,  strap: P.ink,   density: 3.6, strapWidth: 0.006, glow: 0.25, drift: 0.35, construction: 1.0,  grain: 0.010, opacity: 0.55, lightOrigin: [0.22, 0.30] },
  program:  { a: P.paperWarm, b: P.fillApricot, c: P.sienna,   strap: P.paper, density: 3.0, strapWidth: 0.014, glow: 0.40, drift: 0.50, construction: 0.35, grain: 0.010, opacity: 0.50, lightOrigin: [0.50, 0.18] },
  calendar: { a: P.paperCool, b: P.fillSky,     c: P.slate,    strap: P.paper, density: 4.6, strapWidth: 0.010, glow: 0.30, drift: 0.30, construction: 0.25, grain: 0.010, opacity: 0.45, lightOrigin: [0.78, 0.22] },
  enroll:   { a: P.paper,     b: P.fillApricot, c: P.sienna,   strap: P.paper, density: 2.6, strapWidth: 0.016, glow: 0.60, drift: 0.60, construction: 0.30, grain: 0.010, opacity: 0.55, lightOrigin: [0.30, 0.55] },
  faqs:     { a: P.paper,     b: P.paperCool,   c: P.paperWarm, strap: P.ink,  density: 5.2, strapWidth: 0.008, glow: 0.15, drift: 0.25, construction: 0.20, grain: 0.008, opacity: 0.35, lightOrigin: [0.50, 0.10] },
  give:     { a: P.ink,       b: P.slate,       c: P.fillApricot,    strap: P.paper, density: 3.2, strapWidth: 0.012, glow: 0.90, drift: 0.70, construction: 0.30, grain: 0.014, opacity: 1.00, lightOrigin: [0.50, 0.02] },
  contact:  { a: P.slateDeep, b: P.slate,       c: P.fillSky,  strap: P.paper, density: 2.2, strapWidth: 0.010, glow: 0.50, drift: 0.40, construction: 0.30, grain: 0.012, opacity: 1.00, lightOrigin: [0.50, 0.62] },
  notfound: { a: P.paper,     b: P.fillApricot, c: P.sienna,   strap: P.paper, density: 2.6, strapWidth: 0.016, glow: 0.60, drift: 0.60, construction: 0.30, grain: 0.010, opacity: 0.40, lightOrigin: [0.50, 0.50] },
} satisfies Record<string, Preset>;

export type PresetName = keyof typeof PRESETS;

/* ------------------------------------------------------------------ */
/* Capability tiers - 13.2.                                            */

export type Tier = 1 | 2 | 3;

export function detectTier(): Tier {
  if (typeof window === 'undefined') return 3;

  let gl: WebGL2RenderingContext | null = null;
  try {
    const probe = document.createElement('canvas');
    gl = probe.getContext('webgl2');
  } catch {
    gl = null;
  }
  if (!gl) return 3;

  const wide = window.innerWidth >= 600;
  const cores = navigator.hardwareConcurrency ?? 0;
  return wide && cores > 4 ? 1 : 2;
}

/** DPR cap 2, and 1.75 on the small-viewport hero tier (11). */
export function cappedDpr(): number {
  const cap = window.innerWidth < 900 ? 1.75 : 2;
  return Math.min(window.devicePixelRatio || 1, cap);
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ------------------------------------------------------------------ */
/* Reaching a mounted field from page code.                             */

/**
 * Masthead.astro mounts the field, so without a registry the FieldHandle is
 * only reachable from inside that component and the two scroll-linked shader
 * behaviours DESIGN.md specifies cannot be written at all:
 *
 *   13.4  /program  uDensity   4.6 -> 3.2 -> 2.0 as the three sections pass
 *   13.3  /give     uLightOrigin.y  0.02 -> 0.5 across the page's scroll
 *
 * onField resolves whether it is called before or after the mount, which
 * matters because Three.js is dynamically imported and the page script may
 * win the race. On Tier 3 there is no shader and the callback never fires,
 * which is the correct outcome: no canvas, nothing to scrub, and the CSS
 * gradient underneath is already the complete fallback.
 */
const mountedFields = new Map<string, FieldHandle>();
const fieldWaiters = new Map<string, Array<(handle: FieldHandle) => void>>();

export function registerField(key: string, handle: FieldHandle): void {
  mountedFields.set(key, handle);
  const waiting = fieldWaiters.get(key);
  if (waiting) {
    fieldWaiters.delete(key);
    for (const cb of waiting) cb(handle);
  }
}

export function onField(key: string, cb: (handle: FieldHandle) => void): void {
  const existing = mountedFields.get(key);
  if (existing) {
    cb(existing);
    return;
  }
  fieldWaiters.set(key, [...(fieldWaiters.get(key) ?? []), cb]);
}

/* ------------------------------------------------------------------ */

export interface FieldHandle {
  /** Push a normalised aperture rect. w = 0 disables it. */
  setWindowRect(x: number, y: number, w: number, h: number): void;
  setUniform(name: string, value: number | number[]): void;
  /** The Three.js material, for pages that need to scrub a uniform. */
  material: ShaderMaterial;
  destroy(): void;
}

export interface FieldOptions {
  preset: PresetName;
  /** Called if WebGL is unavailable or the context is lost. */
  onFallback?: () => void;
}

/**
 * Mounts the field shader on a canvas as a fullscreen quad.
 *
 * Returns null when there is no WebGL2 at all, which is the caller's cue to
 * leave the CSS gradient showing. That gradient sits behind the canvas and is
 * simply covered when the shader runs, so the fallback is never an apology
 * and never a black rectangle.
 */
export async function mountField(
  canvas: HTMLCanvasElement,
  { preset, onFallback }: FieldOptions
): Promise<FieldHandle | null> {
  if (detectTier() === 3) {
    onFallback?.();
    return null;
  }

  const THREE = await import('three');
  const config = PRESETS[preset];
  const reduce = prefersReducedMotion();

  let renderer: WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });
  } catch {
    onFallback?.();
    return null;
  }

  renderer.setPixelRatio(cappedDpr());
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene: Scene = new THREE.Scene();
  const camera: OrthographicCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geometry: PlaneGeometry = new THREE.PlaneGeometry(2, 2);

  const uniforms = {
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uWindowRect: { value: new THREE.Vector4(0, 0, 0, 0) },
    uLightOrigin: { value: new THREE.Vector2(...config.lightOrigin) },
    uPaletteA: { value: new THREE.Vector3(...hexToVec3(config.a)) },
    uPaletteB: { value: new THREE.Vector3(...hexToVec3(config.b)) },
    uPaletteC: { value: new THREE.Vector3(...hexToVec3(config.c)) },
    uStrapColor: { value: new THREE.Vector3(...hexToVec3(config.strap)) },
    uDensity: { value: config.density },
    uStrapWidth: { value: config.strapWidth },
    uGlow: { value: config.glow },
    uDrift: { value: reduce ? 0 : config.drift },
    /* 5.4 - reduced motion raises uConstruction to 1.0 on every surface,
       exposing the compass arcs and radii that generated the pattern. The
       still site becomes a diagram of itself. */
    uConstruction: { value: reduce ? 1.0 : config.construction },
    uGrain: { value: config.grain },
    uOpacity: { value: config.opacity },
  };

  const material: ShaderMaterial = new THREE.ShaderMaterial({
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    uniforms,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  const mesh: Mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  scene.add(mesh);

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    renderer.setPixelRatio(cappedDpr());
    renderer.setSize(width, height, false);
    uniforms.uRes.value.set(width * renderer.getPixelRatio(), height * renderer.getPixelRatio());
  };

  resize();

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  let running = false;
  let visible = true;
  let disposed = false;
  const start = performance.now();

  const frame = () => {
    uniforms.uTime.value = (performance.now() - start) / 1000;
    renderer.render(scene, camera);
  };

  const play = () => {
    if (disposed || running || reduce) return;
    running = true;
    renderer.setAnimationLoop(frame);
  };

  const pause = () => {
    if (!running) return;
    running = false;
    renderer.setAnimationLoop(null);
  };

  if (reduce) {
    /* Exactly one frame, at uTime 3.7, then stop. */
    uniforms.uTime.value = 3.7;
    renderer.render(scene, camera);
  } else {
    play();
  }

  /* The loop stops the moment the canvas leaves the viewport. On a page with
     a masthead band, that is most of the visit. */
  const io = new IntersectionObserver(
    (entries) => {
      visible = entries[0]?.isIntersecting ?? false;
      visible ? play() : pause();
    },
    { rootMargin: '120px' }
  );
  io.observe(canvas);

  const onVisibility = () => {
    document.hidden || !visible ? pause() : play();
  };
  document.addEventListener('visibilitychange', onVisibility);

  /* preventDefault is what makes recovery possible at all; without it the
     context is gone for good. Even so, the honest move is to hand the surface
     back to the CSS gradient rather than show a black rectangle. */
  const onLost = (event: Event) => {
    event.preventDefault();
    pause();
    canvas.classList.remove('is-live');
    onFallback?.();
  };
  canvas.addEventListener('webglcontextlost', onLost);

  canvas.classList.add('is-live');

  return {
    material,
    setWindowRect(x, y, w, h) {
      uniforms.uWindowRect.value.set(x, y, w, h);
      if (reduce) renderer.render(scene, camera);
    },
    setUniform(name, value) {
      const uniform = (uniforms as Record<string, { value: unknown }>)[name];
      if (!uniform) return;
      if (typeof value === 'number') {
        uniform.value = value;
      } else if (Array.isArray(value) && typeof uniform.value === 'object' && uniform.value !== null) {
        (uniform.value as { set: (...args: number[]) => void }).set(...value);
      }
      if (reduce) renderer.render(scene, camera);
    },
    destroy() {
      disposed = true;
      pause();
      io.disconnect();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onLost);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
