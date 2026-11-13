import { closeSync, mkdirSync, mkdtempSync, openSync, realpathSync, rmSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { basename, dirname, join, resolve } from "node:path";
import { run } from "./run-local.mjs";

const work = resolve("work");
mkdirSync(work, { recursive: true });
const root = realpathSync(work);
const dir = realpathSync(mkdtempSync(join(root, "payment-tests-")));
try {
  const database = join(dir, "test.db");
  closeSync(openSync(database, "wx"));
  const env = {
    ...process.env,
    DATABASE_URL: "file:" + database.replaceAll("\\", "/"),
    PAYMENT_PROVIDER: "WOMPI_SIMULATED",
    PAYMENT_SIMULATION_ENABLED: "true",
    MOCK_WOMPI_EVENT_SECRET: randomBytes(32).toString("hex"),
    ADMIN_ACCESS_TOKEN: randomBytes(32).toString("hex"),
  };
  process.exitCode = run(process.execPath, ["node_modules/prisma/build/index.js", "db", "push", "--skip-generate"], env);
  if (process.exitCode === 0) {
    process.exitCode = run(process.execPath, ["node_modules/tsx/dist/cli.mjs", "--test", "tests/payments.test.ts"], env);
  }
} finally {
  if (dirname(dir) === root && basename(dir).startsWith("payment-tests-")) {
    rmSync(dir, { recursive: true, force: true });
  }
}
