# Template do dashboard — especificação (v2, com as melhorias da pesquisa de 03/09/2026)

O `dashboard.html` é UM arquivo autocontido, regenerado por inteiro a cada fechamento, com os dados de todos os meses de `dados/` embutidos num `const DADOS = [...]` no próprio HTML. Nada de fetch, nada de arquivo externo — aberto com dois cliques, funciona.

Princípio que governa tudo (pesquisa de mercado): **5 a 9 métricas por aba, uma manchete por aba, todo número com tendência e semáforo**. Não adicionar nada além do especificado aqui.

## Estrutura da página (de cima para baixo)

1. **Header** — nome do negócio, "Dashboard Financeiro" e o seletor de mês (dropdown com todos os meses fechados; abre no mais recente).
2. **Abas: Empresa (PJ) | Pessoal (PF)** — abre na Empresa.

### Regra transversal: tendência em todo KPI

Todo card de KPI mostra, abaixo do valor, a variação contra o mês anterior: seta (▲/▼) + percentual, verde quando a direção é boa para aquele indicador e vermelha quando é ruim (receita subir é bom; despesa subir é ruim). Com um único mês fechado, mostrar "primeiro mês" no lugar da seta.

### Aba Empresa (PJ) — manchete: Lucro Líquido

1. **6 KPI cards**: Receita Líquida · **Lucro Líquido** (manchete, cor do semáforo de margem) · Margem Líquida (semáforo) · Pró-labore retirado · **Caixinha do Imposto** · **Fôlego de caixa**.
   - *Caixinha do Imposto*: provisão sugerida = percentual da configuração × receita bruta do mês, comparada com o imposto efetivamente pago ("Sugerido guardar R$ X · pago no mês R$ Y"). Verde se pago ≥ sugerido; amarelo se pago < sugerido (imposto do mês pode estar por vencer). Nota curta: "padrão 15% — confirme com sua contabilidade".
   - *Fôlego de caixa*: `saldo_final PJ do mês selecionado ÷ média mensal de saídas PJ (despesas + pró-labore) do mês selecionado e dos meses fechados anteriores a ele` (nunca usar meses posteriores ao selecionado), em meses, com uma casa decimal. Semáforo: verde ≥ 3 meses · amarelo 1 a 3 · vermelho < 1. Se não houver `saldo_final`, mostrar "—" com nota "saldo não visível nos extratos".
2. **"Para onde foi o dinheiro" (cascata)** — o visual de destaque, e o mais didático do painel: conta a história na ordem em que a pessoa pensa e espelha o DRE linha a linha.
   - **Frase em português ANTES do gráfico** (é ela que faz a pessoa entender, e funciona mesmo sem Chart.js): "De cada **R$ 100** que entraram no mês, **R$ X sobraram de lucro** e R$ Y foram para impostos, taxas e despesas."
   - **Gráfico de cascata**: barras `type: "bar"` com valores flutuantes `[início, fim]` — Chart.js puro, **sem plugin externo**. Sequência: Receita bruta (petróleo, do 0 ao topo) → um degrau descendo para cada dedução (Impostos, Taxas de plataforma, Despesas operacionais, Despesas com pessoal, em tons de coral) → Sobrou de lucro (verde, do 0 até o valor). Omitir degraus de valor zero.
   - **Detalhes que fazem funcionar (testados em 03/09/2026):** canvas dentro de `<div style="position:relative; height:330px;">` com `responsive: true, maintainAspectRatio: false`; eixo Y escondido (`display: false`) porque os valores vão escritos nas barras; `layout.padding.top` de ~26px para o rótulo do topo não cortar; um **plugin inline** (definido no array `plugins` do próprio gráfico, sem CDN) que faz duas coisas: desenha o valor acima de cada barra na cor da barra ("R$ 7.614", "−R$ 512") e liga os degraus com **linha pontilhada cinza** — sem essa linha as barras parecem soltas e o efeito de escada se perde.
   - **Nota abaixo do gráfico**: "Do lucro de R$ X, você retirou R$ Y de pró-labore e ficaram R$ Z na empresa" (ou o aviso equivalente quando a retirada passou do lucro).
   - Se `window.Chart` não carregar, esconder só o canvas — a frase e a nota continuam visíveis e já entregam o essencial.

   > Histórico: a v2 usou um diagrama Sankey (`chartjs-chart-sankey` via CDN). Funcionava tecnicamente, mas foi **reprovado no teste com a Aline em 03/09/2026**: cores esverdeadas indistintas, nenhum valor visível e as despesas viravam fiapos ao lado do fluxo do lucro — "eu nem entendo o que isso quer dizer". A cascata substituiu por ser autoexplicativa, ensinar o DRE junto e não depender de plugin externo. Não voltar ao Sankey.
