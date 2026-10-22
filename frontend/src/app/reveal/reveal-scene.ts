import {
  HalfFloatType,
  LinearFilter,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  WebGLRenderer,
} from 'three';

/**
 * Both layers are square images with the same framing and the same alpha silhouette
 * (public/img/portrait*.webp). The reveal is multiplied by that alpha, so nothing ever
 * shows outside the person.
 */
export interface RevealOptions {
  base: string;
  hidden: string;
  /** Accent for the thin seam on the reveal edge, as an sRGB hex. */
  accent: string;
}

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

// Trail: previous frame decays; a soft brush is stamped along the smoothed pointer path.
const TRAIL = /* glsl */ `
  uniform sampler2D uPrev;
  uniform vec2 uFrom, uTo;
  uniform float uRadius, uActive, uDecay;
  varying vec2 vUv;
  float seg(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
    return length(pa - ba * h);
  }
  void main() {
    float prev = texture2D(uPrev, vUv).r * uDecay;
    float d = seg(vUv, uFrom, uTo);
    float brush = smoothstep(uRadius, uRadius * 0.35, d) * uActive;
    gl_FragColor = vec4(max(prev, brush), 0.0, 0.0, 1.0);
  }
`;

const DISPLAY = /* glsl */ `
  uniform sampler2D uBase, uHidden, uTrail;
  uniform vec3 uAccent;
  uniform float uTime;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }
  void main() {
    float t = texture2D(uTrail, vUv).r;
    // Noise only bends the edge band (t*(1-t) is 0 inside and outside), so it cannot create islands.
    float edge = t * (1.0 - t) * 4.0;
    float n = noise(vUv * 9.0 + uTime * 0.35) - 0.5;
    float v = t + n * 0.22 * edge;
    float m = smoothstep(0.3, 0.7, v);

    // Discreet refraction of the robot layer near the edge.
    vec2 warp = vec2(n, noise(vUv * 9.0 - uTime * 0.3) - 0.5) * 0.006 * edge;
    vec4 base = texture2D(uBase, vUv);
    vec4 hid = texture2D(uHidden, vUv + warp);

    float alpha = base.a;
    vec3 col = mix(base.rgb, hid.rgb, m);
    float seam = (smoothstep(0.26, 0.34, v) - smoothstep(0.34, 0.42, v)) * alpha;
    col = mix(col, uAccent, seam * 0.45);
    gl_FragColor = vec4(col * alpha, alpha); // premultiplied
  }
`;

const ACTIVE_DECAY = 0.94; // short tail behind the pointer
const IDLE_DECAY = 0.8; // ~0.3 s to restore the photo after leaving
const FOLLOW = 0.35; // pointer smoothing per frame (1 = raw)

export class RevealScene {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly trailScene = new Scene();
  private readonly camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private readonly geometry = new PlaneGeometry(2, 2);
  private readonly display: ShaderMaterial;
  private readonly trail: ShaderMaterial;
  private targets: [WebGLRenderTarget, WebGLRenderTarget];
  private textures: Texture[] = [];
  private readonly target = new Vector2(0.5, 0.5);
  private readonly smooth = new Vector2(0.5, 0.5);
  private readonly from = new Vector2(0.5, 0.5);
  private active = 0;
  private running = false;
  private readonly ro: ResizeObserver;
  private readonly start = performance.now();

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly opts: RevealOptions,
  ) {
    this.renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'low-power' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    const rt = () => new WebGLRenderTarget(256, 256, { type: HalfFloatType, minFilter: LinearFilter, magFilter: LinearFilter });
    this.targets = [rt(), rt()];

    this.trail = new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: TRAIL,
      uniforms: {
        uPrev: { value: null },
        uFrom: { value: this.from },
        uTo: { value: this.smooth },
        uRadius: { value: 0.17 },
        uActive: { value: 0 },
        uDecay: { value: IDLE_DECAY },
      },
    });
    this.display = new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: DISPLAY,
      transparent: true,
      premultipliedAlpha: true,
      uniforms: {
        uBase: { value: null },
        uHidden: { value: null },
        uTrail: { value: null },
        uAccent: { value: hexToVec3(opts.accent) },
        uTime: { value: 0 },
      },
    });
    this.trailScene.add(new Mesh(this.geometry, this.trail));
    this.scene.add(new Mesh(this.geometry, this.display));

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
  }

  async load(): Promise<void> {
    const loader = new TextureLoader();
    const [base, hidden] = await Promise.all([loader.loadAsync(this.opts.base), loader.loadAsync(this.opts.hidden)]);
    this.textures = [base, hidden];
    this.display.uniforms['uBase'].value = base;
    this.display.uniforms['uHidden'].value = hidden;
    this.resize();
  }

  /** Pointer in element-relative 0..1 coordinates (y up). */
  pointer(x: number, y: number): void {
    if (this.active === 0) {
      // Entering: start the stroke where the pointer is, not where it left.
      this.smooth.set(x, y);
      this.from.set(x, y);
    }
    this.target.set(x, y);
    this.active = 1;
  }

  leave(): void {
    this.active = 0;
  }

  play(): void {
    if (this.running) return;
    this.running = true;
    this.renderer.setAnimationLoop(() => this.frame());
  }

  pause(): void {
    this.running = false;
    this.renderer.setAnimationLoop(null);
  }

  dispose(): void {
    this.pause();
    this.ro.disconnect();
    this.targets.forEach((t) => t.dispose());
    this.textures.forEach((t) => t.dispose());
    this.geometry.dispose();
    this.display.dispose();
    this.trail.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }

  private frame(): void {
    this.from.copy(this.smooth);
    this.smooth.lerp(this.target, FOLLOW);

    const [read, write] = this.targets;
    this.trail.uniforms['uPrev'].value = read.texture;
    this.trail.uniforms['uActive'].value = this.active;
    this.trail.uniforms['uDecay'].value = this.active ? ACTIVE_DECAY : IDLE_DECAY;
    this.renderer.setRenderTarget(write);
    this.renderer.render(this.trailScene, this.camera);
    this.renderer.setRenderTarget(null);
    this.targets = [write, read];

    this.display.uniforms['uTrail'].value = write.texture;
    this.display.uniforms['uTime'].value = (performance.now() - this.start) / 1000;
    this.renderer.render(this.scene, this.camera);
  }

  private resize(): void {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    if (!this.running) this.frame();
  }
}

function hexToVec3(hex: string): Vector3 {
  const n = parseInt(hex.replace('#', ''), 16);
  return new Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}
