import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { prefersReducedMotion } from '../core/motion.service';
import type { RevealScene } from './reveal-scene';

const TAP_REVEAL_MS = 900;

/**
 * Portrait with a hidden robot layer. A mouse reveals it where it passes; a tap reveals it
 * briefly around the finger. The plain <img> is the content: without WebGL or with reduced
 * motion only the photo shows, and the canvas never blocks scrolling.
 */
@Component({
  selector: 'app-reveal-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.gl]': 'glReady()' },
  template: `
    <div class="frame" #frame>
      <img [src]="base()" [alt]="alt()" [width]="size()" [height]="size()" fetchpriority="high" />
      <canvas #canvas aria-hidden="true"></canvas>
    </div>
  `,
  styles: `
    :host { display: block; }
    .frame { position: relative; aspect-ratio: 1; touch-action: pan-y; }
    img, canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
    canvas { opacity: 0; transition: opacity 400ms var(--ease-out); }
    :host(.gl) canvas { opacity: 1; }
  `,
})
export class RevealImage {
  readonly base = input.required<string>();
  readonly hidden = input.required<string>();
  readonly alt = input.required<string>();
  readonly size = input(1200);
  readonly accent = input('#3b74ff');

  protected readonly glReady = signal(false);
  private readonly frame = viewChild.required<ElementRef<HTMLElement>>('frame');
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private scene?: RevealScene;

  constructor() {
    const cleanups: (() => void)[] = [];
    inject(DestroyRef).onDestroy(() => {
      cleanups.forEach((fn) => fn());
      this.scene?.dispose();
    });

    afterNextRender(() => {
      if (prefersReducedMotion() || !this.webgl()) return;
      const frame = this.frame().nativeElement;
      // WebGL loads only when the portrait is near the viewport and renders only while visible.
      const io = new IntersectionObserver(
        async ([e]) => {
          if (!this.scene && e.isIntersecting) await this.init(frame, cleanups);
          if (this.scene) e.isIntersecting ? this.scene.play() : this.scene.pause();
        },
        { rootMargin: '200px' },
      );
      io.observe(frame);
      cleanups.push(() => io.disconnect());
    });
  }

  private async init(frame: HTMLElement, cleanups: (() => void)[]): Promise<void> {
    const { RevealScene } = await import('./reveal-scene');
    const scene = new RevealScene(this.canvas().nativeElement, {
      base: this.base(),
      hidden: this.hidden(),
      accent: this.accent(),
    });
    await scene.load();
    this.scene = scene;
    this.glReady.set(true);

    // Coordinates are read from the live bounding box on every event, so scroll, resize and
    // zoom never desync the reveal from the cursor.
    let last: { x: number; y: number } | null = null;
    const toScene = (x: number, y: number) => {
      const r = frame.getBoundingClientRect();
      const u = (x - r.left) / r.width;
      const v = (y - r.top) / r.height;
      if (u < 0 || u > 1 || v < 0 || v > 1) return scene.leave();
      scene.pointer(u, 1 - v);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      last = { x: e.clientX, y: e.clientY };
      toScene(e.clientX, e.clientY);
    };
    const leave = () => {
      last = null;
      scene.leave();
    };
    // Wheel scrolling moves the portrait under a still cursor.
    const scroll = () => last && toScene(last.x, last.y);
    let tapTimer: ReturnType<typeof setTimeout> | undefined;
    const tap = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return;
      toScene(e.clientX, e.clientY);
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => scene.leave(), TAP_REVEAL_MS);
    };

    frame.addEventListener('pointermove', move);
    frame.addEventListener('pointerleave', leave);
    frame.addEventListener('pointerdown', tap);
    addEventListener('scroll', scroll, { passive: true });
    cleanups.push(() => {
      clearTimeout(tapTimer);
      frame.removeEventListener('pointermove', move);
      frame.removeEventListener('pointerleave', leave);
      frame.removeEventListener('pointerdown', tap);
      removeEventListener('scroll', scroll);
    });
  }

  private webgl(): boolean {
    try {
      return !!document.createElement('canvas').getContext('webgl2');
    } catch {
      return false;
    }
  }
}