3. **DRE renderizado** — as 7 linhas da referência `estrutura-dre.md`, linhas de resultado em negrito, nota do pró-labore abaixo.
4. **Gráfico de barras: evolução mensal** — Receita Líquida vs Lucro Líquido por mês.
5. **Gráfico de rosca: composição das despesas** do mês selecionado.
6. **De onde veio a receita** — lista dos lançamentos de receita do mês agrupados por pagador (descrição), ordenada do maior para o menor, com o % de cada um sobre a receita bruta. Se o maior passar de 40%, exibir alerta discreto: "⚠ concentração: X% da receita vem de um cliente só".
7. **Recorrentes detectados** — lançamentos de saída que se repetem entre meses fechados (mesma descrição normalizada + valor com diferença ≤ 5%), com o valor atual e "▲ subiu" quando o valor cresceu. Com um único mês fechado, mostrar: "Aparece a partir do 2º mês fechado".
8. **Tabela de lançamentos** do mês (entradas em verde, saídas em vermelho).

### Aba Pessoal (PF) — manchete: Saldo do Mês

1. **4 KPI cards**: Entradas · Saídas · **Saldo do mês** (manchete; verde/vermelho) · **"O pró-labore cobriu o mês?"** — compara o pró-labore recebido com as saídas PF: "Cobriu, sobraram R$ X" (verde) ou "Faltaram R$ X — saíram do bolso/reserva" (vermelho). É o card que liga as duas abas.
2. **Gráfico de rosca: saídas por categoria**.
3. **Gráfico de barras: evolução mensal** — Entradas vs Saídas por mês.
4. **Recorrentes detectados** (mesma lógica da aba Empresa, sobre os lançamentos PF) — é onde aparecem as assinaturas.
5. **Tabela de lançamentos** do mês.

## Visual

- Fundo claro (#FAFAF7), cards brancos com sombra suave, cantos arredondados (12px), fonte do sistema (`system-ui`). Layout responsivo simples.
- Paleta semáforo: verde `#27AE60` · amarelo `#F39C12` · vermelho `#E74C3C` · neutro `#7F8C8D`. Destaque geral: azul-petróleo `#2C5F6F`; secundária coral `#D97757`. Tons de saída da cascata: `#B5654A` · `#D97757` · `#E0A87E` · `#C98A63`. Os gráficos de rosca usam só cores desta paleta (petróleo, os tons de saída e o neutro), nunca as cores padrão do Chart.js.
- O valor grande de cada card nunca pode encostar na borda nem vazar: use `font-size: clamp(18px, 2vw, 26px)` e `white-space: nowrap` no valor, e deixe a grade de cards quebrar linha (`grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))`).
- Valores no formato brasileiro: `valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })`.
- Sem logotipos, sem emoji no HTML (emoji só no chat). O símbolo ⚠ do alerta de concentração é exceção permitida.

## Técnica

- **Única dependência externa: Chart.js via CDN** (`https://cdn.jsdelivr.net/npm/chart.js`). Nada de plugins de CDN — a cascata usa barras nativas + um plugin inline escrito no próprio arquivo. Sem internet, os gráficos não carregam mas cards, DRE, frases, listas e tabelas continuam funcionando: proteger TODA inicialização de gráfico com `if (window.Chart)`.
- **Gráficos sem animação:** `Chart.defaults.animation = false` antes de criar qualquer gráfico. Com animação ligada, os gráficos redesenhados ao trocar de mês ou de aba podem congelar no meio do movimento (barras espremidas, rosca do tamanho de um ponto) — falha observada no ensaio de 11/09/2026.
- **Troca de aba:** gráficos criados numa aba escondida nascem com tamanho zero. Ao mostrar uma aba, chamar `chart.resize()` em cada gráfico dela (ou criar os gráficos da aba só quando ela fica visível).
- Trocar de mês no dropdown redesenha tudo via JavaScript (sem recarregar). Gráficos de evolução mostram sempre todos os meses.
- Recorrentes: normalizar a descrição (minúsculas, sem acentos, remover datas/números soltos) antes de comparar entre meses; considerar recorrente o que aparece em ≥2 meses com valor dentro de ±5%.
- Todo o CSS e JS inline no próprio arquivo. Únicas dependências externas: os dois CDNs acima.
- No rodapé: "Gerado por /fechar-mes em [data] · [N] meses fechados".
