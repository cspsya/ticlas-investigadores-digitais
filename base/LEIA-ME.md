# Jogo-base V3 — Investigadores Digitais com o Ticl@s

Um único motor de jogo para todas as aulas de TIC curricular. **Para criar um jogo novo só se escreve o conteúdo (bloco AULA, em JSON).** O motor, o visual, os temas por data e o painel do professor ficam iguais em todos os jogos.

## Ficheiros

| Ficheiro | Para que serve |
|---|---|
| `modelo-jogo.html` | Jogo completo pronto a usar, com uma aula de exemplo. É este ficheiro que se copia. |
| `exemplos/` | Aulas de exemplo em JSON. |
| `construir.py` | Valida o conteúdo e gera o jogo (opcional: publica em `jogos/` e regista em `jogos.json`). |
| `src/` | Código do motor (estilo, motor, molde, imagens do Ticl@s). Só se mexe aqui para melhorar o motor de todos os jogos. |

## Criar um jogo novo

**Opção A — sem programas (ChatGPT ou à mão):** copiar `modelo-jogo.html` e substituir **apenas** o texto entre `<!-- AULA:INICIO -->` e `<!-- AULA:FIM -->` (o conteúdo do `<script type="application/json" id="aula">`). Se o JSON tiver um erro, o jogo abre um ecrã a dizer exatamente o que está mal.

**Opção B — com o script:**

```bash
python3 base/construir.py minha-aula.json               # gera minha-aula.html
python3 base/construir.py minha-aula.json --publicar    # gera em jogos/AAAA-MM-DD/ e regista em jogos.json
python3 base/construir.py --validar jogo.html           # verifica um jogo já feito
```

## Formato do bloco AULA

```json
{
  "id": "2026-10-28-2A-grupos-consonanticos",
  "titulo": "Grupos consonânticos",
  "ano": 2,
  "turma": "2.º A",
  "disciplina": "Português",
  "data": "2026-10-28",
  "descricao": "Texto curto para o cartão do portal",
  "objetivo": "Frase que aparece no ecrã inicial.",
  "minutos": 30,
  "tema": "saomartinho",
  "rondas": [ ... ]
}
```

Obrigatórios: `titulo`, `ano` (1 a 4, sem aspas) e `rondas`. Para publicar com o script são também precisos `data`, `turma` e `disciplina`. `tema` é opcional: sem ele, o tema muda sozinho com a data.

### Cada ronda

```json
{ "fase": "desafios", "tipo": "escolher", "titulo": "Balões dos sons", "instrucao": "Rebenta o balão certo.", "baralhar": false, "itens": [ ... ] }
```

- `fase`: `aquecimento`, `desafios` (por omissão), `escrita` ou `bonus`. As rondas `bonus` só aparecem no fim, para quem termina cedo.
- `instrucao` é opcional (há uma instrução por omissão para cada tipo).
- `baralhar: true` baralha a ordem dos itens. As **opções de resposta são sempre baralhadas**.

### Os 7 tipos de atividade

| Tipo | Itens | Exemplo |
|---|---|---|
| `escolher` | `pergunta`, `certa`, `erradas` (lista) | `{"pergunta":"Que palavra começa por BR?","emoji":"💪","certa":"braço","erradas":["prato","flor"]}` |
| `verdadeiro_falso` | `afirmacao`, `verdade` (true/false) | `{"afirmacao":"«tigre» tem o grupo TR.","verdade":false,"explicacao":"ti-gre: o grupo é GR."}` |
| `completar` | `frase` com `___`, `certa`, `erradas` (sem `erradas`, o aluno escreve) | `{"frase":"O ___ salta na relva.","certa":"grilo","erradas":["prato","cravo"]}` |
| `escrever` (resposta exata) | `pergunta`, `resposta` (texto ou lista de respostas aceites) | `{"pergunta":"Escreve o nome do desenho.","emoji":"🌸","resposta":"flor","dica":"Começa por FL."}` |
| `escrever` (frase livre) | `pergunta`, `palavra` (opcional), `minPalavras` (opcional) | `{"pergunta":"Escreve uma frase com «flor».","palavra":"flor","minPalavras":4}` |
| `pares` | `["esquerda","direita"]` | `["BR","brinquedo"]` — com `"visual":"memoria"` na ronda passa a jogo da memória |
| `classificar` | `["texto","caixa"]` + `caixas` na ronda | `"caixas":["BR","PR"], "itens":[["broa","BR"],["prego","PR"]]` |
| `ordenar` | `pecas` já pela ordem certa | `{"emoji":"🚲","pecas":["bi","ci","cle","ta"]}` — sílabas, letras, palavras de uma frase ou passos |

