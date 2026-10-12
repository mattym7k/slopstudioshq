// Copies the public site files into dist/ and pushes them to Cloudflare Pages.
// Usage: npm run deploy
// First time on a machine: npx wrangler login
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";

const PROJECT = "slopstudioshq";
const FILES = ["index.html", "styles.css", "script.js", "favicon.svg"];

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist");
for (const f of FILES) cpSync(f, `dist/${f}`);

const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["wrangler", "pages", "deploy", "dist", "--project-name", PROJECT, "--commit-dirty=true"],
  { stdio: "inherit", shell: process.platform === "win32" }
);
process.exit(result.status ?? 1);
