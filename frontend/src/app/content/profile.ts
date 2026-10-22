import { Link } from './types';

export const profile = {
  name: 'Felipe Convento',
  firstName: 'Felipe',
  lastName: 'Convento',
  heroLine:
    'Sou desenvolvedor full stack. Estudo Cibersegurança na Unimar e estou me preparando para trabalhar com Blue Team e SOC.',
  about: [
    'Comecei sozinho, mexendo com JavaScript e React. Antes disso já fazia algumas coisas em PHP com MySQL. Entrei em Análise e Desenvolvimento de Sistemas, mas troquei para Segurança da Informação, e hoje curso Cibersegurança e Infraestrutura de Redes na Unimar.',
    'Desde maio de 2026 atendo clientes como freelancer, fazendo sites e apps. No resto do tempo monto laboratório. Quero trabalhar em SOC, então estudo principalmente monitoramento, análise de log e resposta a incidente. Pentest também entra nos estudos, sempre no meu laboratório: ajuda a entender o que eu estou tentando detectar.',
  ],
  now: [
    { label: 'Trabalho', value: 'Sites e apps sob encomenda, em React, Next.js, Angular e Flutter' },
    { label: 'Laboratório', value: 'SOC em casa: Wazuh em Docker numa VM Kali' },
    { label: 'Open source', value: 'Keyhound, um detector de credenciais vazadas' },
    { label: 'Faculdade', value: 'Cibersegurança na Unimar, até 2029' },
  ],
  githubUser: 'felipedelyra-arch',
  linkedin: 'https://www.linkedin.com/in/felipe-de-lyra-4855713b0' as string | null,
  email: 'felipedelyra@gmail.com' as string | null,
  portrait: { human: 'img/portrait.webp', machine: 'img/portrait-robot.webp' } as { human: string; machine: string } | null,
};

export const socials = (): Link[] => [
  { label: 'GitHub', href: `https://github.com/${profile.githubUser}`, icon: 'github' },
  ...(profile.linkedin ? [{ label: 'LinkedIn', href: profile.linkedin, icon: 'linkedin' }] : []),
];
