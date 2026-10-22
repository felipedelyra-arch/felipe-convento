import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  siAngular, siDart, siDebian, siDocker, siFirebase, siFlutter, siGit, siGithub, siGithubactions, siGrafana,
  siJavascript, siKalilinux, siLinux, siMercadopago, siMysql, siNextdotjs, siNodedotjs, siOpenjdk, siPhp,
  siPortainer, siPostgresql, siPytest, siPython, siReact, siSpringboot, siSupabase, siTailwindcss, siTypescript,
  siVercel, siVirustotal, siWireshark,
} from 'simple-icons';

// Only the icons the content uses are imported, so the rest of the set is tree-shaken away.
const PATHS: Record<string, string> = {
  angular: siAngular.path, dart: siDart.path, debian: siDebian.path, docker: siDocker.path,
  firebase: siFirebase.path, flutter: siFlutter.path, git: siGit.path, github: siGithub.path,
  githubactions: siGithubactions.path, grafana: siGrafana.path, javascript: siJavascript.path,
  kali: siKalilinux.path, linux: siLinux.path, mercadopago: siMercadopago.path, mysql: siMysql.path,
  nextjs: siNextdotjs.path, nodejs: siNodedotjs.path, java: siOpenjdk.path, php: siPhp.path,
  portainer: siPortainer.path, postgresql: siPostgresql.path, pytest: siPytest.path, python: siPython.path,
  react: siReact.path, spring: siSpringboot.path, supabase: siSupabase.path, tailwind: siTailwindcss.path,
  typescript: siTypescript.path, vercel: siVercel.path, virustotal: siVirustotal.path, wireshark: siWireshark.path,
  // LinkedIn is no longer shipped by simple-icons; standard "in" mark.
  linkedin:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
};

/** Brand mark from simple-icons, drawn in currentColor. Decorative: the label sits next to it. */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `@if (path(); as d) { <svg viewBox="0 0 24 24"><path [attr.d]="d" /></svg> }`,
  styles: `
    :host { display: inline-flex; width: 1.15em; height: 1.15em; flex-shrink: 0; }
    svg { width: 100%; height: 100%; fill: currentColor; }
  `,
})
export class Icon {
  readonly name = input.required<string>();
  protected readonly path = computed(() => PATHS[this.name()]);
}

export const hasIcon = (name?: string): boolean => !!name && name in PATHS;
