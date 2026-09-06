import { test } from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { readdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

test("build-packages gera 15 .skill + kit-completo.zip", () => {
  const out = mkdtempSync(join(tmpdir(), "pacotes-"));
  execSync("bash scripts/build-packages.sh", { stdio: "pipe", env: { ...process.env, OUT_DIR: out } });
  const arquivos = readdirSync(out);
  assert.equal(arquivos.filter(a => a.endsWith(".skill")).length, 15);
  assert.ok(arquivos.includes("kit-completo.zip"));
  const lista = execSync(`unzip -l ${out}/kit-completo.zip`).toString();
  assert.equal((lista.match(/\.skill/g) || []).length, 15);
});
