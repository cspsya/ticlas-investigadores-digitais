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
  "descricao": "Texto para os professores (tabela do portal)",
  "resumo": "Frase curta para os alunos (cartão do portal)",
  "focoTic": "Rato: arrastar",
  "objetivo": "Frase que aparece no ecrã inicial.",
  "minutos": 30,
  "tema": "saomartinho",
  "rondas": [ ... ]
}
```

Obrigatórios: `titulo`, `ano` (1 a 4, sem aspas) e `rondas`. Para publicar com o script são também precisos `data`, `turma` e `disciplina`. `tema` é opcional: sem ele, o tema muda sozinho com a data. `resumo` e `focoTic` são opcionais e só aparecem no portal: `resumo` é o texto do cartão para os alunos (sem ele, usa-se `descricao`); `focoTic` é a competência TIC trabalhada (texto ou lista), mostrada como etiqueta e filtro na zona dos professores.

### Cada ronda

```json
{ "fase": "desafios", "tipo": "escolher", "titulo": "Balões dos sons", "instrucao": "Rebenta o balão certo.", "baralhar": false, "itens": [ ... ] }
```

- `fase`: `aquecimento`, `desafios` (por omissão), `escrita` ou `bonus`. As rondas `bonus` só aparecem no fim, para quem termina cedo.
- `instrucao` é opcional (há uma instrução por omissão para cada tipo).
- `baralhar: true` baralha a ordem dos itens. As **opções de resposta são sempre baralhadas**.

### Os tipos de atividade

Os tipos gerais estão na tabela abaixo; os tipos de Matemática (`mab`, `cadeia`, `reta`, `tabela100` e `algoritmo`) estão nas secções seguintes.

| Tipo | Itens | Exemplo |
|---|---|---|
| `escolher` | `pergunta`, `certa`, `erradas` (lista) | `{"pergunta":"Que palavra começa por BR?","emoji":"💪","certa":"braço","erradas":["prato","flor"]}` |
| `verdadeiro_falso` | `afirmacao`, `verdade` (true/false) | `{"afirmacao":"«tigre» tem o grupo TR.","verdade":false,"explicacao":"ti-gre: o grupo é GR."}` |
| `completar` | `frase` com `___`, `certa`, `erradas` (sem `erradas`, o aluno escreve) | `{"frase":"O ___ salta na relva.","certa":"grilo","erradas":["prato","cravo"]}` |
| `escrever` (resposta exata) | `pergunta`, `resposta` (texto ou lista de respostas aceites) | `{"pergunta":"Escreve o nome do desenho.","emoji":"🌸","resposta":"flor","dica":"Começa por FL."}` |
| `ditado` | `palavra`, `frase` (opcional, para dar contexto) | `{"palavra":"prato","frase":"Comi a sopa no prato.","emoji":"🍽️"}` — o Ticl@s dita; há botões «Ouvir» e «Mais devagar» |
| `copiar` | `palavra` (palavra ou frase curta) | `{"palavra":"pão","emoji":"🍞"}` — a palavra aparece em **letra manuscrita** e, por baixo de cada letra, a tecla do teclado que a escreve (com ~, ´ e ⇧ quando é preciso). O aluno escreve letra a letra e a tecla seguinte brilha no teclado do ecrã (também se pode tocar nele, útil no quadro). `"teclado": false` na ronda esconde o teclado do ecrã. Um engano ainda vale 3 estrelas. |
| `puzzle` | `emoji` ou `imagem`; opcional `palavra`, `pecas` (4, 6 ou 9), `certa` + `erradas` (pergunta no fim, ex.: a primeira letra) | Troca-se as peças com dois toques (ou a arrastar). No perfil de apoio tem sempre 4 peças. |
| `pontos` | `forma` (`p`, `t`, `P`, `T`) ou `pontos` (traços com pontos [x, y] de 0 a 100); opcional `exemplos` | Ligar os pontos pela ordem dos números para descobrir a letra; no fim mostra a letra (imprensa e manuscrita) e os exemplos. |
| `apanhar` | `certas`, `erradas`; opcional `meta` (3 a 20, por defeito 8) e `velocidade` | Letras, sílabas ou palavras caem; o aluno leva o cesto com o rato (ou setas ← →) e apanha só as certas. |
| `percurso` | `certas` (até 7), `erradas` (até 8); opcional `alvo`, `colunas`, `linhas` | Labirinto: o Ticl@s anda com as setas (ou botões), apanha as certas, foge das erradas e chega à castanha 🌰. O mapa é sorteado e tem sempre caminho. |
| `escrever` (frase livre) | `pergunta`, `palavra` (opcional), `minPalavras` (opcional) | `{"pergunta":"Escreve uma frase com «flor».","palavra":"flor","minPalavras":4}` |
| `pares` | `["esquerda","direita"]` | `["BR","brinquedo"]` — com `"visual":"memoria"` na ronda passa a jogo da memória |
| `classificar` | `["texto","caixa"]` + `caixas` na ronda | `"caixas":["BR","PR"], "itens":[["broa","BR"],["prego","PR"]]` |
| `ordenar` | `pecas` já pela ordem certa | `{"emoji":"🚲","pecas":["bi","ci","cle","ta"]}` — sílabas, letras, palavras de uma frase ou passos |

Campos que qualquer item pode ter: `emoji` (desenho grande, útil no 1.º ano), `imagem` (endereço de uma imagem; com `"imagemGrande": true` aparece em grande, numa linha própria, para cenas ilustradas), `dica` (aparece após o 1.º erro ou no botão «Pedir pista» do modo apoio) e `explicacao` (aparece depois de responder).

**Maiúsculas:** nas respostas escritas e no ditado, se a resposta certa tiver maiúscula (ex.: `"Madeira"`), a maiúscula é obrigatória e o aluno vê «Quase! Este nome começa com letra maiúscula.». Se não tiver (ex.: `"flor"`), aceita-se «Flor». Para mudar isto num item: `"maiusculas": true` ou `false`. Os acentos contam sempre («Quase! Verifica os acentos.»).

Opções de aspeto em `escolher` (`"visual"`):

| Visual | Como se joga |
|---|---|
| `cartoes` (por omissão) | Cartões grandes. |
| `baloes` | Balões a flutuar; o certo rebenta. |
| `comboio` | O comboio chega com as respostas nas carruagens e parte quando se acerta. |
| `buracos` | O Ticl@s salta de buracos com uma resposta; toca-se quando aparece a certa. Sem pressa: ele volta sempre a aparecer. |
| `aviao` | Toca-se numa nuvem (ou usa-se ▲ ▼ e «Apanhar!», ou as setas do teclado) e o avião voa até ela. |

### Caderno do Ticl@s — páginas de consulta (V3.6, opcional)

Para os alunos poderem consultar a matéria quando têm dúvidas, acrescenta à aula uma lista `consulta`:

```json
"consulta": [
  { "id": "reis", "emoji": "👑", "titulo": "Os nove reis",
    "paragrafos": ["Texto com **negrito**."],
    "lista": ["Ponto 1", "Ponto 2"],
    "tabela": [["Rei", "Cognome"], ["D. Dinis", "o Lavrador"]],
    "imagem": "data:image/svg+xml;base64,...", "alt": "descrição",
    "lembra": "Caixa verde com uma dica final." }
]
```

Cada página precisa de `titulo` e de `paragrafos`, `lista` ou `tabela`. Numa ronda, `"consulta": "reis"` mostra o botão **📖 Rever a matéria**, que abre essa página. Com páginas de consulta aparece também o botão 📖 no cabeçalho e a faixa «Caderno do Ticl@s» no mapa de missões (índice, Anterior/Próximo, setas do teclado e Esc para fechar; 🔊 lê a página com o som ligado). Exemplo: `aulas/2026-11-24_4ano_EstudoDoMeio_1Dinastia_v1.json`.

### Animações obrigatórias — abertura e antes de cada missão (V3.7, opcional)

Pequenos «filmes» sem som, com legendas grandes e o Ticl@s, para rever a matéria antes de jogar:

```json
"abertura": [
  { "emoji": "🐿️ ⏳ 🏰", "titulo": "Viagem à Idade Média", "texto": "Olá! Hoje vamos viajar no tempo…", "pose": "ola" },
  { "friso": [["1128", "São Mamede"], ["1143", "Zamora"]], "texto": "Num **friso cronológico**…" }
],
"rondas": [ { "titulo": "…", "animacao": [ { "itens": ["👑 D. Dinis", "👑 D. Pedro I"], "texto": "…" } ], … } ]
```

Cada cena precisa de `texto` (a legenda; `**…**` fica destacado). Opcional: `titulo`, `emoji` (vários, separados por espaços, aparecem um a um), `imagem` + `alt` + `efeito` (`zoom` ou `revelar`, de cima para baixo), `itens` (aparecem um a um), `friso` (pares [data, texto] numa linha do tempo), `pose` do Ticl@s (`ola`, `aponta`, `duvida`, `ideia`, `portatil`, `trofeu`) e `duracao` em segundos (por omissão é calculada pelo número de palavras e pelo ano; mais 30 % no perfil de apoio).

- **Obrigatórias:** a `abertura` passa antes do mapa de missões e a `animacao` de cada ronda antes da missão. O botão para continuar só fica ativo no fim; pode-se pausar e voltar à cena anterior, mas não avançar. Fica registado no progresso: ao voltar à mesma missão, já não é obrigatória (há o botão «🎬 Ver a animação» e, no mapa de missões, «🎬 Abertura»).
- **Painel do professor (⚙️):** «Animações: permitir saltar (⏭️)».
- **Animações à escolha do aluno (V3.10):** com `"animacoes": "opcionais"` na aula, antes da abertura e de cada missão aparece a pergunta «Queres ver a animação com a matéria antes de começar?», com os botões «🎬 Ver a animação» e «▶ Começar a missão». Se o aluno escolher ver, pode avançar quando quiser. Sem este campo, as animações continuam obrigatórias.
- Sem som por omissão; no modo quadro (som ligado) o Ticl@s lê as legendas. A duração estimada da aula inclui as animações.

### Escape room (V3.8, opcional)

Transforma o mapa de missões num castelo de salas fechadas:

```json
"escape": { "titulo": "🏰 Fuga do Castelo", "historia": "O Ticl@s ficou fechado…", "palavra": "DINASTIA",
            "cadeado": "Ordena as letras…", "pista": "Aparece depois de 2 tentativas erradas.", "vitoria": "O portão abriu-se!" },
