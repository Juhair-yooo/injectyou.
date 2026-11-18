import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = dirname(fileURLToPath(import.meta.url));
const entry = resolve(root, 'index.html');
assert(existsSync(entry), 'Missing index.html');

const visited = new Set();
const errors = [];

function localReference(from, reference) {
  if (!reference || /^(?:#|data:|blob:)/i.test(reference)) return;
  if (/^(?:https?:)?\/\//i.test(reference)) {
    errors.push(`${relative(root, from)} uses an external runtime asset: ${reference}`);
    return;
  }
  const clean = reference.split(/[?#]/)[0];
  if (!clean) return;
  const target = resolve(dirname(from), decodeURIComponent(clean));
  if (!existsSync(target)) {
    errors.push(`${relative(root, from)} references missing asset ${reference}`);
    return;
  }
  inspect(target);
}

function inspect(path) {
  if (visited.has(path)) return;
  visited.add(path);
  const extension = extname(path).toLowerCase();
  if (!['.html', '.js', '.mjs', '.css', '.svg'].includes(extension)) return;
  const text = readFileSync(path, 'utf8');
  const name = relative(root, path);
  if (/\bRELAY\b/i.test(text)) errors.push(`${name} still contains the former product name.`);
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(text)) {
    errors.push(`${name} contains private-key material.`);
  }
  if (extension === '.html') {
    for (const match of text.matchAll(/<(?:script|img|source)\b[^>]*\bsrc=["']([^"']+)["']/gi)) {
      localReference(path, match[1]);
    }
    for (const match of text.matchAll(/<link\b[^>]*>/gi)) {
      if (/\brel=["'](?:stylesheet|icon|preload|modulepreload)["']/i.test(match[0])) {
        const href = match[0].match(/\bhref=["']([^"']+)["']/i)?.[1];
        localReference(path, href);
      }
    }
  }
  if (['.js', '.mjs'].includes(extension)) {
    const syntax = spawnSync(process.execPath, ['--input-type=module', '--check'], {
      input: text, encoding: 'utf8', windowsHide: true,
    });
    if (syntax.status !== 0) errors.push(`${name}: ${syntax.stderr || syntax.error?.message || 'JavaScript syntax check failed'}`);
    for (const match of text.matchAll(/(?:\b(?:import|export)\s+(?:[^;\n]*?\s+from\s*)?|\bimport\s*\(\s*)["']([^"']+)["']/g)) {
      const specifier = match[1];
      if (!specifier.startsWith('.')) errors.push(`${name} uses a non-local module: ${specifier}`);
      else localReference(path, specifier);
    }
  }
  if (extension === '.css') {
    for (const match of text.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/gi)) {
      localReference(path, match[1]);
    }
  }
}

inspect(entry);
const html = readFileSync(entry, 'utf8');
if (!html.includes('inJectyou')) errors.push('index.html does not contain the exact product name inJectyou.');
if (!/name=["']viewport["']/i.test(html)) errors.push('index.html is missing responsive viewport metadata.');
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Validated ${visited.size} local assets: references, JavaScript syntax, branding, and runtime dependencies.`);
}
