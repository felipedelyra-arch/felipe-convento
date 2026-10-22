// Fails the build when the prerendered HTML has an inline script whose hash is not
// allowed by the CSP in vercel.json, so a framework update can't silently break the site.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const html = readFileSync('dist/frontend/browser/index.html', 'utf8');
const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
const csp = config.headers
  .flatMap((h) => h.headers)
  .find((h) => h.key === 'Content-Security-Policy').value;

const missing = [];
for (const [, attrs, body] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
  if (/\bsrc=/.test(attrs) || /application\/json/.test(attrs)) continue;
  const hash = `'sha256-${createHash('sha256').update(body).digest('base64')}'`;
  if (!csp.includes(hash)) missing.push(`${hash}  ${body.slice(0, 60)}…`);
}

if (missing.length) {
  console.error('CSP is missing hashes for inline scripts:\n' + missing.join('\n'));
  process.exit(1);
}
console.log('CSP covers every inline script.');
