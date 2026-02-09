// ---------------------------------------------------------------------------
// Static build — renders docs page to HTML + bundles client JS
// Output goes to docs/out/
// ---------------------------------------------------------------------------

import { renderToString } from "react-dom/server";

import { Page } from "./page.tsx";

const outDir = import.meta.dir + "/out";

// 1. Render HTML
const html = "<!DOCTYPE html>" + renderToString(<Page />);

// 2. Bundle client JS
const buildResult = await Bun.build({
  entrypoints: [import.meta.dir + "/client.tsx"],
  minify: true,
});

const clientJs = await buildResult.outputs[0]!.text();

// 3. Read CSS
const css = await Bun.file(import.meta.dir + "/styles.css").text();

// 4. Inject script tag into HTML (before </body>)
const finalHtml = html.replace(
  "</body>",
  `<script type="module" src="/client.js"></script></body>`,
);

// 5. Favicon SVG (light/dark aware)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
<style>
  path { fill: #1a1a1a; }
  @media (prefers-color-scheme: dark) { path { fill: #f5efe6; } }
</style>
<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM172.42,72.84l-64,32a8.05,8.05,0,0,0-3.58,3.58l-32,64A8,8,0,0,0,80,184a8.1,8.1,0,0,0,3.58-.84l64-32a8.05,8.05,0,0,0,3.58-3.58l32-64a8,8,0,0,0-10.74-10.74ZM138,138,97.89,158.11,118,118l40.15-20.07Z"/>
</svg>`;

// 6. Write output
await Bun.write(outDir + "/index.html", finalHtml);
await Bun.write(outDir + "/styles.css", css);
await Bun.write(outDir + "/client.js", clientJs);
await Bun.write(outDir + "/favicon.svg", faviconSvg);

console.log("Built docs to docs/out/");
console.log(`  index.html  ${(finalHtml.length / 1024).toFixed(1)} kB`);
console.log(`  styles.css  ${(css.length / 1024).toFixed(1)} kB`);
