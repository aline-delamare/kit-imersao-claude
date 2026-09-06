// Kit Imersão Claude 2.0 : templates do site
// Exporta renderHome, renderSkill, renderFluxo, renderSenha.
// Cada função retorna uma string HTML completa começando em <!DOCTYPE html>.
// Todo o markup deriva dos mockups aprovados (home.html, skill-page.html,
// senha.html) e usa exclusivamente os tokens de base.css (as 7 cores do
// brand book). Nada de em-dash em texto visível.

const REPO_URL = "https://github.com/aline-delamare/kit-imersao-claude";
const REPO_ZIP = `${REPO_URL}/archive/refs/heads/main.zip`;
const AVISO_CODE = "Este bloco é para o Claude Code. No claude.ai, use o caminho de upload ao lado.";
const GROUP_ORDER = ["comecar", "pesquisa", "criacao", "publicacao", "analise"];
const CARD_COLORS = ["c-off", "c-pessego", "c-medio", "c-bege", "c-vinho"];
const JORNADA_BG = ["jornada-vinho", "jornada-off", "jornada-bege", "jornada-marrom", "jornada-pessego"];

// ---------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------

function esc(str) {
  // Escapa HTML e, por regra inegociável do brand book, remove em-dash/en-dash
  // de qualquer texto visível (mesmo o que vem dinamicamente do SKILL.md).
  return String(str ?? "")
    .replace(/\s*[—–]\s*/g, ", ")
    .replace(/,\s*,/g, ",")
    .replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

function skillHref(nome) {
  return `/skills/${nome}.html`;
}

function findSkillMeta(meta, nome) {
  return meta.skills.find((s) => s.nome === nome) || null;
}

function scriptCopiar() {
  return `<script>
document.querySelectorAll('.copy-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    navigator.clipboard.writeText(btn.previousElementSibling.textContent.trim());
    btn.textContent = 'COPIADO';
    setTimeout(function () { btn.textContent = 'COPIAR'; }, 1500);
  });
});
</script>`;
}

function documentShell({ title, bodyClass = "", head = "", body }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<link rel="stylesheet" href="/static/base.css">
${head}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ""}>
${body}
</body>
</html>`;
}

function lockup({ size = "normal" } = {}) {
  return `<span class="lockup">A <span class="orb"><i>ia</i></span> A</span>`;
}

function navHome() {
  return `<nav><div class="wrap nav-inner">
  <a class="brand" href="/index.html"><span class="orb"><i>ia</i></span><b>Kit de Skills</b></a>
  <div class="nav-links">
    <a href="/index.html#instalacao">Instalação</a><a href="/index.html#skills">Skills</a><a href="/fluxo.html">Fluxo da semana</a>
    <a class="nav-cta" href="/index.html#download">Baixar o kit</a>
  </div>
</div></nav>`;
}

function navSkill() {
  return `<nav><div class="wrap nav-inner">
  <a class="brand" href="/index.html"><span class="orb"><i>ia</i></span><b>Kit de Skills</b></a>
  <a class="back" href="/index.html#skills">&larr; Todas as skills</a>
</div></nav>`;
}

function footerHome() {
  return `<footer><div class="wrap foot">
  ${lockup()}
  <span class="mono">Imersão Claude 2.0 · Um produto da IA Como Aliada</span>
</div></footer>`;
}

function footerSimples() {
  return `<footer><div class="wrap foot">
  <span class="mono">Imersão Claude 2.0 · Um produto da IA Como Aliada</span>
</div></footer>`;
}

// ---------------------------------------------------------------------
// Diagrama SVG da coordenadora-central (home): derivado de meta, nada
// hard-coded: grupos, skills por grupo e número de setas vêm de
// meta.grupos / meta.skills / meta.jornadas.
// ---------------------------------------------------------------------

function quebrarLinhas(texto, maxChars) {
  // Quebra "a · b · c" em linhas de ate maxChars, sem cortar nome no meio.
  const partes = texto.split(" · ");
  const linhas = [];
  let atual = "";
  for (const parte of partes) {
    const candidata = atual ? `${atual} · ${parte}` : parte;
    if (candidata.length > maxChars && atual) {
      linhas.push(atual);
      atual = parte;
    } else {
      atual = candidata;
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
}

function buildDiagramaSVG(meta) {
  // Mapa mental radial: orb da coordenadora a esquerda, ramos curvos ate um
  // cartao por grupo. Grupos, skills e numero de ramos vem sempre do meta.
  const largura = 1100;
  const orbX = 168;
  const orbR = 82;
  const cardX = 430;
  const cardW = 630;
  const gap = 22;
  const topo = 30;

  const grupos = GROUP_ORDER.filter((g) => meta.grupos[g]);
  const fills = ["#650022", "#5C3B2E", "#382315"];

  const cards = grupos.map((g) => {
    const skills = meta.skills
      .filter((s) => s.grupo === g && s.nome !== "coordenadora-central")
      .map((s) => s.nome);
    const linhas = quebrarLinhas(skills.join(" · "), 74);
    return { label: meta.grupos[g], linhas, altura: 62 + linhas.length * 23 };
  });

  let y = topo;
  cards.forEach((c) => {
    c.y = y;
    c.centro = y + c.altura / 2;
    y += c.altura + gap;
  });
  const alturaTotal = y - gap + topo;
  const orbY = alturaTotal / 2;

  const ramos = cards
    .map((c) => {
      const x1 = orbX + orbR;
      const cp = x1 + (cardX - 16 - x1) * 0.55;
      return `<path d="M ${x1} ${orbY} C ${cp} ${orbY}, ${cp} ${c.centro}, ${cardX - 16} ${c.centro}" fill="none" stroke="#DCC996" stroke-width="2.5" stroke-linecap="round"/>`;
    })
    .join("\n      ");

  const caixas = cards
    .map((c, i) => {
      const fill = fills[i % fills.length];
      const textoX = cardX + 34;
      // Separador entre skills em pessego e maior que o texto: marca onde um
      // nome termina e o proximo comeca (off-white sobre off-white nao lia).
      const linhasSkills = c.linhas
        .map((linha, li) => {
          const spans = linha
            .split(" · ")
            .map(
              (nome, ni) =>
                (ni ? `<tspan fill="#F0A78B" font-size="19" dx="2"> · </tspan>` : "") +
                `<tspan fill="#FFFDEE">${esc(nome)}</tspan>`
            )
            .join("");
          return `<text x="${textoX}" y="${c.y + 48 + li * 23}" font-family="Poppins" font-size="13">${spans}</text>`;
        })
        .join("\n        ");
      return `<g>
        <rect x="${cardX}" y="${c.y}" width="${cardW}" height="${c.altura}" rx="26" fill="${fill}"/>
        <circle cx="${cardX}" cy="${c.centro}" r="15" fill="#F0A78B"/>
        <circle cx="${cardX}" cy="${c.centro}" r="6" fill="${fill}"/>
        <text x="${textoX}" y="${c.y + 26}" font-family="JetBrains Mono" font-size="10" letter-spacing="2.5" fill="#F0A78B">${esc(c.label.toUpperCase())}</text>
        ${linhasSkills}
      </g>`;
    })
    .join("\n      ");

  return `<svg viewBox="0 0 ${largura} ${alturaTotal}" width="100%" aria-label="Mapa do kit: a coordenadora-central no centro e as 14 skills agrupadas por função">
      ${ramos}
      <circle cx="${orbX}" cy="${orbY}" r="${orbR}" fill="#D97757"/>
      <circle cx="${orbX + 54}" cy="${orbY - 50}" r="11" fill="#650022"/>
      <text x="${orbX}" y="${orbY - 6}" text-anchor="middle" font-family="Libre Baskerville" font-style="italic" font-size="20" fill="#FFFDEE">coordenadora</text>
      <text x="${orbX}" y="${orbY + 20}" text-anchor="middle" font-family="Libre Baskerville" font-style="italic" font-size="20" fill="#FFFDEE">central</text>
      <text x="${orbX}" y="${orbY + orbR + 26}" text-anchor="middle" font-family="JetBrains Mono" font-size="10" letter-spacing="2.5" fill="#5C3B2E">VOCÊ FALA COM ELA</text>
      ${caixas}
    </svg>`;
}

// ---------------------------------------------------------------------
// Extração de conteúdo do SKILL.md (skill.corpo / skill.description)
// para a página de skill: "O que ela faz", "Quando usar",
// "O que ela pergunta" e "Exemplo de resultado".
// ---------------------------------------------------------------------

function splitSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+(?=[A-ZÀ-Ú(])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function extrairDescricao(description) {
  const texto = String(description || "").replace(/\s+/g, " ").trim();
  const match = texto.match(/(^|[.!?]\s+)(Use\s.+)$/);
  if (!match) {
    return { oQueFaz: texto, quandoUsar: [] };
  }
  const usoTexto = match[2];
  const oQueFaz = texto.slice(0, texto.length - usoTexto.length).trim();
  const quandoUsar = splitSentences(usoTexto);
  return { oQueFaz: oQueFaz || texto, quandoUsar };
}

function extrairSecaoPorTitulo(corpo, regexTitulo) {
  const headingRe = /^#{1,6}\s+(.+)$/gm;
  let m;
  const headings = [];
  while ((m = headingRe.exec(corpo))) {
    headings.push({ title: m[1], index: m.index, end: m.index + m[0].length });
  }
  const alvo = headings.find((h) => regexTitulo.test(h.title));
  if (!alvo) return null;
  const proximo = headings.find((h) => h.index > alvo.index);
  const fim = proximo ? proximo.index : corpo.length;
  return corpo.slice(alvo.end, fim);
}

function extrairBullets(trecho) {
  if (!trecho) return [];
  const linhas = trecho.split("\n").filter((l) => /^\s*[-*]\s+/.test(l));
  return linhas
    .map((l) =>
      l
        .replace(/^\s*[-*]\s+/, "")
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/`(.+?)`/g, "$1")
        .trim()
    )
    .filter(Boolean);
}

function extrairExemploSaida(corpo) {
  const trecho = extrairSecaoPorTitulo(corpo, /exemplo de sa[ií]da/i);
  if (!trecho) return null;
  const fence = trecho.match(/```[a-z]*\n([\s\S]*?)```/i);
  return fence ? fence[1].trim() : null;
}

function extrairOQuePergunta(corpo, entrada) {
  const trecho = extrairSecaoPorTitulo(
    corpo,
    /o que (você )?(precisa|deve) saber|recebe como input|processo|perguntas?/i
  );
  const bullets = extrairBullets(trecho);
  if (bullets.length) return bullets.slice(0, 6);
  if (entrada && entrada.config) return [entrada.config];
  return ["Nenhum dado obrigatório: descreva o que você precisa e ela conduz a conversa a partir daí."];
}

function parseSkillContent(entrada, skill) {
  const { oQueFaz, quandoUsar } = extrairDescricao(skill.description);
  const oQuePergunta = extrairOQuePergunta(skill.corpo || "", entrada);
  const exemplo = extrairExemploSaida(skill.corpo || "");
  return {
    oQueFaz,
    quandoUsar: quandoUsar.length ? quandoUsar : [skill.description],
    oQuePergunta,
    exemplo,
  };
}

// ---------------------------------------------------------------------
// renderHome
// ---------------------------------------------------------------------

export function renderHome(meta, skills) {
  const totalSkills = meta.skills.length;
  const kitMinimoQtd = meta.kit_minimo.length;
  const outrasQtd = totalSkills - kitMinimoQtd;

  const fraseOrdem = meta.ordem_instalacao.length
    ? `Instale primeiro, nesta ordem: ${meta.ordem_instalacao.map((n) => `<b>${esc(n)}</b>`).join(" e depois ")}. As outras ${totalSkills - meta.ordem_instalacao.length} skills podem entrar em qualquer sequência.`
    : "Instale as skills na ordem que fizer sentido para você.";

  const kitMinimoChips = meta.kit_minimo
    .map((n) => `<b>${esc(n)}</b>`)
    .join(", ");

  const catalogo = GROUP_ORDER.filter((g) => meta.grupos[g])
    .map((g) => {
      const label = meta.grupos[g];
      const skillsGrupo = meta.skills.filter((s) => s.grupo === g);
      const cards = skillsGrupo
        .map((s, i) => {
          const cor = CARD_COLORS[i % CARD_COLORS.length];
          if (s.nome === "coordenadora-central") {
            return `<a class="card card-hero" href="${skillHref(s.nome)}">
      <div><h4>${esc(s.nome)}</h4><p>${esc(s.resumo)}</p></div>
      <span class="btn">Ver skill</span>
    </a>`;
          }
          return `<a class="card ${cor}" href="${skillHref(s.nome)}"><span class="mono">${esc(label)}</span><h4>${esc(s.nome)}</h4><p>${esc(s.resumo)}</p></a>`;
        })
        .join("\n    ");
      return `<div class="mono group-label">${esc(label)}</div>
  <div class="cards">
    ${cards}
  </div>`;
    })
    .join("\n\n  ");

  const body = `${navHome()}

<header class="hero"><div class="wrap hero-grid">
  <div>
    <span class="mono">Imersão Claude · 12.09 · 13.09</span>
    <h1>Seu squad de conteúdo com <em>inteligência artificial</em>.</h1>
    <p>${totalSkills} skills que trabalham juntas: pesquisam o seu nicho, planejam o calendário, escrevem no seu tom e publicam. Você comanda, o squad executa.</p>
    <div class="ctas">
      <a class="btn btn-coral" href="#instalacao">Instalar o kit</a>
      <a class="btn btn-ghost" href="#skills">Conhecer as skills</a>
    </div>
  </div>
  <div class="hero-sym">
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none" aria-hidden="true">
      <circle cx="120" cy="120" r="92" stroke="#F0A78B" stroke-width="3"/>
      <circle cx="120" cy="120" r="34" fill="#D97757"/>
      <circle cx="120" cy="28" r="9" fill="#F0A78B"/>
      <circle cx="212" cy="120" r="9" fill="#F0A78B"/>
      <circle cx="120" cy="212" r="9" fill="#F0A78B"/>
      <circle cx="28" cy="120" r="9" fill="#F0A78B"/>
      <circle cx="185" cy="55" r="6" fill="#DCC996"/>
      <circle cx="55" cy="185" r="6" fill="#DCC996"/>
    </svg>
  </div>
</div></header>

<section class="diagram"><div class="wrap">
  <h2>Uma skill coordena. <em>As outras executam.</em></h2>
  <p>A coordenadora-central é a porta de entrada do kit: você diz o que precisa e ela aciona as skills certas, na ordem certa. Não é preciso decorar nada.</p>
  <div class="diagram-canvas">
    ${buildDiagramaSVG(meta)}
  </div>
</div></section>

<section class="install" id="instalacao"><div class="wrap">
  <h2>Instale em dois minutos.</h2>
  <p class="lead">${fraseOrdem}</p>
  <div class="kit-minimo">
    <span class="mono">Kit mínimo</span>
    <p>Sem tempo agora? Instale só estas ${kitMinimoQtd} e você já cria posts hoje; as outras ${outrasQtd} expandem o sistema. (${kitMinimoChips})</p>
  </div>
  <div class="install-cols">
    <div class="install-card">
      <span class="mono">Claude.ai · Cowork</span>
      <h3>Upload da skill</h3>
      <div class="step"><span class="step-n">01</span><div class="step-body"><p>Baixe o arquivo <b>.skill</b> na página da skill (ou o kit completo).</p><img src="/static/img/passo-1.png" alt="Passo 1: Página da skill mostrando o botão de download do arquivo .skill"/></div></div>
      <div class="step"><span class="step-n">02</span><div class="step-body"><p>No Claude, abra <b>Configurações › Capacidades › Criar habilidades</b>.</p><img src="/static/img/passo-2.png" alt="Passo 2: Menu do Claude com Configurações selecionadas, mostrando a opção Capacidades › Criar habilidades"/></div></div>
      <div class="step"><span class="step-n">03</span><div class="step-body"><p>Clique em <b>Fazer upload de uma habilidade</b> e selecione o arquivo.</p><img src="/static/img/passo-3.png" alt="Passo 3: Interface de upload no Claude com o botão 'Fazer upload de uma habilidade' e seletor de arquivo"/></div></div>
      <div class="step"><span class="step-n">04</span><div class="step-body"><p>Comece qualquer conversa chamando a <b>coordenadora-central</b>.</p><img src="/static/img/passo-4.png" alt="Passo 4: Conversa no Claude com a coordenadora-central chamada e respondendo"/></div></div>
      <div class="step"><span class="step-n">05</span><div class="step-body"><p>A skill está pronta! Use o comando indicado para ativar o squad completo.</p><img src="/static/img/passo-5.png" alt="Passo 5: Interface do Claude mostrando a skill coordenadora-central ativa e pronta para uso"/></div></div>
    </div>
    <div class="install-card">
      <span class="mono">Claude Code</span>
      <h3>Cole e pronto</h3>
      <div class="step"><span class="step-n">01</span><p>Abra a aba <b>Code</b> do Claude Desktop.</p></div>
      <div class="step"><span class="step-n">02</span><p>Cole a instrução abaixo e aperte Enter:</p></div>
      <span class="mono code-warning">${AVISO_CODE}</span>
      <div class="codebox">
        <code>Baixe o repositório ${REPO_URL} (se o git não estiver disponível, baixe e extraia ${REPO_ZIP}) e instale cada pasta de skills/ como skill global do Claude Code (uma pasta por skill, cada uma com seu SKILL.md)</code>
        <button class="copy-btn">COPIAR</button>
      </div>
    </div>
  </div>
</div></section>

<section class="catalog" id="skills"><div class="wrap">
  <h2>As ${totalSkills} skills do <em>squad</em>.</h2>

  ${catalogo}
</div></section>

<section class="download" id="download"><div class="wrap download-inner">
  <div>
    <h2>Prefere instalar <em>tudo de uma vez</em>?</h2>
    <p>O kit completo reúne as ${totalSkills} skills em um único arquivo. Baixe, faça o upload de cada uma e o squad está pronto.</p>
  </div>
  <div class="download-cta">
    <a class="btn btn-coral" href="/downloads/kit-completo.zip">Baixar kit completo</a>
    <p class="microtexto">O arquivo vem compactado: descompacte no seu computador e envie uma skill por vez no Claude (o zip inteiro não instala).</p>
  </div>
</div></section>

${footerHome()}
${scriptCopiar()}`;

  return documentShell({ title: "Kit de Skills · Imersão Claude 2.0", body });
}

// ---------------------------------------------------------------------
// renderSkill
// ---------------------------------------------------------------------

export function renderSkill(entrada, skill, meta) {
  const grupoLabel = meta.grupos[entrada.grupo] || entrada.grupo;
  const conteudo = parseSkillContent(entrada, skill);

  const quandoUsarLi = conteudo.quandoUsar.map((s) => `<li>${esc(s)}</li>`).join("\n        ");
  const perguntaLi = conteudo.oQuePergunta.map((s) => `<li>${esc(s)}</li>`).join("\n        ");

  const exemploBloco = conteudo.exemplo
    ? `<div class="example">
        <span class="mono">Saída de exemplo</span>
        <pre>${esc(conteudo.exemplo)}</pre>
      </div>`
    : `<div class="example">
        <span class="mono">Saída de exemplo</span>
        <pre>Peça para a skill rodar com um exemplo real do seu perfil e veja o resultado completo no chat.</pre>
      </div>`;

  const configBloco = entrada.config
    ? `<div class="side-card side-config">
      <h3>Configuração</h3>
      <p>${esc(entrada.config)}</p>
    </div>`
    : `<div class="side-card side-config">
      <h3>Configuração</h3>
      <p>Nenhum pré-requisito técnico.</p>
    </div>`;

  function relCard(nome, kicker) {
    const e = findSkillMeta(meta, nome);
    if (!e) return "";
    return `<a class="rel-card" href="${skillHref(nome)}"><span class="mono">${esc(kicker)}</span><h4>${esc(nome)}</h4><p>${esc(e.resumo)}</p></a>`;
  }

  const relacionadas = [
    ...entrada.antes.map((n) => relCard(n, "Antes")),
    ...entrada.depois.map((n) => relCard(n, "Depois")),
  ]
    .filter(Boolean)
    .join("\n    ");

  const secaoRelacionadas = relacionadas
    ? `<section class="related"><div class="wrap">
  <h2>Funciona junto com</h2>
  <div class="rel-cards">
    ${relacionadas}
  </div>
</div></section>`
    : "";

  const body = `${navSkill()}

<header class="head"><div class="wrap">
  <span class="mono">${esc(grupoLabel)}${entrada.config ? " · Com configuração" : ""}</span>
  <div class="head-grid">
    <div>
      <h1>${esc(entrada.nome)}</h1>
      <p>${esc(conteudo.oQueFaz)}</p>
    </div>
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <rect x="22" y="18" width="76" height="84" rx="8" stroke="#F0A78B" stroke-width="3"/>
      <line x1="38" y1="42" x2="82" y2="42" stroke="#D97757" stroke-width="4"/>
      <line x1="38" y1="60" x2="82" y2="60" stroke="#D97757" stroke-width="4"/>
      <line x1="38" y1="78" x2="64" y2="78" stroke="#D97757" stroke-width="4"/>
    </svg>
  </div>
</div></header>

<main class="wrap content">
  <div>
    <div class="section">
      <h2>O que ela faz</h2>
      <p>${esc(conteudo.oQueFaz)}</p>
    </div>
    <div class="section">
      <h2>Quando usar</h2>
      <ul>
        ${quandoUsarLi}
      </ul>
    </div>
    <div class="section">
      <h2>O que ela pergunta</h2>
      <ul>
        ${perguntaLi}
      </ul>
    </div>
    <div class="section">
      <h2>Exemplo de resultado</h2>
      ${exemploBloco}
    </div>
  </div>

  <aside>
    <div class="side-card side-download">
      <h3>Instalar no Claude</h3>
      <p>Baixe o arquivo e faça o upload em Configurações › Capacidades › Criar habilidades.</p>
      <a class="btn btn-coral btn-block" href="/downloads/${esc(entrada.nome)}.skill">Baixar ${esc(entrada.nome)}.skill</a>
    </div>
    <div class="side-card side-code">
      <h3>Instalar no Claude Code</h3>
      <p>Cole na aba Code do Claude Desktop:</p>
      <div class="codebox">
        <span class="mono">${AVISO_CODE}</span>
        <code>Baixe o repositório ${REPO_URL} (sem git, baixe e extraia ${REPO_ZIP}) e instale a pasta skills/${esc(entrada.nome)}/ como skill global do Claude Code</code>
        <button class="copy-btn">COPIAR</button>
      </div>
    </div>
    ${configBloco}
  </aside>
</main>

${secaoRelacionadas}

${footerSimples()}
${scriptCopiar()}`;

  return documentShell({ title: `${entrada.nome} · Kit de Skills`, body });
}

// ---------------------------------------------------------------------
// renderFluxo
// ---------------------------------------------------------------------

export function renderFluxo(meta) {
  function pillFor(nome) {
    const e = findSkillMeta(meta, nome);
    if (!e) return `<span class="pill">${esc(nome)}</span>`;
    return `<a class="pill" href="${skillHref(nome)}">${esc(nome)}</a>`;
  }

  const secoes = meta.jornadas
    .map((jornada, i) => {
      const bg = JORNADA_BG[i % JORNADA_BG.length];
      const partes = [];
      if (jornada.escolha && jornada.escolha.length) {
        jornada.escolha.forEach((nome, idx) => {
          if (idx > 0) partes.push(`<span class="pill-ou">ou</span>`);
          partes.push(pillFor(nome));
        });
        if (jornada.skills && jornada.skills.length) {
          partes.push(`<span class="pill-arrow">&rarr;</span>`);
        }
      }
      (jornada.skills || []).forEach((nome, idx) => {
        if (idx > 0) partes.push(`<span class="pill-arrow">&rarr;</span>`);
        partes.push(pillFor(nome));
      });

      return `<section class="jornada ${bg}"><div class="wrap">
  <h2>${i + 1}. ${esc(jornada.nome)}</h2>
  <div class="pills">
    ${partes.join("\n    ")}
  </div>
</div></section>`;
    })
    .join("\n\n");

  const body = `${navHome()}

<header class="fluxo-hero"><div class="wrap">
  <span class="mono">Imersão Claude · 12.09 · 13.09</span>
  <h1>As <em>cinco jornadas</em> do squad.</h1>
  <p>Cada jornada é uma sequência de skills que já sabe em que ordem trabalhar. Comece por qualquer uma delas ou peça para a coordenadora-central escolher por você.</p>
</div></header>

${secoes}

${footerHome()}`;

  return documentShell({ title: "Fluxo da semana · Kit de Skills", body });
}

// ---------------------------------------------------------------------
// renderSenha
// ---------------------------------------------------------------------

export function renderSenha() {
  const body = `<main class="gate">
  <span class="lockup">A <span class="orb"><i>ia</i></span> A</span>
  <span class="mono">Imersão Claude · 12.09 · 13.09</span>
  <h1>Área da <em>turma</em>.</h1>
  <p class="sub">Este kit é exclusivo para quem participa da Imersão Claude 2.0. Digite a senha compartilhada durante o evento.</p>
  <form method="POST" action="/entrar">
    <label for="pwd">Senha de acesso</label>
    <input id="pwd" name="senha" type="password" autocomplete="off" placeholder="••••••••••••••">
    <div class="error">Senha incorreta. Confira e tente novamente.</div>
    <button type="submit">Entrar</button>
  </form>
  <p class="hint">Não tem a senha? Ela está no grupo de WhatsApp da turma.</p>
  <div class="foot"><span class="mono">Um produto da IA Como Aliada</span></div>
</main>
<script>
var params = new URLSearchParams(location.search);
if (params.get('erro') === '1') document.querySelector('.error').style.display = 'block';
</script>`;

  return documentShell({ title: "Acesso · Kit de Skills", bodyClass: "gate-body", body });
}
