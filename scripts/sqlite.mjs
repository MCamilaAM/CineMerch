import { constants, copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";

export function sqlitePath({ production = false } = {}) {
  const url = process.env.DATABASE_URL;
  if (!url?.startsWith("file:") || /[?#]/.test(url)) {
    throw new Error("DATABASE_URL debe indicar un archivo SQLite sin parámetros.");
  }
  const path = decodeURIComponent(url.slice(5));
  if (!path || path === ":memory:" || /^[\\/]{2}/.test(path)) {
    throw new Error("Se requiere un archivo SQLite local.");
  }
  if (production && !isAbsolute(path)) {
    throw new Error("En producción DATABASE_URL debe ser absoluta y apuntar al disco persistente, por ejemplo file:/data/cinemerch.db.");
  }
  const database = isAbsolute(path) ? resolve(path) : resolve("prisma", path);
  if (production && database === resolve("prisma/dev.db")) {
    throw new Error("Usa una base separada de prisma/dev.db para producción.");
  }
  mkdirSync(dirname(database), { recursive: true });
  return database;
}

export function backupDatabase(database) {
  if (["-wal", "-journal"].some((suffix) => existsSync(database + suffix))) {
    throw new Error("SQLite tiene archivos WAL o journal. Detén la aplicación y cierra las conexiones antes del respaldo.");
  }
  if (!existsSync(database) || !statSync(database).size) return;
  const backup = database + "-" + new Date().toISOString().replace(/[:.]/g, "-") + ".bak";
  copyFileSync(database, backup, constants.COPYFILE_EXCL);
  console.log("Respaldo de SQLite creado: " + backup);
  return backup;
}
