import { ChangeDetectionStrategy, Component } from '@angular/core';
import { projects } from '../content/projects';
import { Icon, hasIcon } from '../core/icon';
import { RevealDirective } from '../core/reveal.directive';
import { Lab } from './lab';

@Component({
  selector: 'app-work',
  imports: [RevealDirective, Icon, Lab],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="projetos" class="section wrap">
      <h2 class="title" appReveal>Projetos</h2>

      @for (p of featured; track p.slug; let odd = $odd) {
        @if (p.media === 'labsoc') {
          <app-lab [project]="p" />
        } @else {
          <article class="project" [class.flip]="odd" [attr.aria-labelledby]="'p-' + p.slug">
            <div class="media panel" appReveal>
              @switch (p.media) {
                @case ('keyhound-cli') {
                  <!-- Real output of "keyhound scan" (v0.3.0) on a folder with fake credentials. -->
                  <div class="term" role="img" aria-label="Saída real do Keyhound encontrando duas credenciais críticas">
                    <pre><span class="dim">$</span> keyhound scan demo/
┏━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━┳━━━━━━┓
┃ Sev.     ┃ Rule              ┃ File:line         ┃ Ent. ┃
┡━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━╇━━━━━━┩
│ <b>CRITICAL</b> │ github-token      │ app/settings.py:3 │ 5.25 │
│ <b>CRITICAL</b> │ mercadopago-token │ app/settings.py:4 │ 4.27 │
└──────────┴───────────────────┴───────────────────┴──────┘

2 finding(s): <b>2 critical</b></pre>
                  </div>
                }
                @case ('pandavip') {
                  <div class="phones">
                    <img src="img/pandavip-inicio.webp" alt="PandaVIP: tela inicial do clube" width="540" height="1173" loading="lazy" />
                    <img src="img/pandavip-cardapio.webp" alt="PandaVIP: cardápio com pratos e preços" width="540" height="1173" loading="lazy" />
                    <img src="img/pandavip-gorjeta.webp" alt="PandaVIP: gorjeta via Pix para o atendente" width="540" height="1173" loading="lazy" />
                  </div>
                }
                @case ('mercadog') {
                  <div class="browser">
                    <div class="chrome" aria-hidden="true"><span></span><span></span><span></span><p>mercadog.com.br</p></div>
                    <img src="img/mercadog.webp" alt="Página inicial do site Mercadog" width="1280" height="759" loading="lazy" />
                  </div>
                }
              }
            </div>

            <div class="text" appReveal="children">
              <h3 [id]="'p-' + p.slug">{{ p.title }}</h3>
              <p class="meta">{{ p.kind }}, {{ p.statusLabel }}</p>
              <p class="body">{{ p.text }}</p>
              <ul class="tech" aria-label="Tecnologias">
                @for (t of p.stack; track t.name) {
                  <li>@if (hasIcon(t.icon)) { <app-icon [name]="t.icon!" /> } {{ t.name }}</li>
                }
              </ul>
              @if (p.link; as l) {
                <a class="btn" [href]="l.href" target="_blank" rel="noopener noreferrer">{{ l.label }}</a>
              }
              @if (p.details.length) {
                <details class="more">
                  <summary><span class="more-label">mais detalhes</span><span class="less">menos detalhes</span></summary>
                  <ul class="details">
                    @for (d of p.details; track d) { <li>{{ d }}</li> }
                  </ul>
                </details>
              }
            </div>
          </article>
        }
      }

      <div class="also">
        <h3 appReveal>Em andamento</h3>
        @for (p of others; track p.slug) {
          <article appReveal="children">
            <h4>{{ p.title }}</h4>
            <p class="meta">{{ p.kind }}, {{ p.statusLabel }}</p>
            <p>{{ p.text }}</p>
          </article>
        }
      </div>
    </section>
  `,
  styleUrl: './work.scss',
})
export class Work {
  protected readonly hasIcon = hasIcon;
  protected readonly featured = projects.filter((p) => p.media);
  protected readonly others = projects.filter((p) => !p.media);
}
