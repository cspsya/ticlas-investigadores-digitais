# Investigadores Digitais — com a Ticl@s

Portal HTML estático para GitHub Pages. Inclui jogos educativos para 1.º e 2.º anos, filtros por ano e pesquisa.

## Publicar no GitHub Free

1. Criar repositório **público** `ticlas-investigadores-digitais` na conta `cspsya`. **Não tornar público o repositório de trabalho existente.**
2. Carregar **todo o conteúdo desta pasta** para a raiz do novo repositório (não colocar uma pasta adicional à volta de `index.html`).
3. Ir a **Settings → Pages → Build and deployment → Deploy from a branch**.
4. Selecionar `main` e `/ (root)`, guardar.
5. Quando o Pages terminar a publicação, testar `https://cspsya.github.io/ticlas-investigadores-digitais/`.

Este URL é uma previsão até a publicação estar concluída.

## Adicionar jogos posteriormente

- Colocar o HTML completo em `jogos/AAAA-MM-DD/`.
- Acrescentar um registo ao array em `jogos.json`, com `url` relativo à raiz do site.
- Fazer commit das alterações no repositório público. O GitHub Pages atualiza a publicação.
- Arquivar o mesmo HTML no Drive, de acordo com a organização por semana e turma.

## Segurança e publicação

Não publicar nomes de alunos, credenciais ou dados pessoais. Rever o jogo quanto a erros pedagógicos, acessibilidade e funcionamento antes de o publicar. Os jogos incluídos são protótipos de trabalho e ainda precisam de validação prática no Surface.

## Limitação da automatização

O portal está pronto para alojamento estático, mas a ligação de **escrita** do ChatGPT ao GitHub e a publicação automática de jogos a partir de uma tarefa agendada ainda precisam de ser validadas. A geração do ficheiro não constitui publicação automática.

## Consulta local

O `index.html` carrega `jogos.json` via `fetch`; por segurança, alguns navegadores bloqueiam esse pedido ao abrir `file://`. Testa com um servidor local (`python -m http.server 8000`) ou publica no GitHub Pages. Os jogos individuais HTML podem abrir diretamente em modo offline.
