import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const backendRoot = resolve(__dirname, "..");
const shouldReset = !process.argv.includes("--no-reset");
const runner = process.platform === "win32" ? "npx.cmd" : "npx";
const args = ["convex", "run", "seed:seedDirectory", JSON.stringify({ reset: shouldReset })];

const result = spawnSync(runner, args, {
  cwd: backendRoot,
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
