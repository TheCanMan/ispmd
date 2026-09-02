/**
 * The Field - the homepage hero. DESIGN.md 13.1 and 13.2.
 *
 * A shallow slab of extruded girih strapwork, lit from behind by a slow field
 * of warm light, with a rectangular aperture cut into it where the pattern
 * does not close. The aperture is the Window, and it is where the video
 * montage will live.
 *
 * This is the one surface on the site where the interlace is REAL: the
 * ribbons genuinely weave over and under in z, which a flat SVG can never
 * show. That is the payoff for spending the entire 3D budget in one place.
 *
 * Two structural decisions worth stating plainly:
 *
 *  - The DOM is the source of truth for the aperture (13.2). `.hero-window`
 *    is a positioned box whose getBoundingClientRect is normalised and pushed
 *    to the shader as uWindowRect. Projecting a scene rect into screen space
 *    and positioning DOM against it is fragile across resize, DPR and font
 *    loading; this direction is not.
 *
 *  - Every ribbon of the same z-level is merged into ONE BufferGeometry, so
 *    the whole lattice is two draw calls rather than four hundred. That is
 *    also why the entrance draw carries its delay as a per-VERTEX attribute
 *    rather than a per-mesh uniform: after merging there are no per-ribbon
 *    meshes left to hold one.
 */

import type * as THREE_NS from 'three';
import { FRAGMENT_SHADER, PRESETS, hexToVec3, cappedDpr, prefersReducedMotion } from './webgl';

/* 9.2 - the {10/3} decagram, in world units.
   R = 0.5, horizontal period 1.0, vertical period 1 : sin72. */
const R = 0.5;
const PERIOD_X = 1.0;
const PERIOD_Y = 0.95106;

/** Each decagram is ten separate edges, vertex k to vertex k+3. */
const EDGE_STEP = 3;

/** 13.1 - ribbon cross-section. */
const RIBBON_W = 0.026;
const RIBBON_H = 0.014;

function decagramVertex(k: number, cx: number, cy: number): [number, number] {
  const a = (Math.PI / 180) * 36 * k;
  return [cx + R * Math.cos(a), cy + R * Math.sin(a)];
}

export interface HeroOptions {
  canvas: HTMLCanvasElement;
  /** The DOM box that defines the aperture. */
  windowEl: HTMLElement;
  rings: number;
  onFallback: () => void;
}

export interface HeroHandle {
  /** ScrollTrigger drives this 0 -> 1 across the hero's height. */
  setScrollProgress(t: number): void;
  refreshWindowRect(): void;
  destroy(): void;
}

