import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { profile, socials } from '../content/profile';
import { Icon } from '../core/icon';
import { prefersReducedMotion } from '../core/motion.service';
import { RevealImage } from '../reveal/reveal-image';

@Component({
  selector: 'app-hero',
  imports: [RevealImage, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="top" class="hero" #root>
      <header class="bar wrap">
        <a href="#top" class="mark" aria-label="Felipe Convento, início">FC</a>
        <nav aria-label="Principal">
          <a href="#sobre">Sobre</a>
          <a href="#projetos">Projetos</a>
          <a href="#competencias" class="hide-sm">Competências</a>
          <a href="#experiencia" class="hide-sm">Experiência</a>
        </nav>
        <a href="#contato" class="contact-link">Contato</a>
      </header>

      <div class="stage wrap">
        <div class="copy">
          <h1 class="name" [attr.aria-label]="profile.name">
            <span class="mask" aria-hidden="true"><span class="line">{{ profile.firstName }}</span></span>
            <span class="mask" aria-hidden="true"><span class="line">{{ profile.lastName }}</span></span>
          </h1>
          <p class="intro">{{ profile.heroLine }}</p>
          <div class="actions">
            <a href="#projetos" class="btn">Ver projetos</a>
            @for (s of socials; track s.href) {
              <a [href]="s.href" class="btn quiet" target="_blank" rel="noopener noreferrer"><app-icon [name]="s.icon!" /> {{ s.label }}</a>
            }
          </div>
        </div>

        @if (profile.portrait; as p) {
          <figure class="portrait">
            <app-reveal-image [base]="p.human" [hidden]="p.machine" alt="Retrato de Felipe Convento" />
            <figcaption class="hint" aria-hidden="true">
              <span class="hint-desktop">passe o mouse no rosto</span>
              <span class="hint-touch">toque no rosto</span>
            </figcaption>
          </figure>
        }
      </div>
    </section>
  `,
  styleUrl: './hero.scss',
})
export class Hero {
  protected readonly profile = profile;
  protected readonly socials = socials();
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  constructor() {
    let tl: gsap.core.Timeline | undefined;
    afterNextRender(() => {
      if (prefersReducedMotion()) return;
      const el = this.root().nativeElement;
      // Entrance only; nothing in the hero moves during the portrait interaction.
      tl = gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from(el.querySelector('.portrait'), { autoAlpha: 0, y: 40, duration: 1.4 }, 0)
        .from(el.querySelectorAll('.name .line'), { yPercent: 110, duration: 1.1, stagger: 0.1 }, 0.1)
        .from(el.querySelectorAll('.intro, .actions'), { y: 16, autoAlpha: 0, duration: 0.8, stagger: 0.07 }, 0.45);
    });
    inject(DestroyRef).onDestroy(() => tl?.kill());
  }
}
