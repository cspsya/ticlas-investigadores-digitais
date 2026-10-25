# Aulas (conteúdo dos jogos)

Cada ficheiro `.json` desta pasta é o conteúdo de um jogo (bloco AULA), no formato de [`base/LEIA-ME.md`](../base/LEIA-ME.md).

Quando um ficheiro é acrescentado ou alterado, o GitHub, sozinho:

1. verifica o conteúdo (se houver erros, não publica e envia um email com a lista);
2. gera o jogo em `jogos/AAAA-MM-DD/` (segunda-feira da semana da aula), com o mesmo nome do ficheiro;
3. regista-o em `jogos.json` (pelo `id`; uma versão nova com o mesmo `id` substitui a anterior no portal, mas o ficheiro antigo fica guardado);
4. publica o site.

Nome dos ficheiros: `AAAA-MM-DD_TURMA_Disciplina_v1.json` (ex.: `2026-11-03_1A_Matematica_v1.json`). Campos obrigatórios para publicar: `titulo`, `ano`, `turma`, `disciplina`, `data` e `rondas`.

Para carregar à mão: no GitHub, abrir esta pasta → **Add file → Upload files** → arrastar o `.json` → **Commit changes**.
