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

test("build-packages gera os pacotes do dia 2 fora do kit completo (R11.3)", () => {
  const out = mkdtempSync(join(tmpdir(), "pacotes-"));
  execSync("bash scripts/build-packages.sh", { stdio: "pipe", env: { ...process.env, OUT_DIR: out } });
  const arquivos = readdirSync(out);
  assert.ok(arquivos.includes("meu-financeiro.zip") && arquivos.includes("link-da-bio.zip"));
  const fin = execSync(`unzip -l ${out}/meu-financeiro.zip`).toString();
  for (const item of ["meu-financeiro/.claude/skills/fechar-mes/SKILL.md", "meu-financeiro/LEIA-ME.md", "meu-financeiro/dados/", "meu-financeiro/extratos/2026-08/"])
    assert.ok(fin.includes(item), `meu-financeiro.zip sem ${item}`);
  assert.ok(!/\.DS_Store|\.gitkeep|cc-writes/.test(fin), "meu-financeiro.zip com arquivo de sistema");
  const skillFin = execSync(`unzip -p ${out}/meu-financeiro.zip meu-financeiro/.claude/skills/fechar-mes/SKILL.md`).toString();
  assert.ok(skillFin.includes("[PREENCHER]"), "configuração da fechar-mes já preenchida");
  const bio = execSync(`unzip -l ${out}/link-da-bio.zip`).toString();
  assert.ok(bio.includes("link-da-bio/SKILL.md") && bio.includes("link-da-bio/referencia/pagina-modelo.html"));
  const kit = execSync(`unzip -l ${out}/kit-completo.zip`).toString();
  assert.ok(!/fechar-mes|link-da-bio/.test(kit), "skill do dia 2 dentro do kit completo");
});
