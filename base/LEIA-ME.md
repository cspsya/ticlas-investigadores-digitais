# Jogo-base V3 — Investigadores Digitais com o Ticl@s

Um único motor de jogo para todas as aulas de TIC curricular. **Para criar um jogo novo só se escreve o conteúdo (bloco AULA, em JSON).** O motor, o visual, os temas por data e o painel do professor ficam iguais em todos os jogos.

## Ficheiros

| Ficheiro | Para que serve |
|---|---|
| `modelo-jogo.html` | Jogo completo pronto a usar, com uma aula de exemplo. É este ficheiro que se copia. |
| `exemplos/` | Aulas de exemplo: 2.º ano (Português, com escrita e ditado) e 1.º ano sem leitura (Matemática: contagens, padrões, buracos e avião), cada uma com o jogo já gerado. |
| `construir.py` | Valida o conteúdo e gera o jogo (opcional: publica em `jogos/` e regista em `jogos.json`). |
| `src/` | Código do motor (estilo, motor, línguas, imagens dos emojis, molde, imagens do Ticl@s). Só se mexe aqui para melhorar o motor de todos os jogos. |

## Criar um jogo novo

**Opção recomendada — pasta `aulas/` no GitHub:** pôr o ficheiro `.json` da aula na pasta `aulas/` do repositório (à mão: *Add file → Upload files*). O GitHub verifica o conteúdo, gera o jogo em `jogos/AAAA-MM-DD/`, regista-o em `jogos.json` e publica. Se houver erros, não publica e envia um email com a lista. Ver [`aulas/LEIA-ME.md`](../aulas/LEIA-ME.md).

**Opção A — sem programas (à mão):** copiar `modelo-jogo.html` e substituir **apenas** o texto entre `<!-- AULA:INICIO -->` e `<!-- AULA:FIM -->` (o conteúdo do `<script type="application/json" id="aula">`). Se o JSON tiver um erro, o jogo abre um ecrã a dizer exatamente o que está mal.

**Opção B — com o script:**

```bash
python3 base/construir.py minha-aula.json               # gera minha-aula.html
python3 base/construir.py minha-aula.json --publicar    # gera em jogos/AAAA-MM-DD/ e regista em jogos.json
python3 base/construir.py --validar jogo.html           # verifica um jogo já feito
python3 base/construir.py --imagens jogo.html           # embute as imagens dos emojis num jogo já feito
```

As imagens dos emojis precisam de `pip install emoji` e de Internet na primeira vez (ficam guardadas em `base/.cache-emojis/`).

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

### Os 8 tipos de atividade

| Tipo | Itens | Exemplo |
|---|---|---|
| `escolher` | `pergunta`, `certa`, `erradas` (lista) | `{"pergunta":"Que palavra começa por BR?","emoji":"💪","certa":"braço","erradas":["prato","flor"]}` |
| `verdadeiro_falso` | `afirmacao`, `verdade` (true/false) | `{"afirmacao":"«tigre» tem o grupo TR.","verdade":false,"explicacao":"ti-gre: o grupo é GR."}` |
| `completar` | `frase` com `___`, `certa`, `erradas` (sem `erradas`, o aluno escreve) | `{"frase":"O ___ salta na relva.","certa":"grilo","erradas":["prato","cravo"]}` |
| `escrever` (resposta exata) | `pergunta`, `resposta` (texto ou lista de respostas aceites) | `{"pergunta":"Escreve o nome do desenho.","emoji":"🌸","resposta":"flor","dica":"Começa por FL."}` |
| `ditado` | `palavra`, `frase` (opcional, para dar contexto) | `{"palavra":"prato","frase":"Comi a sopa no prato.","emoji":"🍽️"}` — o Ticl@s dita; há botões «Ouvir» e «Mais devagar» |
| `escrever` (frase livre) | `pergunta`, `palavra` (opcional), `minPalavras` (opcional) | `{"pergunta":"Escreve uma frase com «flor».","palavra":"flor","minPalavras":4}` |
| `pares` | `["esquerda","direita"]` | `["BR","brinquedo"]` — com `"visual":"memoria"` na ronda passa a jogo da memória |
| `classificar` | `["texto","caixa"]` + `caixas` na ronda | `"caixas":["BR","PR"], "itens":[["broa","BR"],["prego","PR"]]` |
| `ordenar` | `pecas` já pela ordem certa | `{"emoji":"🚲","pecas":["bi","ci","cle","ta"]}` — sílabas, letras, palavras de uma frase ou passos |

