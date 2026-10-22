import { ChangeDetectionStrategy, Component } from '@angular/core';
import { profile } from '../content/profile';
import { RevealDirective } from '../core/reveal.directive';

@Component({
  selector: 'app-about',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="sobre" class="section wrap">
      <h2 class="title" appReveal>Sobre</h2>
      <div class="grid">
        <div class="text" appReveal="children">
          @for (p of profile.about; track $index) { <p>{{ p }}</p> }
        </div>
        <dl class="now" appReveal="children">
          @for (n of profile.now; track n.label) {
            <div><dt>{{ n.label }}</dt><dd>{{ n.value }}</dd></div>
          }
        </dl>
      </div>
    </section>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: 7fr 5fr; gap: var(--sp-8); align-items: start; }
    .text { display: grid; gap: var(--sp-5); max-width: 60ch; }
    .text p:first-child { color: var(--title); font-size: var(--fs-lg); line-height: 1.5; }
    .now { margin: 0; display: grid; gap: var(--sp-5); padding: var(--sp-6); background: var(--surface); border-radius: var(--r-sm); }
    dt { font-size: var(--fs-xs); color: var(--muted); }
    dd { margin: var(--sp-1) 0 0; color: var(--title); }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; gap: var(--sp-6); } }
  `,
})
export class About {
  protected readonly profile = profile;
}
