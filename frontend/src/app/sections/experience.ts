import { ChangeDetectionStrategy, Component } from '@angular/core';
import { timeline } from '../content/timeline';
import { RevealDirective } from '../core/reveal.directive';

@Component({
  selector: 'app-experience',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="experiencia" class="section wrap exp">
      <h2 class="title" appReveal>Experiência e formação</h2>
      <ol appReveal="children">
        @for (e of timeline; track e.title) {
          <li>
            <p class="when">{{ e.period }}</p>
            <div>
              <h3>{{ e.title }}</h3>
              <p class="org">{{ e.org }}</p>
              @if (e.note) { <p class="note">{{ e.note }}</p> }
            </div>
          </li>
        }
      </ol>
    </section>
  `,
  styles: `
    .exp { display: grid; grid-template-columns: 4fr 8fr; gap: var(--sp-7); align-items: start; }
    .exp > h2 { margin: 0; }
    @media (max-width: 900px) { .exp { grid-template-columns: 1fr; gap: var(--sp-5); } }
    ol { display: grid; gap: var(--sp-2); max-width: 60rem; }
    li {
      display: grid; grid-template-columns: 3fr 9fr; gap: var(--sp-5); align-items: baseline;
      padding: var(--sp-4) 0;
    }
    h3 { font-size: var(--fs-lg); line-height: 1.25; }
    .org { margin-top: var(--sp-1); font-size: var(--fs-sm); }
    .note { margin-top: var(--sp-2); max-width: 60ch; font-size: var(--fs-sm); }
    .when { font-variant-numeric: tabular-nums; font-size: var(--fs-sm); color: var(--muted); }
    @media (max-width: 900px) {
      li { grid-template-columns: 1fr; gap: var(--sp-1); }
    }
  `,
})
export class Experience {
  protected readonly timeline = timeline;
}
