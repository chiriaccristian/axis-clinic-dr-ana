import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Plugin } from 'vite';

const SSG_FLAG = 'CLINIC_SSG';
const SITE_URL = 'https://drana.ro';
const CLINIC_NAME = 'Facial Harmony Clinic by Dr. Ana';

interface PrerenderProcedure {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  details: string[];
}

interface ServerEntry {
  render: (url: string) => string;
  procedures: PrerenderProcedure[];
}

function replaceTag(html: string, pattern: RegExp, replacement: string) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildProcedureHead(html: string, procedure: PrerenderProcedure) {
  const url = `${SITE_URL}/proceduri/${procedure.slug}`;
  const title = escapeHtml(procedure.metaTitle);
  const description = escapeHtml(procedure.metaDescription);

  let head = replaceTag(
    html,
    /<title>[\s\S]*?<\/title>/,
    `<title>${title}</title>`,
  );
  head = replaceTag(
    head,
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${description}" />`,
  );
  head = replaceTag(
    head,
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${url}" />`,
  );
  head = replaceTag(
    head,
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${url}" />`,
  );
  head = replaceTag(
    head,
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${title}" />`,
  );
  head = replaceTag(
    head,
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${description}" />`,
  );
  head = replaceTag(
    head,
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${title}" />`,
  );
  head = replaceTag(
    head,
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${description}" />`,
  );

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: `${procedure.title} în Galați`,
    description: procedure.metaDescription,
    url,
    howPerformed: procedure.intro,
    provider: {
      '@type': 'MedicalClinic',
      name: CLINIC_NAME,
      url: `${SITE_URL}/`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Galați',
        addressCountry: 'RO',
      },
    },
  };

  return head.replace(
    '</head>',
    `  <script type="application/ld+json">\n${JSON.stringify(
      schema,
      null,
      2,
    )}\n    </script>\n  </head>`,
  );
}

function injectAppHtml(html: string, appHtml: string) {
  return html.replace(
    /<div id="root">[\s\S]*?<\/div>/,
    `<div id="root">${appHtml}</div>`,
  );
}

function buildLegalHead(html: string, title: string, url: string) {
  return replaceTag(
    replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${title} | ${CLINIC_NAME}</title>`),
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${SITE_URL}${url}" />`,
  );
}

export function prerenderPlugin(): Plugin {
  return {
    name: 'clinic-prerender',
    apply: 'build',
    enforce: 'post',
    async closeBundle() {
      if (process.env[SSG_FLAG] === 'true' || process.env['VITEST']) {
        return;
      }

      const { build } = await import('vite');
      const root = import.meta.dirname;
      const distDir = resolve(root, 'dist');
      const ssrDir = resolve(root, '../../node_modules/.vite-ssg/clinic');

      process.env[SSG_FLAG] = 'true';

      try {
        await build({
          root,
          configFile: resolve(root, 'vite.config.mts'),
          logLevel: 'warn',
          build: {
            ssr: resolve(root, 'src/entry-server.tsx'),
            outDir: ssrDir,
            emptyOutDir: true,
            copyPublicDir: false,
            reportCompressedSize: false,
          },
        });

        const [entry, template] = await Promise.all([
          import(
            pathToFileURL(join(ssrDir, 'entry-server.mjs')).href
          ) as Promise<ServerEntry>,
          readFile(join(distDir, 'index.html'), 'utf8'),
        ]);

        const { procedures } = entry;

        await writeFile(
          join(distDir, 'index.html'),
          injectAppHtml(template, entry.render('/')),
        );

        let pages = 1;

        for (const procedure of procedures) {
          const html = buildProcedureHead(
            injectAppHtml(
              template,
              entry.render(`/proceduri/${procedure.slug}`),
            ),
            procedure,
          );
          const file = join(distDir, 'proceduri', procedure.slug, 'index.html');

          await mkdir(dirname(file), { recursive: true });
          await writeFile(file, html);
          pages += 1;
        }

        for (const legalPage of [
          ['politica-de-confidentialitate', 'Politica de confidențialitate'],
          ['termeni-si-conditii', 'Termeni și condiții'],
        ] as const) {
          const [slug, title] = legalPage;
          const html = buildLegalHead(
            injectAppHtml(template, entry.render(`/${slug}`)),
            title,
            `/${slug}`,
          );
          const file = join(distDir, slug, 'index.html');
          await mkdir(dirname(file), { recursive: true });
          await writeFile(file, html);
          pages += 1;
        }

        this.info(`pre-randate ${pages} pagini`);
      } finally {
        delete process.env[SSG_FLAG];
      }
    },
  };
}
