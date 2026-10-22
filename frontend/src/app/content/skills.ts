import { SkillGroup, StackGroup } from './types';

export const stackGroups: StackGroup[] = [
  {
    title: 'Frontend',
    items: [
      { name: 'React', icon: 'react' },
      { name: 'Next.js', icon: 'nextjs' },
      { name: 'Angular', icon: 'angular' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'Tailwind', icon: 'tailwind' },
    ],
  },
  { title: 'Mobile', items: [{ name: 'Flutter', icon: 'flutter' }, { name: 'Dart', icon: 'dart' }] },
  {
    title: 'Backend',
    items: [
      { name: 'Java', icon: 'java' },
      { name: 'Spring Boot', icon: 'spring' },
      { name: 'Node.js', icon: 'nodejs' },
      { name: 'PHP', icon: 'php' },
      { name: 'Python', icon: 'python' },
    ],
  },
  {
    title: 'Dados',
    items: [
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'Supabase', icon: 'supabase' },
      { name: 'Firebase', icon: 'firebase' },
      { name: 'MySQL', icon: 'mysql' },
    ],
  },
  {
    title: 'DevOps',
    items: [
      { name: 'Docker', icon: 'docker' },
      { name: 'Git', icon: 'git' },
      { name: 'GitHub Actions', icon: 'githubactions' },
      { name: 'Vercel', icon: 'vercel' },
      { name: 'Linux', icon: 'linux' },
    ],
  },
  {
    title: 'Segurança',
    items: [
      { name: 'Kali Linux', icon: 'kali' },
      { name: 'Wireshark', icon: 'wireshark' },
      { name: 'Wazuh' },
      { name: 'Fail2ban' },
      { name: 'Nmap' },
      { name: 'Grafana', icon: 'grafana' },
      { name: 'VirusTotal', icon: 'virustotal' },
      { name: 'YARA' },
      { name: 'Portainer', icon: 'portainer' },
    ],
  },
];

export const securitySkills: SkillGroup[] = [
  {
    title: 'SOC e monitoramento',
    desc: 'Coletar, correlacionar e triar eventos de segurança para separar ruído de incidente.',
    items: [
      { name: 'Conceitos de SIEM e SOC', level: 'study' },
      { name: 'Wazuh', level: 'lab' },
      { name: 'Agentes e integrações do Wazuh', level: 'study' },
      { name: 'Análise de logs', level: 'lab' },
      { name: 'Triagem de alertas', level: 'lab' },
      { name: 'Detecção de força bruta', level: 'lab' },
      { name: 'Fail2ban', level: 'lab' },
    ],
  },
  {
    title: 'Threat hunting e malware',
    desc: 'Procurar sinais de comprometimento e analisar artefatos suspeitos antes do alerta.',
    items: [
      { name: 'Threat hunting em Windows e Linux', level: 'study' },
      { name: 'Dashboards de segurança com Grafana', level: 'study', icon: 'grafana' },
      { name: 'Malware hunting com YARA', level: 'study' },
      { name: 'VirusTotal', level: 'study', icon: 'virustotal' },
    ],
  },
  {
    title: 'Redes e tráfego',
    desc: 'Entender o que trafega na rede e reconhecer padrões de ataque nos pacotes.',
    items: [
      { name: 'TCP/IP', level: 'lab' },
      { name: 'Análise de pacotes com Wireshark', level: 'lab', icon: 'wireshark' },
      { name: 'Nmap', level: 'lab' },
      { name: 'VPN e SSH', level: 'lab' },
    ],
  },
  {
    title: 'Sistemas',
    desc: 'Operar e endurecer os sistemas onde os serviços e o laboratório rodam.',
    items: [
      { name: 'Linux (Debian, Kali)', level: 'practice', icon: 'debian' },
      { name: 'Windows e PowerShell', level: 'study' },
      { name: 'Virtualização', level: 'lab' },
      { name: 'Docker e Portainer', level: 'practice', icon: 'docker' },
    ],
  },
  {
    title: 'Pentest',
    desc: 'Simular o atacante em ambiente autorizado para saber o que precisa ser defendido.',
    items: [
      { name: 'Kali Linux', level: 'study', icon: 'kali' },
      { name: 'Nmap', level: 'study' },
      { name: 'Ataques simulados em laboratório próprio', level: 'study' },
      { name: 'Noções de OWASP Top 10', level: 'study' },
    ],
  },
  {
    title: 'Segurança de aplicações',
    desc: 'Escrever e revisar código que resiste aos ataques mais comuns da web.',
    items: [
      { name: 'OWASP Top 10', level: 'practice' },
      { name: 'Secure Coding', level: 'practice' },
      { name: 'Detecção de segredos', level: 'practice' },
      { name: 'Análise de dependências', level: 'practice' },
    ],
  },
];

export const levelLabel = { lab: 'Laboratório', practice: 'Prática', study: 'Estudo' } as const;
