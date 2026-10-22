import { Project } from './types';

// Links and publication states checked on 2026-10-22.
export const projects: Project[] = [
  {
    slug: 'pandavip',
    title: 'PandaVIP',
    kind: 'App de restaurante, projeto meu',
    status: 'live',
    statusLabel: 'na Google Play',
    text:
      'Delivery e clube de assinatura de um restaurante. Fiz o app inteiro em Flutter, com Firebase no back e pagamento pelo Mercado Pago. O sócio do clube tem carteirinha digital, ganha prêmios e cupons, e dá para deixar gorjeta por Pix direto para quem atendeu.',
    points: [],
    link: { label: 'Abrir na Google Play', href: 'https://play.google.com/store/apps/details?id=com.tiopanda.pandavip' },
    details: [
      'Pedido para entrega ou retirada no balcão',
      'Integração com o sistema de gestão do restaurante',
      'Dados pessoais tratados pensando na LGPD',
      'Telas da versão iOS prontas para a App Store',
    ],
    stack: [
      { name: 'Flutter', icon: 'flutter' },
      { name: 'Firebase', icon: 'firebase' },
      { name: 'Mercado Pago', icon: 'mercadopago' },
    ],
    media: 'pandavip',
  },
  {
    slug: 'mercadog',
    title: 'Mercadog',
    kind: 'Site para cliente, petshop e clínica veterinária',
    status: 'live',
    statusLabel: 'no ar',
    text:
      'Site de um petshop e clínica veterinária. Tem agendamento de consulta e de banho e tosa, loja e um atalho de emergência que cai direto no WhatsApp do veterinário. O login é com Supabase, e cada cliente só enxerga os próprios dados por causa das regras de acesso no banco (RLS).',
    points: [],
    link: { label: 'Visitar mercadog.com.br', href: 'https://www.mercadog.com.br' },
    details: [],
    stack: [
      { name: 'React', icon: 'react' },
      { name: 'Supabase', icon: 'supabase' },
      { name: 'PostgreSQL', icon: 'postgresql' },
    ],
    media: 'mercadog',
  },
  {
    slug: 'keyhound',
    title: 'Keyhound',
    kind: 'Ferramenta open source em Python',
    status: 'live',
    statusLabel: 'versão 0.3.0 no PyPI',
    text:
      'É muito fácil esquecer uma chave de API ou uma senha no código e só perceber depois do push. O Keyhound procura esse tipo de coisa nos arquivos e no histórico do Git, tudo offline. São 19 regras, 9 delas para serviços brasileiros, como o token do Mercado Pago que aparece no print.',
    points: [],
    link: { label: 'Código no GitHub', href: 'https://github.com/felipedelyra-arch/keyhound' },
    details: [
      'Gera relatório SARIF, que o GitHub Actions entende',
      'Também está no GitHub Marketplace',
      'Testes com pytest, licença Apache 2.0',
      'Estou fazendo um painel local, sem nuvem e sem cadastro',
    ],
    stack: [
      { name: 'Python', icon: 'python' },
      { name: 'pytest', icon: 'pytest' },
      { name: 'GitHub Actions', icon: 'githubactions' },
    ],
    media: 'keyhound-cli',
  },
  {
    slug: 'labsoc',
    title: 'LabSOC',
    kind: 'Laboratório de Blue Team',
    status: 'live',
    statusLabel: 'em uso',
    text:
      'Montei um laboratório para ver um ataque acontecer do começo ao fim e treinar a resposta. O alvo é monitorado pelo Wazuh, que roda em Docker numa VM Kali.',
    points: [],
    details: [],
    stack: [],
    media: 'labsoc',
  },
  {
    slug: 'ack-admy',
    title: 'ACK-ADMY',
    kind: 'App acadêmico em Flutter',
    status: 'building',
    statusLabel: 'em desenvolvimento',
    text:
      'Um app no estilo Duolingo para ensinar segurança da informação, com trilhas, XP, vidas, ranking e um painel para o professor. Participei do desenvolvimento; está sendo testado com alunos da Unimar.',
    points: [],
    details: [],
    stack: [],
  },
  {
    slug: 'ransomware-ml',
    title: 'Ransomware e machine learning',
    kind: 'Pesquisa',
    status: 'scope',
    statusLabel: 'ainda no papel',
    text:
      'A ideia é detectar ransomware pelo comportamento: muitos arquivos sendo reescritos e renomeados de uma vez, entropia subindo nos arquivos alterados, extensões estranhas e nota de resgate aparecendo em várias pastas.',
    points: [],
    details: [],
    stack: [],
  },
];