"rondas": [ { "titulo": "Portão do castelo", "icone": "🏰", "chave": "S", … }, … ]
```

- Cada sala (ronda principal) pode ter uma `chave` (letra ou número) e um `icone`. Ao terminar a sala, o aluno vê «🔓 Sala aberta!» e ganha a chave, que fica na barra de chaves do mapa.
- As salas abrem por ordem (`"sequencial": false` deixa-as todas abertas; a navegação livre do painel do professor também).
- No fim, o **cadeado final** pede a `palavra` secreta (sem distinguir maiúsculas nem acentos). As chaves podem vir baralhadas, para os alunos terem de pensar; o construtor confirma que as chaves têm exatamente as letras da palavra. Depois de 2 tentativas erradas aparece a `pista`.
- Funciona com o Caderno do Ticl@s, as animações e os bónus (que abrem quando todas as salas estiverem feitas). Exemplo: `aulas/2026-11-25_4ano_EstudoDoMeio_1Dinastia_EscapeRoom_v1.json`.

### Tipos de Matemática (V3.4)

| Tipo | Itens | Exemplo |
|---|---|---|
| `mab` construir | `modo: "construir"`, `numero` (1 a 299), `pergunta` (opcional) | `{"modo":"construir","numero":45,"dica":"4 barras e 5 cubos."}` — o aluno toca na placa, na barra e no cubo para os pôr no quadro C/D/U e toca numa peça para a tirar. Com 10 cubos (ou 10 barras) aparece o botão amarelo de troca (10 U → 1 D, 10 D → 1 C). Só conta como certo com a representação final (menos de 10 peças em cada coluna); se o total estiver certo mas faltar a troca, o Ticl@s avisa sem tirar estrelas. |
| `mab` ler | `modo: "ler"`, `c`, `d`, `u` (0 a 20) | `{"modo":"ler","d":1,"u":12}` — o MAB aparece montado e o aluno escreve o número (aqui 22). Pode ter mais de 10 peças numa coluna, para treinar as trocas. |
| `cadeia` | `inicio`, `passos` (lista), `pergunta` (opcional) | `{"pergunta":"De 5 em 5, começando no 0.","inicio":0,"passos":[5,5,5,5]}` ou setas mistas `[5, 10, -10, 20]`. O aluno escreve todos os números e confirma; as caixas certas ficam verdes. No modo apoio a 1.ª caixa já vem preenchida. |
| `reta` ler | `modo: "ler"`, `inicio`, `fim`, `passo`, `marca`, `erradas` (opcional) | `{"modo":"ler","inicio":0,"fim":100,"passo":10,"marca":30,"erradas":[3,40]}` — sem `erradas`, o aluno escreve o número. |
| `reta` colocar | `modo: "colocar"`, `inicio`, `fim`, `passo`, `numero`, `rotulos` (opcional) | `{"modo":"colocar","inicio":20,"fim":100,"passo":10,"rotulos":[20,40,60,80,100],"numero":68}` — o aluno toca no espaço entre duas marcas onde fica o número (posição aproximada). O número não pode coincidir com uma marca. |
| `tabela100` | `inicio` (1, 11, 21…), `linhas`, `lacunas` | `{"inicio":21,"linhas":3,"lacunas":[23,26,34,47]}` — no modo apoio só aparece metade das lacunas. |

### Algoritmo da adição com MAB (V3.9)

| Tipo | Itens | Exemplo |
|---|---|---|
| `algoritmo` | `compras` (2 ou 3 × `["emoji", "nome", preço]`) ou `parcelas` (2 ou 3 números); soma até 999; opcional `pergunta`, `unidade` (por omissão «€» com compras), `dica`, `explicacao` | `{"compras":[["🎒","mochila",29],["✏️","estojo",16]],"pergunta":"Quanto custam a mochila e o estojo juntos?"}` |

O aluno vê a lista de compras (talão), a conta em pé e um tabuleiro de MAB com uma linha por compra e a linha «Tudo junto». Trabalha coluna a coluna, das unidades para as centenas: **junta** as peças, **conta-as**, decide se faz a **troca** (10 cubos → 1 barra, 10 barras → 1 placa) e **escreve o algarismo** na conta. A peça trocada aparece com contorno amarelo na coluna seguinte e o algarismo que «vai» aparece por cima dessa coluna. Erros com mensagens próprias (contagem com as parcelas, troca antes do tempo, escrever o algarismo que vai). Estrelas: 3 sem erros, 2 com um erro, 1 com dois ou três, 0 com mais. No perfil de apoio, cada célula mostra quantas peças tem e há o botão «Pedir pista» em cada passo. Exemplo: `aulas/2026-11-25_3ano_DAC_EducacaoFinanceira_AdicaoMAB_v2.json`.

Nas aulas com rondas `mab` aparece no cabeçalho o botão **🧱 MAB**, um MAB livre que o aluno pode abrir em qualquer missão (por exemplo, nos «amigos do 100»). Para o mostrar numa aula sem rondas de MAB: `"ferramentaMAB": true`; para o esconder: `false`. Exemplo completo: `aulas/2026-11-09_2ano_Matematica_CalculoMental_MAB_v1.json`.

**Letra manuscrita:** qualquer texto entre `[[` e `]]` aparece em letra manuscrita (Playwrite PT, o modelo escolar português), por exemplo `["🦆", "[[pato]]"]` nos pares ou `"certa": "p [[p]]"`. Com `"letra": "manuscrita"` na ronda, as opções, peças, cartas e caixas dessa ronda ficam todas em manuscrita (e, no `completar`, também a palavra a completar, como `"frase": "___to"`). As perguntas só ficam em manuscrita com `[[ ]]`. No `completar` pode usar-se `"visual"` (`baloes`, `comboio`…) como no `escolher`.

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

> Cria o conteúdo do jogo da aula de TIC curricular de [turma], [data], sobre [tema da planificação]. Usa o jogo-base V3: copia `base/modelo-jogo.html` do repositório cspsya/ticlas-investigadores-digitais e substitui **apenas** o JSON entre `<!-- AULA:INICIO -->` e `<!-- AULA:FIM -->`, seguindo o formato de `base/LEIA-ME.md`. Não alteres o CSS, o JavaScript nem as imagens. Regras: português de Portugal (AO90) e conteúdos das Aprendizagens Essenciais do [ano].º ano. Usa pelo menos 4 tipos de atividade diferentes (o ditado conta como um), por esta ordem: aquecimento → desafios → escrita → bónus. As opções erradas têm de ser plausíveis (erros típicos dos alunos), nunca absurdas. Inclui `explicacao` nos itens de verdadeiro/falso e `dica` nos itens de escrever. Para o 1.º ano usa `emoji` em todos os itens e frases muito curtas. Cada emoji tem de corresponder sem ambiguidade à palavra (não usar o mesmo emoji para duas palavras). Nomes próprios nas respostas com maiúscula. Sem temas do Dia do Pai nem do Dia da Mãe. Preenche `resumo` (uma frase curta dirigida ao aluno, sem informação para o professor) e `focoTic` (a competência TIC principal, por exemplo «Rato: arrastar», «Teclado: escrever», «Segurança digital» ou «Pesquisa»). Duração: [30/60] minutos. Antes de entregar, confirma que o JSON é válido e que nenhuma resposta certa aparece em `erradas`.

## Publicação automática no GitHub

O ficheiro `.github/workflows/verificar-e-publicar.yml` corre sempre que há alterações no repositório:

1. Verifica o `jogos.json` (campos obrigatórios, datas, ficheiros que existem) e o conteúdo de todos os jogos V3.
2. Se houver um erro, **não publica** e mostra a lista de problemas no separador «Actions» do GitHub (e o GitHub envia um email).
3. Se estiver tudo certo, embute as imagens dos emojis em todos os jogos e publica o site.

Para funcionar é preciso, uma única vez: **Settings → Pages → Build and deployment → Source: «GitHub Actions»**.
