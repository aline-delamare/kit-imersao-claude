// Kit Imersão Claude 2.0 : templates do site
// Exporta renderHome, renderSkill, renderSenha.
// Cada função retorna uma string HTML completa começando em <!DOCTYPE html>.
// Todo o markup deriva dos mockups aprovados (home.html, skill-page.html,
// senha.html) e usa exclusivamente os tokens de base.css (as 7 cores do
// brand book). Nada de em-dash em texto visível.

const REPO_URL = "https://github.com/aline-delamare/kit-imersao-claude";
const REPO_ZIP = `${REPO_URL}/archive/refs/heads/main.zip`;
const AVISO_CODE = "Este bloco é para o Claude Code. No claude.ai, use o caminho de upload ao lado.";
const GROUP_ORDER = ["comecar", "pesquisa", "criacao", "publicacao", "analise"];
const CARD_COLORS = ["c-off", "c-pessego", "c-medio", "c-bege", "c-vinho"];

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

// Abas do site (R11): o Squad de Conteúdo e as duas demonstrações de Claude Code
// do dia 2 são assuntos diferentes, cada um na sua aba. Exatamente uma fica ativa.
const ABAS = [
  { id: "squad", href: "/index.html", rotulo: "Squad de Conteúdo" },
  { id: "financeiro", href: "/financeiro.html", rotulo: "Dashboard financeiro" },
  { id: "bio", href: "/link-da-bio.html", rotulo: "Link da bio" },
];

function abas(ativa) {
  const links = ABAS.map((a) =>
    a.id === ativa
      ? `<a class="aba ativa" href="${a.href}" aria-current="page">${a.rotulo}</a>`
      : `<a class="aba" href="${a.href}">${a.rotulo}</a>`
  ).join("");
  return `<div class="abas"><div class="wrap abas-inner" aria-label="Abas do site">${links}</div></div>`;
}

function navHome() {
  return `<nav><div class="wrap nav-inner">
  <a class="brand" href="/index.html"><span class="orb"><i>ia</i></span><b>Kit de Skills</b></a>
  <div class="nav-links">
    <a href="/index.html#instalacao">Instalação</a><a href="/index.html#skills">Skills</a>
    <a class="nav-cta" href="/index.html#download">Baixar o kit</a>
  </div>
</div>${abas("squad")}</nav>`;
}

function navSkill() {
  return `<nav><div class="wrap nav-inner">
  <a class="brand" href="/index.html"><span class="orb"><i>ia</i></span><b>Kit de Skills</b></a>
  <a class="back" href="/index.html#skills">&larr; Todas as skills</a>
</div>${abas("squad")}</nav>`;
}