Campos que qualquer item pode ter: `emoji` (desenho grande, útil no 1.º ano), `imagem` (endereço de uma imagem), `dica` (aparece após o 1.º erro ou no botão «Pedir pista» do modo apoio) e `explicacao` (aparece depois de responder).

**Maiúsculas:** nas respostas escritas e no ditado, se a resposta certa tiver maiúscula (ex.: `"Madeira"`), a maiúscula é obrigatória e o aluno vê «Quase! Este nome começa com letra maiúscula.». Se não tiver (ex.: `"flor"`), aceita-se «Flor». Para mudar isto num item: `"maiusculas": true` ou `false`. Os acentos contam sempre («Quase! Verifica os acentos.»).

Opções de aspeto em `escolher` (`"visual"`):

| Visual | Como se joga |
|---|---|
| `cartoes` (por omissão) | Cartões grandes. |
| `baloes` | Balões a flutuar; o certo rebenta. |
| `comboio` | O comboio chega com as respostas nas carruagens e parte quando se acerta. |
| `buracos` | O Ticl@s salta de buracos com uma resposta; toca-se quando aparece a certa. Sem pressa: ele volta sempre a aparecer. |
| `aviao` | Toca-se numa nuvem (ou usa-se ▲ ▼ e «Apanhar!», ou as setas do teclado) e o avião voa até ela. |

As respostas podem ser só emojis (ex.: `"certa": "🔵"`) ou grupos de emojis para contar (ex.: `"🌼🌼🌼"`), o que é ideal para o 1.º ano. Em `ordenar`, `"juntar": ""` junta as peças sem espaço (sílabas e letras); por omissão junta com espaço (frases).

## O que o motor faz sozinho

- **Imagens iguais em todos os computadores:** todos os emojis são trocados por imagens Noto Emoji (Google, licença Apache 2.0) embutidas no próprio ficheiro. Assim, a escada, o xadrez e os outros emojis recentes deixam de aparecer como um retângulo nos computadores da escola.
- **Leitura em voz alta:** com o som ligado, o 🔊 lê a pergunta e depois cada opção, destacando-a enquanto a lê. No 1.º e 2.º anos, em modo quadro, isto acontece sozinho. Nos pares, caixas e peças, o 🔊 do título lê as peças. O botão 🔇/🔊 do cabeçalho liga e desliga o som em qualquer computador.
- **Línguas da interface (🌐):** português, inglês, espanhol, francês, alemão, italiano, ucraniano, hindi e nepalês. Mudam os botões, as instruções e as mensagens; o conteúdo da aula fica em português. As traduções devem ser confirmadas por falantes nativos, sobretudo hindi e nepalês.
- **Mapa de missões:** depois de «Começar», cada ronda é uma missão. O aluno escolhe por onde começar, pode parar e retomar, e vê as estrelas de cada missão feita; a missão sugerida pulsa. As rondas de bónus abrem quando todas as missões estiverem feitas. Os botões «Anterior» e «Próximo» continuam a seguir a ordem da aula.
- **Celebrações:** confetes em cada resposta certa e no fim de cada missão (desligam-se se o computador pedir menos animação).
- **Pensar antes de clicar:** 3 estrelas à primeira, 1 à segunda e 0 depois disso. Após 2 erros (3 no modo apoio) mostra a resposta certa e a explicação. Cada opção errada fica bloqueada e há uma pausa curta depois de cada erro.
- **Modos:** quadro interativo (botões e letra maiores, som e narração em pt-PT) ou computador (sem som por omissão).
- **Perfis:** turma ou apoio (2 opções em vez de 3, 3 pares/peças por ecrã em vez de 6, 1.ª peça do `ordenar` já colocada, botão «Pedir pista»).
- **Temas por data**, só visuais: regresso às aulas, outono, Pão-por-Deus, São Martinho, Natal, inverno, Dia da Internet Segura, Carnaval, Páscoa, primavera, Festa da Flor, Dia da Criança, verão e neutro. Carnaval, Páscoa e Internet Segura são calculados para cada ano. As datas da Festa da Flor estão na tabela `FESTA_DA_FLOR`, em `src/motor.js` (2027: 29 abr.–30 mai.); basta acrescentar uma linha por ano. Nos anos que não estão na tabela usa-se 25 abr.–25 mai.
- **Painel do professor (⚙️)**, com a mesma palavra-passe dos outros jogos do Ticl@s: tema manual, modo, perfil, língua, som, navegação livre e saltar para qualquer ronda. Mostra a duração estimada, se o computador tem voz em português e os **resultados guardados nesse computador** (número do aluno, estrelas, rondas, frases escritas), com um botão para copiar para o Excel. Cada computador só guarda os resultados de quem jogou nele.
- **Acessibilidade (Aa):** tamanho da letra, alto contraste e letra mais legível.
- **Ecrã inteiro (⛶):** se o Google Sites não o permitir, abre o jogo num separador novo.
- **Progresso** guardado só no computador da sala, com o número do aluno (opcional), sem nomes. Botão «Continuar onde parei».
- **Fim:** estrelas, frases escritas pelo aluno, certificado imprimível e desafios bónus.

