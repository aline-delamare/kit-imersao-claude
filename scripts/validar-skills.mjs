import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const PROIBIDOS = [
  ["Acione quando", "gatilho literal no frontmatter (R2.1)"],
  ["mcp__", "nome de ferramenta MCP hard-coded (R2.6)"],
  ["~/", "path de filesystem local (R2.6)"],
  ["/Users/", "path absoluto da máquina da autora (R2.6)"],
  ["anthropic-skills:", "namespace de plugin local (R2.6)"],
  ["instagram-analyzer", "referência à skill antiga (R3.5)"],
  ["Amanda", "herança da autora original (R3.8)"],
  ["DICAS DA AMIGA", "pilar herdado da 1.0 (R3.8)"],
  ["humaniza", "referência a skill fora do kit (R3.8)"],
  ["get-design-content", "ferramenta extinta do conector Canva (R3.1)"],
  ["start-editing-transaction", "ferramenta extinta do conector Canva (R3.1)"],
  ["perform-editing-operations", "ferramenta extinta do conector Canva (R3.1)"],
  ["commit-editing-transaction", "ferramenta extinta do conector Canva (R3.1)"],
];

export function validarConteudo(nome, texto) {
  const v = [];
  const fm = texto.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) v.push(`${nome}: sem bloco frontmatter`);
  else {
    if (!/\bdescription:/.test(fm[1])) v.push(`${nome}: frontmatter sem description`);
    else if (!/\bdescription:\s*\|/.test(fm[1]))
      v.push(`${nome}: description sem block scalar (description: |) — dois-pontos quebram o empacotador (lição v1.0)`);
  }
  for (const [alvo, motivo] of PROIBIDOS)
    if (texto.includes(alvo)) v.push(`${nome}: contém "${alvo}" — ${motivo}`);
  if (!texto.includes("iacomoaliada.com/imersaoclaude2/"))
    v.push(`${nome}: sem a linha de autoria do kit (R2.8)`);
  return v;
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop())) {
  const base = "skills";
  const todas = readdirSync(base, { withFileTypes: true })
    .filter(d => d.isDirectory()).map(d => join(base, d.name, "SKILL.md"));
  let violacoes = [];
  for (const f of todas) if (existsSync(f)) violacoes.push(...validarConteudo(f, readFileSync(f, "utf8")));
  if (violacoes.length) { console.error(violacoes.join("\n")); process.exit(1); }
  console.log(`OK — ${todas.length} skills limpas`);
}
