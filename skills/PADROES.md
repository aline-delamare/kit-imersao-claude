# Padrões do Kit — contratos entre as skills

Este arquivo é a fonte dos blocos padronizados. As skills COPIAM estes blocos;
nenhuma skill redefine score, onboarding ou ponte por conta própria.

## 1. Bloco de onboarding (colar no início de toda skill que usa contexto de marca)

> **Antes de começar:** esta skill trabalha a partir do seu contexto de marca.
> Peça ao usuário o arquivo ou o texto do contexto (criado pela `configurar-marca`).
> Se a pessoa ainda não tiver um contexto de marca, NÃO siga com perguntas soltas:
> diga que o primeiro passo é criar o contexto e conduza para a skill
> `configurar-marca`. Só continue quando o contexto existir ou a pessoa pedir
> explicitamente para seguir sem ele (nesse caso, avise que o resultado fica genérico).

Skills ISENTAS do bloco (não usam contexto de marca): `coletora-instagram`, `configurar-marca`,
`coordenadora-central` (ela ENCAMINHA para a configurar-marca, não consome o contexto).

Exceção registrada: a `analise-perfil-insta` oferece a configurar-marca primeiro; se a pessoa
preferir seguir sem contexto agora, pergunta apenas nicho e objetivo e segue (Task 14).

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
| Conectores (Notion, Canva, Drive) | sim, se conectados | sim, se conectados | sim, se configurados |
| Ler/gravar arquivo local | não | pasta do projeto | sim |
| Rodar código (Node/Python) | não | limitado | sim |

Regra de escrita: a skill descreve a AÇÃO ("salve o texto no seu Notion usando o
conector"), nunca o nome técnico da ferramenta (proibido `mcp__...`). Todo passo
que depende de conector ou de arquivo local declara o caminho alternativo em
seguida ("sem o conector, entregue a tabela no chat para copiar e colar").

## 5. Onde guardar o contexto de marca (usado pela configurar-marca)

- claude.ai: criar um Projeto "Meu conteúdo" e salvar o contexto nas instruções
  do projeto (ou como documento anexado ao projeto).
- Cowork: salvar como `contexto-marca.md` na pasta de trabalho.
- Claude Code: salvar como `contexto-marca.md` na pasta onde a pessoa trabalha
  e citar o caminho.
- As demais skills PEDEM o contexto (bloco 1) — nada é lido "automaticamente".
