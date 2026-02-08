import homepage from "./index.html";

Bun.serve({
  development: {
    hmr: true,
    console: true,
  },
  routes: {
    "/*": homepage,
  },
});

console.log("Playground running at http://localhost:3000");
