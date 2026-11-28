import { existsSync, readdirSync, statSync } from "node:fs";
import { loadLocalEnv, run } from "./run-local.mjs";
import { backupDatabase, sqlitePath } from "./sqlite.mjs";

try {
  loadLocalEnv();
  if (!process.argv.includes("--app-stopped")) {
    throw new Error("Detén la aplicación y ejecuta npm run db:baseline -- --app-stopped.");
  }
  const migrations = readdirSync("prisma/migrations", { withFileTypes: true }).filter((entry) => entry.isDirectory()).sort((a, b) => a.name.localeCompare(b.name));
  if (migrations[0]?.name !== "0_init") {
    throw new Error("La línea base requiere el historial de migraciones que comienza en 0_init.");
  }
  const database = sqlitePath({ production: process.env.NODE_ENV === "production" });
  if (!existsSync(database) || !statSync(database).size) {
    throw new Error("La línea base requiere una base existente. Para una base nueva usa las migraciones.");
  }
  backupDatabase(database);
  const cli = "node_modules/prisma/build/index.js";
  const diff = run(process.execPath, [cli, "migrate", "diff", "--from-schema-datasource", "prisma/schema.prisma", "--to-schema-datamodel", "prisma/schema.prisma", "--exit-code"]);
  if (diff !== 0) {
    throw new Error("No se registró la línea base: la base y el esquema deben coincidir. Revisa las diferencias antes de continuar.");
  }
  // Only mark the full history after verifying that every current model already exists.
  for (const migration of migrations) {
    process.exitCode = run(process.execPath, [cli, "migrate", "resolve", "--applied", migration.name]);
    if (process.exitCode !== 0) break;
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
