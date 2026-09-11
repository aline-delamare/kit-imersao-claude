# Meu Financeiro — dashboard com Claude Code

Este é o seu sistema financeiro. Ele funciona com três coisas: uma pasta de extratos, uma skill e um dashboard.

## O ritual de todo mês (leva uns 15 minutos; o primeiro mês demora um pouco mais)

Durante o ritual o Claude Code vai pedir permissão algumas vezes: para gravar a sua configuração no arquivo da skill, para salvar os dados do mês e para abrir o dashboard. É só aprovar.

1. **Junte os extratos do mês.** Da conta da empresa, da conta pessoal, da fatura do cartão e das plataformas onde você vende. Vale de dois jeitos, e pode misturar:
   - **print da tela** do app do banco (print de celular serve);
   - **extrato em PDF** baixado no app ou no site do banco. É o caminho para quem tem um celular que bloqueia o print no app do banco. Se o PDF pedir senha para abrir, abra-o e use "Imprimir" → "Salvar como PDF" para gerar uma cópia sem senha.
2. **Abra o Claude Code nesta pasta** e digite `/fechar-mes`.
3. **Entregue os arquivos** de um destes dois jeitos:
   - salvando em `extratos/AAAA-MM/` (ex.: `extratos/2026-09/`) — o jeito recomendado, porque guarda os originais; ou
   - arrastando os prints ou PDFs direto para a conversa.
4. **Revise e aprove.** O Claude mostra tudo que leu, separado entre empresa e pessoal, e pergunta o que ficou em dúvida. Você corrige o que quiser.
5. **Pronto.** O `dashboard.html` abre no navegador com o mês novo e todo o histórico.

A partir do segundo mês o dashboard fica mais interessante: aparecem as setas de variação em cada indicador e a lista de gastos recorrentes (aquelas assinaturas que você esqueceu que assina).

## O que está em cada pasta

- `extratos/` — os prints e PDFs que você fornece, uma pasta por mês. Já vem com um mês de exemplo (`2026-08`) com dados fictícios para você testar.
- `dados/` — um arquivo por mês fechado. É a memória do sistema; não apague.
- `dashboard.html` — o resultado. É refeito por inteiro a cada fechamento.
- `.claude/skills/fechar-mes/` — a receita que o Claude segue. Abra o `SKILL.md` e leia: é português, e você pode adaptar as regras ao seu negócio (as contas dos seus bancos, o percentual de imposto que você separa, suas categorias).

## Para testar agora

Digite `/fechar-mes` e informe o mês `2026-08`. Os prints de exemplo são de uma empresa fictícia (Estúdio Aurora Design) e servem para você ver o ritual inteiro antes de usar os seus dados reais.
