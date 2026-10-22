import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MotionService } from './core/motion.service';
import { About } from './sections/about';
import { Experience } from './sections/experience';
import { Footer } from './sections/footer';
import { Hero } from './sections/hero';
import { Stack } from './sections/stack';
import { Work } from './sections/work';

@Component({
  selector: 'app-root',
  imports: [Hero, About, Work, Stack, Experience, Footer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <main id="conteudo" class="main">
      <app-hero />
      <app-about class="s-about" />
      <app-work class="s-work" />
      <app-stack class="s-stack" />
      <app-experience class="s-exp" />
    </main>
    <app-footer />
  `,
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    // Instantiated here so Lenis/GSAP boot once for the whole app.
    inject(MotionService);
  }
}
