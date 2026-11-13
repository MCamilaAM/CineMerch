import nextEnv from "@next/env";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function run(command, args, env = process.env) {
  // npm/npx on Windows are command shims. Invoke the JS entry point directly
  // when npm provides it so arguments never have to pass through cmd.exe.
  if (command === "npx" && env.npm_execpath && /npm-cli\.js$/i.test(env.npm_execpath)) {
    return run(process.execPath, [env.npm_execpath.replace(/npm-cli\.js$/i, "npx-cli.js"), ...args], env);
  }
  const result = spawnSync(command, args, { env, stdio: "inherit" });
  if (result.error) console.error(result.error.message);
  return result.status ?? 1;
}

export function loadLocalEnv() {
  nextEnv.loadEnvConfig(process.cwd(), true);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const [command, ...args] = process.argv.slice(2);
  if (!command) {
    console.error("Indica un comando");
    process.exitCode = 1;
  } else {
    loadLocalEnv();
    process.exitCode = run(command, args);
  }
}
