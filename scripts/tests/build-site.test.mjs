import { test } from "node:test";
import assert from "node:assert/strict";
import { construir, lerSkills } from "../build-site.mjs";
import { readFileSync } from "node:fs";

const meta = JSON.parse(readFileSync("site/meta/skills-meta.json", "utf8"));
const skills = lerSkills("skills");

test("gera 19 páginas (home + 15 skills + senha + 2 abas do dia 2)", () => {
  const paginas = construir({ meta, skills });
  assert.equal(paginas.size, 19);
});
test("abas do dia 2 têm página própria com download e passo a passo (R11.1, R11.2)", () => {
  const paginas = construir({ meta, skills });
  const fin = paginas.get("financeiro.html");
  const bio = paginas.get("link-da-bio.html");
  assert.ok(fin && fin.includes("/downloads/meu-financeiro.zip") && fin.includes("/fechar-mes") && fin.includes("Claude Code"));
  assert.ok(bio && bio.includes("/downloads/link-da-bio.zip") && bio.includes("quero criar o meu link da bio") && bio.includes("Claude Code"));
});
test("toda página com menu mostra as três abas, com a ativa marcada (R11.1)", () => {
  const paginas = construir({ meta, skills });
  for (const [caminho, html] of paginas) {
    if (caminho === "senha.html") continue;
    for (const href of ['href="/index.html"', 'href="/financeiro.html"', 'href="/link-da-bio.html"'])
      assert.ok(html.includes(href), `${caminho} sem a aba ${href}`);
    assert.equal((html.match(/aria-current="page"/g) || []).length, 1, `${caminho} sem uma única aba ativa`);
  }
});
test("skills do dia 2 ficam fora do Squad (R11.3)", () => {
  const home = construir({ meta, skills }).get("index.html");
  assert.ok(!home.includes("fechar-mes") && !home.includes("link-da-bio.zip"));
  assert.ok(!meta.skills.some((s) => ["fechar-mes", "link-da-bio"].includes(s.nome)));
});
test("home lista as 15 skills e o link do kit completo", () => {
  const home = construir({ meta, skills }).get("index.html");
  for (const s of meta.skills) assert.ok(home.includes(s.nome), `home sem ${s.nome}`);
  assert.ok(home.includes("/downloads/kit-completo.zip"));
});
test("página de skill tem download e bloco do Code", () => {
  const p = construir({ meta, skills }).get("skills/redatora-copy.html");
  assert.ok(p.includes("/downloads/redatora-copy.skill"));
  assert.ok(p.includes("github.com/aline-delamare/kit-imersao-claude"));
});
test("meta sem uma skill derruba o build", () => {
  const metaFurado = { ...meta, skills: meta.skills.slice(1) };
  assert.throws(() => construir({ meta: metaFurado, skills }));
});

// Falha se: alguma página do Map contiver em-dash/en-dash, violando a regra do brand book.
test("html gerado não contém em-dash", () => {
  const paginas = construir({ meta, skills });
  for (const [caminho, html] of paginas) {
    assert.ok(!html.includes("—"), `${caminho} contém em-dash`);
    assert.ok(!html.includes("–"), `${caminho} contém en-dash`);
  }
});

// Falha se: o parser de frontmatter não capturar o block scalar inteiro (regressão do bug da T20).
test("description extraída do block scalar não é vazia nem '|'", () => {
  const redatora = skills.find((s) => s.nome === "redatora-copy");
  assert.ok(redatora.description.length > 50);
});
