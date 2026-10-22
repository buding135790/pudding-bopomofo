// Run with Playwright installed externally and a Chromium executable available:
// PLAYWRIGHT_MODULE=/path/to/playwright CHROMIUM_PATH=/usr/bin/chromium node scripts/generate-favicon.cjs
// Extracts the original Pudding JSX and CSS without changing the application.
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const root = path.resolve(__dirname, '..');
  const source = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf8');
  const match = source.match(/function Pudding\([\s\S]*?return (<div[\s\S]*?<\/div>)}\n/);
  if (!match) throw new Error('Pudding component changed; review extraction before generating icons.');
  const markup = match[1].replace('className={`pudding ${small?\'small\':\'\'}`}', 'class="pudding"').replaceAll('className=', 'class=').replace(/<(div|i)([^<>]*?)\/>/g, '<$1$2></$1>');
  const css = fs.readFileSync(path.join(root, 'src/style.css'), 'utf8').replace("@import 'tailwindcss';", '');
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const output = path.join(root, 'public');
    fs.mkdirSync(output, { recursive: true });
    const icons = [];
    for (const size of [16, 32, 48, 64, 192, 512]) {
      const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
      // Scale the original 174px drawing to 90% of the square width; freeze bob animation.
      await page.setContent(`<style>${css}\nhtml,body{width:100%;height:100%;margin:0;background:transparent!important;overflow:hidden}body{display:flex;align-items:center;justify-content:center}.icon-stage{width:174px;height:132px;flex-shrink:0;transform:scale(${size * .9 / 174})}.icon-stage .pudding{animation:none!important}</style><div class="icon-stage">${markup}</div>`);
      await page.evaluate(() => document.fonts.ready);
      const png = await page.screenshot({ omitBackground: true });
      if (size >= 192) fs.writeFileSync(path.join(output, `icon-${size}.png`), png);
      else icons.push({ size, png });
      await page.close();
    }
    // ICO supports PNG-compressed entries, preserving transparent, antialiased pixels.
    const header = Buffer.alloc(6 + icons.length * 16);
    header.writeUInt16LE(1, 2); header.writeUInt16LE(icons.length, 4);
    let offset = header.length;
    icons.forEach(({ size, png }, i) => {
      const entry = 6 + i * 16;
      header[entry] = size; header[entry + 1] = size;
      header.writeUInt16LE(1, entry + 4); header.writeUInt16LE(32, entry + 6);
      header.writeUInt32LE(png.length, entry + 8); header.writeUInt32LE(offset, entry + 12);
      offset += png.length;
    });
    fs.writeFileSync(path.join(output, 'favicon.ico'), Buffer.concat([header, ...icons.map(i => i.png)]));
    // Raster-backed SVG avoids approximating the original CSS shape or font expression.
    const data = fs.readFileSync(path.join(output, 'icon-512.png')).toString('base64');
    fs.writeFileSync(path.join(output, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><image width="512" height="512" href="data:image/png;base64,${data}"/></svg>\n`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
