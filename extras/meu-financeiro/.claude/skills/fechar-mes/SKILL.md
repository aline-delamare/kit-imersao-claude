---
name: fechar-mes
description: Fecha o mês financeiro a partir dos prints ou extratos em PDF do banco na pasta extratos/. Extrai os lançamentos, separa PF de PJ, categoriza tudo, monta o DRE da empresa e gera o dashboard.html com o histórico completo. Use sempre que a pessoa disser "/fechar-mes", "fecha o mês", "fechamento", "processa meus extratos", "atualiza meu dashboard financeiro" ou qualquer variação de fechar um período.
---

# /fechar-mes — fechamento financeiro mensal

Este é um ritual mensal. A pessoa joga os prints ou os extratos em PDF do banco na pasta do mês, digita `/fechar-mes`, aprova os lançamentos e recebe o dashboard atualizado. Nada além disso deve ser exigido dela.

## Estrutura de pastas (não alterar)

```
meu-financeiro/
├── extratos/AAAA-MM/     ← prints e PDFs do mês (PF e PJ podem vir misturados)
├── dados/AAAA-MM.json    ← um arquivo por mês fechado (a memória do sistema)
└── dashboard.html        ← regenerado a cada fechamento, com TODOS os meses embutidos
```

## Minha configuração

> Preencha esta seção na primeira execução (Fase 0) e apenas leia nas seguintes.

- **Nome do negócio (PJ):** [PREENCHER]
- **Contas PJ:** [ex.: Nubank PJ, Conta Kiwify — PREENCHER]
- **Contas PF:** [ex.: Itaú pessoal, cartão Nubank roxo — PREENCHER]
- **Percentual de provisão de impostos:** 15% da receita bruta (padrão para Simples serviços — a pessoa pode ajustar; sugerir que confirme com quem faz a contabilidade dela)
- **Regras próprias de categorização:** [ex.: "pagamentos para Fulana são despesa de design do PJ" — opcional]

---

## Como falar com a pessoa

Sempre em gênero neutro: nunca "você mesma/mesmo", "pronta/pronto", "sozinha/sozinho". Reescreva para contornar ("você pode colar essas linhas", "tudo certo para seguir").

## FASE 0 — Configuração (só na primeira vez)

Se a seção "Minha configuração" acima ainda estiver com [PREENCHER]:

1. Pergunte, em uma mensagem só: o nome do negócio, quais bancos/contas são da empresa (PJ) e quais são pessoais (PF). Se os arquivos do mês já mostrarem essas informações, proponha as respostas e peça só a confirmação.
2. Antes de gravar, avise: "Vai aparecer um pedido de permissão para eu editar o arquivo da skill. É só aprovar." Depois grave as respostas editando a seção "Minha configuração" deste próprio arquivo.
3. Se a gravação for negada, siga o fechamento com a configuração da conversa e, no resumo final, entregue as linhas prontas para a pessoa colar na seção "Minha configuração".
4. Confirme o que gravou e siga para a Fase 1.

## FASE 1 — Período e leitura dos arquivos

1. Pergunte qual mês fechar (sugira o mês anterior ao atual). O mês define a pasta `extratos/AAAA-MM/`.
2. Se `dados/AAAA-MM.json` já existir, avise que o mês já foi fechado e pergunte se é para refazer por cima. Nunca sobrescreva sem confirmar.
3. Reúna os arquivos do mês aceitando os DOIS caminhos, sem exigir um formato específico da pessoa:
   - **Pasta (recomendado):** liste os arquivos de `extratos/AAAA-MM/`. Se a pasta ainda não existir, crie-a.
   - **Direto na conversa:** se a pessoa arrastou prints ou PDFs para o chat, use-os também (ou só eles).
   - Se não houver nem uma coisa nem outra, explique os dois caminhos em uma mensagem curta e pare.
4. Aceite **prints (PNG, JPG, HEIC) e extratos em PDF**, misturados à vontade. Há celulares que bloqueiam o print no app do banco; nesse caso o caminho é baixar o extrato em PDF. Se vier outro formato (OFX, CSV, planilha), avise que esta versão lê só prints e PDFs e peça um desses dois.
5. Leia TODOS os arquivos reunidos, um a um. Em PDF, leia **todas as páginas** (com mais de 10 páginas, leia em blocos de até 20 pelo parâmetro de páginas) e confirme que nenhuma ficou de fora.