function navDia2(ativa) {
  return `<nav><div class="wrap nav-inner">
  <a class="brand" href="/index.html"><span class="orb"><i>ia</i></span><b>Kit de Skills</b></a>
  <span class="back">Dia 2 · Claude Code</span>
</div>${abas(ativa)}</nav>`;
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
// meta.grupos / meta.skills.
// ---------------------------------------------------------------------

// Nome de exibição: "Lia · coordenadora-central" quando a skill tem apelido.
// O nome do arquivo segue visível porque é o nome do download.
function nomeExibicao(entrada) {
  if (!entrada) return "";
  return entrada.apelido ? `${entrada.apelido} · ${entrada.nome}` : entrada.nome;
}

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
  const coord = meta.skills.find((s) => s.nome === "coordenadora-central");
  const apelido = (coord && coord.apelido) || "coordenadora";
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

  return `<svg viewBox="0 0 ${largura} ${alturaTotal}" width="100%" aria-label="Mapa do kit: ${esc(apelido)}, a coordenadora-central, no centro e as 14 skills agrupadas por função">
      ${ramos}
      <circle cx="${orbX}" cy="${orbY}" r="${orbR}" fill="#D97757"/>
      <circle cx="${orbX + 54}" cy="${orbY - 50}" r="11" fill="#650022"/>
      <text x="${orbX}" y="${orbY + 8}" text-anchor="middle" font-family="Libre Baskerville" font-style="italic" font-size="38" fill="#FFFDEE">${esc(apelido)}</text>
      <text x="${orbX}" y="${orbY + 34}" text-anchor="middle" font-family="JetBrains Mono" font-size="9" letter-spacing="2" fill="#FFFDEE">COORDENADORA</text>
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
  // Textos escritos para o aluno no meta (campo "pagina") têm prioridade sobre
  // o que é extraído do SKILL.md, que foi escrito para o Claude.
  const pagina = entrada.pagina || {};
  return {
    chamada: pagina.chamada || oQueFaz,
    oQueFaz: pagina.oQueFaz || oQueFaz,
    quandoUsar: pagina.quandoUsar || (quandoUsar.length ? quandoUsar : [skill.description]),
    oQuePergunta: pagina.oQuePergunta || oQuePergunta,
    exemplo: pagina.exemplo || exemplo,
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
    ? `Instale primeiro, nesta ordem: ${meta.ordem_instalacao.map((n) => `<b>${esc(nomeExibicao(findSkillMeta(meta, n)) || n)}</b>`).join(" e depois ")}. As outras ${totalSkills - meta.ordem_instalacao.length} skills podem entrar em qualquer sequência.`
    : "Instale as skills na ordem que fizer sentido para você.";

  const kitMinimoChips = meta.kit_minimo
    .map((n) => `<b>${esc(nomeExibicao(findSkillMeta(meta, n)) || n)}</b>`)
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
      <div><h4>${esc(nomeExibicao(s))}</h4><p>${esc(s.resumo)}</p></div>
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
  <p>A Lia (skill coordenadora-central) é a porta de entrada do kit: você diz o que precisa, ela pergunta o que falta, chama a skill certa e volta para decidir o próximo passo com você. Não é preciso decorar nada.</p>
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
      <div class="step"><span class="step-n">01</span><p>Baixe o arquivo <b>.skill</b> na página da skill (ou o kit completo, logo abaixo).</p></div>
      <div class="step"><span class="step-n">02</span><div class="step-body"><p>No Claude, abra <b>Personalizar</b> (Customize) na barra lateral.</p><img src="/static/img/passo-1.png" alt="Passo 2: barra lateral do Claude com a opção Customize"/></div></div>
      <div class="step"><span class="step-n">03</span><div class="step-body"><p>Clique em <b>Criar novas habilidades</b>.</p><img src="/static/img/passo-2.png" alt="Passo 3: tela Personalizar o Claude com o cartão Criar novas habilidades"/></div></div>
      <div class="step"><span class="step-n">04</span><div class="step-body"><p>Em <b>Habilidades</b>, clique no <b>+</b> (Adicionar habilidade).</p><img src="/static/img/passo-3.png" alt="Passo 4: lista de Habilidades com o botão + Adicionar habilidade em destaque"/></div></div>
      <div class="step"><span class="step-n">05</span><div class="step-body"><p>Escolha <b>Criar habilidade › Fazer upload de uma habilidade</b>.</p><img src="/static/img/passo-4.png" alt="Passo 5: menu Criar habilidade com a opção Fazer upload de uma habilidade"/></div></div>
      <div class="step"><span class="step-n">06</span><div class="step-body"><p>Arraste o arquivo <b>.skill</b> para a janela e pronto. Repita para cada skill.</p><img src="/static/img/passo-5.png" alt="Passo 6: janela Fazer upload de habilidade com a área para arrastar o arquivo"/></div></div>
      <div class="step"><span class="step-n">07</span><p>Abra uma conversa nova e escreva <b>chama a Lia</b>. Ela se apresenta e conduz o resto.</p></div>
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
    return `<a class="rel-card" href="${skillHref(nome)}"><span class="mono">${esc(kicker)}</span><h4>${esc(nomeExibicao(e))}</h4><p>${esc(e.resumo)}</p></a>`;
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
  <span class="mono">${esc(grupoLabel)}${entrada.config ? " · Com configuração" : ""}${entrada.apelido ? ` · skill ${esc(entrada.nome)}` : ""}</span>
  <div class="head-grid">
    <div>
      <h1>${esc(entrada.apelido || entrada.nome)}</h1>
      <p>${esc(conteudo.chamada)}</p>
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
      <p>Baixe o arquivo e faça o upload em Personalizar › Habilidades › + › Fazer upload de uma habilidade.</p>
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

// ---------------------------------------------------------------------
// Abas do dia 2 (R11): demonstrações de Claude Code, fora do Squad.
// Conteúdo escrito para quem participa; os pacotes vêm de extras/.
// ---------------------------------------------------------------------

function passo(n, html) {
  return `<div class="step"><span class="step-n">${String(n).padStart(2, "0")}</span><p>${html}</p></div>`;
}

function paginaDia2({ ativa, titulo, kicker, chamada, simbolo, principal, lateral }) {
  const body = `${navDia2(ativa)}

<header class="head"><div class="wrap">
  <span class="mono">${kicker}</span>
  <div class="head-grid">
    <div>
      <h1>${titulo}</h1>
      <p>${chamada}</p>
    </div>
    ${simbolo}
  </div>
</div></header>

<main class="wrap content">
  <div>
    ${principal}
  </div>
  <aside>
    ${lateral}
  </aside>
</main>

${footerSimples()}
${scriptCopiar()}`;
  return documentShell({ title: `${titulo} · Kit de Skills`, body });
}

export function renderFinanceiro() {
  const simbolo = `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <rect x="20" y="62" width="16" height="36" rx="3" fill="#F0A78B"/>
      <rect x="44" y="44" width="16" height="54" rx="3" fill="#D97757"/>
      <rect x="68" y="28" width="16" height="70" rx="3" fill="#F0A78B"/>
      <circle cx="96" cy="26" r="8" fill="#DCC996"/>
    </svg>`;
  const principal = `<div class="section">
      <h2>O que ela faz</h2>
      <p>Lê os extratos do mês, separa o que é da empresa e o que é pessoal pela conta de origem, categoriza os lançamentos, monta o DRE da empresa em 7 linhas e gera o <code>dashboard.html</code> com o histórico de todos os meses fechados. O que ficar ambíguo vira pergunta: a skill nunca estima um valor.</p>
    </div>
    <div class="section">
      <h2>O que ter em mãos</h2>
      <ul>
        <li>Os prints ou os extratos em PDF do mês: conta da empresa, conta pessoal, fatura do cartão e as plataformas onde você vende. Print de celular serve.</li>
        <li>O aplicativo do Claude no computador, com a aba Code.</li>
        <li>Uns 15 minutos. O primeiro mês demora um pouco mais, porque inclui a configuração inicial.</li>
      </ul>
    </div>
    <div class="section">
      <h2>Como instalar e usar</h2>
      ${passo(1, "Baixe o <b>meu-financeiro.zip</b> e descompacte com dois cliques. Vai aparecer a pasta <b>meu-financeiro</b>. Guarde onde preferir, por exemplo em Documentos.")}
      ${passo(2, "No aplicativo do Claude, abra a aba <b>Code</b> e escolha a pasta <b>meu-financeiro</b> para trabalhar.")}
      ${passo(3, "Digite <b>/fechar-mes</b>. Para testar, informe o mês <b>2026-08</b>: a pasta já vem com os prints de uma empresa fictícia, o Estúdio Aurora Design.")}
      ${passo(4, "Na primeira vez, a skill pergunta o nome do seu negócio e quais bancos são da empresa e quais são pessoais. As respostas ficam gravadas no próprio arquivo da skill, e nos meses seguintes ela já sabe.")}
      ${passo(5, "Revise e aprove o que ela leu, já separado entre empresa e pessoal. Depois disso, o <b>dashboard.html</b> abre no navegador.")}
    </div>
    <div class="section">
      <h2>O ritual de todo mês</h2>
      <p>Salve os extratos do mês em <code>extratos/AAAA-MM/</code> (por exemplo, <code>extratos/2026-09/</code>) ou arraste direto para a conversa, e digite <b>/fechar-mes</b>. O dashboard é refeito com o mês novo e todo o histórico. A partir do segundo mês fechado aparecem as setas de variação e os gastos recorrentes.</p>
    </div>
    <div class="section">
      <h2>Bom saber</h2>
      <ul>
        <li>O Claude Code vai pedir permissão algumas vezes: para gravar a configuração, salvar os dados do mês e abrir o dashboard. É só aprovar.</li>
        <li>Print ilegível ou cortado vira pendência: a skill pergunta em vez de adivinhar.</li>
        <li>Se o PDF do banco pedir senha, abra o arquivo e use Imprimir › Salvar como PDF para gerar uma cópia sem senha.</li>
        <li>A skill não substitui a contabilidade.</li>
      </ul>
    </div>`;
  const lateral = `<div class="side-card side-download">
      <h3>Baixar o sistema</h3>
      <p>A pasta completa: a skill, o LEIA-ME, a pasta de dados e os prints de exemplo de agosto.</p>
      <a class="btn btn-coral btn-block" href="/downloads/meu-financeiro.zip">Baixar meu-financeiro.zip</a>
    </div>
    <div class="side-card side-config">
      <h3>Onde funciona</h3>
      <p>Só no Claude Code, no seu computador. Não precisa de servidor, login nem banco de dados. Sem internet, os gráficos não aparecem, mas os números, o DRE e as tabelas continuam.</p>
    </div>
    <div class="side-card side-code">
      <h3>Mantenha a pasta inteira</h3>
      <p>A pasta <b>meu-financeiro</b> tem uma parte oculta, <code>.claude</code>, que é onde a skill mora, e a pasta <code>dados</code>, que guarda os meses fechados. Se mudar de lugar, mova a pasta inteira.</p>
    </div>`;
  return paginaDia2({
    ativa: "financeiro",
    titulo: "Dashboard financeiro",
    kicker: "Dia 2 · Claude Code · Skill fechar-mes",
    chamada: "A skill <b>/fechar-mes</b> transforma os prints ou os extratos em PDF do seu banco em um dashboard que separa pessoa física de pessoa jurídica e entrega o DRE mensal da empresa. O sistema funciona e fica guardado no seu computador.",
    simbolo,
    principal,
    lateral,
  });
}

export function renderLinkDaBio() {
  const simbolo = `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <rect x="34" y="12" width="52" height="96" rx="10" stroke="#F0A78B" stroke-width="3"/>
      <circle cx="60" cy="34" r="8" fill="#D97757"/>
      <rect x="44" y="52" width="32" height="10" rx="5" fill="#DCC996"/>
      <rect x="44" y="68" width="32" height="10" rx="5" fill="#D97757"/>
      <rect x="44" y="84" width="32" height="10" rx="5" fill="#DCC996"/>
    </svg>`;
  const principal = `<div class="section">
      <h2>O que ela faz</h2>
      <p>Entrevista você sobre o conteúdo e a aparência da página, uma pergunta por vez, e monta a página a partir de um modelo pronto, com as suas cores e fontes. Depois liga o formulário ao seu e-mail e leva até a publicação no Netlify. Se você tiver um domínio próprio, ela conduz esse passo também. Nada é publicado antes da sua aprovação.</p>
    </div>
    <div class="section">
      <h2>O que ter em mãos</h2>
      <ul>
        <li>A sua foto, ou as suas fotos, salvas no computador em .jpg. Se vieram do iPhone em .heic, exporte como .jpg pelo próprio celular antes.</li>
        <li>Os endereços dos seus caminhos: página de vendas, agenda, grupo, o que for.</li>
        <li>O e-mail que deve receber os contatos do formulário.</li>
        <li>Uma conta gratuita no Netlify, criada em netlify.com.</li>
        <li>Se você já criou o seu contexto de marca com a configurar-marca, deixe o <code>contexto-marca.md</code> na pasta do projeto: ela aproveita as cores, as fontes e o tom.</li>
      </ul>
    </div>
    <div class="section">
      <h2>Como instalar</h2>
      ${passo(1, "Baixe o <b>link-da-bio.zip</b> e descompacte. Vai aparecer a pasta <b>link-da-bio</b>.")}
      ${passo(2, "Copie a pasta inteira para a pasta de skills do Claude. No Mac: <code>/Users/o-seu-nome/.claude/skills/</code>. No Windows: <code>C:\\Users\\O-SEU-NOME\\.claude\\skills\\</code>. Se a pasta skills não existir, crie com esse nome. No Mac, a pasta .claude fica oculta: aperte Command, Shift e ponto para ela aparecer. Se preferir, o Claude Code copia por você com o pedido ao lado.")}
      ${passo(3, "Abra o Claude Code na pasta do seu projeto, a que tem o contexto do seu negócio, e escreva: <b>quero criar o meu link da bio</b>. Se a skill não aparecer, comece uma conversa nova.")}
    </div>
    <div class="section">
      <h2>Como ela conduz</h2>
      <ul>
        <li>Contexto: procura na pasta o contexto do seu negócio e pergunta só o que não achar.</li>
        <li>Conteúdo: o que quem chega precisa decidir, os seus caminhos e o endereço de cada um, e o que cada formulário recebe.</li>
        <li>Aparência: formato do quiz (em conversa, em lista ou sem quiz), cor dos cards, menu rápido, efeitos, apresentação, botão de WhatsApp e rodapé.</li>
        <li>Textos: ela propõe e você troca pelo seu jeito de falar.</li>
        <li>A chave do formulário: em web3forms.com, você digita o e-mail que recebe os contatos, clica em Create Access Key e cola a chave na conversa. O plano gratuito aceita 250 envios por mês.</li>
        <li>Aprovação: você testa o quiz, os cards e cada formulário, e confirma que o e-mail chegou.</li>
      </ul>
    </div>
    <div class="section">
      <h2>Publicar e atualizar</h2>
      ${passo(1, "Abra <b>app.netlify.com/drop</b> já com a sua conta do Netlify aberta.")}
      ${passo(2, "Arraste a pasta <b>meu-link-da-bio</b> inteira, e não o arquivo solto, porque as fotos vão junto.")}
      ${passo(3, "O endereço aparece em segundos. Confira no celular e cole na bio do Instagram.")}
      <p>Para mudar a página depois, peça a alteração em uma conversa com a skill e arraste a pasta de novo pelo painel do Netlify, em <b>Deploys</b>. Não use o app.netlify.com/drop de novo, porque ele cria um segundo site com outro endereço.</p>
    </div>`;
  const lateral = `<div class="side-card side-download">
      <h3>Baixar a skill</h3>
      <p>A pasta link-da-bio: a skill, o modelo da página e o guia das fotos.</p>
      <a class="btn btn-coral btn-block" href="/downloads/link-da-bio.zip">Baixar link-da-bio.zip</a>
    </div>
    <div class="side-card side-code">
      <h3>Instalar pelo Claude Code</h3>
      <p>Com o zip já descompactado na pasta Downloads, cole na aba Code:</p>
      <div class="codebox">
        <code>Copie a pasta link-da-bio que está na minha pasta Downloads para a pasta de skills globais do Claude Code, dentro de .claude/skills na minha pasta de usuário, e confirme que o arquivo SKILL.md ficou em .claude/skills/link-da-bio.</code>
        <button class="copy-btn">COPIAR</button>
      </div>
    </div>
    <div class="side-card side-config">
      <h3>Onde funciona</h3>
      <p>Só no Claude Code. A hospedagem no Netlify e a chave do formulário no Web3Forms são gratuitas.</p>
    </div>`;
  return paginaDia2({
    ativa: "bio",
    titulo: "Link da bio",
    kicker: "Dia 2 · Claude Code · Skill link-da-bio",
    chamada: "A skill <b>link-da-bio</b> monta com você um link da bio interativo: um quiz que direciona cada visitante para o caminho certo, cards com os seus caminhos e um formulário que envia os contatos para o seu e-mail. Ela também conduz a publicação, sem hospedagem paga.",
    simbolo,
    principal,
    lateral,
  });
}
