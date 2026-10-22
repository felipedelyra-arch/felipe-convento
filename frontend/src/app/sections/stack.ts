import { ChangeDetectionStrategy, Component } from '@angular/core';
import { securitySkills, stackGroups } from '../content/skills';
import { SkillLevel, Tech } from '../content/types';
import { Icon, hasIcon } from '../core/icon';
import { RevealDirective } from '../core/reveal.directive';

interface Area {
  title: string;
  buckets: { label: string; items: Tech[] }[];
}

const LABEL: Record<SkillLevel, string> = {
  practice: 'No dia a dia',
  lab: 'Já fiz em laboratório',
  study: 'Estudando',
};

const bucket = (items: { name: string; level: SkillLevel; icon?: string }[]) =>
  (['practice', 'lab', 'study'] as const)
    .map((l) => ({ label: LABEL[l], items: items.filter((i) => i.level === l) }))
    .filter((b) => b.items.length);

const AREAS: Area[] = [
  ...stackGroups
    .filter((g) => g.title !== 'Segurança')
    .map((g) => ({ title: g.title, buckets: [{ label: '', items: g.items }] })),
  ...securitySkills.map((g) => ({ title: g.title, buckets: bucket(g.items) })),
];

@Component({
  selector: 'app-stack',
  imports: [RevealDirective, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="competencias" class="section wrap">
      <h2 class="title" appReveal>Competências</h2>
      <div class="cols">
        <div>
          <h3 class="col-title" appReveal>Desenvolvimento</h3>
          @for (a of dev; track a.title) {
            <div class="area" appReveal>
              <h4>{{ a.title }}</h4>
              <ul class="tech">
                @for (t of a.buckets[0].items; track t.name) {
                  <li>@if (hasIcon(t.icon)) { <app-icon [name]="t.icon!" /> } {{ t.name }}</li>
                }
              </ul>
            </div>
          }
        </div>
        <div>
          <h3 class="col-title" appReveal>Segurança</h3>
          @for (a of sec; track a.title) {
            <div class="area" appReveal>
              <h4>{{ a.title }}</h4>
              @for (b of a.buckets; track b.label) {
                <p class="bucket"><span class="label">{{ b.label }}:</span> {{ names(b.items) }}</p>
              }
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .cols { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-8); align-items: start; }
    .col-title { font-size: var(--fs-lg); margin-bottom: var(--sp-5); }
    .area { padding: var(--sp-4) 0; }
    .area + .area { margin-top: var(--sp-2); }
    h4 { font-size: var(--fs-sm); font-weight: 500; color: var(--muted); margin-bottom: var(--sp-2); }
    .bucket { font-size: var(--fs-sm); color: var(--title); }
    .bucket + .bucket { margin-top: var(--sp-1); }
    .label { color: var(--text); }
    @media (max-width: 900px) { .cols { grid-template-columns: 1fr; gap: var(--sp-7); } }
  `,
})
export class Stack {
  protected readonly dev = AREAS.filter((a) => a.buckets.length === 1 && a.buckets[0].label === '');
  protected readonly sec = AREAS.filter((a) => !(a.buckets.length === 1 && a.buckets[0].label === ''));
  protected readonly hasIcon = hasIcon;

  protected names(items: Tech[]): string {
    return items.map((i) => i.name).join(', ');
  }
}
