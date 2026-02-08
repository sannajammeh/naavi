import { $ } from "bun";

// Clean dist
await $`rm -rf dist`;

// Bundle library as ESM
const result = await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  format: "esm",
  target: "browser",
  external: ["react", "react-dom", "react/jsx-runtime"],
  minify: false,
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});

if (!result.success) {
  console.error("Build failed:");
  for (const log of result.logs) {
    console.error(log);
  }
  process.exit(1);
}

// Generate type declarations
await $`bunx tsc --declaration --emitDeclarationOnly --outDir dist --project tsconfig.build.json`;

console.log("Build complete → dist/");
