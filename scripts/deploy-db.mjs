import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { closeSync, existsSync, openSync } from "node:fs";
import { loadLocalEnv, run } from "./run-local.mjs";
import { sqlitePath } from "./sqlite.mjs";

export function deployDatabase() {
  process.env.NODE_ENV = "production";
  loadLocalEnv();
  const database = sqlitePath({ production: true });
  // Prisma 5 on Windows requires the SQLite file to exist before migrating.
  if (!existsSync(database)) closeSync(openSync(database, "wx"));
  return run(process.execPath, ["node_modules/prisma/build/index.js", "migrate", "deploy"]);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    process.exitCode = deployDatabase();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
