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

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

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
