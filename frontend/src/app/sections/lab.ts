import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { Project, Tech } from '../content/types';
import { Icon, hasIcon } from '../core/icon';
import { RevealDirective } from '../core/reveal.directive';

interface Step {
  tab: string;
  /** What happened in this step and why, in first person. */
  text: string;
  tools: Tech[];
  /** Literal command and output, in the tools' real formats. */
  log: string;
}

// Lab IPs are replaced by RFC 5737 documentation ranges before publishing.
const STEPS: Step[] = [
  {
    tab: 'Ataque',
    text: 'Do Kali, rodei o Hydra contra o SSH da máquina-alvo. É um ataque de força bruta simples, mas gera exatamente o tipo de evento que eu queria aprender a enxergar. Tudo dentro do meu ambiente.',
    tools: [{ name: 'Kali Linux', icon: 'kali' }, { name: 'Hydra' }],
    log: `$ hydra -l root -P wordlist.txt ssh://192.0.2.10
[DATA] attacking ssh://192.0.2.10:22/`,
  },
  {
    tab: 'Detecção',
    text: 'No Wireshark, filtrando só as conexões novas na porta 22, a rajada fica óbvia: o mesmo IP abrindo conexão atrás de conexão.',
    tools: [{ name: 'Wireshark', icon: 'wireshark' }],
    log: `filtro: tcp.port == 22 && tcp.flags.syn == 1
192.0.2.44 → 192.0.2.10  TCP  52790 → 22 [SYN]
192.0.2.44 → 192.0.2.10  TCP  52802 → 22 [SYN]
192.0.2.44 → 192.0.2.10  TCP  52814 → 22 [SYN]`,
  },
  {
    tab: 'Análise',
    text: 'Depois fui no log de autenticação com o journalctl. Mesmo IP, mesmo horário, senha errada várias vezes seguidas, para o root e para usuários que nem existem.',
    tools: [{ name: 'journalctl' }, { name: 'Linux', icon: 'linux' }],
    log: `$ journalctl -u ssh | grep "Failed password"
sshd[2291]: Failed password for root from 192.0.2.44 port 52790
sshd[2293]: Failed password for root from 192.0.2.44 port 52802
sshd[2295]: Failed password for invalid user admin from 192.0.2.44`,
  },
  {
    tab: 'Contenção',
    text: 'O Fail2ban bloqueou o IP sozinho depois das tentativas. O Wazuh recebe os eventos do agente instalado no alvo, então o histórico fica guardado para eu analisar depois.',
    tools: [{ name: 'Fail2ban' }, { name: 'Wazuh' }],
    log: `$ fail2ban-client status sshd
Status for the jail: sshd
|- Currently failed: 0
\`- Actions
   |- Currently banned: 1
   \`- Banned IP list: 192.0.2.44`,
  },
];

const ENVIRONMENT = [
  'VM Kali Linux com 6 GB de RAM',
  'Wazuh 4.14.0 single-node em Docker (manager, indexer e dashboard)',
  'Portainer para cuidar dos containers',
  'Agente do Wazuh na máquina monitorada',
];

@Component({
  selector: 'app-lab',
  imports: [RevealDirective, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article id="laboratorio" class="lab" aria-labelledby="lab-title">
      <div class="head" appReveal="children">
        <h3 id="lab-title">{{ project().title }}</h3>
        <p class="meta">{{ project().kind }}, {{ project().statusLabel }}</p>
        <p class="body">{{ project().text }} Abaixo, o caminho do incidente.</p>
      </div>

      <div class="board" appReveal>
        <div class="tabs" role="tablist" aria-label="Etapas do incidente">
          @for (s of steps; track s.tab; let i = $index) {
            <button
              type="button"
              role="tab"
              [id]="'lab-tab-' + i"
              [attr.aria-selected]="i === active()"
              [attr.aria-controls]="'lab-panel-' + i"
              [attr.tabindex]="i === active() ? 0 : -1"
              (click)="active.set(i)"
              (keydown)="keys($event)"
            >{{ s.tab }}</button>
          }
        </div>

        @for (s of steps; track s.tab; let i = $index) {
          @if (i === active()) {
            <div class="step" role="tabpanel" [id]="'lab-panel-' + i" [attr.aria-labelledby]="'lab-tab-' + i">
              <div class="explain">
                <p>{{ s.text }}</p>
                <ul class="tech" aria-label="Ferramentas">
                  @for (t of s.tools; track t.name) {
                    <li>@if (hasIcon(t.icon)) { <app-icon [name]="t.icon!" /> } {{ t.name }}</li>
                  }
                </ul>
              </div>
              <pre class="log" [attr.aria-label]="'Log da etapa ' + s.tab">{{ s.log }}</pre>
            </div>
          }
        }
        <p class="note">Troquei os IPs do laboratório por endereços de documentação (RFC 5737).</p>
      </div>

      <details class="more">
        <summary><span class="more-label">como o laboratório está montado</span><span class="less">esconder</span></summary>
        <ul class="env">
          @for (e of environment; track e) { <li>{{ e }}</li> }
        </ul>
      </details>
    </article>
  `,
  styleUrl: './lab.scss',
})
export class Lab {
  readonly project = input.required<Project>();
  protected readonly steps = STEPS;
  protected readonly environment = ENVIRONMENT;
  protected readonly active = signal(0);
  protected readonly hasIcon = hasIcon;

  protected keys(e: KeyboardEvent): void {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (this.active() + delta + STEPS.length) % STEPS.length;
    this.active.set(next);
    document.getElementById(`lab-tab-${next}`)?.focus();
  }
}
