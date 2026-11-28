import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { PrismaClient } from "@prisma/client";

const work = resolve("work");
mkdirSync(work, { recursive: true });

function command(args, env) {
  return spawnSync(process.execPath, args, { env: { ...process.env, ...env }, encoding: "utf8", timeout: 60000 });
}

function success(result) {
  assert.equal(result.status, 0, result.stdout + result.stderr);
}

async function fixture(callback) {
  const dir = mkdtempSync(join(work, "deployment-tests-"));
  const file = join(dir, "nested", "store.db");
  const env = { DATABASE_URL: "file:" + file.replaceAll("\\", "/"), NODE_ENV: "production" };
  const client = new PrismaClient({ datasources: { db: { url: env.DATABASE_URL } } });
  try {
    await callback({ dir, file, env, client });
  } finally {
    await client.$disconnect();
    if (dirname(dir) === work && basename(dir).startsWith("deployment-tests-")) rmSync(dir, { recursive: true, force: true });
  }
}

async function product(client) {
  return client.product.create({ data: {
    id: "preserved-product", title: "Producto existente", overview: "Preservar", price: 123000,
    format: "4K UHD", category: "Drama", director: "Director", year: 2026, posterUrl: "/test.png", stock: 7,
  } });
}

test("las migraciones crean SQLite y el segundo despliegue conserva los datos", async () => {
  await fixture(async ({ env, file, client }) => {
    success(command(["scripts/deploy-db.mjs"], env));
    assert.ok(existsSync(file));
    const before = await product(client);
    success(command(["scripts/deploy-db.mjs"], env));
    assert.deepEqual(await client.product.findUnique({ where: { id: before.id } }), before);
    assert.equal(await client.order.count(), 0);
    assert.equal(await client.waitlistLead.count(), 0);
  });
});

test("la adopción de una base existente exige confirmación de parada, respalda y conserva sus filas", async () => {
  await fixture(async ({ env, file, client }) => {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, "", { flag: "wx" });
    success(command(["node_modules/prisma/build/index.js", "db", "push", "--skip-generate"], env));
    const before = await product(client);
    await client.$disconnect();
    assert.notEqual(command(["scripts/deploy-db.mjs"], env).status, 0);
    assert.notEqual(command(["scripts/baseline-db.mjs"], env).status, 0);
    success(command(["scripts/baseline-db.mjs", "--app-stopped"], env));
    assert.ok(readdirSync(dirname(file)).some((name) => name.endsWith(".bak")));
    success(command(["scripts/deploy-db.mjs"], env));
    assert.deepEqual(await client.product.findUnique({ where: { id: before.id } }), before);
  });
});

test("la migración de comprobantes conserva una base con solo 0_init", async () => {
  await fixture(async ({ env, file, client }) => {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, "", { flag: "wx" });
    success(command(["node_modules/prisma/build/index.js", "db", "execute", "--file", "prisma/migrations/0_init/migration.sql", "--schema", "prisma/schema.prisma"], env));
    success(command(["node_modules/prisma/build/index.js", "migrate", "resolve", "--applied", "0_init"], env));
    const before = await product(client);
    success(command(["scripts/deploy-db.mjs"], env));
    assert.deepEqual(await client.product.findUnique({ where: { id: before.id } }), before);
    assert.equal(await client.paymentReceipt.count(), 0);
    success(command(["scripts/deploy-db.mjs"], env));
    assert.deepEqual(await client.product.findUnique({ where: { id: before.id } }), before);
  });
});

test("la línea base rechaza un esquema distinto y no lo marca como migrado", async () => {
  await fixture(async ({ env, file, client }) => {
    success(command(["scripts/deploy-db.mjs"], env));
    const before = await product(client);
    await client.$executeRawUnsafe('DROP TABLE "_prisma_migrations"');
    await client.$executeRawUnsafe('DROP TABLE "Review"');
    await client.$disconnect();
    const result = command(["scripts/baseline-db.mjs", "--app-stopped"], env);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /No se registró la línea base/);
    assert.deepEqual(await client.product.findUnique({ where: { id: before.id } }), before);
    const tables = await client.$queryRawUnsafe("SELECT name FROM sqlite_master WHERE name = '_prisma_migrations'");
    assert.equal(tables.length, 0);
    assert.ok(existsSync(file));
  });
});

test("producción rechaza rutas relativas, memoria y la base de desarrollo", () => {
  for (const url of ["file:./dev.db", "file::memory:", "file:" + resolve("prisma/dev.db").replaceAll("\\", "/")]) {
    const result = command(["scripts/deploy-db.mjs"], { DATABASE_URL: url });
    assert.notEqual(result.status, 0);
  }
});

test("el respaldo rechaza un WAL pendiente", async () => {
  await fixture(async ({ env, file, client }) => {
    success(command(["scripts/deploy-db.mjs"], env));
    await client.$disconnect();
    writeFileSync(file + "-wal", "pendiente");
    const result = command(["scripts/baseline-db.mjs", "--app-stopped"], env);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /WAL o journal/);
  });
});
