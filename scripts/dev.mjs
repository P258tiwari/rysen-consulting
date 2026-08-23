import { spawn } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const children = [
  spawn(process.execPath, ["--watch", "server/index.js"], { cwd: root, stdio: "inherit" }),
  spawn(process.execPath, ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1"], { cwd: root, stdio: "inherit" }),
];

let stopping = false;

function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }
  setTimeout(() => process.exit(exitCode), 100).unref();
}

for (const child of children) {
  child.on("exit", (code, signal) => {
    if (!stopping && code && signal !== "SIGTERM") stop(code);
  });
}

process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));
