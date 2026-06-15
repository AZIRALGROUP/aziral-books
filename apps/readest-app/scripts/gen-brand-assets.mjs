// One-off brand asset generator for Aziral Books.
// Renders the "Open Book" mark (Variant A) into app icons + an OG card using
// Playwright's bundled Chromium (supports oklch + Google Fonts). Run from the
// app dir:  node scripts/gen-brand-assets.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, '../public');

// Variant A — open book mark. fg = book body, page = inner accent lines.
const MARK = (fg, page) => `
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 30 C 39 24, 25 23, 15 28 L 15 72 C 25 67, 39 68, 50 74 Z" fill="${fg}"/>
    <path d="M50 30 C 61 24, 75 23, 85 28 L 85 72 C 75 67, 61 68, 50 74 Z" fill="${fg}" opacity="0.82"/>
    <path d="M24 38 C 33 35, 42 36, 49 40 M24 50 C 33 47, 42 48, 49 52 M76 38 C 67 35, 58 36, 51 40 M76 50 C 67 47, 58 48, 51 52"
          stroke="${page}" stroke-width="2.4" stroke-linecap="round" fill="none" opacity="0.9"/>
    <path d="M50 30 V 74" stroke="${fg}" stroke-width="2.6" stroke-linecap="round" opacity="0.55"/>
  </svg>`;

const OCHRE = '#c98a3c'; // ochre primary (light)
const PAPER = '#fdf7ec'; // cream book on tile
const OCHRE_DEEP = '#9a6526';

function iconHTML(size) {
  return `<!doctype html><html><body style="margin:0">
    <div style="width:${size}px;height:${size}px;border-radius:${Math.round(
      size * 0.22,
    )}px;background:linear-gradient(155deg,#d59a4a,#bd7e30);display:grid;place-items:center;overflow:hidden">
      <div style="width:${Math.round(size * 0.62)}px;height:${Math.round(size * 0.62)}px">
        ${MARK(PAPER, OCHRE_DEEP)}
      </div>
    </div></body></html>`;
}

const OG_HTML = `<!doctype html><html><head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;1,400;1,500&family=Hanken+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
</head><body style="margin:0">
  <div style="width:1200px;height:630px;background:radial-gradient(120% 120% at 0% 0%,#f9f3e8,#f1e7d4);position:relative;overflow:hidden;font-family:'Hanken Grotesk',sans-serif">
    <div style="position:absolute;inset:0;opacity:.5;background:repeating-linear-gradient(118deg,transparent 0 26px,rgba(150,110,60,.05) 26px 27px)"></div>
    <div style="position:relative;padding:72px 80px;height:100%;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:16px">
        <div style="width:54px;height:54px">${MARK(OCHRE, '#ffffff')}</div>
        <div style="font-family:'Newsreader',serif;font-size:34px;font-weight:500;color:#33291c;letter-spacing:-.01em">Aziral<span style="font-style:italic;font-weight:400;opacity:.78"> Books</span></div>
      </div>
      <div>
        <div style="font-family:'Hanken Grotesk';font-size:18px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#a87f4a;margin-bottom:20px">Тихая читалка · Открытый код</div>
        <div style="font-family:'Newsreader',serif;font-size:84px;font-weight:500;line-height:1.02;letter-spacing:-.025em;color:#2b2218;max-width:1000px">Место, где хорошо <span style="font-style:italic;color:#bd7e30">читается</span></div>
        <div style="font-family:'Newsreader',serif;font-size:30px;color:#5c4d39;margin-top:24px">EPUB, PDF и заметки в одной тёплой библиотеке · books.aziral.com</div>
      </div>
    </div>
  </div></body></html>`;

async function shotElement(page, html, selector, file) {
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(350);
  const el = await page.$(selector);
  await el.screenshot({ path: path.join(PUBLIC, file), omitBackground: true });
  console.log('wrote', file);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });

  // App icons (ochre tile + cream book)
  for (const [size, file] of [
    [512, 'icon.png'],
    [180, 'apple-touch-icon.png'],
    [256, 'favicon-src.png'],
  ]) {
    await page.setViewportSize({ width: size, height: size });
    await shotElement(page, iconHTML(size), 'div', file);
  }

  // OG card 1200x630
  await page.setViewportSize({ width: 1200, height: 630 });
  await shotElement(page, OG_HTML, 'div', 'og.png');

  await browser.close();
  console.log('done');
})();
