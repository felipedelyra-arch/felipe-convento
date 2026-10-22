import { Directive, ElementRef, afterNextRender, inject, input, DestroyRef } from '@angular/core';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { prefersReducedMotion } from './motion.service';

/**
 * Scroll reveal. 'lines' splits text into masked lines; 'children' staggers direct children.
 * Content is visible in the prerendered HTML; the hidden state only exists once GSAP runs.
 */
@Directive({ selector: '[appReveal]' })
export class RevealDirective {
  readonly appReveal = input<'lines' | 'children' | 'up' | ''>('up');

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    let ctx: gsap.Context | undefined;

    afterNextRender(() => {
      if (prefersReducedMotion()) return;
      const trigger = { trigger: el, start: 'top 85%', once: true };
      ctx = gsap.context(() => {
        switch (this.appReveal()) {
          case 'lines':
            SplitText.create(el, {
              type: 'lines',
              mask: 'lines',
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, {
                  yPercent: 105,
                  duration: 0.9,
                  ease: 'expo.out',
                  stagger: 0.08,
                  scrollTrigger: trigger,
                }),
            });
            break;
          case 'children':
            gsap.from(el.children, {
              y: 28,
              autoAlpha: 0,
              duration: 0.7,
              ease: 'power3.out',
              stagger: 0.06,
              scrollTrigger: trigger,
            });
            break;
          default:
            gsap.from(el, { y: 32, autoAlpha: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: trigger });
        }
      });
    });

    inject(DestroyRef).onDestroy(() => ctx?.revert());
  }
}
