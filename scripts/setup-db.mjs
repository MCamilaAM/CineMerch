import { constants, copyFileSync, existsSync, mkdirSync, closeSync, openSync, statSync } from "node:fs";
import { dirname, resolve, isAbsolute } from "node:path";
import { loadLocalEnv, run } from "./run-local.mjs";

try {
  loadLocalEnv();
  const url = process.env.DATABASE_URL;
  if (!url?.startsWith("file:") || /[?#]/.test(url)) throw new Error("DATABASE_URL debe indicar un archivo SQLite sin parámetros.");
  const path = decodeURIComponent(url.slice(5));
  if (!path || path === ":memory:" || /^[\\/]{2}/.test(path)) throw new Error("Se requiere un archivo SQLite local.");
  const database = isAbsolute(path) ? resolve(path) : resolve("prisma", path);
  const existing = existsSync(database);
  if (["-wal", "-journal"].some((suffix) => existsSync(database + suffix))) {
    throw new Error("SQLite tiene archivos WAL o journal. Detén la aplicación y cierra las conexiones antes del respaldo.");
  }
  if (existing && statSync(database).size > 0) {
    if (!process.argv.includes("--app-stopped")) {
      throw new Error("Detén la aplicación y los demás clientes SQLite. Luego ejecuta npm run db:setup -- --app-stopped.");
    }
    const backup = database + "-" + new Date().toISOString().replace(/[:.]/g, "-") + ".bak";
    copyFileSync(database, backup, constants.COPYFILE_EXCL);
    console.log("Respaldo de SQLite creado.");
  } else if (!existing) {
    mkdirSync(dirname(database), { recursive: true });
    closeSync(openSync(database, "wx"));
  }
  process.exitCode = run(process.execPath, ["node_modules/prisma/build/index.js", "db", "push"]);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
