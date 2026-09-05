---
name: analise-perfil-insta
description: Analisa a performance de um perfil do Instagram via browser, identifica padrões nos posts e gera um relatório completo em .docx salvo no Google Drive com ranking, análise de top/bottom performers e recomendações estratégicas. Use esta skill sempre que o usuário pedir para analisar um perfil do Instagram, entender o que está funcionando ou não nos posts, auditar uma conta, gerar relatório de performance de Instagram, ou identificar padrões de conteúdo — mesmo que não mencione explicitamente "análise" ou "relatório".
---

# Análise de Performance do Instagram

Skill que analisa o perfil do Instagram via browser, identifica padrões de sucesso e fracasso nos posts e gera um relatório profissional em .docx, salvo no Google Drive, com análise completa e recomendações estratégicas.

## Fluxo Completo

O trabalho acontece em 3 fases sequenciais. Cada fase depende da anterior.

```
FASE 1: COLETA DE DADOS
  → Acessar o perfil do Instagram via browser
  → Coletar métricas dos posts recentes
  → Registrar: tipo de post, tema, copy, métricas visíveis

FASE 2: ANÁLISE
  → Rankear posts por performance (alcance + engajamento)
  → Identificar top 5 e bottom 5
  → Extrair padrões dos top performers
  → Identificar o que falhou nos bottom performers

FASE 3: RELATÓRIO
  → Gerar relatório .docx e subir no Google Drive
```

## Perguntas de Onboarding

Antes de começar, perguntar ao/à cliente:

1. Qual o link do perfil do Instagram a ser analisado?
2. Qual o nicho ou área de atuação do perfil? (ex: saúde, negócios, educação, lifestyle)
3. Qual o objetivo principal do perfil no Instagram? (crescimento de seguidores, engajamento, vendas, autoridade)
4. Tem dados do Meta Business Suite disponíveis? (salvamentos, alcance, compartilhamentos — complementam muito a análise)
5. Quantos posts devem ser analisados? (default: últimos 30)
6. Tem algum período específico que quer focar?

---

## Fase 1: Coleta de Dados via Browser

### Acessando o perfil

O link do Instagram será fornecido pelo/a cliente. Acessar o perfil via browser usando as ferramentas de navegação disponíveis.

**Antes de coletar, confirmar que é o perfil certo:** verificar nome, bio e nicho contra o que o/a cliente informou no onboarding. Handles parecidos (com/sem ponto, underline) pertencem a pessoas diferentes. Se houver qualquer divergência, parar e confirmar com o/a cliente antes de continuar.

**Se o perfil for privado:** solicitar o export do Instagram Insights antes de continuar — sem acesso às métricas, a análise não tem base confiável.

Passos para perfis públicos:

1. Navegar até o link fornecido
2. Rolar a página para carregar mais posts, se necessário
3. Para cada post visível, clicar para abrir e coletar:
   - Tipo do post (reel, carrossel, imagem única)
   - Copy da legenda (primeiras linhas visíveis)
   - Número de curtidas
   - Número de comentários
   - Data aproximada de publicação
   - Tema/assunto do post (inferir pela legenda e imagem)

### O que registrar

Para cada post, usar esta estrutura:

```
Post #N:
- Tipo: [reel / carrossel / imagem]
- Data: [data aproximada]
- Tema: [tema inferido]
- Copy da tela/legenda: [primeiras linhas]
- Curtidas: [número]
- Comentários: [número]
- Observações: [algo que chamou atenção — hook forte, visual diferente, etc.]
```

### Limitações e adaptações

- Se curtidas estiverem ocultas: usar comentários como proxy principal
- A lista de comentários é truncada na visão pública (~15 carregados por post) — registrar contagens como aproximadas
- Métricas internas (alcance, impressões, salvamentos) não ficam visíveis publicamente — registrar isso com clareza no relatório
- Posts fixados e impulsionados (anúncios) distorcem a leitura — marcar e tratar à parte no ranking
- Se houver dificuldades técnicas no browser: solicitar ao/à cliente dados do Meta Business Suite antes de continuar

---

## Fase 2: Análise de Performance

### Métricas e ranking

Criar um score de engajamento para cada post com base nos dados coletados.

**Score com dados públicos:**
- Curtidas: peso 1x
- Comentários: peso 3x (comentários sinalizam engajamento mais profundo)

**Score com dados do Business Suite:**
- Alcance: peso 2x
- Curtidas: peso 1x
- Comentários: peso 3x
- Compartilhamentos: peso 4x
- Salvamentos: peso 5x (o sinal mais forte para o algoritmo)

