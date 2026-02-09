import { renderToReadableStream } from "react-dom/server";

import { Page } from "./page.tsx";

const PORT = Number(process.env.PORT) || 3002;

const stylesFile = Bun.file(import.meta.dir + "/styles.css");

// Build the client bundle once at startup
const buildResult = await Bun.build({
  entrypoints: [import.meta.dir + "/client.tsx"],
  minify: false,
});

const clientBundle = buildResult.outputs[0]!;

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
<style>
  path { fill: #1a1a1a; }
  @media (prefers-color-scheme: dark) { path { fill: #f5efe6; } }
</style>
<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM172.42,72.84l-64,32a8.05,8.05,0,0,0-3.58,3.58l-32,64A8,8,0,0,0,80,184a8.1,8.1,0,0,0,3.58-.84l64-32a8.05,8.05,0,0,0,3.58-3.58l32-64a8,8,0,0,0-10.74-10.74ZM138,138,97.89,158.11,118,118l40.15-20.07Z"/>
</svg>`;

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // Serve favicon
    if (url.pathname === "/favicon.svg") {
      return new Response(faviconSvg, {
        headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" },
      });
    }

    // Serve CSS
    if (url.pathname === "/styles.css") {
      return new Response(stylesFile, {
        headers: { "Content-Type": "text/css" },
      });
    }

    // Serve client bundle
    if (url.pathname === "/client.js") {
      return new Response(clientBundle, {
        headers: { "Content-Type": "application/javascript" },
      });
    }

    // SSR the React page, inject hydration script
    const stream = await renderToReadableStream(<Page />, {
      bootstrapScripts: ["/client.js"],
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
});

console.log(`Docs running at http://localhost:${PORT}`);
