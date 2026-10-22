# Segurança do site (notas técnicas)

Movido do rodapé público: detalhes de infraestrutura que não ajudam o visitante a avaliar o trabalho.

- Frontend 100% estático (Angular prerender); nenhum banco ou servidor exposto.
- Fonte (Barlow) e imagens servidas do próprio domínio, sem CDNs de terceiros.
- Sem cookies, analytics ou rastreadores.
- Build de produção sem source maps.
- Pendente: CSP com hashes e headers (HSTS, frame-ancestors etc.) na Vercel. O `autoCsp` do Angular não funciona com prerender; ver ADR a escrever.
