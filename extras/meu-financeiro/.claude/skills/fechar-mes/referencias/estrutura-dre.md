# Estrutura do DRE — padrão da skill

DRE = Demonstração do Resultado do Exercício. É a foto de "quanto a empresa realmente ganhou no mês", em camadas. A ordem das linhas é obrigatória.

## As linhas, na ordem

| # | Linha | Como calcular |
|---|-------|---------------|
| 1 | **Receita Bruta** | soma de Receita de Serviço + Receita de Produto |
| 2 | (−) Impostos | soma da categoria Imposto (DAS, ISS, etc.) |
| 3 | **(=) Receita Líquida** | linha 1 − linha 2 · base dos percentuais |
| 4 | (−) Taxas de Plataforma | soma da categoria Taxa de Plataforma |
| 5 | (−) Despesas Operacionais | soma da categoria Despesa Operacional |
| 6 | (−) Despesas com Pessoal | soma da categoria Despesa com Pessoal |
| 7 | **(=) Lucro Líquido** | linha 3 − linhas 4, 5 e 6 |

Fora do DRE:
- **Pró-labore** aparece como linha informativa abaixo do DRE ("Retirada de pró-labore: R$ X"), não como despesa. É como o dinheiro da empresa chega à pessoa — descontá-lo do lucro contaria o mesmo dinheiro duas vezes na visão PF+PJ.
- **Transferência Interna** não entra em nenhuma linha (não é receita nem despesa).

## Margem líquida e semáforo

```
margem_liquida_pct = lucro_liquido / receita_liquida × 100
```

| Faixa | Semáforo | Leitura |
|-------|----------|---------|
| ≥ 30% | 🟢 verde | saudável para negócio de serviço |
| 15% a 30% | 🟡 amarelo | atenção: despesas comendo o resultado |
| < 15% (ou prejuízo) | 🔴 vermelho | crítico: revisar preços e custos |

Receita líquida zero ou negativa → não calcular percentual; mostrar "—" e semáforo cinza.

## Como apresentar no chat

```
📊 DRE — [Nome do negócio] — Agosto/2026

Receita Bruta ............... R$ 8.500,00
(−) Impostos ................ R$   680,00
(=) Receita Líquida ......... R$ 7.820,00
(−) Taxas de Plataforma ..... R$   420,00
(−) Despesas Operacionais ... R$ 1.900,00
(−) Despesas com Pessoal .... R$   800,00
(=) Lucro Líquido ........... R$ 4.700,00

Margem líquida: 60,1% 🟢
Pró-labore retirado no mês: R$ 3.000,00
```

Valores sempre no formato brasileiro (R$ 1.234,56). Conferir: o lucro líquido tem que bater com a soma algébrica dos lançamentos PJ (excluindo pró-labore e transferências internas). Se não bater, há erro de extração ou categorização — resolver antes de mostrar.
