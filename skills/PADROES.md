# Padrões do Kit — contratos entre as skills

Este arquivo é a fonte dos blocos padronizados. As skills COPIAM estes blocos;
nenhuma skill redefine score, onboarding ou ponte por conta própria.

## 1. Bloco de onboarding (colar no início de toda skill que usa contexto de marca)

Existem dois blocos, conforme o que a skill faz. Nunca misture os dois nem
parafraseie o blockquote — cole literalmente o que corresponde à sua skill.

### 1A — Portão (skills que PRODUZEM conteúdo na voz da pessoa)

Essas skills escrevem texto que vai ao ar como se fosse a pessoa falando —
sem contexto de marca, o resultado sai genérico ou fora do tom, e não há como
consertar isso só perguntando "nicho e objetivo". Por isso, aqui o contexto é
pré-requisito: a skill trava e conduz para a `configurar-marca` antes de seguir.

> **Antes de começar:** esta skill trabalha a partir do seu contexto de marca.
> Peça ao usuário o arquivo ou o texto do contexto (criado pela `configurar-marca`).
> Se a pessoa ainda não tiver um contexto de marca, NÃO siga com perguntas soltas:
> diga que o primeiro passo é criar o contexto e conduza para a skill
> `configurar-marca`. Só continue quando o contexto existir ou a pessoa pedir
> explicitamente para seguir sem ele (nesse caso, avise que o resultado fica genérico).

Usam este bloco: `redatora-copy`, `estrategista-calendario`, `adaptadora-ganchos`,
`editora-visual`, `publicadora-notion`.

### 1B — Aviso (skills que ANALISAM ou PESQUISAM)

Essas skills leem o que já existe ou pesquisam fora — o contexto de marca deixa
a leitura mais afiada (pilares certos, ângulo mais preciso para o nicho), mas a
skill funciona sem ele. Um aluno leigo não sabe que precisa "pedir para seguir
sem contexto" para destravar — por isso aqui NUNCA é um portão: pergunte só o
mínimo necessário e siga.

> **Antes de começar:** esta skill funciona melhor com o seu contexto de marca
> (criado pela `configurar-marca`) — com ele, o resultado sai calibrado para o
> seu nicho e pilares, em vez de genérico. Se a pessoa já tiver o contexto,
> peça o arquivo ou o texto. Se ainda não tiver, NÃO trave a conversa esperando
> que ela peça para seguir sem ele: pergunte diretamente o nicho e o objetivo
> principal e siga com a análise. Ofereça a `configurar-marca` como algo para
> fazer depois, nunca como pré-requisito para continuar agora.

Usam este bloco: `pesquisadora-tendencias`, `cacadora-viral`, `analisadora-concorrentes`,
`analista-contexto-conta`, `analisadora-perfil-proprio`, `analise-perfil-insta`,
`diagnosticadora-estrategica`.

Skills ISENTAS de qualquer um dos dois blocos (não usam contexto de marca): `coletora-instagram`, `configurar-marca`,
`coordenadora-central` (ela ENCAMINHA para a configurar-marca, não consome o contexto).

## 2. Score de engajamento único

score = curtidas + (3 × comentários) + (4 × compartilhamentos) + (5 × salvamentos)

Compartilhamentos e salvamentos entram como 0 quando o dado não está disponível
(coleta pública só vê curtidas e comentários). Nenhuma skill usa views ou alcance
como critério de corte; quando o usuário fornecer o export do Instagram Insights,
alcance pode aparecer como INFORMAÇÃO complementar no relatório, nunca como score.
Usam este score: `coletora-instagram`, `analisadora-perfil-proprio`,
`analise-perfil-insta`, `analisadora-concorrentes` (ranquear "o que mais engaja"),
`diagnosticadora-estrategica` (fases de crescimento).
Regra de comparação: nunca misture num MESMO ranking posts com dados públicos
(compartilhamentos/salvamentos = 0) e posts com dados do Insights (pesos 4x/5x
preenchidos) — o ranking distorce; ranqueie cada fonte separada.

## 3. Bloco de ponte (colar no FIM de toda skill, adaptando a skill de destino)

> **Próximo passo:** [uma frase do que vem agora]. Para isso, use a skill
> `nome-da-proxima-skill`. Se preferir que eu conduza o caminho inteiro,
> chame a `coordenadora-central`.

## 4. Capacidades por ambiente (referência para escrever fallbacks)

| Capacidade | claude.ai | Cowork | Claude Code |
|---|---|---|---|
| Navegar na web / buscar | sim (busca) | sim | sim |
| Coletar dados do Instagram | por capturas de tela (não controla navegador) | navega e coleta sozinho, com Claude in Chrome + sessão logada no Instagram da pessoa (exige plano pago) | navega e coleta sozinho, com Claude in Chrome + sessão logada no Instagram da pessoa (exige plano pago) |
| Conectores (Notion, Canva, Drive) | sim, se conectados | sim, se conectados | sim, se configurados |
| Ler/gravar arquivo local | não | pasta do projeto | sim |
| Rodar código (Node/Python) | não | limitado | sim |

Regra de escrita: a skill descreve a AÇÃO ("salve o texto no seu Notion usando o
conector"), nunca o nome técnico da ferramenta (proibido `mcp__...`). Todo passo
que depende de conector ou de arquivo local declara o caminho alternativo em
seguida ("sem o conector, entregue a tabela no chat para copiar e colar").

Regra para skills de coleta do Instagram: apresente PRIMEIRO o caminho navegado
(Cowork ou Claude Code, com a extensão Claude in Chrome instalada e a pessoa
logada na própria conta do Instagram no Chrome dela — exige plano pago, Claude
Pro ou superior) e só depois o caminho de capturas de tela, para quem está no
claude.ai ou sem a extensão.

## 5. Onde guardar o contexto de marca (usado pela configurar-marca)

- claude.ai: criar um Projeto "Meu conteúdo" e salvar o contexto nas instruções
  do projeto (ou como documento anexado ao projeto).
- Cowork: salvar como `contexto-marca.md` na pasta de trabalho.
- Claude Code: salvar como `contexto-marca.md` na pasta onde a pessoa trabalha
  e citar o caminho.
- Nas três superfícies, orientar a linha nas instruções do Projeto: "Antes de
  qualquer tarefa, leia o arquivo contexto-marca.md." No Claude Code, oferecer
  acrescentar essa linha no `CLAUDE.md` da pasta, só com o ok da pessoa.
- Sem essa linha, as demais skills PEDEM o contexto (bloco 1) — nada é lido
  "automaticamente" além do que a linha nas instruções faz.
