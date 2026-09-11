// Kit Imersão Claude 2.0 : gerador do site a partir das skills.
// lerSkills(dir) e construir({meta, skills}) são puras e testáveis;
// main() é o único ponto que toca o disco (limpa site/public/, grava o
// Map e copia site/static/ -> site/public/static/).

import {
  readFileSync,
  readdirSync,
  existsSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  cpSync,
} from "node:fs";
import { join, dirname } from "node:path";

import {
  renderHome,
  renderSkill,
  renderSenha,
  renderFinanceiro,
  renderLinkDaBio,
} from "../site/templates/paginas.mjs";

// ---------------------------------------------------------------------
// lerSkills
// ---------------------------------------------------------------------

// Mesmo padrão do validador da T3 (scripts/validar-skills.mjs): frontmatter
// ancorado no início do arquivo, para no PRIMEIRO fechamento "---". Um "---"
// divisor no corpo do markdown não confunde o parser.
const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---/;

function extrairCampoSimples(frontmatter, campo) {
  const m = frontmatter.match(new RegExp(`^${campo}:\\s*(.+)$`, "m"));
  return m ? m[1].trim() : "";
}

// `description` usa block scalar YAML (description: |): as linhas seguintes,
// indentadas, pertencem ao valor até a primeira linha que desindenta (ou o
// fim do frontmatter). Nunca capturar só o caractere "|".
function extrairDescriptionBlockScalar(frontmatter) {
  const linhas = frontmatter.split("\n");
  const idx = linhas.findIndex((l) => /^description:\s*\|\s*$/.test(l));
  if (idx === -1) {
    // Sem block scalar: cai para valor plano na mesma linha (fallback).
    return extrairCampoSimples(frontmatter, "description");
  }
  const bloco = [];
  for (let i = idx + 1; i < linhas.length; i++) {
    const linha = linhas[i];
    if (linha.trim() === "") {
      bloco.push("");
      continue;
    }
    if (!/^\s+/.test(linha)) break; // desindentou: fim do block scalar
    bloco.push(linha.replace(/^\s{1,}/, ""));
  }
  return bloco.join(" ").replace(/\s+/g, " ").trim();
}

export function lerSkills(dir) {
  const pastas = readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory());
  const resultado = [];
  for (const pasta of pastas) {
    const caminho = join(dir, pasta.name, "SKILL.md");
    if (!existsSync(caminho)) continue;
    const texto = readFileSync(caminho, "utf8");
    const fm = texto.match(FRONTMATTER_RE);
    if (!fm) continue;
    const frontmatter = fm[1];
    const nome = extrairCampoSimples(frontmatter, "name") || pasta.name;
    const description = extrairDescriptionBlockScalar(frontmatter);
    const corpo = texto.slice(fm.index + fm[0].length);
    resultado.push({ nome, description, corpo });
  }
  return resultado;
}

// ---------------------------------------------------------------------
// construir
// ---------------------------------------------------------------------

export function construir({ meta, skills }) {
  const skillsPorNome = new Map(skills.map((s) => [s.nome, s]));
  const metaPorNome = new Map(meta.skills.map((s) => [s.nome, s]));

  const faltandoNoSkills = meta.skills
    .map((s) => s.nome)
    .filter((nome) => !skillsPorNome.has(nome));
  const faltandoNoMeta = skills
    .map((s) => s.nome)
    .filter((nome) => !metaPorNome.has(nome));

  if (faltandoNoSkills.length || faltandoNoMeta.length) {
    const partes = [];
    if (faltandoNoSkills.length)
      partes.push(`no meta mas sem SKILL.md: ${faltandoNoSkills.join(", ")}`);
    if (faltandoNoMeta.length)
      partes.push(`com SKILL.md mas fora do meta: ${faltandoNoMeta.join(", ")}`);
    throw new Error(`construir: divergência meta x skills (${partes.join(" | ")})`);
  }

  const paginas = new Map();

  paginas.set("index.html", renderHome(meta, skills));
  paginas.set("senha.html", renderSenha());
  paginas.set("financeiro.html", renderFinanceiro());
  paginas.set("link-da-bio.html", renderLinkDaBio());

  for (const entrada of meta.skills) {
    const skill = skillsPorNome.get(entrada.nome);
    paginas.set(`skills/${entrada.nome}.html`, renderSkill(entrada, skill, meta));
  }

  return paginas;
}

// ---------------------------------------------------------------------
// main : único ponto que toca o disco
// ---------------------------------------------------------------------

function limparPublicoPreservandoDownloads(publicDir) {
  const downloadsDir = join(publicDir, "downloads");
  const tinhaDownloads = existsSync(downloadsDir);
  const tmpDownloads = `${publicDir}__downloads-tmp`;

  if (tinhaDownloads) {
    rmSync(tmpDownloads, { recursive: true, force: true });
    cpSync(downloadsDir, tmpDownloads, { recursive: true });
  }

  rmSync(publicDir, { recursive: true, force: true });
  mkdirSync(publicDir, { recursive: true });

  if (tinhaDownloads) {
    cpSync(tmpDownloads, downloadsDir, { recursive: true });
    rmSync(tmpDownloads, { recursive: true, force: true });
  }
}

function gravarPaginas(publicDir, paginas) {
  for (const [caminho, html] of paginas) {
    const destino = join(publicDir, caminho);
    mkdirSync(dirname(destino), { recursive: true });
    writeFileSync(destino, html, "utf8");
  }
}

export function main() {
  const meta = JSON.parse(readFileSync("site/meta/skills-meta.json", "utf8"));
  const skills = lerSkills("skills");
  const paginas = construir({ meta, skills });

  const publicDir = "site/public";
  limparPublicoPreservandoDownloads(publicDir);
  gravarPaginas(publicDir, paginas);
  cpSync("site/static", join(publicDir, "static"), { recursive: true });

  console.log(`OK — ${paginas.size} páginas geradas em ${publicDir}`);
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop())) {
  main();
}
