import { test } from "node:test";
import assert from "node:assert/strict";
import { validarConteudo } from "../validar-skills.mjs";

test("aprova skill limpa", () => {
  const ok = `---\nname: exemplo\ndescription: |\n  Faz algo util. Use quando precisar de algo util.\n---\ncorpo\n\nKit da Imersão Claude 2.0 · IA Como Aliada · iacomoaliada.com/imersaoclaude2/`;
  assert.deepEqual(validarConteudo("exemplo", ok), []);
});
test("acusa autoria ausente (R2.8)", () => {
  const semAutoria = `---\nname: x\ndescription: |\n  Faz algo util.\n---\ncorpo`;
  assert.ok(validarConteudo("x", semAutoria).some(m => m.includes("autoria")));
});
test("acusa gatilho literal, mcp, paths, herancas, canva morto e humaniza", () => {
  const ruim = `---\nname: x\ndescription: |\n  Acione quando: "algo"\n---\nuse mcp__claude_ai_Notion__fetch em ~/.claude/x ou /Users/alinedelamare, a instagram-analyzer da Amanda (anthropic-skills:instagram-analyzer), pilar DICAS DA AMIGA, humanização, e start-editing-transaction`;
  const v = validarConteudo("x", ruim);
  for (const alvo of ["Acione quando", "mcp__", "~/", "/Users/", "anthropic-skills:", "instagram-analyzer", "Amanda", "DICAS DA AMIGA", "humaniza", "start-editing-transaction"])
    assert.ok(v.some(m => m.includes(alvo)), `faltou acusar ${alvo}`);
});
test("acusa description ausente e scalar plano", () => {
  assert.ok(validarConteudo("x", "---\nname: x\n---\ncorpo").some(m => m.includes("description")));
  const plano = "---\nname: x\ndescription: Faz algo util\n---\ncorpo";
  assert.ok(validarConteudo("x", plano).some(m => m.includes("block scalar")));
});
test("description: no corpo nao conta como frontmatter", () => {
  const semFm = "---\nname: x\n---\ncorpo com description: falsa";
  assert.ok(validarConteudo("x", semFm).some(m => m.includes("sem description")));
});
