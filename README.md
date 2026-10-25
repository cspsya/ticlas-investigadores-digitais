# Investigadores Digitais — com o Ticl@s

Portal HTML estático para GitHub Pages. Os alunos escolhem o ano nas placas do Ticl@s e veem as missões da semana; os professores têm um catálogo com filtros por disciplina, ano e pesquisa.

## Publicar no GitHub Free

1. Criar repositório **público** `ticlas-investigadores-digitais` na conta `cspsya`. **Não tornar público o repositório de trabalho existente.**
2. Carregar **todo o conteúdo desta pasta** para a raiz do novo repositório (não colocar uma pasta adicional à volta de `index.html`).
3. Ir a **Settings → Pages → Build and deployment → Deploy from a branch**.
4. Selecionar `main` e `/ (root)`, guardar.
5. Quando o Pages terminar a publicação, testar `https://cspsya.github.io/ticlas-investigadores-digitais/`.

Este URL é uma previsão até a publicação estar concluída.

## Jogo-base V3 (novos jogos)

Os jogos novos partem de `base/modelo-jogo.html`: copia-se o ficheiro e muda-se **apenas** o bloco AULA (JSON) com o conteúdo da aula. O formato, os 7 tipos de atividade e a instrução para a tarefa agendada no ChatGPT estão em [`base/LEIA-ME.md`](base/LEIA-ME.md). Opcionalmente, `python3 base/construir.py aula.json --publicar` valida o conteúdo, gera o jogo em `jogos/AAAA-MM-DD/` e regista-o em `jogos.json`.

## Adicionar jogos posteriormente

- Colocar o HTML completo em `jogos/AAAA-MM-DD/`.
- Acrescentar um registo ao array em `jogos.json`, com `url` relativo à raiz do site.
- Fazer commit das alterações no repositório público. O GitHub Pages atualiza a publicação.
- Arquivar o mesmo HTML no Drive, de acordo com a organização por semana e turma.

### Campos de cada missão em `jogos.json`

| Campo | Obrigatório | Exemplo | Uso na página |
|---|---|---|---|
| `turma` | sim | `"2A"` | Autocolante «2.º A» no cartão |
| `ano` | sim | `2` | Placa do ano e cor do autocolante |
| `titulo`, `descricao`, `disciplina` | sim | | Texto do cartão; `disciplina` gera os filtros dos professores |
| `data` | sim | `"2026-10-21"` | Agrupa por semana (a página mostra aos alunos só a semana mais recente) |
| `semana` | sim | `"19–23 out. 2026"` | Texto da semana |
| `url` | sim | `"jogos/2026-10-19/2A_….html"` | Botão «Começar» |
| `duracao` | não | `"até 60 min"` | Informação no cartão |
| `estado` | não | `"em validação"` | Mostra «Versão de teste» |
| `tipo` | não | `"Quiz"` | Por omissão: «Jogo interativo» |
| `ilustracao` | não | `{"tipo":"letras","letras":["nh","lh"]}` | Desenho do cartão. Tipos: `letras`, `numeros` (com `"conta":["7","+","3"]`), `mistura` (letras e conta), `natureza`, `digital`. Sem este campo, o desenho é escolhido a partir da disciplina e do título. |

Para abrir diretamente um ano no painel: `https://cspsya.github.io/ticlas-investigadores-digitais/#ano-2`.

## Segurança e publicação

Não publicar nomes de alunos, credenciais ou dados pessoais. Rever o jogo quanto a erros pedagógicos, acessibilidade e funcionamento antes de o publicar. Os jogos incluídos são protótipos de trabalho e ainda precisam de validação prática no Surface.

## Limitação da automatização

O portal está pronto para alojamento estático, mas a ligação de **escrita** do ChatGPT ao GitHub e a publicação automática de jogos a partir de uma tarefa agendada ainda precisam de ser validadas. A geração do ficheiro não constitui publicação automática.

## Consulta local

O `index.html` carrega `jogos.json` via `fetch`; por segurança, alguns navegadores bloqueiam esse pedido ao abrir `file://`. Testa com um servidor local (`python -m http.server 8000`) ou publica no GitHub Pages. Os jogos individuais HTML podem abrir diretamente em modo offline.