Campos que qualquer item pode ter: `emoji` (desenho grande, útil no 1.º ano), `imagem` (endereço de uma imagem), `dica` (aparece após o 1.º erro ou no botão «Pedir pista» do modo apoio) e `explicacao` (aparece depois de responder).

Opções de aspeto: em `escolher`, `"visual": "baloes"`, `"comboio"` ou `"cartoes"` (por omissão). Em `ordenar`, `"juntar": ""` junta as peças sem espaço (sílabas e letras); por omissão junta com espaço (frases).

## O que o motor faz sozinho

- **Pensar antes de clicar:** 3 estrelas à primeira, 1 à segunda e 0 depois disso. Após 2 erros (3 no modo apoio) mostra a resposta certa e a explicação. Cada opção errada fica bloqueada e há uma pausa curta depois de cada erro.
- **Modos:** quadro interativo (botões e letra maiores, som e narração em pt-PT) ou computador (sem som por omissão).
- **Perfis:** turma ou apoio (2 opções em vez de 3, 3 pares/peças por ecrã em vez de 6, 1.ª peça do `ordenar` já colocada, botão «Pedir pista»).
- **Temas por data**, só visuais: regresso às aulas, outono, Pão-por-Deus, São Martinho, Natal, inverno, Dia da Internet Segura, Carnaval, Páscoa, primavera, Festa da Flor, Dia da Criança, verão e neutro. Carnaval, Páscoa e Internet Segura são calculados para cada ano. As datas da Festa da Flor estão na tabela `FESTA_DA_FLOR`, em `src/motor.js` (2027: 29 abr.–30 mai.); basta acrescentar uma linha por ano. Nos anos que não estão na tabela usa-se 25 abr.–25 mai.
- **Painel do professor (⚙️)**, com a mesma palavra-passe dos outros jogos do Ticl@s: tema manual, modo, perfil, som, navegação livre, saltar para qualquer ronda e apagar o progresso. Mostra também a duração estimada.
- **Acessibilidade (Aa):** tamanho da letra, alto contraste e letra mais legível.
- **Ecrã inteiro (⛶):** se o Google Sites não o permitir, abre o jogo num separador novo.
- **Progresso** guardado só no computador da sala, com o número do aluno (opcional), sem nomes. Botão «Continuar onde parei».
- **Fim:** estrelas, frases escritas pelo aluno, certificado imprimível e desafios bónus.

## Duração

Estimativa usada pelo motor: escolher 30 s, verdadeiro/falso 25 s, completar 35 s, escrever 60 s, frase livre 3 min, cada par ou peça 20 s, ordenar 45 s, mais 30 s por ronda. Para **30 minutos** contar com 25 a 30 itens; para **60 minutos**, 50 a 60 itens e 2 a 3 frases livres, mais 1 ou 2 rondas de bónus.

## Instrução para a tarefa agendada no ChatGPT

> Cria o conteúdo do jogo da aula de TIC curricular de [turma], [data], sobre [tema da planificação]. Usa o jogo-base V3: copia `base/modelo-jogo.html` do repositório cspsya/ticlas-investigadores-digitais e substitui **apenas** o JSON entre `<!-- AULA:INICIO -->` e `<!-- AULA:FIM -->`, seguindo o formato de `base/LEIA-ME.md`. Não alteres o CSS, o JavaScript nem as imagens. Regras: português de Portugal (AO90) e conteúdos das Aprendizagens Essenciais do [ano].º ano. Usa pelo menos 4 tipos de atividade diferentes, por esta ordem: aquecimento → desafios → escrita → bónus. As opções erradas têm de ser plausíveis (erros típicos dos alunos), nunca absurdas. Inclui `explicacao` nos itens de verdadeiro/falso e `dica` nos itens de escrever. Para o 1.º ano usa `emoji` em todos os itens e frases muito curtas. Sem temas do Dia do Pai nem do Dia da Mãe. Duração: [30/60] minutos. Antes de entregar, confirma que o JSON é válido e que nenhuma resposta certa aparece em `erradas`.