export async function mountHeroField({
  canvas,
  windowEl,
  rings,
  onFallback,
}: HeroOptions): Promise<HeroHandle | null> {
  const THREE = (await import('three')) as typeof THREE_NS;
  const { mergeGeometries } = await import('three/examples/jsm/utils/BufferGeometryUtils.js');

  const reduce = prefersReducedMotion();

  let renderer: THREE_NS.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
  } catch {
    onFallback();
    return null;
  }

  renderer.setPixelRatio(cappedDpr());
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 20);
  camera.position.set(0, 0, 3.2);

  /* ---------------------------------------------------------------- */
  /* The backdrop: the same field shader the interior pages run.        */

  const preset = PRESETS['home-backdrop'];
  const backdropUniforms = {
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uWindowRect: { value: new THREE.Vector4(0, 0, 0, 0) },
    uLightOrigin: { value: new THREE.Vector2(0.5, 0.5) },
    uPaletteA: { value: new THREE.Vector3(...hexToVec3(preset.a)) },
    uPaletteB: { value: new THREE.Vector3(...hexToVec3(preset.b)) },
    uPaletteC: { value: new THREE.Vector3(...hexToVec3(preset.c)) },
    uStrapColor: { value: new THREE.Vector3(...hexToVec3(preset.strap)) },
    uDensity: { value: preset.density },
    uStrapWidth: { value: preset.strapWidth },
    uGlow: { value: preset.glow },
    uDrift: { value: reduce ? 0 : preset.drift },
    uConstruction: { value: reduce ? 1.0 : preset.construction },
    uGrain: { value: preset.grain },
    uOpacity: { value: preset.opacity },
  };

  const backdropMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
    fragmentShader: FRAGMENT_SHADER,
    uniforms: backdropUniforms,
    transparent: true,
    depthWrite: false,
  });

  const backdropGeometry = new THREE.PlaneGeometry(1, 1);
  const backdrop = new THREE.Mesh(backdropGeometry, backdropMaterial);
  backdrop.position.z = -1.6;
  backdrop.renderOrder = -1;
  scene.add(backdrop);

  /* ---------------------------------------------------------------- */
  /* The lattice.                                                       */

  const shape = new THREE.Shape();
  shape.moveTo(-RIBBON_W / 2, -RIBBON_H / 2);
  shape.lineTo(RIBBON_W / 2, -RIBBON_H / 2);
  shape.lineTo(RIBBON_W / 2, RIBBON_H / 2);
  shape.lineTo(-RIBBON_W / 2, RIBBON_H / 2);
  shape.closePath();

  /* The draw grows outward from a single construction point at the upper
     left (13.1, "The entrance draw"). */
  const origin = new THREE.Vector2(-rings * PERIOD_X, rings * PERIOD_Y);
  let maxDistance = 0.0001;

  type Ribbon = { geometry: THREE_NS.BufferGeometry; even: boolean };
  const ribbons: Ribbon[] = [];

  for (let row = -rings; row <= rings; row++) {
    for (let col = -rings; col <= rings; col++) {
      const cx = col * PERIOD_X;
      const cy = row * PERIOD_Y;

      for (let k = 0; k < 10; k++) {
        const [ax, ay] = decagramVertex(k, cx, cy);
        const [bx, by] = decagramVertex((k + EDGE_STEP) % 10, cx, cy);

        /* 13.1 step 4 - interlace. Edge index i sits at z = 0.014 when i is
           even and z = 0 when i is odd. Because a {10/3} path alternates
           naturally around its crossings, this gives a correct-looking
           over/under weave with no crossing analysis at all. */
        const even = k % 2 === 0;
        const z = even ? RIBBON_H : 0;

        const a = new THREE.Vector3(ax, ay, z);
        const b = new THREE.Vector3(bx, by, z);

        const geometry = new THREE.ExtrudeGeometry(shape, {
          extrudePath: new THREE.LineCurve3(a, b),
          steps: 1,
          bevelEnabled: false,
        });

        const midX = (ax + bx) / 2;
        const midY = (ay + by) / 2;
        const distance = Math.hypot(midX - origin.x, midY - origin.y);
        maxDistance = Math.max(maxDistance, distance);

        /* aPathT: how far along its own ribbon each vertex sits, from the
           projection onto the edge. Computed rather than assumed, so it does
           not depend on the order ExtrudeGeometry happens to emit. */
        const position = geometry.getAttribute('position');
        const count = position.count;
        const pathT = new Float32Array(count);
        const delay = new Float32Array(count);
        const dx = bx - ax;
        const dy = by - ay;
        const lengthSq = dx * dx + dy * dy || 1;

        for (let i = 0; i < count; i++) {
          const t = ((position.getX(i) - ax) * dx + (position.getY(i) - ay) * dy) / lengthSq;
          pathT[i] = Math.min(1, Math.max(0, t));
          delay[i] = distance;
        }

        geometry.setAttribute('aPathT', new THREE.BufferAttribute(pathT, 1));
        geometry.setAttribute('aDelay', new THREE.BufferAttribute(delay, 1));

        ribbons.push({ geometry, even });
      }
    }
  }

  /* Normalise the delays now that the furthest ribbon is known. */
  for (const { geometry } of ribbons) {
    const delay = geometry.getAttribute('aDelay') as THREE_NS.BufferAttribute;
    for (let i = 0; i < delay.count; i++) {
      delay.setX(i, delay.getX(i) / maxDistance);
    }
  }

  const overGeometry = mergeGeometries(
    ribbons.filter((r) => r.even).map((r) => r.geometry),
    false
  );
  const underGeometry = mergeGeometries(
    ribbons.filter((r) => !r.even).map((r) => r.geometry),
    false
  );

  /* The per-ribbon geometries have been copied into the merges. */
  for (const { geometry } of ribbons) geometry.dispose();

  const reveal = { value: reduce ? 1.3 : 0 };
  const windowRect = new THREE.Vector4(0, 0, 0, 0);
  const resolution = new THREE.Vector2(1, 1);

  /**
   * Patches MeshStandardMaterial with the path reveal and the Window cull.
   *
   * The cull is done in screen space against the same uWindowRect the
   * backdrop uses, which is what keeps the aperture in the lattice and the
   * aperture in the light exactly aligned at any DPR.
   */
  function makeRibbonMaterial(color: THREE_NS.Color): THREE_NS.MeshStandardMaterial {
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.82,
      metalness: 0.0,
      transparent: true,
    });

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uRevealGlobal = reveal;
      shader.uniforms.uWindowRect = { value: windowRect };
      shader.uniforms.uRes = { value: resolution };

      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
           attribute float aPathT;
           attribute float aDelay;
           varying float vPathT;
           varying float vDelay;`
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
           vPathT = aPathT;
           vDelay = aDelay;`
        );

      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
           uniform float uRevealGlobal;
           uniform vec4  uWindowRect;
           uniform vec2  uRes;
           varying float vPathT;
           varying float vDelay;`
        )
        .replace(
          '#include <clipping_planes_fragment>',
          `#include <clipping_planes_fragment>
           float grown = clamp((uRevealGlobal - vDelay) / 0.25, 0.0, 1.0);
           if (vPathT > grown) discard;

           if (uWindowRect.z > 0.0) {
             vec2 uv = gl_FragCoord.xy / uRes;
             vec2 wmin = uWindowRect.xy;
             vec2 wmax = uWindowRect.xy + uWindowRect.zw;
             if (all(greaterThan(uv, wmin)) && all(lessThan(uv, wmax))) discard;
           }`
        );
    };

    return material;
  }

  const paper = new THREE.Color(0xfbf8f2);
  const overMaterial = makeRibbonMaterial(paper.clone());
  /* 13.1 step 5 - under-ribbons are multiplied by 0.88. Faked ambient
     occlusion, cheaper and better-looking than a shadow map. */
  const underMaterial = makeRibbonMaterial(paper.clone().multiplyScalar(0.88));

  const lattice = new THREE.Group();
  lattice.add(new THREE.Mesh(overGeometry, overMaterial));
  lattice.add(new THREE.Mesh(underGeometry, underMaterial));
  scene.add(lattice);

  /* ---------------------------------------------------------------- */
  /* Construction hairlines: the circumscribing circle and ten radii of
     every decagram, in --amber. They fade out once the draw completes -
     except under reduced motion, where they never fade and the hero is a
     still diagram of its own construction (5.4). */

  const hairPoints: number[] = [];
  const SEGMENTS = 40;
  for (let row = -rings; row <= rings; row++) {
    for (let col = -rings; col <= rings; col++) {
      const cx = col * PERIOD_X;
      const cy = row * PERIOD_Y;

      for (let s = 0; s < SEGMENTS; s++) {
        const a0 = (s / SEGMENTS) * Math.PI * 2;
        const a1 = ((s + 1) / SEGMENTS) * Math.PI * 2;
        hairPoints.push(cx + R * Math.cos(a0), cy + R * Math.sin(a0), 0.02);
        hairPoints.push(cx + R * Math.cos(a1), cy + R * Math.sin(a1), 0.02);
      }

      for (let k = 0; k < 10; k++) {
        const [vx, vy] = decagramVertex(k, cx, cy);
        hairPoints.push(cx, cy, 0.02, vx, vy, 0.02);
      }
    }
  }

  const hairGeometry = new THREE.BufferGeometry();
  hairGeometry.setAttribute('position', new THREE.Float32BufferAttribute(hairPoints, 3));
  const hairMaterial = new THREE.LineBasicMaterial({
    /* --sienna-bright: the construction arcs stay terracotta, not gold. */
    color: 0xd08348,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
  });
  const hairlines = new THREE.LineSegments(hairGeometry, hairMaterial);
  scene.add(hairlines);

  /* ---------------------------------------------------------------- */
  /* Lights. No shadow maps anywhere in this scene.                     */

  const keyLight = new THREE.DirectionalLight(0xf6e7d7, 1.6);
  keyLight.position.set(-0.6, 0.9, 1.0);
  scene.add(keyLight);

  /* Sky is the new --fill-sky, ground stays --sienna: the ribbons are lit by
     the palette they sit in, or the lattice reads grey against the pine. */
  const ambient = new THREE.HemisphereLight(0xa5ccb7, 0xa85a1e, 0.45);
  scene.add(ambient);

  /* --fill-apricot, matching the shader's light end. Amber here would put the
     gold back exactly where 12.4 refuses it. */
  const windowGlow = new THREE.PointLight(0xf2c9a0, 2.2, 3.2);
  windowGlow.position.set(0, 0, -0.9);
  scene.add(windowGlow);

  /* ---------------------------------------------------------------- */

  function sizeBackdrop() {
    const distance = camera.position.z - backdrop.position.z;
    const height = 2 * distance * Math.tan((camera.fov * Math.PI) / 360);
    backdrop.scale.set(height * camera.aspect * 1.25, height * 1.25, 1);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    renderer.setPixelRatio(cappedDpr());
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const dpr = renderer.getPixelRatio();
    resolution.set(width * dpr, height * dpr);
    backdropUniforms.uRes.value.copy(resolution);

    sizeBackdrop();
    refreshWindowRect();
  }

  /**
   * 13.2 - the aperture, read from the DOM.
   *
   * gl_FragCoord counts from the bottom of the canvas and a DOMRect counts
   * from the top, so the y flip happens exactly here and nowhere else.
   */
  function refreshWindowRect() {
    const canvasRect = canvas.getBoundingClientRect();
    const box = windowEl.getBoundingClientRect();
    if (canvasRect.width === 0 || canvasRect.height === 0) return;

    const x = (box.left - canvasRect.left) / canvasRect.width;
    const w = box.width / canvasRect.width;
    const h = box.height / canvasRect.height;
    const y = 1 - (box.bottom - canvasRect.top) / canvasRect.height;

    windowRect.set(x, y, w, h);
    backdropUniforms.uWindowRect.value.copy(windowRect);
    backdropUniforms.uLightOrigin.value.set(x + w / 2, y + h / 2);

    /* The glow sits behind the aperture in world space, so the light in the
       3D scene and the light in the shader agree. */
    const distance = camera.position.z + 0.9;
    const viewHeight = 2 * distance * Math.tan((camera.fov * Math.PI) / 360);
    const viewWidth = viewHeight * camera.aspect;
    windowGlow.position.set(
      (x + w / 2 - 0.5) * viewWidth,
      (y + h / 2 - 0.5) * viewHeight,
      -0.9
    );
  }

  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  window.addEventListener('resize', refreshWindowRect, { passive: true });
  document.fonts?.ready.then(refreshWindowRect);

  /* ---------------------------------------------------------------- */
  /* Pointer parallax: 1.2 degrees and 0.06 units, lerped. Just enough for
     the weave to read as depth. Disabled on touch. */

  const pointer = { x: 0, y: 0 };
  const smoothed = { x: 0, y: 0 };
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const onPointerMove = (event: PointerEvent) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  };
  if (fine && !reduce) window.addEventListener('pointermove', onPointerMove, { passive: true });

  let scrollProgress = 0;
  let running = false;
  let disposed = false;
  const started = performance.now();

  const MAX_TILT = (1.2 * Math.PI) / 180;

  function render() {
    const time = (performance.now() - started) / 1000;
    backdropUniforms.uTime.value = time;

    if (!reduce) {
      smoothed.x += (pointer.x - smoothed.x) * 0.06;
      smoothed.y += (pointer.y - smoothed.y) * 0.06;
    }

    /* Scroll handoff: the field recedes as the first content section
       arrives (13.1, "Motion"). */
    const z = 3.2 + scrollProgress * (4.6 - 3.2);
    camera.position.set(smoothed.x * 0.06, -smoothed.y * 0.06, z);
    camera.rotation.set(smoothed.y * MAX_TILT, -smoothed.x * MAX_TILT, 0);

    const fade = 1 - scrollProgress;
    overMaterial.opacity = 0.15 + 0.85 * fade;
    underMaterial.opacity = overMaterial.opacity;
    backdropUniforms.uOpacity.value = 0.25 + 0.75 * fade;

    /* The hairlines fade out over --dur-slow once the draw passes 1.0.
       Under reduced motion they stay, permanently. */
    if (!reduce) {
      hairMaterial.opacity = 0.35 * Math.max(0, Math.min(1, (1.25 - reveal.value) / 0.25)) * fade;
    }

    renderer.render(scene, camera);
  }

  const play = () => {
    if (disposed || running || reduce) return;
    running = true;
    renderer.setAnimationLoop(render);
  };

  const pause = () => {
    if (!running) return;
    running = false;
    renderer.setAnimationLoop(null);
  };

  if (reduce) {
    /* One static frame, at uTime 3.7. The pattern is already complete and
       its construction is visible. */
    backdropUniforms.uTime.value = 3.7;
    renderer.render(scene, camera);
  } else {
    play();
    const { gsap } = await import('./motion');
    gsap.to(reveal, { value: 1.25, duration: 1.9, ease: 'expo.out' });
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries[0]?.isIntersecting ? play() : pause();
    },
    { rootMargin: '120px' }
  );
  io.observe(canvas);

  const onVisibility = () => (document.hidden ? pause() : play());
  document.addEventListener('visibilitychange', onVisibility);

  const onLost = (event: Event) => {
    event.preventDefault();
    pause();
    canvas.classList.remove('is-live');
    onFallback();
  };
  canvas.addEventListener('webglcontextlost', onLost);

  canvas.classList.add('is-live');

  return {
    setScrollProgress(t) {
      scrollProgress = Math.max(0, Math.min(1, t));
      if (reduce) renderer.render(scene, camera);
    },
    refreshWindowRect,
    destroy() {
      disposed = true;
      pause();
      io.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('resize', refreshWindowRect);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onLost);
      overGeometry.dispose();
      underGeometry.dispose();
      hairGeometry.dispose();
      backdropGeometry.dispose();
      overMaterial.dispose();
      underMaterial.dispose();
      hairMaterial.dispose();
      backdropMaterial.dispose();
      renderer.dispose();
    },
  };
}