## 1.º ano sem leitura

Ver `exemplos/exemplo-1ano-contar-e-padroes.json`. Regras: `emoji` ou imagens em todos os itens; perguntas curtas, para serem ouvidas (o Ticl@s lê a pergunta e as opções no modo quadro); respostas com números, emojis ou grupos de emojis; tipos `escolher` (com `baloes`, `buracos`, `comboio`, `aviao`), `ordenar` (números), `classificar` (grupos para contar) e `pares` (número ↔ quantidade). Evitar `escrever` e `verdadeiro_falso` com frases enquanto os alunos não lerem.

## Duração

Estimativa usada pelo motor (multiplicada por 1,5 no 1.º ano, 1,2 no 2.º e 0,9 no 4.º): escolher 30 s, ditado 45 s, verdadeiro/falso 25 s, completar 35 s, escrever 60 s, frase livre 3 min, cada par ou peça 20 s, ordenar 45 s, mais 30 s por ronda. Para **60 minutos** contar, como referência, com 6 rondas de cerca de 10 minutos: no 1.º ano 6 a 8 itens por ronda; do 2.º ao 4.º ano 8 a 10 itens por ronda e 2 a 3 frases livres; mais 1 ou 2 rondas de bónus. O painel do professor mostra a estimativa de cada jogo. São estimativas: só a observação das aulas diz a duração real.

## Instrução para a tarefa agendada no ChatGPT

> Cria o conteúdo do jogo da aula de TIC curricular de [turma], [data], sobre [tema da planificação]. Usa o jogo-base V3: copia `base/modelo-jogo.html` do repositório cspsya/ticlas-investigadores-digitais e substitui **apenas** o JSON entre `<!-- AULA:INICIO -->` e `<!-- AULA:FIM -->`, seguindo o formato de `base/LEIA-ME.md`. Não alteres o CSS, o JavaScript nem as imagens. Regras: português de Portugal (AO90) e conteúdos das Aprendizagens Essenciais do [ano].º ano. Usa pelo menos 4 tipos de atividade diferentes (o ditado conta como um), por esta ordem: aquecimento → desafios → escrita → bónus. As opções erradas têm de ser plausíveis (erros típicos dos alunos), nunca absurdas. Inclui `explicacao` nos itens de verdadeiro/falso e `dica` nos itens de escrever. Para o 1.º ano usa `emoji` em todos os itens e frases muito curtas. Cada emoji tem de corresponder sem ambiguidade à palavra (não usar o mesmo emoji para duas palavras). Nomes próprios nas respostas com maiúscula. Sem temas do Dia do Pai nem do Dia da Mãe. Duração: [30/60] minutos. Antes de entregar, confirma que o JSON é válido e que nenhuma resposta certa aparece em `erradas`.

## Publicação automática no GitHub

O ficheiro `.github/workflows/verificar-e-publicar.yml` corre sempre que há alterações no repositório:

1. Verifica o `jogos.json` (campos obrigatórios, datas, ficheiros que existem) e o conteúdo de todos os jogos V3.
2. Se houver um erro, **não publica** e mostra a lista de problemas no separador «Actions» do GitHub (e o GitHub envia um email).
3. Se estiver tudo certo, embute as imagens dos emojis em todos os jogos e publica o site.

Para funcionar é preciso, uma única vez: **Settings → Pages → Build and deployment → Source: «GitHub Actions»**.