### Análise dos Top 5

Para os 5 posts com maior score, investigar:

1. Qual o tema em comum?
2. Que tipo de conteúdo era (reel, carrossel, imagem)?
3. Como era o hook/copy da tela inicial?
4. Qual o padrão de formato?
5. Em que dia/horário foram postados?
6. O que eles têm em comum que os diferencia dos demais?

### Análise dos Bottom 5

Para os 5 posts com menor score, investigar:

1. O que eles têm em comum?
2. O tema era diferente dos top performers?
3. O formato era diferente?
4. O hook era fraco? A copy era genérica?
5. O que pode ter causado a baixa performance?

### Padrões a identificar

- Temas que consistentemente performam bem vs. mal
- Formatos (reel vs. carrossel vs. imagem) que dominam o top
- Elementos de copy que aparecem nos melhores hooks
- Frequência de postagem e relação com performance
- Se algum pilar de conteúdo específico domina o top — identificar qual e entender por quê, considerando o nicho e objetivo informados no onboarding

---

## Fase 3: Relatório em .docx no Google Drive

**IMPORTANTE: NUNCA gerar o relatório em HTML.** O MCP do Google Drive não converte HTML em Google Doc — o arquivo fica salvo como HTML cru, inutilizável. O caminho correto:

1. **Gerar o relatório como arquivo .docx** usando a skill `docx` (docx-js via Node). Isso garante tabelas com cabeçalho colorido, linhas alternadas e formatação profissional.
   - Nas tabelas, usar sempre `WidthType.DXA` (nunca `PERCENTAGE` — quebra no Google Docs) e `ShadingType.CLEAR` no sombreamento.
2. **Subir o .docx no Google Drive** com a ferramenta `create_file` do MCP do Drive:
   - `base64Content`: o .docx codificado em base64
   - `contentMimeType`: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
   - **Atenção:** ler e passar o base64 programaticamente direto no tool call. NUNCA imprimir o conteúdo base64 no chat.
3. **Resultado para o/a cliente:** o Google Docs abre e edita .docx nativamente — basta clicar no arquivo no Drive e ele abre no editor do Docs, com tabelas e cores preservadas.
4. **Fazer upload UMA única vez.** Se falhar, diagnosticar antes de tentar de novo — uploads repetidos criam duplicatas no Drive.
5. Entregar o link no formato `https://drive.google.com/file/d/{id}/view`.

O relatório deve seguir esta estrutura:

```
RELATÓRIO DE PERFORMANCE — INSTAGRAM @[perfil]
Data da análise: [data]
Nicho: [nicho informado]
Objetivo: [objetivo informado]

1. RESUMO EXECUTIVO
   → Quantos posts analisados, período coberto, principais destaques

2. RANKING DE PERFORMANCE
   → Tabela com todos os posts rankeados por score
   → Colunas: Posição | Tipo | Tema | Curtidas | Comentários | Score

3. TOP 5 — POSTS QUE MAIS PERFORMARAM
   → Para cada post: detalhes, métricas e por que funcionou

4. BOTTOM 5 — POSTS QUE MENOS PERFORMARAM
   → Para cada post: detalhes, métricas e por que não funcionou

5. PADRÕES IDENTIFICADOS
   → Temas vencedores
   → Formatos vencedores
   → Elementos de copy que funcionam
   → O que evitar

6. RECOMENDAÇÕES ESTRATÉGICAS
   → O que fazer mais
   → O que parar de fazer
   → O que testar

APÊNDICE: Dados brutos coletados
```

### Estilo do relatório

- Tabelas com cabeçalho colorido e linhas alternadas
- Headers claros e hierarquia visual bem definida
- Linguagem direta e acionável — evitar análises genéricas que poderiam se aplicar a qualquer perfil
- Incluir disclaimer claro sobre limitações dos dados públicos

---

## Checklist de qualidade final

Antes de entregar:

- [ ] O relatório foi gerado como .docx (NÃO HTML) e está no Google Drive?
- [ ] Existe apenas UM arquivo no Drive (sem duplicatas de tentativas anteriores)?
- [ ] O ranking está correto e coerente com os dados coletados?
- [ ] Os padrões identificados fazem sentido dado o nicho e objetivo do perfil?
- [ ] As recomendações são específicas e acionáveis (não genéricas)?
- [ ] O relatório inclui disclaimer sobre limitações de dados públicos?
- [ ] Se o perfil era privado, os dados vieram do export do Insights?
