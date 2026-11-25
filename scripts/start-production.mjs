import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { deployDatabase } from "./deploy-db.mjs";
import { loadLocalEnv } from "./run-local.mjs";

try {
  if (!existsSync(".next/BUILD_ID")) throw new Error("Primero ejecuta npm run build.");
  process.env.NODE_ENV = "production";
  loadLocalEnv();
  const port = process.env.PORT ?? "3000";
  if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) {
    throw new Error("PORT debe ser un puerto entre 1 y 65535.");
  }
  const migrated = deployDatabase();
  if (migrated !== 0) {
    process.exitCode = migrated;
  } else {
    const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "0.0.0.0", "--port", port], { stdio: "inherit", env: process.env });
    const terminate = () => server.kill("SIGTERM");
    const interrupt = () => server.kill("SIGINT");
    process.on("SIGTERM", terminate);
    process.on("SIGINT", interrupt);
    server.on("error", (error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
    server.on("exit", (code, signal) => {
      process.off("SIGTERM", terminate);
      process.off("SIGINT", interrupt);
      process.exitCode = code ?? (signal === "SIGINT" ? 130 : signal === "SIGTERM" ? 143 : 1);
    });
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
