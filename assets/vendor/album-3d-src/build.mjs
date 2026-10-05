// Bundles entry.js into ../album-3d.js (committed artifact).
// Rebuild: npm install && npm run build  (inside this folder).
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));

const result = await build({
  entryPoints: [join(here, "entry.js")],
  bundle: true,
  minify: true,
  format: "iife",
  globalName: "Album3DReader",
  outfile: join(here, "..", "album-3d.js"),
  legalComments: "inline",
  logLevel: "info",
  metafile: true,
});

const outputs = Object.entries(result.metafile.outputs);
for (const [path, info] of outputs) {
  console.log(`${path}: ${info.bytes} bytes`);
}