> Arquivo enviado pelo chat (print ou PDF) fecha o mês normalmente, mas **não fica arquivado** na pasta — se um dia a pessoa quiser refazer aquele mês, os originais precisam estar em `extratos/AAAA-MM/`. Dizer isso uma vez, sem insistir. Em `arquivos_processados`, registrar a origem de cada um (nome do arquivo, ou "enviado no chat").

### Cuidados com extrato em PDF

- **PDF com senha:** muitos bancos protegem o arquivo com parte do CPF. Se o PDF não abrir, não peça a senha nem tente adivinhar. Explique que basta abrir o PDF no celular ou no computador, usar "Imprimir" → "Salvar como PDF" para gerar uma cópia sem senha e colocar essa cópia na pasta (ou mandar prints).
- **Período maior que o mês:** extratos em PDF costumam cobrir 30, 60 ou 90 dias, ou um período escolhido pela pessoa. Lance só as transações do mês que está sendo fechado e ignore as outras, sem transformar isso em pendência. Diga no checkpoint quantas transações de fora do mês foram ignoradas.
- **Saldo final do mês:** use o saldo do último dia do mês (a coluna ou linha de saldo diário, quando existir). Se o PDF só mostrar o saldo de uma data depois do fim do mês, não use esse número: siga sem `saldo_final` e avise.
- **Mês incompleto:** se o PDF começa depois do dia 1 ou termina antes do último dia do mês, avise no checkpoint qual trecho ficou sem cobertura.
- **Mesma conta em print e em PDF:** vale a regra de duplicatas — um lançamento só.
- **PDF escaneado (foto de papel):** leia como imagem; número ilegível vira pendência, como no print.

## FASE 2 — Extração dos lançamentos

Para cada transação visível nos prints e PDFs, extraia: **data, descrição original, valor, tipo (entrada/saída) e conta de origem**. Registre também o **saldo final** de cada conta quando ele aparecer no print ou no PDF (alimenta o indicador de fôlego de caixa; se não aparecer, siga sem ele).

Regras inegociáveis:

- **A conta separa PF de PJ — não o texto da transação.** Print ou PDF de conta PJ → lançamento PJ, mesmo que a descrição pareça pessoal. Use a seção "Minha configuração".
- **Nunca invente ou estime um valor.** Se um número estiver cortado ou ilegível no print ou no PDF, o lançamento vira **pendência**: registre o que dá para ver e o que falta.
- **Ambiguidade vira pendência, não chute.** PIX sem identificação numa conta que não dá para reconhecer? Pendência.
- **Duplicatas:** a mesma transação pode aparecer em dois arquivos (extrato + fatura, ou print + PDF da mesma conta). Mesma data + mesmo valor + descrição similar = um lançamento só, com nota.
- **Taxas de plataforma** (Kiwify, Hotmart, Stripe, maquininha): quando o print ou o PDF mostrar valor bruto e taxa, registre como DOIS lançamentos — receita bruta e taxa como despesa separada. O **repasse líquido que cai na conta** é esse mesmo dinheiro: não lance de novo, apenas registre em nota. Lançar bruto, taxa e repasse conta a receita duas vezes.
- **Fatura de cartão de crédito:** quando houver o print ou o PDF da fatura, lance os itens dela e **não lance o pagamento da fatura** que aparece no extrato — é a mesma despesa. Confira que a soma dos itens bate com o total da fatura. Sem a fatura, lance o pagamento como um único valor e avise que o detalhamento ficou de fora.
- **Pró-labore e transferências PJ→PF:** registre o par — saída no PJ (categoria "Pró-labore") e entrada no PF (categoria "Pró-labore"). Nunca conte como receita nova.

## FASE 3 — Checkpoint de aprovação

Antes de qualquer cálculo, apresente para aprovação:

1. Uma tabela dos lançamentos PJ e outra dos lançamentos PF (data, descrição, categoria proposta, valor).
2. A lista de **pendências**, cada uma com a pergunta objetiva que resolve ("esse PIX de R$ 250,00 do dia 12 é da empresa ou pessoal?").
3. Os totais parciais de cada lado.

Só avance depois que a pessoa aprovar e responder as pendências. Ajustes pedidos aqui (recategorizar, excluir, corrigir valor) são aplicados antes de seguir.

