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

// 5. Write output
await Bun.write(outDir + "/index.html", finalHtml);
await Bun.write(outDir + "/styles.css", css);
await Bun.write(outDir + "/client.js", clientJs);

console.log("Built docs to docs/out/");
console.log(`  index.html  ${(finalHtml.length / 1024).toFixed(1)} kB`);
console.log(`  styles.css  ${(css.length / 1024).toFixed(1)} kB`);
