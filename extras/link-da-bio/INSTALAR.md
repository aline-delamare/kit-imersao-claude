# Instalar a skill do link da bio

A skill é uma pasta chamada `link-da-bio`, com o arquivo `SKILL.md` e uma pasta
`referencia` dentro. Para o Claude enxergar a skill, a pasta precisa estar no lugar certo do
seu computador.

## 1. Baixar e extrair

Baixe o arquivo `link-da-bio.zip` que você recebeu e extraia. Vai aparecer a pasta
`link-da-bio`. É essa pasta inteira que você vai copiar, e não o `.zip`.

## 2. Onde colocar a pasta

Copie a pasta `link-da-bio` para dentro da pasta de skills do Claude.

**Windows:**

```
C:\Users\O-SEU-NOME\.claude\skills\
```

**Mac:**

```
/Users/o-seu-nome/.claude/skills/
```

Se a pasta `skills` não existir, crie com esse nome. No Mac, a pasta `.claude` fica escondida:
dentro da pasta do usuário, aperte Command, Shift e ponto para ela aparecer. No Windows, ela
costuma aparecer normalmente; se não aparecer, no Explorador vá em Exibir, Mostrar, Itens
ocultos.

O caminho final fica assim, no Windows:

```
C:\Users\O-SEU-NOME\.claude\skills\link-da-bio\SKILL.md
```

e no Mac:

```
/Users/o-seu-nome/.claude/skills/link-da-bio/SKILL.md
```

## 3. Como começar

Abra o Claude Code dentro da pasta do seu projeto, a que tem o contexto e os documentos do seu
negócio, e escreva:

```
quero criar o meu link da bio
```

A skill instalada deve aparecer na hora na sua conversa no Code, mas se não aparecer, comece
uma conversa nova.

## O que ter em mãos antes de começar

- A sua foto, ou as suas fotos, salvas no computador em `.jpg`. Se vieram do iPhone em
  `.heic`, exporte como `.jpg` pelo próprio celular antes.
- Os endereços dos seus caminhos: página de vendas, agenda, grupo, o que for.
- O e-mail que deve receber os contatos do formulário.
- Uma conta gratuita no Netlify, criada em netlify.com. Dá para criar na hora da publicação,
  mas com a conta pronta o site já entra nela.

## Para mudar a página depois

É só abrir uma conversa nova com a skill, dentro da mesma pasta do projeto, e pedir a
alteração. Para publicar a versão nova, abra o seu site no painel do Netlify, entre em
**Deploys** e arraste a pasta `meu-link-da-bio` na área de arrastar que fica no fim da tela.
Não use o app.netlify.com/drop de novo, porque ali ele cria um segundo site com outro
endereço.