## FASE 4 — Categorização

**PJ** (alimenta o DRE): Receita de Serviço · Receita de Produto · Taxa de Plataforma · Despesa Operacional · Despesa com Pessoal · Imposto · Pró-labore · Transferência Interna

**PF** (entradas e saídas por categoria, sem DRE): entradas em Pró-labore · Outras Entradas; saídas em Moradia · Alimentação · Transporte · Saúde · Educação · Assinaturas · Lazer · Outros

Aplique primeiro as "Regras próprias de categorização" da configuração; o resto segue o bom senso das descrições. Categoria é sugestão editável — a palavra final é da pessoa, no checkpoint.

## FASE 5 — Gravar o mês

Salve `dados/AAAA-MM.json` neste formato exato (o dashboard depende dele):

```json
{
  "mes": "2026-08",
  "fechado_em": "2026-09-12",
  "pj": {
    "lancamentos": [
      { "data": "2026-08-05", "descricao": "PIX RECEBIDO - CLIENTE X", "categoria": "Receita de Serviço", "tipo": "entrada", "valor": 1500.00, "nota": null }
    ],
    "dre": {
      "receita_bruta": 0, "impostos": 0, "receita_liquida": 0,
      "taxas_plataforma": 0, "despesas_operacionais": 0, "despesas_pessoal": 0,
      "lucro_liquido": 0, "margem_liquida_pct": 0, "semaforo": "verde|amarelo|vermelho"
    },
    "pro_labore": 0,
    "saldo_final": 0
  },
  "pf": {
    "lancamentos": [],
    "totais": { "entradas": 0, "saidas": 0, "saldo": 0 },
    "saidas_por_categoria": { "Moradia": 0 },
    "saldo_final": 0
  },
  "pendencias_resolvidas": [],
  "arquivos_processados": []
}
```

Convenções: entradas com valor positivo, saídas com valor negativo — **inclusive nos totais**: `pf.totais.saidas` e todos os valores de `saidas_por_categoria` são negativos, e `pf.totais.saldo` é entradas + saídas (os campos do `dre` ficam positivos, como no modelo); datas `AAAA-MM-DD`; valores com ponto decimal no JSON (a formatação R$ 1.234,56 é só na exibição). O campo `saldo_final` de cada lado é o saldo que aparece no extrato ao fim do mês (omitir se não estiver visível nos prints ou PDFs).

## FASE 6 — DRE do PJ

Monte o DRE seguindo `referencias/estrutura-dre.md` (estrutura, fórmulas e faixas do semáforo estão lá). Apresente o DRE completo no chat, com a margem líquida classificada no semáforo, antes de gerar o dashboard.

O lado PF não tem DRE: apresente entradas, saídas por categoria e saldo do mês.

## FASE 7 — Gerar o dashboard

Regenere `dashboard.html` do zero seguindo `referencias/template-dashboard.md`, embutindo no próprio HTML os dados de **todos** os arquivos de `dados/` (o navegador não lê arquivos externos quando o HTML é aberto do disco — por isso o arquivo é sempre regenerado por inteiro).

Ao final, abra o arquivo no navegador (`open dashboard.html`).

## FASE 8 — Mini-auditoria (antes de declarar fechado)

Recalcule de forma independente, sem confiar nos números já montados:

1. A soma dos lançamentos PJ bate com o lucro líquido do DRE?
2. A soma dos lançamentos PF bate com o saldo PF?
3. Toda entrada está positiva e toda saída negativa?
4. O pró-labore que saiu do PJ é o mesmo que entrou no PF?
5. Todos os arquivos da pasta constam em `arquivos_processados`?

Se algo não bater, corrija antes de mostrar qualquer resultado — nunca apresente um número que não conferiu. Encerre com um resumo: totais PJ e PF, margem com semáforo, pendências que ficaram para o próximo mês.

## O que esta skill NUNCA faz

- Inventar, estimar ou "completar" valores que não estão nos prints ou PDFs.
- Avançar de fase com pendências abertas sem avisar.
- Sobrescrever um mês já fechado sem confirmação explícita.
- Acessar banco, internet ou qualquer dado fora desta pasta.
- Pedir, adivinhar ou tentar quebrar a senha de um PDF.
