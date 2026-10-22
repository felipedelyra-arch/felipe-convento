import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { profile, socials } from '../content/profile';
import { Icon } from '../core/icon';
import { RevealDirective } from '../core/reveal.directive';

@Component({
  selector: 'app-footer',
  imports: [Icon, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer id="contato" class="wrap">
      <div class="cta" appReveal="children">
        <h2>Contato</h2>
        <p>Estou aberto a projetos freelance e a vagas de SOC ou de desenvolvimento. {{ hint() }}</p>
        <div class="actions">
          <a class="btn" [href]="primary().href" [attr.target]="primary().external ? '_blank' : null" rel="noopener noreferrer">
            @if (primary().icon; as i) { <app-icon [name]="i" /> } {{ primary().label }}
          </a>
          @for (s of secondary(); track s.href) {
            <a class="btn quiet" [href]="s.href" target="_blank" rel="noopener noreferrer"><app-icon [name]="s.icon!" /> {{ s.label }}</a>
          }
        </div>
      </div>

      <div class="bottom">
        <p>{{ profile.name }}</p>
        <nav aria-label="Rodapé">
          <a href="#projetos">Projetos</a>
          <a href="#competencias">Competências</a>
          <a href="#experiencia">Experiência</a>
          <a href="#top">Voltar ao topo</a>
        </nav>
      </div>
    </footer>
  `,
  styles: `
    footer { padding-block: var(--section-pad) var(--sp-6); display: grid; gap: var(--sp-8); }
    .cta { display: grid; grid-template-columns: 4fr 8fr; gap: var(--sp-4) var(--sp-7); align-items: start; }
    .cta > p, .cta > .actions { grid-column: 2; }
    .cta > h2 { grid-row: 1 / span 2; }
    @media (max-width: 900px) { .cta { grid-template-columns: 1fr; } .cta > p, .cta > .actions, .cta > h2 { grid-column: 1; grid-row: auto; } }
    h2 { font-size: var(--fs-2xl); }
    .cta > p { font-size: var(--fs-lg); }
    .actions { display: flex; flex-wrap: wrap; gap: var(--sp-3); }
    .bottom { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: var(--sp-4); font-size: var(--fs-sm); color: var(--muted); }
    nav { display: flex; flex-wrap: wrap; gap: var(--sp-5); }
    nav a { text-decoration: none; color: var(--text); &:hover { color: var(--title); } }
  `,
})
export class Footer {
  protected readonly profile = profile;
  private readonly links = socials();
  /** Direct channel first: e-mail, then LinkedIn; GitHub only when nothing direct is configured. */
  protected readonly primary = computed(() => {
    if (profile.email) return { label: 'Enviar e-mail', href: `mailto:${profile.email}`, icon: undefined, external: false };
    const s = this.links.find((l) => l.label === 'LinkedIn') ?? this.links[0];
    return { label: s.label === 'LinkedIn' ? 'Me chamar no LinkedIn' : 'GitHub', href: s.href, icon: s.icon, external: true };
  });
  protected readonly secondary = computed(() => this.links.filter((l) => l.href !== this.primary().href));
  protected readonly hint = computed(() =>
    profile.email || profile.linkedin ? '' : 'Por enquanto, o melhor caminho é o meu GitHub.',
  );
}
