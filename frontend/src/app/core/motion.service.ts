import { Injectable, afterNextRender } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

export const prefersReducedMotion = (): boolean =>
  matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer = (): boolean => matchMedia('(pointer: fine)').matches;

/** Owns GSAP plugin registration and Lenis. Browser-only: everything runs in afterNextRender. */
@Injectable({ providedIn: 'root' })
export class MotionService {
  constructor() {
    afterNextRender(() => {
      gsap.registerPlugin(ScrollTrigger, SplitText);
      // Native scroll on touch and reduced motion: smoother there and friendlier to assistive tech.
      if (prefersReducedMotion() || !hasFinePointer()) return;
      const lenis = new Lenis({ anchors: true, lerp: 0.12 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    });
  }
}
