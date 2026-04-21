import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const backendRoot = resolve(__dirname, "..");
const runner = resolve(
  backendRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "convex.cmd" : "convex",
);
const args = ["run", "seed:clearSeedDirectory", "{}"];
const result =
  process.platform === "win32"
    ? spawnSync(`"${runner}" ${args.map((arg) => `"${arg}"`).join(" ")}`, {
        cwd: backendRoot,
        shell: true,
        stdio: "inherit",
      })
    : spawnSync(runner, args, {
        cwd: backendRoot,
        stdio: "inherit",
      });

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
