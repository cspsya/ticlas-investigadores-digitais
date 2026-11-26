/* ==========================================================
   Investigadores Digitais · Jogo-base V3 · motor
   Para criar um jogo novo NÃO se altera este código:
   muda-se apenas o bloco AULA (JSON) no ficheiro HTML.
   ========================================================== */

const VERSAO = 'V3.11';
const PASS_HASH = '0ab6d63e627eaf2f63a43514d1722ec6de93c49fc7452a9de39fe1882e2f0d98'; // a mesma palavra-passe dos outros jogos do Ticl@s
const TIPOS = ['escolher', 'verdadeiro_falso', 'completar', 'escrever', 'ditado', 'copiar', 'pares', 'classificar', 'ordenar', 'mab', 'cadeia', 'reta', 'tabela100', 'puzzle', 'pontos', 'apanhar', 'percurso'];
const FASES = ['aquecimento', 'desafios', 'escrita', 'bonus'];
const SEGUNDOS = { escolher: 30, verdadeiro_falso: 25, completar: 35, escrever: 60, frase: 180, ditado: 45, copiar: 60, pares: 20, classificar: 20, ordenar: 45, mab: 60, cadeia: 70, reta: 35, tabela100: 110, puzzle: 70, pontos: 50, apanhar: 120, percurso: 150 };

/* ---------- temas: só mudam cores, decoração e acessório da mascote ---------- */
const TEMAS = {
  neutro:      { nome: 'Neutro (Investigadores)', c: ['#5BA3D0', '#285775', '#e6f3f5', '#E8834A', '#b9582e', '#FFF8F0', '#e6f3f5'], d: ['🔍', '💡', '⭐', '💻'], a: '' },
  regresso:    { nome: 'Regresso às aulas', c: ['#5BA3D0', '#285775', '#e6f3f5', '#E8834A', '#b9582e', '#FFF8F0', '#e9f2fb'], d: ['🎒', '✏️', '📚', '🖍️'], a: '🎒' },
  outono:      { nome: 'Outono', c: ['#b0632a', '#6e3a14', '#f8e6d6', '#5f8a2a', '#43631b', '#fff8ef', '#f6e3cf'], d: ['🍂', '🍁', '🍄', '🌰'], a: '🍂' },
  paopordeus:  { nome: 'Pão-por-Deus', c: ['#a8612e', '#663814', '#f6e5d6', '#c9862b', '#8f5b14', '#fff8ef', '#f5e4d0'], d: ['🥖', '🍎', '🌰', '🍂'], a: '🧺' },
  saomartinho: { nome: 'São Martinho', c: ['#8b4a2b', '#4f2814', '#f3e1d4', '#d27424', '#9a5212', '#fff7ef', '#f3dfcc'], d: ['🌰', '🔥', '🍂', '☂️'], a: '🌰' },
  natal:       { nome: 'Natal', c: ['#2e7d4f', '#1b4d30', '#e2f3e8', '#c8323c', '#8f1f27', '#fffaf3', '#e7f2ea'], d: ['🎄', '⭐', '❄️', '🎁'], a: '🎁' },
  inverno:     { nome: 'Inverno', c: ['#3d7fb8', '#1f4d75', '#e3eef8', '#6f63c9', '#4a3f9a', '#f7fbff', '#e1edf8'], d: ['❄️', '☃️', '🧤', '🌨️'], a: '🧣' },
  internet:    { nome: 'Dia da Internet Segura', c: ['#3b6fd8', '#1d3f8a', '#e4ecfb', '#12a37a', '#0b7556', '#f6f9ff', '#e2ebfb'], d: ['🛡️', '💻', '🔒', '🌐'], a: '🛡️' },
  carnaval:    { nome: 'Carnaval', c: ['#9b4fd0', '#5e2a85', '#f1e4fa', '#e0861a', '#a35f0c', '#fffaf2', '#f3e6fb'], d: ['🎭', '🎉', '🎊', '🤡'], a: '🎭' },
  primavera:   { nome: 'Primavera', c: ['#4fa36b', '#2b6a40', '#e3f3e7', '#E8834A', '#b9582e', '#fbfff8', '#e5f4e8'], d: ['🌸', '🌼', '🦋', '🌱'], a: '🌼' },
  pascoa:      { nome: 'Páscoa', c: ['#5f9e59', '#3d6e38', '#e6f3e4', '#d9578a', '#a63a63', '#fffaf8', '#eef6ea'], d: ['🐣', '🌷', '🥚', '🐰'], a: '🐣' },
  festadaflor: { nome: 'Festa da Flor', c: ['#c93f80', '#8e2459', '#fbe3ef', '#e2802a', '#a85c12', '#fff8fb', '#fae5ef'], d: ['🌺', '🌸', '🌷', '💐'], a: '🌺' },
  crianca:     { nome: 'Dia da Criança', c: ['#3a8fd6', '#1e5a8f', '#e3f0fb', '#f07a24', '#b5550f', '#fffaf2', '#e6f1fb'], d: ['🎈', '🧸', '🎨', '⚽'], a: '🎈' },
  verao:       { nome: 'Verão', c: ['#1a9bb5', '#0e6476', '#dff4f8', '#e28a12', '#a8620a', '#fffdf5', '#dff3f7'], d: ['☀️', '🏖️', '🌊', '🐚'], a: '🕶️' },
  castelo: { nome: 'Castelo medieval', c: ['#78512f','#51301e','#dfd0ac','#813b32','#54241e','#f5ecd5','#e3d2ab'], d: ['⚜️','🛡️','📜','🔑'], a: '' }
};
function pascoa(ano) { // algoritmo de Meeus/Jones/Butcher
  const a = ano % 19, b = Math.floor(ano / 100), c = ano % 100, d = Math.floor(b / 4), e = b % 4,
    f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
    i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
    mes = Math.floor((h + l - 7 * m + 114) / 31), dia = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(ano, mes - 1, dia);
}
// Festa da Flor (Madeira): datas oficiais de cada edição, no formato MMDD. Acrescentar uma linha por ano.
const FESTA_DA_FLOR = { 2027: [429, 530] };
const FESTA_DA_FLOR_APROX = [425, 525]; // usado nos anos que não estão na tabela
function temaDoDia(data = new Date()) {
  const ano = data.getFullYear(), hoje = new Date(ano, data.getMonth(), data.getDate());
  const md = (data.getMonth() + 1) * 100 + data.getDate();
  const mais = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const entre = (a, b) => hoje >= a && hoje <= b;
  const P = pascoa(ano);
  const primeiroFev = new Date(ano, 1, 1);
  const internetSegura = new Date(ano, 1, 1 + ((2 - primeiroFev.getDay() + 7) % 7) + 7); // 2.ª terça-feira de fevereiro
  if (entre(mais(internetSegura, -1), mais(internetSegura, 3))) return 'internet';
  if (entre(mais(P, -52), mais(P, -46))) return 'carnaval';
  if (entre(mais(P, -7), mais(P, 1))) return 'pascoa';
  if (md >= 1031 && md <= 1102) return 'paopordeus';
  if (md >= 1103 && md <= 1113) return 'saomartinho';
  if (md >= 1201 || md <= 106) return 'natal';
  const [ffIni, ffFim] = FESTA_DA_FLOR[ano] || FESTA_DA_FLOR_APROX;
  if (md >= ffIni && md <= ffFim) return 'festadaflor';
  if (md >= 529 && md <= 602) return 'crianca';
  if (md >= 901 && md <= 930) return 'regresso';
  if (md >= 1001 && md <= 1130) return 'outono';
  if (md >= 107 && md <= 319) return 'inverno';
  if (md >= 320 && md <= 621) return 'primavera';
  if (md >= 622 && md <= 831) return 'verao';
  return 'neutro';
}

/* ---------- utilidades ---------- */
const $ = s => document.querySelector(s);
function h(tag, props, ...filhos) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else if (k === 'style') e.style.cssText = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? '' : v);
  }
  for (const f of filhos.flat()) { if (f == null || f === false) continue; e.append(f instanceof Node ? f : document.createTextNode(String(f))); }
  return e;
}
function encher(alvo, ...nos) { alvo.replaceChildren(...nos.flat().filter(Boolean)); }
function baralhar(lista) { const a = lista.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function baralharDiferente(lista, igual = (x, y) => x === y) {
  if (lista.length < 2) return lista.slice();
  let b, n = 0;
  do { b = baralhar(lista); n++; } while (n < 30 && b.every((x, i) => igual(x, lista[i])));
  return b;
}
const soEmoji = s => { const x = semMarca(s); return /\p{Extended_Pictographic}/u.test(x) && !/[\p{L}\p{N}]/u.test(x); }; // só desenhos, sem texto
const sorteio = lista => lista[Math.floor(Math.random() * lista.length)];
const norm = s => String(s ?? '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('pt-PT').normalize('NFC');
const semAcentos = s => norm(s).normalize('NFD').replace(/[̀-ͯ]/g, '');
const semFim = s => String(s ?? '').trim().replace(/\s+/g, ' ').normalize('NFC').replace(/[.!?…]+$/, '');
const palavras = s => String(s || '').normalize('NFC').split(/[^\p{L}\p{N}-]+/u).filter(Boolean);
/* ---------- letra manuscrita ----------
   [[texto]] em qualquer texto da aula aparece em letra manuscrita (Playwrite PT, modelo escolar português).
   "letra": "manuscrita" numa ronda escreve em manuscrita as opções, peças, cartas e caixas dessa ronda
   (e a palavra a completar, no tipo completar). As perguntas só ficam em manuscrita com [[ ]]. */
let RONDA = null;
const MARCA = /\[\[(.+?)\]\]/g;
const semMarca = s => String(s ?? '').replace(MARCA, '$1');
function rico(texto, cursivo) {
  const s = String(texto ?? '');
  const todo = cursivo ?? !!(RONDA && RONDA.letra === 'manuscrita');
  if (!s.includes('[[')) return todo ? h('span', { class: 'manuscrita' }, s) : s;
  const frag = document.createDocumentFragment();
  let i = 0, m; MARCA.lastIndex = 0;
  while ((m = MARCA.exec(s))) {
    if (m.index > i) frag.append(todo ? h('span', { class: 'manuscrita' }, s.slice(i, m.index)) : s.slice(i, m.index));
    frag.append(h('span', { class: 'manuscrita' }, m[1]));
    i = m.index + m[0].length;
  }
  if (i < s.length) frag.append(todo ? h('span', { class: 'manuscrita' }, s.slice(i)) : s.slice(i));
  return frag;
}
// Caracteres que o tipo «copiar» sabe ensinar no teclado português
const COPIAVEIS = /^[A-Za-zÇçÁÉÍÓÚáéíóúÀàÂÊÔâêôÃÕãõ .,!?-]+$/u;
const temTexto = v => (typeof v === 'string' && v.trim() !== '') || typeof v === 'number';
const timers = new Set();
function depois(ms, fn) { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); return t; }
function limparTimers() { timers.forEach(clearTimeout); timers.clear(); }
function guardar(chave, valor) { try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (e) { /* sem armazenamento: o jogo continua */ } }
function ler(chave) { try { return JSON.parse(localStorage.getItem(chave) || 'null'); } catch (e) { return null; } }
function apagar(chave) { try { localStorage.removeItem(chave); } catch (e) { } }

/* ---------- língua da interface ---------- */
function t(chave, vars) {
  const L = T[prefs.lingua] || T.pt;
  let s = L[chave] ?? T.pt[chave] ?? chave;
  if (Array.isArray(s)) s = sorteio(s);
  return vars ? String(s).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '') : s;
}
const nomeFase = f => t(f || 'desafios');

/* ---------- comparação de respostas escritas ---------- */
// Devolve 'certo', 'maiuscula', 'acentos' ou 'errado'.
// Se a resposta esperada tiver maiúsculas (ex.: «Madeira»), a maiúscula conta, salvo "maiusculas": false.
function compararResposta(aceites, escrito, exigirMaiuscula) {
  const t1 = semFim(escrito);
  for (const a of aceites) {
    const a1 = semFim(a);
    const exige = exigirMaiuscula ?? /\p{Lu}/u.test(a1);
    if (exige ? a1 === t1 : norm(a1) === norm(t1)) return 'certo';
  }
  if (aceites.some(a => norm(semFim(a)) === norm(t1))) return 'maiuscula';
  if (aceites.some(a => semAcentos(semFim(a)) === semAcentos(t1))) return 'acentos';
  return 'errado';
}

/* ---------- validação do conteúdo (as mesmas regras de construir.py) ---------- */
function validarAula(a) {
  const e = [];
  if (!a || typeof a !== 'object' || Array.isArray(a)) return ['O bloco AULA tem de ser um objeto JSON { ... }.'];
  if (!temTexto(a.titulo)) e.push('Falta o «titulo» da aula.');
  if (![1, 2, 3, 4].includes(a.ano)) e.push('«ano» tem de ser 1, 2, 3 ou 4 (número, sem aspas).');
  if (!Array.isArray(a.rondas) || !a.rondas.length) { e.push('Falta a lista «rondas».'); return e; }
  a.rondas.forEach((r, ri) => {
    const onde = `Ronda ${ri + 1}${r && r.titulo ? ' («' + r.titulo + '»)' : ''}`;
    if (!r || !TIPOS.includes(r.tipo)) { e.push(`${onde}: tipo desconhecido «${r && r.tipo}». Tipos possíveis: ${TIPOS.join(', ')}.`); return; }
    if (r.fase && !FASES.includes(r.fase)) e.push(`${onde}: fase desconhecida «${r.fase}». Fases possíveis: ${FASES.join(', ')}.`);
    if (!Array.isArray(r.itens) || !r.itens.length) { e.push(`${onde}: falta a lista «itens».`); return; }
    if (r.tipo === 'classificar' && (!Array.isArray(r.caixas) || r.caixas.length < 2 || !r.caixas.every(temTexto))) e.push(`${onde}: «caixas» tem de ter pelo menos 2 caixas.`);
    r.itens.forEach((it, ii) => {
      const w = `${onde}, item ${ii + 1}`;
      const opErradas = () => {
        if (!Array.isArray(it.erradas) || !it.erradas.length || !it.erradas.every(temTexto)) { e.push(`${w}: «erradas» tem de ter pelo menos 1 opção.`); return; }
        if (it.erradas.some(x => norm(x) === norm(it.certa))) e.push(`${w}: a resposta certa também aparece em «erradas».`);
        if (new Set(it.erradas.map(norm)).size !== it.erradas.length) e.push(`${w}: há opções repetidas em «erradas».`);
      };
      if (['escolher', 'verdadeiro_falso', 'completar', 'escrever', 'ditado', 'copiar', 'ordenar'].includes(r.tipo) && (!it || typeof it !== 'object' || Array.isArray(it))) { e.push(`${w}: tem de ser um objeto { ... }.`); return; }
      if (it && typeof it === 'object' && !Array.isArray(it) && it.maiusculas !== undefined && typeof it.maiusculas !== 'boolean') e.push(`${w}: «maiusculas» tem de ser true ou false (sem aspas).`);
      switch (r.tipo) {
        case 'escolher':
          if (!temTexto(it.pergunta)) e.push(`${w}: falta a «pergunta».`);
          if (!temTexto(it.certa)) e.push(`${w}: falta a resposta «certa».`); else opErradas();
          break;
        case 'verdadeiro_falso':
          if (!temTexto(it.afirmacao)) e.push(`${w}: falta a «afirmacao».`);
          if (typeof it.verdade !== 'boolean') e.push(`${w}: «verdade» tem de ser true ou false (sem aspas).`);
          break;
        case 'completar':
          if (!temTexto(it.frase) || String(it.frase).split('___').length !== 2 || String(it.frase).includes('____')) e.push(`${w}: «frase» tem de ter ___ (três traços) uma única vez.`);
          if (!temTexto(it.certa)) e.push(`${w}: falta a resposta «certa».`); else if (it.erradas !== undefined) opErradas();
          break;
        case 'escrever':
          if (!temTexto(it.pergunta)) e.push(`${w}: falta a «pergunta».`);
          if (it.resposta !== undefined && !(temTexto(it.resposta) || (Array.isArray(it.resposta) && it.resposta.length && it.resposta.every(temTexto)))) e.push(`${w}: «resposta» tem de ser um texto ou uma lista de respostas aceites.`);
          if (it.minPalavras !== undefined && !(Number.isInteger(it.minPalavras) && it.minPalavras > 0)) e.push(`${w}: «minPalavras» tem de ser um número inteiro.`);
          break;
        case 'ditado':
          if (!temTexto(it.palavra)) e.push(`${w}: falta a «palavra» a ditar.`);
          break;
        case 'copiar':
          if (!temTexto(it.palavra)) e.push(`${w}: falta a «palavra» a copiar.`);
          else if (!COPIAVEIS.test(String(it.palavra).normalize('NFC'))) e.push(`${w}: «${it.palavra}» tem caracteres que o tipo copiar não ensina (usa letras, acentos, espaço e . , ! ? -).`);
          break;
        case 'pares':
          if (!Array.isArray(it) || it.length !== 2 || !it.every(temTexto)) e.push(`${w}: cada par tem de ser ["esquerda", "direita"].`);
          break;
        case 'classificar':
          if (!Array.isArray(it) || it.length !== 2 || !temTexto(it[0])) e.push(`${w}: cada item tem de ser ["texto", "caixa"].`);
          else if (Array.isArray(r.caixas) && !r.caixas.includes(it[1])) e.push(`${w}: a caixa «${it[1]}» não existe em «caixas».`);
          break;
        case 'ordenar':
          if (!Array.isArray(it.pecas) || it.pecas.length < 2 || !it.pecas.every(temTexto)) e.push(`${w}: «pecas» tem de ter pelo menos 2 peças, já pela ordem certa.`);
          else if (new Set(it.pecas.map(norm)).size === 1) e.push(`${w}: as peças são todas iguais.`);
          break;
      }
    });
    if (r.tipo === 'pares') {
      const ok = r.itens.filter(p => Array.isArray(p) && p.length === 2);
      const esq = ok.map(p => norm(p[0])), dir = ok.map(p => norm(p[1]));
      if (new Set(esq).size !== esq.length || new Set(dir).size !== dir.length) e.push(`${onde}: há textos repetidos nos pares (cada lado tem de ser diferente).`);
      if (r.visual === 'memoria' && new Set([...esq, ...dir]).size !== esq.length + dir.length) e.push(`${onde}: no jogo da memória um texto não pode aparecer dos dois lados.`);
    }
  });
  e.push(...validarExtra(a));
  e.push(...validarAlgoritmo(a));
  e.push(...validarJogos(a));
  e.push(...validarConsulta(a));
  e.push(...validarFilmes(a));
  e.push(...validarEscape(a));
  if (a.animacoes !== undefined && !['obrigatorias', 'opcionais'].includes(a.animacoes)) e.push('«animacoes» tem de ser «obrigatorias» ou «opcionais».');
  if (!a.rondas.some(r => r && r.fase !== 'bonus')) e.push('Tem de existir pelo menos uma ronda que não seja de bónus.');
  return e;
}
const FATOR_ANO = { 1: 1.5, 2: 1.2, 3: 1.0, 4: 0.9 }; // os mais novos demoram mais em cada item
function minutosEstimados(rondas) {
  const s = rondas.reduce((t, r) => t + 30 + (r.itens || []).reduce((u, it) =>
    u + (r.tipo === 'escrever' && it && it.resposta === undefined ? SEGUNDOS.frase : (SEGUNDOS[r.tipo] || 30)), 0), 0);
  // animações (V3.7): o tempo de cada cena não depende do ano (já é calculado para ele)
  const cenas = l => Array.isArray(l) ? l.reduce((u, c) => u + (c && typeof c === 'object' ? duracaoCena(c) / 1000 : 0), 0) : 0;
  const filmes = rondas.reduce((t, r) => t + cenas(r.animacao), 0) + (rondas.some(r => r.fase !== 'bonus') ? cenas(AULA && AULA.abertura) : 0);
  return Math.max(1, Math.round((s * (FATOR_ANO[AULA && AULA.ano] || 1) + filmes) / 60));
}

/* ---------- estado ---------- */
const PREF = 'ticlas3-preferencias';
let prefs = Object.assign({ modo: 'computador', perfil: 'turma', escala: 1, contraste: false, legivel: false, tema: 'auto', livre: false, lingua: 'pt' }, ler(PREF) || {});
let AULA = null, MASCOTE = {};
const est = { seq: 'principal', p: 0, pontos: {}, maximos: {}, feitas: {}, frases: [], vistas: {}, escapou: false, melhor: {}, desbloqueadas: {}, chavesProf: {}, numero: '', concluido: false, profOk: false };
const somLigado = () => prefs.som === true || (prefs.som !== false && prefs.modo === 'quadro');
const apoio = () => prefs.perfil === 'apoio';
const listaRondas = seq => AULA.rondas.map((r, i) => ({ r, i })).filter(x => seq === 'bonus' ? x.r.fase === 'bonus' : x.r.fase !== 'bonus').map(x => x.i);
const prefixoProgresso = () => 'ticlas3:' + (AULA.id || AULA.titulo) + ':';
const chaveProgresso = () => prefixoProgresso() + (est.numero || 'sem-numero');
function guardarProgresso() {
  guardar(chaveProgresso(), { seq: est.seq, p: est.p, pontos: est.pontos, maximos: est.maximos, feitas: est.feitas, frases: est.frases, vistas: est.vistas, escapou: est.escapou, melhor: est.melhor, desbloqueadas: est.desbloqueadas, chavesProf: est.chavesProf, concluido: est.concluido, atualizado: new Date().toISOString() });
}
function totalEstrelas() { return Object.values(est.pontos).reduce((a, b) => a + b, 0); }
function totalMaximo() { return Object.values(est.maximos).reduce((a, b) => a + b, 0); }
function atualizarEstrelas() { $('#estrelas').textContent = '⭐ ' + totalEstrelas(); }
function guardarPrefs() { guardar(PREF, prefs); }

/* ---------- som e narração ---------- */
let audio = null;
function som(tipo) {
  if (!somLigado()) return;
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const notas = { certo: [660, 880], errado: [220, 185], fim: [523, 659, 784, 1046] }[tipo] || [440];
    notas.forEach((f, i) => {
      const o = audio.createOscillator(), g = audio.createGain(), tt = audio.currentTime + i * 0.12;
      o.type = tipo === 'errado' ? 'triangle' : 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, tt); g.gain.exponentialRampToValueAtTime(0.14, tt + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, tt + 0.24);
      o.connect(g).connect(audio.destination); o.start(tt); o.stop(tt + 0.26);
    });
  } catch (e) { }
}
const temFala = () => 'speechSynthesis' in window;
function vozPT() {
  if (!temFala()) return null;
  const v = speechSynthesis.getVoices();
  return v.find(x => /pt[-_]PT/i.test(x.lang)) || v.find(x => /^pt/i.test(x.lang)) || null;
}
const limparFala = s => semMarca(s).replace(/\p{Extended_Pictographic}️?(?:‍\p{Extended_Pictographic}️?)*/gu, ' ').replace(/_{3,}/g, ' … ').replace(/\s+/g, ' ').trim();
// Lê em voz alta uma sequência de partes; cada parte pode destacar um elemento enquanto é lida.
function lerSequencia(partes, lento) {
  if (!temFala()) return;
  try {
    speechSynthesis.cancel();
    document.querySelectorAll('.a-ler').forEach(x => x.classList.remove('a-ler'));
    const voz = vozPT();
    partes.map(p => typeof p === 'string' ? { texto: p } : p).forEach(p => {
      const txt = limparFala(p.texto);
      if (!txt) return;
      const u = new SpeechSynthesisUtterance(txt);
      u.lang = 'pt-PT'; u.rate = lento ? 0.6 : 0.9; if (voz) u.voice = voz;
      if (p.el) { u.onstart = () => p.el.classList.add('a-ler'); u.onend = u.onerror = () => p.el.classList.remove('a-ler'); }
      speechSynthesis.speak(u);
    });
  } catch (e) { }
}
const falar = (texto, lento) => lerSequencia([texto], lento);
function calar() { try { if (temFala()) speechSynthesis.cancel(); } catch (e) { } document.querySelectorAll('.a-ler').forEach(x => x.classList.remove('a-ler')); }
function atualizarBotaoSom() { const b = $('#btSom'); if (b) { b.textContent = somLigado() ? '🔊' : '🔇'; b.setAttribute('aria-pressed', String(somLigado())); } }

/* ---------- aparência: tema, acessibilidade, modo, língua ---------- */
// Escape room (V3.11): tema próprio e fixo; por omissão o castelo medieval. "tema": "auto" devolve a escolha à professora.
function temaEscape() { if (!modoEscape()) return null; const x = AULA.escape.tema ?? 'castelo'; return x !== 'auto' && TEMAS[x] ? x : null; }
function temaAtual() { const te = temaEscape(); if (te) return te; if (prefs.tema && prefs.tema !== 'auto' && TEMAS[prefs.tema]) return prefs.tema; if (AULA && TEMAS[AULA.tema]) return AULA.tema; return temaDoDia(); }
function aplicarAparencia() {
  const tema = TEMAS[temaAtual()] || TEMAS.neutro, s = document.documentElement.style;
  ['--t-1', '--t-1d', '--t-1l', '--t-2', '--t-2d', '--t-fundo', '--t-fundo2'].forEach((v, i) => s.setProperty(v, tema.c[i]));
  s.setProperty('--escala', prefs.escala);
  const b = document.body;
  b.classList.toggle('castelo', temaAtual() === 'castelo');
  b.classList.toggle('contraste', !!prefs.contraste); b.classList.toggle('legivel', !!prefs.legivel);
  b.classList.toggle('quadro', prefs.modo === 'quadro');
  b.className = b.className.replace(/\bano-\d\b/g, '').trim(); if (AULA && AULA.ano) b.classList.add('ano-' + AULA.ano);
  document.documentElement.lang = prefs.lingua === 'pt' ? 'pt-PT' : prefs.lingua;
  const decor = $('#decor'); decor.innerHTML = '';
  const pos = [[4, 12], [90, 18], [8, 70], [86, 76], [48, 92], [70, 6], [24, 40], [94, 48]];
  pos.forEach(([x, y], i) => decor.append(h('span', { style: `left:${x}%;top:${y}%;animation-delay:${-i * 1.3}s` }, tema.d[i % tema.d.length])));
  atualizarBotaoSom();
}
function mascote(pose, extra) {
  const tema = TEMAS[temaAtual()] || TEMAS.neutro;
  return h('div', { class: 'mascote' },
    h('img', { src: MASCOTE[pose] || MASCOTE.ola, alt: 'Ticl@s, o esquilo investigador', id: 'imgMascote' }),
    tema.a ? h('span', { class: 'acessorio', 'aria-hidden': 'true' }, tema.a) : null,
    extra);
}
function poseMascote(pose, salta) {
  const img = $('#imgMascote'); if (!img) return;
  img.src = MASCOTE[pose] || MASCOTE.ola;
  if (salta) { img.classList.remove('salta'); void img.offsetWidth; img.classList.add('salta'); }
}
function dizerBalao(texto) { const b = $('#balao'); if (b) b.textContent = texto; }
// celebração: confetes a sair do elemento (ou do centro do ecrã)
function festa(el, quantos = 18) {
  try { if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; } catch (e) { }
  const r = el ? el.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 3, width: 0, height: 0 };
  const cores = ['#E8834A', '#5BA3D0', '#6BBF59', '#FFC857', '#9b6bc9', '#d9578a'];
  for (let i = 0; i < quantos; i++) {
    const c = h('span', { class: 'confete', 'aria-hidden': 'true', style: `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;background:${cores[i % cores.length]};--dx:${Math.round((Math.random() * 2 - 1) * 160)}px;--dy:${Math.round(-60 - Math.random() * 140)}px;--r:${Math.round(Math.random() * 720)}deg` });
    document.body.append(c); setTimeout(() => c.remove(), 1200);
  }
}

/* ---------- ecrã de erro do conteúdo ---------- */
function ecraErros(erros) {
  $('#app').replaceChildren(h('div', null,
    h('h2', { class: 'titulo-ronda' }, '⚠️ O conteúdo deste jogo tem problemas'),
    h('p', { class: 'instrucao' }, 'O jogo não arranca até o bloco AULA ser corrigido. Problemas encontrados:'),
    h('ul', { class: 'erros' }, erros.map(x => h('li', null, x)))));
}

/* ---------- ecrã inicial ---------- */
function ecraInicio() {
  limparTimers(); calar(); aplicarAparencia(); atualizarEstrelas();
  const guardado = ler(chaveProgresso());
  const temGuardado = guardado && !guardado.concluido && (Object.keys(guardado.feitas || {}).length || guardado.p > 0);
  const escolha = (grupo, valor, titulo, sub) => h('button', {
    class: 'escolha', 'aria-pressed': String(prefs[grupo] === valor),
    onclick: () => { prefs[grupo] = valor; if (grupo === 'modo') delete prefs.som; guardarPrefs(); ecraInicio(); }
  }, titulo, h('small', null, sub));
  const tags = [AULA.ano + '.º ano', AULA.turma, AULA.disciplina, '≈ ' + (AULA.minutos || minutosEstimados(listaRondas('principal').map(i => AULA.rondas[i]))) + ' min'].filter((x, k, a) => x && a.indexOf(x) === k); // sem etiquetas repetidas (ex.: turma «3.º ano»)
  const numero = h('input', { id: 'numAluno', inputmode: 'numeric', maxlength: '3', value: est.numero, 'aria-label': t('numero'), placeholder: 'ex.: 7' });
  numero.addEventListener('input', () => { numero.value = numero.value.replace(/\D/g, ''); est.numero = numero.value; });
  // Não redesenhar o ecrã: se o aluno escreve o número e carrega logo em «Começar», o clique perdia-se.
  // Só se mostra (ou esconde) o botão «Continuar onde parei» para esse número.
  numero.addEventListener('change', () => {
    const g = ler(chaveProgresso()), tem = g && !g.concluido && (Object.keys(g.feitas || {}).length || g.p > 0), bt = $('#btContinuar');
    if (tem && !bt) $('#btComecar').after(h('button', { class: 'btn leve', id: 'btContinuar', onclick: () => comecar(true) }, t('continuarOnde')));
    else if (!tem && bt) bt.remove();
  });
  const lingua = h('select', { id: 'lingua', 'aria-label': t('lingua'), onchange: e => { prefs.lingua = e.target.value; guardarPrefs(); ecraInicio(); } },
    Object.entries(LINGUAS).map(([k, nome]) => h('option', { value: k, selected: k === prefs.lingua || null }, nome)));
  $('#app').replaceChildren(h('div', { class: 'inicio' },
    mascote('ola', h('div', { class: 'balao', id: 'balao' }, t('ola'))),
    h('section', null,
      h('div', { class: 'linha-topo' },
        h('div', { class: 'tags' }, tags.map(x => h('span', { class: 'tag' }, x))),
        h('label', { class: 'seletor-lingua' }, '🌐', lingua)),
      h('h1', null, AULA.titulo),
      AULA.objetivo ? h('p', { class: 'instrucao' }, AULA.objetivo) : null,
      h('div', { class: 'grupo-titulo' }, t('ondeJogar')),
      h('div', { class: 'escolhas' },
        escolha('modo', 'quadro', t('quadro'), t('quadroSub')),
        escolha('modo', 'computador', t('computador'), t('computadorSub'))),
      h('div', { class: 'grupo-titulo' }, t('comoJogar')),
      h('div', { class: 'escolhas' },
        escolha('perfil', 'turma', t('turma'), t('turmaSub')),
        escolha('perfil', 'apoio', t('apoio'), t('apoioSub'))),
      prefs.modo === 'computador' ? h('label', { class: 'numero' }, t('numero'), numero) : null,
      h('div', { class: 'linha', style: 'justify-content:flex-start;margin-top:12px' },
        h('button', { class: 'btn', id: 'btComecar', onclick: () => comecar(false) }, t('comecar')),
        temGuardado ? h('button', { class: 'btn leve', id: 'btContinuar', onclick: () => comecar(true) }, t('continuarOnde')) : null))));
}
function comecar(continuar) {
  const g = continuar ? ler(chaveProgresso()) : null;
  Object.assign(est, { seq: 'principal', p: 0, pontos: {}, maximos: {}, feitas: {}, frases: [], vistas: {}, escapou: false, melhor: {}, desbloqueadas: {}, chavesProf: {}, concluido: false }, g || {});
  if (!est.vistas) est.vistas = {};
  if (!g) apagar(chaveProgresso());
  if (audio && audio.state === 'suspended') audio.resume();
  if (temCenas(AULA.abertura) && !est.vistas.abertura) ecraAbertura(); else ecraMapa();
}

/* ---------- mapa de missões: escolha livre, pausa e retoma ---------- */
function iconeRonda(r) {
  if (r.tipo === 'escolher' || (r.tipo === 'completar' && r.visual)) return { baloes: '🎈', comboio: '🚂', buracos: '🕳️', aviao: '✈️' }[r.visual] || (r.tipo === 'completar' ? '🧩' : '🃏');
  return { verdadeiro_falso: '✅', completar: '🧩', escrever: '✏️', ditado: '🎧', copiar: '⌨️', pares: r.visual === 'memoria' ? '🃏' : '🔗', classificar: '🗂️', ordenar: '🔢' }[r.tipo] || EXTRA_ICONES[r.tipo] || '⭐';
}
function ecraMapa() {
  limparTimers(); calar();
  est.seq = 'principal'; guardarProgresso(); atualizarEstrelas();
  if (modoEscape()) { ecraMapaEscape(); return; }
  const principais = listaRondas('principal'), bonus = listaRondas('bonus');
  const todas = principais.every(ri => est.feitas[ri]);
  const sugestao = principais.findIndex(ri => !est.feitas[ri]);
  const cartao = (ri, k, seq, bloqueado) => {
    const r = AULA.rondas[ri], feita = est.feitas[ri], sugerida = seq === 'principal' && k === sugestao;
    return h('button', {
      class: 'missao' + (feita ? ' feita' : '') + (sugerida ? ' sugerida' : ''), disabled: bloqueado || null,
      onclick: () => { est.seq = seq; est.p = k; iniciarRonda(); }
    },
      h('span', { class: 'missao-num' }, seq === 'bonus' ? '★' : k + 1),
      h('span', { class: 'missao-icone', 'aria-hidden': 'true' }, bloqueado ? '🔒' : iconeRonda(r)),
      h('strong', null, r.titulo || nomeFase(r.fase)),
      h('small', null, nomeFase(r.fase)),
      feita ? h('span', { class: 'missao-estado' }, `✔ ${est.pontos[ri] ?? 0}/${est.maximos[ri] ?? 0} ⭐`) : sugerida ? h('span', { class: 'missao-estado' }, t('sugestao')) : null);
  };
  $('#app').replaceChildren(h('div', null,
    h('div', { class: 'mapa-topo' }, mascote(todas ? 'trofeu' : 'aponta'),
      h('div', null, h('h2', { class: 'titulo-ronda' }, t('escolheMissao')), h('p', { class: 'instrucao' }, AULA.titulo))),
    temConsulta() ? h('button', { class: 'consulta-faixa', onclick: () => abrirConsulta() },
      h('span', { class: 'consulta-faixa-icone', 'aria-hidden': 'true' }, '📖'),
      h('span', null, h('strong', null, t('consulta')), h('small', null, t('consultaSub')))) : null,
    h('div', { class: 'mapa' }, principais.map((ri, k) => cartao(ri, k, 'principal', false))),
    bonus.length ? h('div', { class: 'grupo-titulo' }, todas ? nomeFase('bonus') : t('bonusFechado')) : null,
    bonus.length ? h('div', { class: 'mapa' }, bonus.map((ri, k) => cartao(ri, k, 'bonus', !todas))) : null,
    h('div', { class: 'nav' },
      h('button', { class: 'btn leve', onclick: ecraInicio }, t('inicio')),
      temCenas(AULA.abertura) ? h('button', { class: 'btn leve', onclick: () => verFilme(AULA.abertura, AULA.titulo) }, '🎬 ' + t('filmeAbertura')) : null,
      todas ? h('button', { class: 'btn', id: 'btResultado', onclick: () => { est.seq = 'principal'; ecraFim(); } }, t('resultado')) : h('span'))));
}

/* ---------- moldura de cada ronda ---------- */
function iniciarRonda() {
  limparTimers(); calar(); reporMelhor();
  const lista = listaRondas(est.seq);
  if (modoEscape() && est.seq === 'principal' && est.p < lista.length && salaFechada(est.p, lista)) { ecraMapa(); return; }
  if (est.p >= lista.length) {
    if (est.seq === 'principal' && !lista.every(ri => est.feitas[ri])) { ecraMapa(); return; }
    if (est.seq === 'principal' && modoEscape() && !est.escapou) { ecraCadeado(); return; }
    ecraFim(); return;
  }
  const ri = lista[est.p], ronda = AULA.rondas[ri];
  RONDA = ronda;
  // escape room: repetir uma sala já aberta não tira a chave e guarda a melhor pontuação
  const repetir = modoEscape() && est.seq === 'principal' && est.feitas[ri];
  if (repetir) { est.melhor = est.melhor || {}; est.melhor[ri] = { p: est.pontos[ri] || 0, m: est.maximos[ri] || 0 }; }
  est.pontos[ri] = 0; est.maximos[ri] = 0; if (!modoEscape()) delete est.feitas[ri];
  guardarProgresso(); atualizarEstrelas();
  const progresso = h('div', { class: 'progresso', 'aria-hidden': 'true' },
    lista.map((x, k) => h('i', { class: k === est.p ? 'atual' : est.feitas[x] ? 'feito' : '' })));
  const area = h('div', { class: 'area', id: 'area' });
  const btAnterior = h('button', { class: 'btn leve', id: 'btAnterior', disabled: est.p === 0, onclick: () => { est.p--; iniciarRonda(); } }, t('anterior'));
  const btProximo = h('button', { class: 'btn azul', id: 'btProximo', disabled: modoEscape() || !prefs.livre, onclick: () => { est.p++; guardarProgresso(); iniciarRonda(); } }, est.p === lista.length - 1 ? t('terminar') : t('proximo'));
  $('#app').replaceChildren(
    progresso,
    h('div', { class: 'etiqueta' },
      h('span', null, t(est.seq === 'bonus' ? 'rondaBonus' : 'ronda', { a: est.p + 1, b: lista.length })),
      h('span', { class: 'fase' }, nomeFase(ronda.fase))),
    h('div', { class: 'palco' },
      mascote(['escrever', 'ditado', 'copiar'].includes(ronda.tipo) ? 'portatil' : 'aponta', h('div', { class: 'balao', id: 'balao' }, t('animo'))),
      area),
    h('div', { class: 'nav' }, btAnterior,
      h('button', { class: 'btn leve', id: 'btMissoes', onclick: ecraMapa }, t('missoes')),
      btProximo));
  const motor = { escolher: rondaItens, verdadeiro_falso: rondaItens, completar: rondaItens, escrever: rondaItens, ditado: rondaItens, copiar: rondaItens, ordenar: rondaItens, pares: rondaPares, classificar: rondaClassificar, mab: rondaItens, algoritmo: rondaItens, cadeia: rondaItens, reta: rondaItens, tabela100: rondaItens, puzzle: rondaItens, pontos: rondaItens, apanhar: rondaItens, percurso: rondaItens }[ronda.tipo];
  if (temCenas(ronda.animacao) && !est.vistas['r' + ri]) {
    const palco = $('#app .palco'); palco.classList.add('filme-ativo');
    btProximo.disabled = true;
    const comecar = () => { est.vistas['r' + ri] = true; guardarProgresso(); palco.classList.remove('filme-ativo'); btProximo.disabled = modoEscape() || !prefs.livre; encher(area); motor(ri, ronda, area); };
    const ver = livre => encher(area, filme(ronda.animacao, {
      titulo: ronda.titulo || nomeFase(ronda.fase), botao: '▶ ' + t('filmeComecar'), livre,
      aoTerminar: () => { est.vistas['r' + ri] = true; guardarProgresso(); }, aoContinuar: comecar
    }));
    if (filmesOpcionais()) encher(area, escolhaFilme(ronda.titulo || nomeFase(ronda.fase), () => ver(true), comecar, t('filmeComecar')));
    else ver(false);
    return;
  }
  motor(ri, ronda, area);
}
function rondaConcluida(ri) {
  est.feitas[ri] = true;
  const escapeSala = modoEscape() && est.seq === 'principal';
  const lista = listaRondas(est.seq), ultima = est.p === lista.length - 1;
  const tudoFeito = est.seq === 'bonus' || lista.every(x => est.feitas[x]);
  const ganhas = est.pontos[ri], possiveis = est.maximos[ri];
  est.melhor = est.melhor || {};
  const antes = est.melhor[ri]; delete est.melhor[ri];
  if (antes && antes.p > (est.pontos[ri] || 0)) { est.pontos[ri] = antes.p; est.maximos[ri] = antes.m; }
  if (est.chavesProf) delete est.chavesProf[ri]; // o aluno abriu a sala sozinho
  guardarProgresso(); atualizarEstrelas();
  poseMascote('trofeu', true); dizerBalao(escapeSala ? t('escAberta') : t('rondaConcluida')); som('fim'); festa(null, 40);
  let rotulo, seguir, vaiAoMapa = false;
  if (escapeSala) {
    const k = proximaSalaPorAbrir();
    if (k >= 0) { rotulo = t('escProxima') + ' ▶'; seguir = () => { est.p = k; guardarProgresso(); iniciarRonda(); }; }
    else if (!tudoFeito) { rotulo = t('missoes'); seguir = ecraMapa; vaiAoMapa = true; }
    else { rotulo = est.escapou ? t('verResultado') : '🔐 ' + t('escCadeado'); seguir = () => { est.p = lista.length; guardarProgresso(); iniciarRonda(); }; }
  } else {
    rotulo = ultima ? (tudoFeito ? t('verResultado') : t('missoes')) : t('proximaRonda');
    seguir = () => { est.p++; guardarProgresso(); iniciarRonda(); };
    vaiAoMapa = ultima && !tudoFeito;
  }
  const bt = $('#btProximo');
  if (escapeSala) bt.replaceWith(h('button', { class: bt.className, id: 'btProximo', onclick: seguir }, t('proximo')));
  else bt.disabled = false;
  encher($('#area'), h('div', { style: 'text-align:center;padding:20px 0' },
    h('div', { class: 'estrelas-grandes' }, '⭐'),
    h('h2', { class: 'titulo-ronda' }, escapeSala ? '🔓 ' + t('escAberta') : t('rondaConcluida')),
    h('p', { class: 'instrucao' }, t('estrelasRonda', { a: ganhas, b: possiveis })),
    est.seq === 'principal' ? chaveGanha(AULA.rondas[ri]) : null,
    h('div', { class: 'linha' },
      h('button', { class: 'btn leve', onclick: iniciarRonda }, t('repetirRonda')),
      est.seq === 'principal' && !vaiAoMapa ? h('button', { class: 'btn leve', onclick: ecraMapa }, t('missoes')) : null,
      h('button', { class: 'btn', id: 'btSeguinte', onclick: seguir }, rotulo))));
  $('#btSeguinte').focus({ preventScroll: true });
}

/* ---------- cabeçalho comum dentro da área ---------- */
// fala: função que devolve as partes a ler (com o elemento a destacar), para o botão 🔊 do cabeçalho
function cabecalhoRonda(ronda, chaveInstrucao, contador, fala) {
  const instr = ronda.instrucao || t(chaveInstrucao);
  const traducao = prefs.lingua !== 'pt' && ronda.instrucao ? h('span', { class: 'traducao' }, t(chaveInstrucao)) : null;
  return [
    h('div', { class: 'linha-titulo' },
      h('h2', { class: 'titulo-ronda' }, ronda.titulo || nomeFase(ronda.fase)),
      fala && somLigado() ? h('button', { class: 'ouvir', 'aria-label': t('ouvir'), title: t('ouvir'), onclick: () => lerSequencia(fala()) }, '🔊') : null,
      botaoAnimacao(ronda), botaoRever(ronda)),
    h('p', { class: 'instrucao' }, instr + (contador ? ' · ' + contador : ''), traducao)
  ];
}
// opcoes: função que devolve [{texto, el}] das opções, lidas a seguir à pergunta (útil no 1.º ano)
function blocoPergunta(it, conteudo, textoFala, opcoes) {
  const filhos = [];
  if (it.emoji) filhos.push(h('span', { class: 'emoji', 'aria-hidden': 'true' }, it.emoji));
  if (it.imagem) filhos.push(h('img', { class: it.imagemGrande ? 'ilustra grande' : 'ilustra', src: it.imagem, alt: it.alt || '' }));
  if (conteudo) filhos.push(h('span', null, typeof conteudo === 'string' ? rico(conteudo, false) : conteudo));
  const partes = () => [textoFala, ...(opcoes ? opcoes() : [])];
  if (somLigado() && (textoFala || opcoes)) filhos.push(h('button', { class: 'ouvir', 'aria-label': t('ouvir'), title: t('ouvir'), onclick: () => lerSequencia(partes()) }, '🔊'));
  if (somLigado() && (textoFala || opcoes) && (AULA.ano <= 2 || AULA.lerAutomatico)) depois(400, () => lerSequencia(partes()));
  return h('div', { class: 'pergunta' }, filhos);
}

/* ---------- controlador de um item (tentativas, pontos, pistas) ---------- */
function criarItem(ri, it, nOpcoes, aoRevelar) {
  const limiteBase = apoio() ? 3 : 2;
  const limite = nOpcoes ? Math.max(1, Math.min(limiteBase, nOpcoes - 1)) : limiteBase;
  const fb = h('div', { class: 'feedback', role: 'status', 'aria-live': 'polite' });
  const dica = it.dica ? h('div', { class: 'dica', hidden: true }, '💡 ' + it.dica) : null;
  const explica = it.explicacao ? h('div', { class: 'explica', hidden: true }, it.explicacao) : null;
  const btDica = it.dica && apoio() ? h('button', { class: 'btn leve', onclick: () => { dica.hidden = false; poseMascote('ideia'); btDica.hidden = true; } }, t('pista')) : null;
  const btContinuar = h('button', { class: 'btn azul', hidden: true }, t('continuar'));
  const c = {
    erros: 0, resolvido: false, bloqueado: false, fb,
    nos: [fb, dica, explica, h('div', { class: 'linha' }, btDica, btContinuar)],
    aoContinuar(fn) { btContinuar.onclick = () => { calar(); fn(); }; },
    aviso(msg) { fb.className = 'feedback bad'; fb.textContent = msg; poseMascote('duvida'); },
    errou(el, msg) {
      if (c.resolvido) return;
      c.erros++; som('errado'); poseMascote('duvida', true); dizerBalao(t('pensaOutra'));
      fb.className = 'feedback bad'; fb.textContent = msg || t('errado');
      if (el) { el.classList.add('errado'); el.disabled = true; }
      if (dica && c.erros >= 1) dica.hidden = false;
      if (c.erros >= limite) { c.revelar(); return; }
      c.bloqueado = true; depois(700, () => { c.bloqueado = false; });
    },
    acertou(el, extra) {
      if (c.resolvido) return;
      c.resolvido = true;
      const p = c.erros === 0 ? 3 : c.erros === 1 ? 1 : 0;
      est.pontos[ri] += p; est.maximos[ri] += 3; atualizarEstrelas(); guardarProgresso();
      som('certo'); poseMascote('ideia', true); dizerBalao(p === 3 ? t('primeira') : t('conseguiste'));
      fb.className = 'feedback ok'; fb.textContent = t('certo') + (extra ? ' ' + extra : '');
      if (el) el.classList.add('certo');
      festa(el || fb);
      if (explica) explica.hidden = false;
      if (dica) dica.hidden = true; if (btDica) btDica.hidden = true;
      btContinuar.hidden = false; btContinuar.focus({ preventScroll: true }); if (it.imagemGrande) depois(350, () => btContinuar.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
    },
    revelar() {
      c.resolvido = true; est.maximos[ri] += 3; guardarProgresso();
      poseMascote('ideia'); dizerBalao(t('vamosVer'));
      fb.className = 'feedback bad';
      fb.textContent = aoRevelar ? aoRevelar() : '';
      if (explica) explica.hidden = false;
      if (btDica) btDica.hidden = true;
      btContinuar.hidden = false; btContinuar.focus({ preventScroll: true }); if (it.imagemGrande) depois(350, () => btContinuar.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
    }
  };
  return c;
}

/* ---------- rondas item a item ---------- */
function rondaItens(ri, ronda, area) {
  const itens = ronda.baralhar ? baralhar(ronda.itens) : ronda.itens.slice();
  let i = 0;
  const seguinte = () => {
    limparTimers(); calar();
    if (i >= itens.length) { rondaConcluida(ri); return; }
    poseMascote(['escrever', 'ditado', 'copiar'].includes(ronda.tipo) ? 'portatil' : 'aponta'); dizerBalao(t('animo'));
    const it = itens[i], contador = itens.length > 1 ? `${i + 1} / ${itens.length}` : '';
    const desenhar = { escolher: itemEscolha, completar: itemEscolha, verdadeiro_falso: itemVF, escrever: itemEscrever, ditado: itemEscrever, copiar: itemCopiar, ordenar: itemOrdenar }[ronda.tipo] || EXTRA_ITENS[ronda.tipo];
    desenhar(ri, ronda, it, area, contador, () => { i++; seguinte(); });
  };
  seguinte();
}
function itemEscolha(ri, ronda, it, area, contador, proximo) {
  const completar = ronda.tipo === 'completar';
  if (completar && !Array.isArray(it.erradas)) return itemEscrever(ri, ronda, Object.assign({}, it, { resposta: it.certa }), area, contador, proximo);
  const erradas = apoio() ? [sorteio(it.erradas)] : it.erradas;
  const opcoes = baralhar([it.certa, ...erradas]);
  let lacuna = null, conteudo, fala;
  if (completar) {
    const [a, b] = String(it.frase).split('___'), manus = RONDA && RONDA.letra === 'manuscrita';
    lacuna = h('span', { class: 'lacuna' }, '?');
    conteudo = h('span', { class: manus ? 'manuscrita palavra-manus' : null }, rico(a, false), lacuna, rico(b, false)); fala = semMarca(it.frase).replace(/_{3,}/g, ' … ');
  } else { conteudo = it.pergunta; fala = it.pergunta; }
  const visual = ronda.visual || 'cartoes';
  const botoes = [];
  let aoResolver = () => { };
  const c = criarItem(ri, it, opcoes.length, () => {
    botoes.forEach(b => { b.disabled = true; if (b.dataset.certa) b.classList.add('revela'); });
    if (lacuna) lacuna.textContent = semMarca(it.certa);
    aoResolver(true);
    return t('respostaCerta', { r: semMarca(it.certa) });
  });
  const escolher = (b, op) => {
    if (c.resolvido || c.bloqueado || b.disabled) return;
    calar();
    if (op === it.certa) { botoes.forEach(x => x.disabled = true); if (lacuna) lacuna.textContent = semMarca(it.certa); c.acertou(b); aoResolver(false); }
    else c.errou(b);
  };
  const semMovimento = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();
  let jogo, chaveInstr = 'i_' + ronda.tipo;
  if (visual === 'buracos') {
    // o Ticl@s salta de buracos com as respostas; toca-se no que tem a resposta certa
    chaveInstr = 'i_buracos';
    jogo = h('div', { class: 'opcoes v-buracos' });
    opcoes.forEach(op => {
      const b = h('button', { class: 'opcao buraco', 'data-certa': op === it.certa ? '1' : null, 'aria-label': semMarca(op) },
        h('span', { class: 'bicho' }, h('b', null, rico(op)), h('img', { src: MASCOTE.ola, alt: '', draggable: 'false' })));
      // conta o toque se o esquilo estiver em cima ou tiver acabado de descer (margem para as crianças)
      b.onclick = () => { if (!b.classList.contains('cima') && Date.now() > (+b.dataset.ate || 0)) return; escolher(b, op); };
      botoes.push(b); jogo.append(b);
    });
    let ultimo = -1;
    const salta = () => {
      if (c.resolvido) return;
      const vivos = botoes.filter(x => !x.disabled);
      botoes.forEach(x => { if (x.classList.contains('cima')) x.dataset.ate = Date.now() + 600; x.classList.remove('cima'); });
      if (!vivos.length) return;
      let k = Math.floor(Math.random() * vivos.length);
      if (vivos.length > 1 && botoes.indexOf(vivos[k]) === ultimo) k = (k + 1) % vivos.length;
      ultimo = botoes.indexOf(vivos[k]);
      vivos[k].classList.add('cima');
      depois(apoio() ? 2800 : 1900, salta);
    };
    aoResolver = () => botoes.forEach(x => x.classList.add('cima'));
    if (semMovimento) botoes.forEach(x => x.classList.add('cima')); else depois(500, salta);
  } else if (visual === 'aviao') {
    // avião controlado por toque (toca numa nuvem) ou pelos botões ▲ ▼ e «Apanhar!»
    chaveInstr = 'i_aviao';
    const n = opcoes.length;
    let faixa = Math.floor(n / 2);
    const aviao = h('span', { class: 'aviao', 'aria-hidden': 'true' }, '✈️');
    const ceu = h('div', { class: 'ceu', tabindex: '0', 'aria-label': t('i_aviao') }, aviao);
    const mover = k => {
      faixa = Math.max(0, Math.min(n - 1, k));
      aviao.style.top = `${(faixa + 0.5) * 100 / n}%`;
      botoes.forEach((x, i) => x.classList.toggle('alvo', i === faixa));
    };
    const apanhar = () => {
      const b = botoes[faixa];
      if (c.resolvido || c.bloqueado || b.disabled || aviao.classList.contains('voa')) return;
      aviao.classList.add('voa');
      depois(semMovimento ? 0 : 600, () => { aviao.classList.remove('voa'); escolher(b, opcoes[faixa]); });
    };
    opcoes.forEach((op, k) => {
      const b = h('button', { class: 'opcao nuvem', style: `top:${(k + 0.5) * 100 / n}%`, 'data-certa': op === it.certa ? '1' : null }, rico(op));
      b.onclick = () => { if (faixa === k) apanhar(); else { mover(k); depois(semMovimento ? 0 : 420, apanhar); } };
      botoes.push(b); ceu.append(b);
    });
    ceu.onkeydown = e => {
      if (e.key === 'ArrowUp') { e.preventDefault(); mover(faixa - 1); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); mover(faixa + 1); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); apanhar(); }
    };
    aoResolver = revelado => { if (!revelado) { aviao.classList.add('vitoria'); } };
    jogo = h('div', null, ceu, h('div', { class: 'linha controlos-aviao' },
      h('button', { class: 'btn leve', 'aria-label': t('subir'), onclick: () => mover(faixa - 1) }, '▲'),
      h('button', { class: 'btn', onclick: apanhar }, t('apanhar')),
      h('button', { class: 'btn leve', 'aria-label': t('descer'), onclick: () => mover(faixa + 1) }, '▼')));
    mover(faixa);
  } else {
    const cores = ['#e8834a', '#5ba3d0', '#9b6bc9', '#4fa36b', '#d9578a'];
    jogo = h('div', { class: 'opcoes v-' + visual }, visual === 'comboio' ? h('span', { class: 'loco', 'aria-hidden': 'true' }, '🚂') : null);
    opcoes.forEach((op, k) => {
      const b = h('button', { class: 'opcao', style: visual === 'baloes' ? `--bc:${cores[k % cores.length]}` : null, 'data-certa': op === it.certa ? '1' : null }, rico(op));
      b.onclick = () => escolher(b, op);
      botoes.push(b); jogo.append(b);
    });
    if (visual === 'comboio') aoResolver = revelado => { if (!revelado) depois(700, () => jogo.classList.add('parte')); };
  }
  c.aoContinuar(proximo);
  encher(area, cabecalhoRonda(ronda, chaveInstr, contador),
    blocoPergunta(it, conteudo, fala, () => botoes.map(b => ({ texto: b.getAttribute('aria-label') || b.textContent, el: b }))), jogo, c.nos);
}
function itemVF(ri, ronda, it, area, contador, proximo) {
  const botoes = [];
  const c = criarItem(ri, it, 2, () => {
    botoes.forEach(b => { b.disabled = true; if (b.dataset.certa) b.classList.add('revela'); });
    return it.verdade ? t('eVerdade') : t('eFalso');
  });
  const grelha = h('div', { class: 'opcoes' });
  [[true, t('verdadeiro')], [false, t('falso')]].forEach(([v, txt]) => {
    const b = h('button', { class: 'opcao', 'data-certa': v === it.verdade ? '1' : null }, txt);
    b.onclick = () => { if (c.resolvido || c.bloqueado) return; calar(); if (v === it.verdade) { botoes.forEach(x => x.disabled = true); c.acertou(b); } else c.errou(b); };
    botoes.push(b); grelha.append(b);
  });
  c.aoContinuar(proximo);
  encher(area, cabecalhoRonda(ronda, 'i_verdadeiro_falso', contador), blocoPergunta(it, it.afirmacao, it.afirmacao), grelha, c.nos);
}
// escrever (resposta exata ou frase livre), completar sem opções e ditado
function itemEscrever(ri, ronda, it, area, contador, proximo) {
  const ditado = ronda.tipo === 'ditado';
  const livre = !ditado && it.resposta === undefined;
  const aceites = ditado ? [String(it.palavra)] : livre ? [] : [].concat(it.resposta).map(String);
  const minimo = it.minPalavras || (AULA.ano <= 1 ? 3 : 4);
  const campo = livre
    ? h('textarea', { id: 'resposta', 'aria-label': t('escreveFrase'), spellcheck: 'false', autocomplete: 'off', placeholder: t('escreveFrase') })
    : h('input', { id: 'resposta', 'aria-label': t('escreveAqui'), spellcheck: 'false', autocomplete: 'off', autocapitalize: 'off', placeholder: t('escreveAqui') });
  let lacuna = null, conteudo = it.pergunta, fala = it.pergunta, chaveInstr = livre ? 'i_frase' : 'i_escrever';
  if (ronda.tipo === 'completar') { const [a, b] = String(it.frase).split('___'); lacuna = h('span', { class: 'lacuna' }, '?'); conteudo = h('span', null, a, lacuna, b); fala = it.frase; chaveInstr = 'i_completar'; }
  const btOk = h('button', { class: 'btn' }, t('confirmar'));
  const c = criarItem(ri, it, 0, () => { campo.disabled = true; btOk.disabled = true; if (lacuna) lacuna.textContent = aceites[0]; return t('respostaCerta', { r: aceites[0] }); });
  let topo, criterios = null;
  if (ditado) {
    chaveInstr = 'i_ditado';
    const dizer = lento => lerSequencia(it.frase ? [it.palavra, it.frase, it.palavra] : [it.palavra, it.palavra], lento);
    const aviso = !temFala() || (speechSynthesis.getVoices().length && !vozPT()) ? h('div', { class: 'dica' }, t('semVoz')) : null;
    topo = h('div', { class: 'pergunta' },
      it.emoji && apoio() ? h('span', { class: 'emoji', 'aria-hidden': 'true' }, it.emoji) : null,
      h('button', { class: 'btn azul grande', onclick: () => dizer(false) }, t('ouvirOutra')),
      h('button', { class: 'btn leve', onclick: () => dizer(true) }, t('devagar')),
      apoio() ? h('span', { class: 'tag' }, t('letras', { n: [...String(it.palavra)].filter(x => /\p{L}/u.test(x)).length })) : null);
    topo = [topo, aviso];
    if (somLigado()) depois(400, () => dizer(false));
  } else topo = blocoPergunta(it, conteudo, fala);
  const regras = livre ? [
    it.palavra ? [t('cPalavra', { p: it.palavra }), x => palavras(x).some(p => norm(p) === norm(it.palavra))] : null,
    [t('cMin', { n: minimo }), x => palavras(x).length >= minimo],
    [t('cMaiuscula'), x => /^\p{Lu}/u.test(x.trim())],
    [t('cPonto'), x => /[.!?]$/.test(x.trim())]
  ].filter(Boolean) : [];
  if (livre) {
    criterios = h('ul', { class: 'criterios' }, regras.map(([txt]) => h('li', null, txt)));
    campo.addEventListener('input', () => regras.forEach(([, f], k) => criterios.children[k].classList.toggle('sim', f(campo.value))));
  }
  const verificar = () => {
    if (c.resolvido || c.bloqueado) return;
    const escrito = campo.value;
    if (!escrito.trim()) { campo.focus(); return; }
    if (livre) {
      const falta = regras.filter(([, f]) => !f(escrito)).map(([txt]) => txt.toLowerCase());
      if (falta.length) { c.aviso(t('falta', { r: falta.join('; ') })); return; }
      est.frases.push({ pergunta: it.pergunta, frase: escrito.trim() });
      campo.disabled = true; btOk.disabled = true; c.acertou(null, t('fraseCompleta'));
      return;
    }
    const r = compararResposta(aceites, escrito, it.maiusculas);
    if (r === 'certo') { campo.disabled = true; btOk.disabled = true; campo.classList.add('certo'); if (lacuna) lacuna.textContent = escrito.trim(); c.acertou(null, ditado ? '«' + it.palavra + '»' : ''); }
    else c.errou(null, r === 'maiuscula' ? t('quaseMaiuscula') : r === 'acentos' ? t('quaseAcentos') : null);
    if (!c.resolvido) campo.select();
  };
  btOk.onclick = verificar;
  // preventDefault: sem ele, o mesmo Enter carregava logo em «Continuar» (o foco passa para esse botão) e o aluno não via o resultado
  if (!livre) campo.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); verificar(); } });
  c.aoContinuar(proximo);
  encher(area, cabecalhoRonda(ronda, chaveInstr, contador), topo, h('div', { class: 'escrita' }, campo, btOk), criterios, c.nos);
  if (prefs.modo === 'computador') depois(50, () => campo.focus({ preventScroll: true }));
}
/* ---------- copiar: da letra manuscrita para o teclado ----------
   Mostra a palavra em manuscrita e, por baixo de cada letra, a tecla (ou teclas) do teclado português
   que a escrevem. O aluno escreve letra a letra; a tecla seguinte brilha no teclado do ecrã.
   Campos do item: palavra (obrigatório), emoji ou imagem. Na ronda: "teclado": false esconde o teclado do ecrã. */
const TECLADO_PT = [
  [['\\', '\\'], ['1'], ['2'], ['3'], ['4'], ['5'], ['6'], ['7'], ['8'], ['9'], ['0'], ["'"], ['«'], ['⌫', 'apagar', 'larga']],
  [['Tab', 'tab', 'media'], ['Q'], ['W'], ['E'], ['R'], ['T'], ['Y'], ['U'], ['I'], ['O'], ['P'], ['+'], ['´', 'agudo']],
  [['Caps', 'caps', 'larga'], ['A'], ['S'], ['D'], ['F'], ['G'], ['H'], ['J'], ['K'], ['L'], ['Ç'], ['º'], ['~', 'til'], ['↵', 'enter', 'media']],
  [['⇧', 'shift', 'larga'], ['<'], ['Z'], ['X'], ['C'], ['V'], ['B'], ['N'], ['M'], [','], ['.'], ['-'], ['⇧', 'shift', 'larga']],
  [['espaço', 'espaco', 'espaco']]
];
// Teclas que escrevem cada carácter: [teclas a carregar antes (morta ou shift), tecla final]
function teclasDe(ch) {
  const base = ch.normalize('NFD'), letra = base[0], marca = base.slice(1);
  const MORTAS = { '\u0303': ['~'], '\u0301': ['´'], '\u0300': ['⇧', '´'], '\u0302': ['⇧', '~'] };
  if (ch === ' ') return { antes: [], tecla: 'espaço' };
  if (ch === 'ç' || ch === 'Ç') return { antes: ch === 'Ç' ? ['⇧'] : [], tecla: 'Ç' };
  if (ch === '!') return { antes: ['⇧'], tecla: '1' };
  if (ch === '?') return { antes: ['⇧'], tecla: "'" };
  if ('.,-'.includes(ch)) return { antes: [], tecla: ch };
  const maiuscula = letra !== letra.toLowerCase();
  const antes = [...(marca ? (MORTAS[marca] || []) : [])];
  if (maiuscula) antes.push('⇧'); // acento primeiro (tecla morta), depois ⇧ + letra
  return { antes, tecla: letra.toUpperCase(), morta: marca ? (MORTAS[marca] || []).slice(-1)[0] : null, maiuscula };
}
function itemCopiar(ri, ronda, it, area, contador, proximo) {
  const alvo = [...String(it.palavra).normalize('NFC')];
  let pos = 0, erradas = 0, morta = null, mortaShift = false, shiftEcra = false;
  const c = criarItem(ri, it, 0, null);
  // ponte: letra manuscrita → tecla(s) → letra escrita
  const casas = alvo.map(ch => {
    const tk = teclasDe(ch);
    const cap = x => h('kbd', { class: 'tecla' + (x === '⇧' || x === '~' || x === '´' ? ' especial' : '') + (x === 'espaço' ? ' espaco' : '') }, x);
    const teclas = h('span', { class: 'teclas' }, [...tk.antes.flatMap(x => [cap(x), h('i', null, '+')]), cap(tk.tecla)]);
    const escrita = h('span', { class: 'escrita-letra' }, '');
    return h('div', { class: 'casa' + (ch === ' ' ? ' espaco' : '') }, h('span', { class: 'manuscrita letra-manus' }, ch === ' ' ? '␣' : ch), h('span', { class: 'seta', 'aria-hidden': 'true' }, '↓'), teclas, escrita);
  });
  // as casas ficam agrupadas por palavra, para a frase só mudar de linha entre palavras
  const grupos = []; let grupo = [];
  casas.forEach((cs, k) => { if (alvo[k] === ' ') { grupos.push(h('span', { class: 'grupo-casas' }, grupo), cs); grupo = []; } else grupo.push(cs); });
  if (grupo.length) grupos.push(h('span', { class: 'grupo-casas' }, grupo));
  const ponte = h('div', { class: 'ponte' + (alvo.length > 9 ? ' compacta' : ''), 'aria-hidden': 'true' }, grupos);
  const modelo = h('div', { class: 'caderno' }, h('span', { class: 'manuscrita' }, it.palavra));
  const campo = h('input', { id: 'resposta', class: 'campo-copiar', 'aria-label': t('escreveAqui'), spellcheck: 'false', autocomplete: 'off', autocapitalize: 'off', placeholder: t('copiarAqui') });
  // teclado do ecrã (também se pode tocar nas teclas, útil no quadro interativo)
  const mapaTeclas = {};
  const teclado = ronda.teclado === false ? null : h('div', { class: 'teclado-pt', 'aria-hidden': 'true' }, TECLADO_PT.map(linha => h('div', { class: 'linha-teclas' }, linha.map(([rot, nome, larg]) => {
    const k = h('button', { class: 'tk' + (larg ? ' ' + larg : ''), tabindex: '-1', type: 'button', onmousedown: e => e.preventDefault() }, rot);
    (mapaTeclas[rot] = mapaTeclas[rot] || []).push(k);
    k.onclick = () => tocarEcra(rot);
    return k;
  }))));
  function brilhar() {
    if (!teclado) return;
    teclado.querySelectorAll('.tk').forEach(k => k.classList.remove('brilha', 'antes'));
    casas.forEach((cs, k) => { cs.classList.toggle('feita', k < pos); cs.classList.toggle('atual', k === pos); });
    if (pos >= alvo.length) return;
    const tk = teclasDe(alvo[pos]);
    let antes = tk.antes.slice();
    if (morta && antes.includes(morta)) antes = antes.slice(antes.indexOf(morta) + 1); // depois da tecla morta, falta o que vem a seguir (ex.: É = ´ e depois ⇧ + E)
    if (shiftEcra) antes = antes.filter(x => x !== '⇧');
    antes.forEach(x => (mapaTeclas[x] || []).forEach(k => k.classList.add('antes')));
    (mapaTeclas[tk.tecla] || []).forEach(k => k.classList.add('brilha'));
  }
  function atualizarCasas() {
    casas.forEach((cs, k) => { cs.lastChild.textContent = k < pos ? alvo[k] : ''; cs.classList.toggle('feita', k < pos); cs.classList.toggle('atual', k === pos && !c.resolvido); });
    campo.value = alvo.slice(0, pos).join('');
    brilhar();
  }
  function pista(esperado) {
    const tk = teclasDe(esperado);
    if (esperado === ' ') return t('copiarEspaco');
    if (tk.morta) return t('copiarMorta', { s: tk.morta, l: tk.tecla });
    if (tk.maiuscula || (tk.antes[0] === '⇧')) return t('copiarShift', { l: tk.tecla });
    return t('copiarProcura', { l: tk.tecla });
  }
  function errar(esperado, tecla) {
    erradas++; c.erros = 0; som('errado'); poseMascote('duvida', true); dizerBalao(t('pensaOutra'));
    c.fb.className = 'feedback bad'; c.fb.textContent = pista(esperado);
    const cs = casas[pos]; if (cs) { cs.classList.remove('abana'); void cs.offsetWidth; cs.classList.add('abana'); }
    if (tecla && mapaTeclas[tecla]) mapaTeclas[tecla].forEach(k => { k.classList.add('errada'); depois(500, () => k.classList.remove('errada')); });
  }
  // devolve true se aceitou o carácter
  function tentar(ch) {
    if (c.resolvido || pos >= alvo.length) return false;
    const esperado = alvo[pos];
    const ok = ch === esperado || (esperado === esperado.toLowerCase() && ch.toLowerCase() === esperado);
    if (!ok) { errar(esperado, ch.length === 1 ? ch.normalize('NFD')[0].toUpperCase() : null); return false; }
    pos++; morta = null; shiftEcra = false;
    c.fb.className = 'feedback'; c.fb.textContent = '';
    if (pos >= alvo.length) terminar();
    return true;
  }
  function terminar() {
    campo.disabled = true;
    c.erros = erradas <= 1 ? 0 : erradas <= 3 ? 1 : 2; // um engano na tecla ainda vale 3 estrelas
    atualizarCasas();
    modelo.classList.add('certo');
    c.acertou(null, '«' + it.palavra + '»');
  }
  function processar() {
    if (c.resolvido) return;
    const escrito = [...campo.value.normalize('NFC')], feito = alvo.slice(0, pos);
    if (escrito.length < pos) { // apagou letras
      let k = 0; while (k < escrito.length && (escrito[k] === feito[k] || escrito[k].toLowerCase() === feito[k])) k++;
      pos = k; atualizarCasas(); return;
    }
    const iguais = feito.every((x, k) => escrito[k] === x || (escrito[k] || '').toLowerCase() === x);
    if (iguais) for (const ch of escrito.slice(pos)) { if (!tentar(ch)) break; }
    if (!c.resolvido) atualizarCasas();
  }
  function tocarEcra(rot) {
    if (c.resolvido) return;
    if (rot === '⌫') { if (pos > 0) { pos--; atualizarCasas(); } return; }
    if (rot === '⇧') { shiftEcra = !shiftEcra; teclado.querySelectorAll('.tk').forEach(k => k.textContent === '⇧' && k.classList.toggle('presa', shiftEcra)); brilhar(); return; }
    if (rot === '~' || rot === '´') { morta = rot; mortaShift = shiftEcra; shiftEcra = false; brilhar(); return; }
    if (['Tab', 'Caps', '↵'].includes(rot)) return;
    let ch = rot === 'espaço' ? ' ' : rot;
    if (/^\p{L}$/u.test(ch)) {
      ch = shiftEcra ? ch.toUpperCase() : ch.toLowerCase();
      const acento = morta === '~' ? (mortaShift ? '\u0302' : '\u0303') : morta === '´' ? (mortaShift ? '\u0300' : '\u0301') : null;
      if (acento) ch = (ch + acento).normalize('NFC');
    } else if (shiftEcra && rot === '1') ch = '!';
    else if (shiftEcra && rot === "'") ch = '?';
    teclado.querySelectorAll('.tk.presa').forEach(k => k.classList.remove('presa'));
    const aceitou = tentar(ch);
    if (!aceitou) { morta = null; shiftEcra = false; }
    if (!c.resolvido) atualizarCasas();
    if (prefs.modo === 'computador') campo.focus({ preventScroll: true });
  }
  campo.addEventListener('input', e => { if (!e.isComposing) processar(); });
  campo.addEventListener('compositionend', () => depois(0, processar));
  campo.addEventListener('keydown', e => {
    if (e.key === 'Dead') { morta = e.code === 'Backslash' ? '~' : '´'; mortaShift = e.shiftKey; brilhar(); } // teclado PT: ~^ ao lado do Enter, ´` ao lado do P
    else if (e.key === 'Enter' && c.resolvido) e.preventDefault();
  });
  const fala = () => [it.palavra];
  c.aoContinuar(proximo);
  encher(area, cabecalhoRonda(ronda, 'i_copiar', contador),
    h('div', { class: 'copiar' },
      h('div', { class: 'copiar-topo' }, blocoPergunta(Object.assign({}, it, { dica: null }), null, it.palavra), modelo),
      h('div', { class: 'copiar-legenda' }, h('span', null, '✍️ ' + t('copiarModelo')), h('span', null, '⌨️ ' + t('copiarTeclas'))),
      ponte, h('div', { class: 'escrita' }, campo), teclado),
    c.nos);
  atualizarCasas();
  if (prefs.modo === 'computador') depois(50, () => campo.focus({ preventScroll: true }));
}
function itemOrdenar(ri, ronda, it, area, contador, proximo) {
  const juntar = it.juntar ?? ronda.juntar ?? ' ';
  const certas = it.pecas.map(String);
  const pecas = certas.map((x, k) => ({ t: x, k }));
  const fixas = apoio() ? 1 : 0; // no modo apoio a primeira peça já vem colocada
  let montadas = pecas.slice(0, fixas);
  let soltas = baralharDiferente(pecas.slice(fixas), (x, y) => x.k === y.k);
  const montagem = h('div', { class: 'montagem', 'aria-live': 'polite', 'data-vazio': t('montagemVazia') }), bandeja = h('div', { class: 'pecas' });
  const c = criarItem(ri, it, 0, () => { montadas = pecas.slice(); soltas = []; desenhar(true); return t('ordemCerta', { r: semMarca(certas.join(juntar)) }); });
  function desenhar(fim) {
    montagem.replaceChildren(...montadas.map((p, k) => h('button', {
      class: 'peca' + (fim || k < fixas || p.ok ? ' fixa' : ''), disabled: fim || k < fixas || p.ok || null,
      onclick: () => { if (c.resolvido || c.bloqueado) return; montadas.splice(k, 1); soltas.push(p); desenhar(); }
    }, rico(p.t))));
    bandeja.replaceChildren(...soltas.map((p, k) => h('button', {
      class: 'peca', disabled: fim || null,
      onclick: () => { if (c.resolvido || c.bloqueado) return; soltas.splice(k, 1); montadas.push(p); desenhar(); if (!soltas.length) verificar(); }
    }, rico(p.t))));
  }
  function verificar() {
    const certo = montadas.every((p, k) => norm(p.t) === norm(certas[k]));
    if (certo) { montadas.forEach(p => p.ok = true); desenhar(true); c.acertou(null, '«' + semMarca(certas.join(juntar)) + '»'); return; }
    // as peças bem colocadas no início ficam; as outras voltam para a bandeja
    const ficam = [], voltam = [];
    montadas.forEach((p, k) => { if (k < fixas || (norm(p.t) === norm(certas[k]) && ficam.length === k)) { p.ok = true; ficam.push(p); } else voltam.push(p); });
    montadas = ficam; soltas = baralhar(voltam);
    c.errou(null, t('pecasVerdes'));
    if (!c.resolvido) desenhar();
  }
  desenhar();
  c.aoContinuar(proximo);
  const fala = () => [...bandeja.querySelectorAll('.peca')].map(b => ({ texto: b.textContent, el: b }));
  encher(area, cabecalhoRonda(ronda, 'i_ordenar', contador, fala), blocoPergunta(it, it.pergunta || null, it.pergunta), montagem, bandeja, c.nos);
}

/* ---------- rondas por ecrãs: pares e classificar ---------- */
function porEcras(lista) { const n = apoio() ? 3 : 6, out = []; for (let k = 0; k < lista.length; k += n) out.push(lista.slice(k, k + n)); return out; }
function rondaPares(ri, ronda, area) {
  const ecras = porEcras(ronda.baralhar ? baralhar(ronda.itens) : ronda.itens.slice());
  let e = 0;
  const seguinte = () => { if (e >= ecras.length) { rondaConcluida(ri); return; } (ronda.visual === 'memoria' ? ecraMemoria : ecraLigar)(ri, ronda, area, ecras[e], ecras.length > 1 ? t('parte', { a: e + 1, b: ecras.length }) : '', () => { e++; seguinte(); }); };
  seguinte();
}
function ecraLigar(ri, ronda, area, pares, contador, proximo) {
  const limite = apoio() ? 3 : 2;
  const esq = pares.map((p, k) => ({ t: String(p[0]), k, erros: 0 }));
  const dir = baralharDiferente(pares.map((p, k) => ({ t: String(p[1]), k })), (x, y) => x.k === y.k);
  const cores = ['#5BA3D0', '#E8834A', '#6BBF59', '#9b6bc9', '#d9578a', '#c9a227'];
  let selE = null, selD = null, feitos = 0, bloqueado = false;
  const fb = h('div', { class: 'feedback', role: 'status' });
  const bE = esq.map(x => h('button', { class: 'peca' + (soEmoji(x.t) ? ' so-emoji' : '') }, rico(x.t))), bD = dir.map(x => h('button', { class: 'peca' + (soEmoji(x.t) ? ' so-emoji' : '') }, rico(x.t)));
  const fixar = (k, revelado) => {
    const ie = esq.findIndex(x => x.k === k), id = dir.findIndex(x => x.k === k), cor = cores[k % cores.length];
    [bE[ie], bD[id]].forEach(b => { b.disabled = true; b.classList.remove('sel'); b.classList.add('fixa'); b.style.borderColor = cor; b.style.boxShadow = `0 4px 0 ${cor}`; if (revelado) b.style.borderStyle = 'dashed'; });
    feitos++;
    if (!revelado) festa(bD[id], 10);
    if (feitos === pares.length) { som('certo'); fb.className = 'feedback ok'; fb.textContent = t('paresLigados'); depois(900, proximo); }
  };
  const tentar = () => {
    if (selE == null || selD == null) return;
    const a = esq[selE], b = dir[selD], be = bE[selE], bd = bD[selD];
    selE = selD = null; be.classList.remove('sel'); bd.classList.remove('sel');
    if (a.k === b.k) {
      const p = a.erros === 0 ? 3 : a.erros === 1 ? 1 : 0; est.pontos[ri] += p; est.maximos[ri] += 3; atualizarEstrelas(); guardarProgresso();
      som('certo'); poseMascote('ideia', true); fb.className = 'feedback ok'; fb.textContent = t('certo'); fixar(a.k);
    } else {
      a.erros++; som('errado'); poseMascote('duvida', true); fb.className = 'feedback bad';
      be.classList.add('errado'); bd.classList.add('errado'); bloqueado = true;
      depois(600, () => { be.classList.remove('errado'); bd.classList.remove('errado'); bloqueado = false; });
      if (a.erros >= limite) { fb.textContent = t('ligaCom', { a: semMarca(a.t), b: semMarca(pares[a.k][1]) }); est.maximos[ri] += 3; guardarProgresso(); depois(600, () => fixar(a.k, true)); }
      else fb.textContent = t('errado');
    }
  };
  bE.forEach((b, k) => b.onclick = () => { if (bloqueado) return; bE.forEach(x => x.classList.remove('sel')); selE = k; b.classList.add('sel'); tentar(); });
  bD.forEach((b, k) => b.onclick = () => { if (bloqueado) return; bD.forEach(x => x.classList.remove('sel')); selD = k; b.classList.add('sel'); tentar(); });
  const fala = () => [...bE, ...bD].filter(b => !b.disabled).map(b => ({ texto: b.textContent, el: b }));
  encher(area, cabecalhoRonda(ronda, 'i_pares', contador, fala),
    h('div', { class: 'colunas' }, h('div', { class: 'col' }, bE), h('div', { class: 'col' }, bD)), fb);
}
function ecraMemoria(ri, ronda, area, pares, contador, proximo) {
  const cartas = baralhar(pares.flatMap((p, k) => [{ t: String(p[0]), k }, { t: String(p[1]), k }]));
  let viradas = [], feitos = 0, ocupado = false;
  const fb = h('div', { class: 'feedback', role: 'status' });
  const botoes = cartas.map((c, i) => h('button', { class: 'carta', 'aria-label': 'Carta ' + (i + 1) }, '?'));
  botoes.forEach((b, i) => b.onclick = () => {
    if (ocupado || viradas.includes(i) || b.classList.contains('par')) return;
    b.replaceChildren(rico(cartas[i].t)); b.classList.add('virada'); b.classList.toggle('so-emoji', soEmoji(cartas[i].t)); viradas.push(i);
    if (somLigado()) falar(cartas[i].t);
    if (viradas.length < 2) return;
    const [x, y] = viradas;
    if (cartas[x].k === cartas[y].k) {
      viradas = []; feitos++; est.pontos[ri] += 3; est.maximos[ri] += 3; atualizarEstrelas(); guardarProgresso();
      [x, y].forEach(n => { botoes[n].classList.add('par'); botoes[n].disabled = true; });
      festa(botoes[y], 10);
      som('certo'); fb.className = 'feedback ok'; fb.textContent = t('umPar');
      if (feitos === pares.length) { fb.textContent = t('todosPares'); poseMascote('ideia', true); depois(900, proximo); }
    } else {
      ocupado = true; fb.className = 'feedback'; fb.textContent = t('naoPar');
      depois(1000, () => { [x, y].forEach(n => { botoes[n].textContent = '?'; botoes[n].classList.remove('virada', 'so-emoji'); }); viradas = []; ocupado = false; });
    }
  });
  encher(area, cabecalhoRonda(ronda, 'i_memoria', contador), h('div', { class: 'memoria' }, botoes), fb);
}
function rondaClassificar(ri, ronda, area) {
  const ecras = porEcras(baralhar(ronda.itens));
  let e = 0;
  const seguinte = () => { if (e >= ecras.length) { rondaConcluida(ri); return; } ecraClassificar(ri, ronda, area, ecras[e], ecras.length > 1 ? t('parte', { a: e + 1, b: ecras.length }) : '', () => { e++; seguinte(); }); };
  seguinte();
}
function ecraClassificar(ri, ronda, area, itens, contador, proximo) {
  const limite = apoio() ? 3 : 2;
  const pecas = itens.map(([x, cx]) => ({ t: String(x), cx, erros: 0 }));
  let sel = null, feitos = 0, bloqueado = false;
  const fb = h('div', { class: 'feedback', role: 'status' });
  const bandeja = h('div', { class: 'pecas' });
  const botoes = pecas.map((p, k) => {
    const b = h('button', { class: 'peca', draggable: 'true' }, rico(p.t));
    b.onclick = () => escolher(k);
    b.ondragstart = ev => { ev.dataTransfer.setData('text/plain', String(k)); escolher(k); };
    return b;
  });
  const caixas = ronda.caixas.map(nome => {
    const lista = h('div', { class: 'lista-caixa' });
    const el = h('div', { class: 'caixa', role: 'button', tabindex: '0', 'aria-label': semMarca(nome) }, h('h4', null, rico(nome)), lista);
    el.onclick = () => largar(nome, el);
    el.onkeydown = ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); largar(nome, el); } };
    el.ondragover = ev => { ev.preventDefault(); el.classList.add('alvo'); };
    el.ondragleave = () => el.classList.remove('alvo');
    el.ondrop = ev => { ev.preventDefault(); el.classList.remove('alvo'); const k = +ev.dataTransfer.getData('text/plain'); if (Number.isInteger(k) && botoes[k] && !botoes[k].disabled) { escolher(k); largar(nome, el); } };
    return { nome, el, lista };
  });
  function escolher(k) {
    if (bloqueado || botoes[k].disabled) return;
    botoes.forEach(b => b.classList.remove('sel')); sel = k; botoes[k].classList.add('sel');
    if (somLigado() && AULA.ano <= 2) falar(pecas[k].t);
  }
  function colocar(k, revelado) {
    const p = pecas[k], cx = caixas.find(c => c.nome === p.cx), b = botoes[k];
    b.classList.remove('sel'); b.classList.add('fixa'); b.disabled = true; b.draggable = false; if (revelado) b.style.borderStyle = 'dashed';
    cx.lista.append(b); feitos++;
    if (!revelado) festa(b, 10);
    if (feitos === pecas.length) { som('certo'); fb.className = 'feedback ok'; fb.textContent = t('arrumado'); poseMascote('ideia', true); depois(900, proximo); }
  }
  function largar(nome, el) {
    if (bloqueado) return;
    if (sel == null) { fb.className = 'feedback'; fb.textContent = t('tocaPrimeiro'); return; }
    const k = sel, p = pecas[k]; sel = null;
    if (p.cx === nome) {
      const pts = p.erros === 0 ? 3 : p.erros === 1 ? 1 : 0; est.pontos[ri] += pts; est.maximos[ri] += 3; atualizarEstrelas(); guardarProgresso();
      som('certo'); fb.className = 'feedback ok'; fb.textContent = t('certo'); colocar(k);
    } else {
      p.erros++; som('errado'); poseMascote('duvida', true); fb.className = 'feedback bad';
      botoes[k].classList.remove('sel'); botoes[k].classList.add('errado'); el.classList.add('alvo'); bloqueado = true;
      depois(650, () => { botoes[k].classList.remove('errado'); el.classList.remove('alvo'); bloqueado = false; });
      if (p.erros >= limite) { fb.textContent = t('vaiPara', { a: semMarca(p.t), b: semMarca(p.cx) }); est.maximos[ri] += 3; guardarProgresso(); depois(650, () => colocar(k, true)); }
      else fb.textContent = t('errado');
    }
  }
  bandeja.append(...botoes);
  const fala = () => [...caixas.map(c => ({ texto: c.nome, el: c.el })), ...botoes.filter(b => !b.disabled).map(b => ({ texto: b.textContent, el: b }))];
  encher(area, cabecalhoRonda(ronda, 'i_classificar', contador, fala), bandeja, h('div', { class: 'caixas' }, caixas.map(c => c.el)), fb);
}

/* ---------- fim e certificado ---------- */
function ecraFim() {
  limparTimers(); calar();
  if (est.seq === 'principal') est.concluido = true;
  guardarProgresso();
  const pts = totalEstrelas(), max = totalMaximo() || 1, pct = pts / max;
  const grandes = pct >= 0.8 ? 3 : pct >= 0.5 ? 2 : 1;
  const temBonus = est.seq === 'principal' && listaRondas('bonus').length > 0;
  som('fim');
  $('#app').replaceChildren(h('div', { style: 'text-align:center' },
    mascote('trofeu'),
    h('div', { class: 'estrelas-grandes', 'aria-label': grandes + ' / 3' }, '⭐'.repeat(grandes) + '☆'.repeat(3 - grandes)),
    h('h2', { class: 'titulo-ronda' }, est.seq === 'bonus' ? t('bonusFeitos') : t('missao')),
    h('p', { class: 'instrucao' }, t('estrelasTotal', { a: pts, b: max })),
    est.frases.length ? h('div', { class: 'frases-lista' }, h('strong', null, t('tuasFrases')), h('ul', null, est.frases.map(f => h('li', null, f.frase)))) : null,
    h('div', { class: 'linha', style: 'margin-top:14px' },
      h('button', { class: 'btn', onclick: certificado }, t('certificado')),
      temBonus ? h('button', { class: 'btn azul', id: 'btBonus', onclick: () => { est.seq = 'bonus'; est.p = 0; iniciarRonda(); } }, t('desafiosBonus')) : null,
      h('button', { class: 'btn leve', onclick: ecraMapa }, t('missoes')),
      h('button', { class: 'btn leve', onclick: () => comecar(false) }, t('outraVez')),
      h('button', { class: 'btn leve', onclick: ecraInicio }, t('inicio')))));
}
function certificado() {
  const hoje = new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
  $('#certificado').replaceChildren(
    h('img', { src: MASCOTE.trofeu, alt: '' }),
    h('h1', null, 'Certificado de Investigador Digital'),
    h('p', null, est.numero ? `Aluno n.º ${est.numero}${AULA.turma ? ' · ' + AULA.turma : ''}` : (AULA.turma || '')),
    h('p', null, 'completou a missão'), h('h2', null, '«' + AULA.titulo + '»'),
    h('p', null, `com ${totalEstrelas()} estrelas ⭐`), h('p', null, hoje),
    h('p', { style: 'font-size:14px;margin-top:30px' }, 'Investigadores Digitais, TIC no 1.º ciclo · Coordenadora TIC C. Sofia O.'));
  window.print();
}

/* ---------- janelas: acessibilidade e painel do professor ---------- */
function janela(...conteudo) {
  const j = h('div', { class: 'janela', role: 'dialog', 'aria-modal': 'true' }, h('div', { class: 'cartao' }, ...conteudo));
  j.onclick = e => { if (e.target === j) j.remove(); };
  document.body.append(j); return j;
}
function abrirAcessibilidade() {
  const j = janela(
    h('h3', null, 'Aa'),
    h('label', null, 'A− / A+', h('span', { class: 'linha' },
      h('button', { class: 'icon', 'aria-label': 'Letra mais pequena', onclick: () => mudar('escala', Math.max(0.85, +(prefs.escala - 0.15).toFixed(2))) }, 'A−'),
      h('button', { class: 'icon', 'aria-label': 'Letra maior', onclick: () => mudar('escala', Math.min(1.45, +(prefs.escala + 0.15).toFixed(2))) }, 'A+'))),
    h('label', null, 'Alto contraste', h('input', { type: 'checkbox', checked: prefs.contraste || null, onchange: e => mudar('contraste', e.target.checked) })),
    h('label', null, 'Letra mais legível', h('input', { type: 'checkbox', checked: prefs.legivel || null, onchange: e => mudar('legivel', e.target.checked) })),
    h('div', { class: 'linha' }, h('button', { class: 'btn', onclick: () => j.remove() }, '✔')));
  function mudar(k, v) { prefs[k] = v; guardarPrefs(); aplicarAparencia(); }
}
async function sha256(texto) {
  const r = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
  return [...new Uint8Array(r)].map(b => b.toString(16).padStart(2, '0')).join('');
}
function abrirProfessor() {
  if (est.profOk) return painelProfessor();
  const campo = h('input', { type: 'password', placeholder: 'Palavra-passe', autocomplete: 'off', 'aria-label': 'Palavra-passe' });
  const erro = h('div', { class: 'erros' });
  const entrar = async () => {
    try { if (await sha256(campo.value) === PASS_HASH) { est.profOk = true; j.remove(); painelProfessor(); } else erro.textContent = 'Palavra-passe errada.'; }
    catch (e) { erro.textContent = 'Este navegador não permite verificar a palavra-passe aqui.'; }
  };
  campo.onkeydown = e => { if (e.key === 'Enter') entrar(); };
  const j = janela(h('h3', null, '⚙️ Painel do professor'), campo, erro,
    h('div', { class: 'linha', style: 'margin-top:10px' }, h('button', { class: 'btn leve', onclick: () => j.remove() }, 'Fechar'), h('button', { class: 'btn', onclick: entrar }, 'Entrar')));
  campo.focus();
}
// resultados guardados neste computador para este jogo (um registo por número de aluno)
function resultadosLocais() {
  const pref = prefixoProgresso(), out = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(pref)) continue;
      const v = ler(k); if (!v) continue;
      const soma = o => Object.values(o || {}).reduce((a, b) => a + b, 0);
      const principais = listaRondas('principal');
      out.push({
        chave: k, numero: k.slice(pref.length) === 'sem-numero' ? '—' : k.slice(pref.length),
        estrelas: soma(v.pontos), maximo: soma(v.maximos),
        rondas: principais.filter(ri => v.feitas && v.feitas[ri]).length + '/' + principais.length,
        concluido: !!v.concluido, data: v.atualizado ? new Date(v.atualizado).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' }) : '',
        frases: (v.frases || []).map(f => f.frase)
      });
    }
  } catch (e) { }
  return out.sort((a, b) => (parseInt(a.numero) || 999) - (parseInt(b.numero) || 999));
}
function tabelaResultados() {
  const res = resultadosLocais();
  if (!res.length) return h('p', { class: 'info' }, 'Ainda não há resultados deste jogo neste computador.');
  const copiar = h('button', {
    class: 'btn leve', onclick: async () => {
      const tsv = ['N.º\tEstrelas\tMáximo\tRondas\tConcluído\tData\tFrases', ...res.map(r => [r.numero, r.estrelas, r.maximo, r.rondas, r.concluido ? 'sim' : 'não', r.data, r.frases.join(' | ')].join('\t'))].join('\n');
      try { await navigator.clipboard.writeText(tsv); copiar.textContent = 'Copiado ✓'; }
      catch (e) { const ta = h('textarea', { style: 'width:100%;height:120px' }); ta.value = tsv; copiar.replaceWith(ta); ta.select(); }
    }
  }, '📋 Copiar (para colar no Excel)');
  return h('div', null,
    h('table', { class: 'resultados' },
      h('thead', null, h('tr', null, ['N.º', '⭐', 'Rondas', 'Fim', 'Data', 'Frases'].map(x => h('th', null, x)))),
      h('tbody', null, res.map(r => h('tr', null,
        h('td', null, r.numero), h('td', null, `${r.estrelas}/${r.maximo}`), h('td', null, r.rondas),
        h('td', null, r.concluido ? '✔' : '…'), h('td', null, r.data),
        h('td', null, r.frases.length ? h('details', null, h('summary', null, r.frases.length), h('ul', null, r.frases.map(f => h('li', null, f)))) : '—'))))),
    h('div', { class: 'linha', style: 'justify-content:flex-start;margin-top:6px' }, copiar,
      h('button', { class: 'btn leve', onclick: e => { if (confirm('Apagar todos os resultados deste jogo neste computador?')) { res.forEach(r => apagar(r.chave)); e.target.closest('.janela').remove(); painelProfessor(); } } }, '🗑️ Apagar resultados')));
}
function painelProfessor() {
  const sel = (valor, opcoes, aoMudar) => h('select', { onchange: e => aoMudar(e.target.value) }, opcoes.map(([v, x]) => h('option', { value: v, selected: v === valor || null }, x)));
  const principais = listaRondas('principal'), bonus = listaRondas('bonus');
  const destino = sel('', [['', '— escolher —'],
    ...principais.map((ri, k) => ['principal:' + k, `${k + 1}. ${AULA.rondas[ri].titulo || AULA.rondas[ri].tipo}`]),
    ...bonus.map((ri, k) => ['bonus:' + k, `Bónus ${k + 1}. ${AULA.rondas[ri].titulo || AULA.rondas[ri].tipo}`])], () => { });
  const mudar = (k, v) => { prefs[k] = v; guardarPrefs(); aplicarAparencia(); };
  const nItens = AULA.rondas.reduce((s, r) => s + r.itens.length, 0);
  const voz = vozPT();
  const ref = { remove: () => j.remove() };
  const j = janela(
    h('h3', null, '⚙️ Painel do professor'),
    h('div', { class: 'info' }, `«${AULA.titulo}» · ${principais.length} rondas + ${bonus.length} de bónus · ${nItens} itens · duração estimada ≈ ${minutosEstimados(principais.map(i => AULA.rondas[i]))} min (+ ${minutosEstimados(bonus.map(i => AULA.rondas[i]))} min de bónus) · tema de hoje: ${TEMAS[temaDoDia()].nome} · voz em português: ${voz ? voz.name : 'não encontrada neste computador'} · motor ${VERSAO}`),
    temaEscape() ? h('p', { class: 'info' }, `Tema: ${TEMAS[temaEscape()].nome} (fixo neste escape room).`) : h('label', null, 'Tema', sel(prefs.tema, [['auto', 'Automático (pela data)'], ...Object.entries(TEMAS).map(([k, x]) => [k, x.nome])], v => mudar('tema', v))),
    h('label', null, 'Modo', sel(prefs.modo, [['quadro', 'Quadro interativo'], ['computador', 'Computador']], v => { delete prefs.som; mudar('modo', v); })),
    h('label', null, 'Perfil', sel(prefs.perfil, [['turma', 'Turma'], ['apoio', 'Apoio']], v => mudar('perfil', v))),
    h('label', null, 'Língua da interface', sel(prefs.lingua, Object.entries(LINGUAS), v => mudar('lingua', v))),
    h('label', null, 'Som e narração', h('input', { type: 'checkbox', checked: somLigado() || null, onchange: e => mudar('som', e.target.checked) })),
    modoEscape() ? null : h('label', null, 'Navegação livre (Próximo sempre ativo)', h('input', { type: 'checkbox', checked: prefs.livre || null, onchange: e => { mudar('livre', e.target.checked); const b = $('#btProximo'); if (b && e.target.checked) b.disabled = false; } })),
    h('label', null, 'Animações: permitir saltar (⏭️)', h('input', { type: 'checkbox', checked: prefs.saltarFilmes || null, onchange: e => mudar('saltarFilmes', e.target.checked) })),
    h('label', null, modoEscape() ? 'Ir para a sala (fica desbloqueada)' : 'Ir para a ronda', h('span', { class: 'linha' }, destino, h('button', {
      class: 'btn azul', onclick: () => { if (!destino.value) return; const [s, k] = destino.value.split(':'); if (s === 'principal' && modoEscape()) { est.desbloqueadas = est.desbloqueadas || {}; est.desbloqueadas[principais[+k]] = true; } est.seq = s; est.p = +k; guardarProgresso(); j.remove(); iniciarRonda(); }
    }, 'Ir'))),
    modoEscape() ? h('label', null, 'Todos os desafios abertos (salas e bónus por qualquer ordem, neste computador)', h('input', { type: 'checkbox', checked: prefs.escapeAberto || null, onchange: e => { mudar('escapeAberto', e.target.checked); if ($('#app .escape')) ecraMapa(); j.remove(); painelProfessor(); } })) : null,
    modoEscape() ? painelEscape(ref) : null,
    h('h4', { style: 'margin:12px 0 4px' }, 'Resultados neste computador'),
    tabelaResultados(),
    h('p', { style: 'font-size:.7rem;color:var(--muted)' }, 'Cada computador guarda apenas os resultados de quem jogou nele, identificados pelo número do aluno (sem nomes). As alterações de modo, perfil e língua aplicam-se na ronda seguinte ou ao voltar ao início.'),
    h('div', { class: 'linha' }, h('button', { class: 'btn leve', onclick: () => { j.remove(); ecraInicio(); } }, '🏠 Início'), h('button', { class: 'btn', onclick: () => j.remove() }, 'Fechar')));
}
function ecraInteiro() {
  if (document.fullscreenElement) { document.exitFullscreen(); return; }
  const el = document.documentElement;
  if (el.requestFullscreen && document.fullscreenEnabled) el.requestFullscreen().catch(() => window.open(location.href, '_blank'));
  else window.open(location.href, '_blank'); // ex.: dentro do Google Sites sem permissão de ecrã inteiro
}

/* ---------- arranque ---------- */
/* ==========================================================
   Matemática (V3.4): mab (construir / ler), cadeia (sequências e setas),
   reta (ler a marca / colocar um número) e tabela100.
   ========================================================== */
const EXTRA_ICONES = { mab: '🧱', cadeia: '➰', reta: '📏', tabela100: '💯' };


/* ---------- validação dos tipos novos ---------- */
const inteiro = v => Number.isInteger(v);
function validarExtra(a) {
  const e = [];
  a.rondas.forEach((r, ri) => {
    if (!r || !['mab', 'cadeia', 'reta', 'tabela100'].includes(r.tipo) || !Array.isArray(r.itens)) return;
    const onde = `Ronda ${ri + 1}${r.titulo ? ' («' + r.titulo + '»)' : ''}`;
    r.itens.forEach((it, ii) => {
      const w = `${onde}, item ${ii + 1}`;
      if (!it || typeof it !== 'object' || Array.isArray(it)) { e.push(`${w}: tem de ser um objeto { ... }.`); return; }
      if (r.tipo === 'mab') {
        if (it.modo === 'ler') { if (![it.c ?? 0, it.d ?? 0, it.u ?? 0].every(x => inteiro(x) && x >= 0 && x <= 20) || !((it.c || 0) + (it.d || 0) + (it.u || 0))) e.push(`${w}: no modo «ler» indica c, d e u (números de 0 a 20).`); }
        else if (!inteiro(it.numero) || it.numero < 1 || it.numero > 299) e.push(`${w}: «numero» tem de ser um número inteiro de 1 a 299.`);
      }
      if (r.tipo === 'cadeia') {
        if (!inteiro(it.inicio) || !Array.isArray(it.passos) || !it.passos.length || !it.passos.every(x => inteiro(x) && x !== 0)) e.push(`${w}: precisa de «inicio» e de «passos» (lista de números, ex.: [5, 10, -10]).`);
        else { let v = it.inicio; it.passos.forEach(p => { v += p; if (v < 0 || v > 999) e.push(`${w}: a sequência sai dos números de 0 a 999.`); }); }
      }
      if (r.tipo === 'reta') {
        const { inicio: a0, fim: a1, passo: p } = it;
        if (![a0, a1, p].every(inteiro) || p <= 0 || a1 <= a0 || (a1 - a0) % p) { e.push(`${w}: «inicio», «fim» e «passo» têm de formar uma reta certa (ex.: 0, 100, 10).`); return; }
        if (it.modo === 'colocar') { if (!inteiro(it.numero) || it.numero <= a0 || it.numero >= a1 || (it.numero - a0) % p === 0) e.push(`${w}: «numero» tem de ficar entre duas marcas (não em cima de uma marca).`); }
        else {
          if (!inteiro(it.marca) || it.marca < a0 || it.marca > a1 || (it.marca - a0) % p) e.push(`${w}: «marca» tem de ser uma das marcas da reta.`);
          if (it.erradas && (!Array.isArray(it.erradas) || it.erradas.includes(it.marca))) e.push(`${w}: «erradas» não pode incluir a resposta certa.`);
        }
      }
      if (r.tipo === 'tabela100') {
        if (!inteiro(it.inicio) || it.inicio % 10 !== 1 || !inteiro(it.linhas) || it.linhas < 1 || it.inicio + it.linhas * 10 - 1 > 100) { e.push(`${w}: «inicio» tem de ser 1, 11, 21… e as linhas não podem passar do 100.`); return; }
        if (!Array.isArray(it.lacunas) || !it.lacunas.length || it.lacunas.some(x => !inteiro(x) || x < it.inicio || x > it.inicio + it.linhas * 10 - 1)) e.push(`${w}: «lacunas» tem de ter números que estejam nessas linhas.`);
      }
    });
  });
  return e;
}

/* ---------- utilidades ---------- */
const SVGNS = 'http://www.w3.org/2000/svg';
function s(tag, attrs, ...filhos) {
  const e = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs || {})) { if (v == null) continue; if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v); }
  filhos.flat().forEach(f => f != null && e.append(f instanceof Node ? f : document.createTextNode(String(f))));
  return e;
}
function campoNumero(extra) {
  const c = h('input', Object.assign({ class: 'num', inputmode: 'numeric', maxlength: '4', autocomplete: 'off', spellcheck: 'false', 'aria-label': t('escreveAqui') }, extra || {}));
  c.addEventListener('input', () => { c.value = c.value.replace(/\D/g, ''); c.classList.remove('mal'); });
  return c;
}
const sinal = p => (p > 0 ? '+ ' : '− ') + Math.abs(p);
const falaSinal = p => (p > 0 ? 'mais ' : 'menos ') + Math.abs(p);

/* ---------- peças do MAB (desenho em SVG) ---------- */
const CORES_MAB = {
  c: { f: '#F2A06B', t: '#F8C49E', s: '#C76A33', l: '#9a4a1c' },
  d: { f: '#7FBCE0', t: '#B4DAF0', s: '#3F86B5', l: '#245a80' },
  u: { f: '#8DD07B', t: '#BDE6B0', s: '#4F9A3E', l: '#2f6b23' }
};
function svgPeca(tipo) {
  const [cols, rows] = tipo === 'c' ? [10, 10] : tipo === 'd' ? [1, 10] : [1, 1];
  const cel = 10, d = 4, cor = CORES_MAB[tipo], W = cols * cel + d, H = rows * cel + d;
  let lin = '';
  for (let i = 1; i < cols; i++) lin += `<line x1="${i * cel}" y1="${d}" x2="${i * cel}" y2="${H}"/>`;
  for (let j = 1; j < rows; j++) lin += `<line x1="0" y1="${d + j * cel}" x2="${cols * cel}" y2="${d + j * cel}"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" style="width:${W / 14}rem;height:${H / 14}rem" aria-hidden="true" focusable="false">` +
    `<polygon points="0,${d} ${d},0 ${W},0 ${cols * cel},${d}" fill="${cor.t}" stroke="${cor.l}" stroke-width=".8"/>` +
    `<polygon points="${cols * cel},${d} ${W},0 ${W},${H - d} ${cols * cel},${H}" fill="${cor.s}" stroke="${cor.l}" stroke-width=".8"/>` +
    `<rect x="0" y="${d}" width="${cols * cel}" height="${rows * cel}" fill="${cor.f}" stroke="${cor.l}" stroke-width="1"/>` +
    `<g stroke="${cor.l}" stroke-width=".6" opacity=".75">${lin}</g></svg>`;
}
function peca(tipo, props) { const b = h('button', Object.assign({ class: 'peca-mab p-' + tipo, type: 'button' }, props || {})); b.innerHTML = svgPeca(tipo); return b; }

/* ---------- componente MAB ---------- */
// op: { c, d, u, editavel, contadores, total, aoMudar }
function criarMAB(op) {
  const st = { c: op.c || 0, d: op.d || 0, u: op.u || 0 };
  const MAX = { c: 2, d: 19, u: 19 }, VAL = { c: 100, d: 10, u: 1 };
  const cols = {}, nums = {};
  const valor = () => st.c * 100 + st.d * 10 + st.u;
  const totalEl = h('span', { class: 'mab-total-n' }, '0');
  const btJuntarU = h('button', { class: 'btn amarelo', type: 'button', onclick: () => juntar('u') }, t('mab_juntarU'));
  const btJuntarD = h('button', { class: 'btn amarelo', type: 'button', onclick: () => juntar('d') }, t('mab_juntarD'));
  function desenhar(novo) {
    ['c', 'd', 'u'].forEach(k => {
      const pecas = [];
      for (let i = 0; i < st[k]; i++) {
        const p = peca(k, op.editavel ? { title: t('mab_tirar'), 'aria-label': 'Tirar ' + t('mab_' + { c: 'placa', d: 'barra', u: 'cubo' }[k]), onclick: () => { st[k]--; desenhar(); mudou(); } } : { tabindex: '-1', disabled: true });
        if (novo === k && i === st[k] - 1) p.classList.add('entra');
        pecas.push(p);
        if (k === 'u' && i % 10 === 9 && i < st[k] - 1) pecas.push(h('span', { class: 'quebra' }));
      }
      encher(cols[k], pecas);
      nums[k].textContent = st[k];
      nums[k].classList.toggle('dez', st[k] >= 10);
    });
    totalEl.textContent = valor();
    btJuntarU.hidden = !op.editavel || st.u < 10 || st.d >= MAX.d;
    btJuntarD.hidden = !op.editavel || st.d < 10 || st.c >= MAX.c;
  }
  function mudou() { if (op.aoMudar) op.aoMudar(valor()); }
  function juntar(k) {
    const sup = k === 'u' ? 'd' : 'c';
    const grupo = cols[k].querySelectorAll('.peca-mab');
    for (let i = 0; i < 10 && i < grupo.length; i++) grupo[i].classList.add('sai');
    som('certo');
    depois(380, () => { st[k] -= 10; st[sup]++; desenhar(sup); mudou(); });
  }
  const colunas = ['c', 'd', 'u'].map(k => {
    nums[k] = h('b', { class: 'mab-num' }, '0');
    cols[k] = h('div', { class: 'mab-pecas pc-' + k });
    return h('div', { class: 'mab-col col-' + k },
      h('div', { class: 'mab-cab' }, h('strong', null, k.toUpperCase()), h('small', null, t('mab_' + k))),
      cols[k],
      op.contadores !== false ? h('div', { class: 'mab-conta' }, nums[k]) : h('span', { hidden: true }, nums[k]));
  });
  const tabuleiro = h('div', { class: 'mab-tab' }, colunas);
  const tabuleiro2 = op.editavel ? h('div', { class: 'mab-bandeja' },
    ['c', 'd', 'u'].map(k => {
      const b = h('button', { class: 'mab-add add-' + k, type: 'button', onclick: () => { if (st[k] >= MAX[k]) { som('errado'); return; } st[k]++; desenhar(k); mudou(); } });
      b.innerHTML = svgPeca(k);
      b.append(h('span', null, '＋ ' + t('mab_' + { c: 'placa', d: 'barra', u: 'cubo' }[k]), h('small', null, ' (' + VAL[k] + ')')));
      return b;
    })) : null;
  const acoes = op.editavel ? h('div', { class: 'linha mab-acoes' }, btJuntarU, btJuntarD,
    h('button', { class: 'btn leve', type: 'button', onclick: () => { st.c = st.d = st.u = 0; desenhar(); mudou(); } }, t('mab_limpar')),
    op.total ? h('span', { class: 'mab-total' }, t('mab_total') + ' = ', totalEl) : null) : null;
  const el = h('div', { class: 'mab' + (op.editavel ? ' editavel' : '') }, tabuleiro2, tabuleiro, acoes);
  desenhar();
  return {
    el, valor, st,
    canonico: () => st.u < 10 && st.d < 10,
    definir(c, d, u) { st.c = c; st.d = d; st.u = u; desenhar(); },
    bloquear() { el.classList.add('bloqueado'); el.querySelectorAll('button').forEach(b => { b.disabled = true; }); }
  };
}
function descreverMAB(n) {
  const c = Math.floor(n / 100), d = Math.floor(n % 100 / 10), u = n % 10, p = [];
  if (c) p.push(c + (c === 1 ? ' placa' : ' placas'));
  if (d) p.push(d + (d === 1 ? ' barra' : ' barras'));
  if (u) p.push(u + (u === 1 ? ' cubo' : ' cubos'));
  return (p.length > 1 ? p.slice(0, -1).join(', ') + ' e ' + p[p.length - 1] : p[0]) + ' = ' + n;
}

/* ---------- item MAB ---------- */
function itemMAB(ri, ronda, it, area, contador, proximo) {
  const ler = it.modo === 'ler';
  if (ler) {
    const n = (it.c || 0) * 100 + (it.d || 0) * 10 + (it.u || 0);
    const m = criarMAB({ c: it.c, d: it.d, u: it.u, editavel: false, contadores: false });
    const campo = campoNumero();
    const btOk = h('button', { class: 'btn' }, t('confirmar'));
    const c = criarItem(ri, it, 0, () => { campo.value = n; campo.disabled = btOk.disabled = true; return t('respostaCerta', { r: n }); });
    const verificar = () => {
      if (c.resolvido || c.bloqueado || !campo.value) { campo.focus(); return; }
      if (Number(campo.value) === n) { campo.disabled = btOk.disabled = true; campo.classList.add('certo'); c.acertou(null, '= ' + n); }
      else { c.errou(null); campo.classList.add('mal'); campo.select(); }
    };
    btOk.onclick = verificar; campo.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); verificar(); } });
    c.aoContinuar(proximo);
    encher(area, cabecalhoRonda(ronda, 'i_mab_ler', contador), blocoPergunta(it, it.pergunta || t('i_mab_ler'), it.pergunta || 'Que número mostra o MAB?'), m.el,
      h('div', { class: 'escrita' }, h('span', { class: 'igual' }, '='), campo, btOk), c.nos);
    if (prefs.modo === 'computador') depois(60, () => campo.focus({ preventScroll: true }));
    return;
  }
  const n = it.numero;
  const m = criarMAB({ editavel: true, contadores: true, total: apoio() });
  const btOk = h('button', { class: 'btn' }, t('confirmar'));
  const c = criarItem(ri, it, 0, () => { m.definir(Math.floor(n / 100), Math.floor(n % 100 / 10), n % 10); m.bloquear(); btOk.disabled = true; return t('mab_era', { r: descreverMAB(n) }); });
  btOk.onclick = () => {
    if (c.resolvido || c.bloqueado) return;
    const v = m.valor();
    if (v === n && m.canonico()) { m.bloquear(); btOk.disabled = true; c.acertou(m.el, descreverMAB(n)); }
    else if (v === n) { c.aviso(t('mab_troca')); }
    else c.errou(null, t('mab_mostra', { n: v }) + ' ' + (v < n ? t('mab_mais') : t('mab_menos')));
  };
  c.aoContinuar(proximo);
  const pergunta = h('span', null, it.pergunta ? rico(it.pergunta) : 'Representa o número ', h('span', { class: 'alvo' }, n));
  encher(area, cabecalhoRonda(ronda, 'i_mab_construir', contador),
    blocoPergunta(it, pergunta, (it.pergunta || 'Representa o número') + ' ' + n), m.el,
    h('div', { class: 'linha' }, btOk), c.nos);
}

/* ---------- item cadeia (sequências e setas) ---------- */
function itemCadeia(ri, ronda, it, area, contador, proximo) {
  const valores = [it.inicio]; it.passos.forEach(p => valores.push(valores[valores.length - 1] + p));
  const campos = valores.slice(1).map(() => campoNumero());
  if (apoio()) { campos[0].value = valores[1]; campos[0].disabled = true; campos[0].classList.add('certo'); }
  const btOk = h('button', { class: 'btn' }, t('confirmar'));
  const c = criarItem(ri, it, 0, () => { campos.forEach((x, k) => { if (!x.classList.contains('certo')) { x.value = valores[k + 1]; x.classList.remove('mal'); x.classList.add('revela'); } x.disabled = true; }); btOk.disabled = true; return t('respostaCerta', { r: valores.join(', ') }); });
  const fila = h('div', { class: 'cadeia' }, h('span', { class: 'cx inicio' }, it.inicio),
    it.passos.flatMap((p, k) => [h('span', { class: 'seta' + (p < 0 ? ' menos' : '') }, h('b', null, sinal(p)), h('i', { 'aria-hidden': 'true' })), h('span', { class: 'cx' }, campos[k])]));
  const verificar = () => {
    if (c.resolvido || c.bloqueado) return;
    if (campos.some(x => !x.value)) { c.aviso(t('vazias')); (campos.find(x => !x.value)).focus(); return; }
    let mal = 0;
    campos.forEach((x, k) => { if (x.disabled) return; if (Number(x.value) === valores[k + 1]) { x.classList.add('certo'); x.disabled = true; } else { x.classList.add('mal'); mal++; } });
    if (!mal) { btOk.disabled = true; c.acertou(fila); }
    else { c.errou(null, mal === 1 && prefs.lingua === 'pt' ? t('faltamCaixa1') : t('faltamCaixas', { n: mal })); const p = campos.find(x => !x.disabled); if (p) p.select(); }
  };
  btOk.onclick = verificar;
  campos.forEach((x, k) => x.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); const nx = campos.slice(k + 1).find(y => !y.disabled); if (nx && !nx.value) nx.focus(); else verificar(); } }));
  c.aoContinuar(proximo);
  const fala = (it.pergunta || 'Segue as setas.') + ' Começa no ' + it.inicio + '. ' + it.passos.map(falaSinal).join(', ') + '.';
  encher(area, cabecalhoRonda(ronda, 'i_cadeia', contador), blocoPergunta(it, it.pergunta || t('i_cadeia'), fala), fila, h('div', { class: 'linha' }, btOk), c.nos);
  if (prefs.modo === 'computador') depois(60, () => { const p = campos.find(x => !x.disabled); if (p) p.focus({ preventScroll: true }); });
}

/* ---------- item reta numérica ---------- */
function itemReta(ri, ronda, it, area, contador, proximo) {
  const { inicio: a0, fim: a1, passo: p } = it;
  const W = 1000, X0 = 50, X1 = 950, Y = 92;
  const x = v => X0 + (v - a0) / (a1 - a0) * (X1 - X0);
  const rotulos = it.rotulos || [a0, a1];
  const svg = s('svg', { viewBox: `0 0 ${W} 190`, class: 'reta-svg', role: 'img', 'aria-label': `Reta numérica de ${a0} a ${a1}` });
  const colocar = it.modo === 'colocar';
  const segs = [];
  if (colocar) {
    for (let v = a0; v < a1; v += p) {
      const g = s('rect', { x: x(v) + 2, y: Y - 38, width: x(v + p) - x(v) - 4, height: 76, rx: 10, class: 'seg', tabindex: '0', role: 'button', 'aria-label': t('reta_segmento', { a: v, b: v + p }) });
      g.dataset.a = v; segs.push(g); svg.append(g);
    }
  }
  svg.append(s('line', { x1: X0 - 20, y1: Y, x2: X1 + 24, y2: Y, class: 'eixo' }), s('polygon', { points: `${X1 + 34},${Y} ${X1 + 18},${Y - 9} ${X1 + 18},${Y + 9}`, class: 'eixo-ponta' }));
  for (let v = a0; v <= a1; v += p) {
    svg.append(s('line', { x1: x(v), y1: Y - 16, x2: x(v), y2: Y + 16, class: 'tick' }));
    if (rotulos.includes(v)) svg.append(s('text', { x: x(v), y: Y + 50, class: 'rot' }, v));
  }
  let caixaTxt = null, alvo = null;
  if (!colocar) {
    alvo = s('g', { class: 'marca-alvo' },
      s('line', { x1: x(it.marca), y1: Y + 22, x2: x(it.marca), y2: Y + 44, class: 'seta-alvo' }),
      s('polygon', { points: `${x(it.marca)},${Y + 20} ${x(it.marca) - 9},${Y + 34} ${x(it.marca) + 9},${Y + 34}`, class: 'seta-alvo-p' }),
      s('rect', { x: x(it.marca) - 40, y: Y + 46, width: 80, height: 48, rx: 10, class: 'caixa-alvo' }),
      caixaTxt = s('text', { x: x(it.marca), y: Y + 80, class: 'rot alvo-txt' }, '?'));
    svg.append(alvo);
  } else {
    svg.append(s('g', { class: 'bandeira' }, s('rect', { x: W / 2 - 50, y: 2, width: 100, height: 40, rx: 10 }), s('text', { x: W / 2, y: 32, class: 'rot' }, it.numero)));
  }
  let c;
  if (colocar) {
    c = criarItem(ri, it, segs.length, () => { marcar(); return t('reta_fica', { n: it.numero, a: Math.floor((it.numero - a0) / p) * p + a0, b: Math.floor((it.numero - a0) / p) * p + a0 + p }); });
    const certoA = Math.floor((it.numero - a0) / p) * p + a0;
    function marcar() {
      segs.forEach(g => g.classList.toggle('certo', Number(g.dataset.a) === certoA));
      svg.querySelector('.bandeira').setAttribute('transform', `translate(${x(it.numero) - W / 2},0)`);
      svg.append(s('line', { x1: x(it.numero), y1: 42, x2: x(it.numero), y2: Y - 2, class: 'seta-alvo' }));
      svg.append(s('circle', { cx: x(it.numero), cy: Y, r: 9, class: 'ponto' }));
      segs.forEach(g => g.classList.add('fim'));
    }
    segs.forEach(g => {
      const tocar = () => {
        if (c.resolvido || c.bloqueado || g.classList.contains('errado')) return;
        if (Number(g.dataset.a) === certoA) { marcar(); c.acertou(null, t('reta_fica', { n: it.numero, a: certoA, b: certoA + p })); }
        else { g.classList.add('errado'); c.errou(null); }
      };
      g.addEventListener('click', tocar); g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tocar(); } });
    });
    c.aoContinuar(proximo);
    encher(area, cabecalhoRonda(ronda, 'i_reta_colocar', contador),
      blocoPergunta(it, h('span', null, it.pergunta || 'Onde fica o número ', h('span', { class: 'alvo' }, it.numero), '?'), (it.pergunta || 'Onde fica o número') + ' ' + it.numero + '?'),
      h('div', { class: 'reta' }, svg), c.nos);
    return;
  }
  const mostrar = v => { caixaTxt.textContent = v; alvo.classList.add('ok'); };
  if (Array.isArray(it.erradas)) {
    const erradas = apoio() ? [sorteio(it.erradas)] : it.erradas;
    const botoes = baralhar([it.marca, ...erradas]).map(v => h('button', { class: 'opcao', type: 'button', onclick: e => escolher(v, e.currentTarget) }, v));
    c = criarItem(ri, it, botoes.length, () => { mostrar(it.marca); botoes.forEach(b => { b.disabled = true; if (Number(b.textContent) === it.marca) b.classList.add('revela'); }); return t('respostaCerta', { r: it.marca }); });
    function escolher(v, b) {
      if (c.resolvido || c.bloqueado) return;
      if (v === it.marca) { mostrar(v); botoes.forEach(x => { x.disabled = true; }); c.acertou(b); } else c.errou(b);
    }
    c.aoContinuar(proximo);
    encher(area, cabecalhoRonda(ronda, 'i_reta_ler', contador), blocoPergunta(it, it.pergunta || t('i_reta_ler'), it.pergunta || 'Que número está na marca da seta?', () => botoes.map(b => ({ texto: b.textContent, el: b }))),
      h('div', { class: 'reta' }, svg), h('div', { class: 'opcoes' }, botoes), c.nos);
  } else {
    const campo = campoNumero(), btOk = h('button', { class: 'btn' }, t('confirmar'));
    c = criarItem(ri, it, 0, () => { mostrar(it.marca); campo.value = it.marca; campo.disabled = btOk.disabled = true; return t('respostaCerta', { r: it.marca }); });
    const verificar = () => {
      if (c.resolvido || c.bloqueado || !campo.value) { campo.focus(); return; }
      if (Number(campo.value) === it.marca) { mostrar(it.marca); campo.disabled = btOk.disabled = true; campo.classList.add('certo'); c.acertou(null); }
      else { campo.classList.add('mal'); c.errou(null); campo.select(); }
    };
    btOk.onclick = verificar; campo.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); verificar(); } });
    c.aoContinuar(proximo);
    encher(area, cabecalhoRonda(ronda, 'i_reta_ler', contador), blocoPergunta(it, it.pergunta || t('i_reta_ler'), it.pergunta || 'Que número está na marca da seta?'),
      h('div', { class: 'reta' }, svg), h('div', { class: 'escrita' }, campo, btOk), c.nos);
    if (prefs.modo === 'computador') depois(60, () => campo.focus({ preventScroll: true }));
  }
}

/* ---------- item tabela do 100 ---------- */
function itemTabela(ri, ronda, it, area, contador, proximo) {
  let lacunas = it.lacunas.slice().sort((a, b) => a - b);
  if (apoio()) lacunas = lacunas.filter((_, k) => k % 2 === 0);
  const campos = [];
  const grelha = h('div', { class: 'tabela100' });
  for (let v = it.inicio; v < it.inicio + it.linhas * 10; v++) {
    if (lacunas.includes(v)) { const cp = campoNumero({ 'aria-label': 'Número que falta' }); cp.dataset.v = v; campos.push(cp); grelha.append(h('span', { class: 'cel vazia' }, cp)); }
    else grelha.append(h('span', { class: 'cel' + (v % 10 === 0 ? ' dez' : '') }, v));
  }
  const btOk = h('button', { class: 'btn' }, t('confirmar'));
  const c = criarItem(ri, it, 0, () => { campos.forEach(x => { if (!x.classList.contains('certo')) { x.value = x.dataset.v; x.classList.remove('mal'); x.classList.add('revela'); } x.disabled = true; }); btOk.disabled = true; return t('vamosVer'); });
  const verificar = () => {
    if (c.resolvido || c.bloqueado) return;
    if (campos.some(x => !x.value)) { c.aviso(t('vazias')); campos.find(x => !x.value).focus(); return; }
    let mal = 0;
    campos.forEach(x => { if (x.disabled) return; if (x.value === x.dataset.v) { x.classList.add('certo'); x.disabled = true; } else { x.classList.add('mal'); mal++; } });
    if (!mal) { btOk.disabled = true; c.acertou(grelha); }
    else { c.errou(null, mal === 1 && prefs.lingua === 'pt' ? t('faltamCaixa1') : t('faltamCaixas', { n: mal })); const p = campos.find(x => !x.disabled); if (p) p.select(); }
  };
  btOk.onclick = verificar;
  campos.forEach((x, k) => x.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); const nx = campos.slice(k + 1).find(y => !y.disabled && !y.value); if (nx) nx.focus(); else verificar(); } }));
  c.aoContinuar(proximo);
  encher(area, cabecalhoRonda(ronda, 'i_tabela', contador), blocoPergunta(it, it.pergunta || t('i_tabela'), it.pergunta || 'Completa a tabela do 100.'), grelha, h('div', { class: 'linha' }, btOk), c.nos);
  if (prefs.modo === 'computador') depois(60, () => campos[0] && campos[0].focus({ preventScroll: true }));
}
const EXTRA_ITENS = { mab: itemMAB, cadeia: itemCadeia, reta: itemReta, tabela100: itemTabela };

/* ---------- ferramenta MAB livre (botão no cabeçalho) ---------- */
function abrirFerramentaMAB() {
  const m = criarMAB({ editavel: true, contadores: true, total: true });
  const j = janela(h('h2', { class: 'titulo-ronda' }, t('mab_ferramenta')), h('p', { class: 'instrucao' }, t('mab_livre')), m.el,
    h('div', { class: 'linha', style: 'margin-top:10px' }, h('button', { class: 'btn azul', onclick: () => j.remove() }, '✔ OK')));
  j.querySelector('.cartao').classList.add('larga');
}

/* ==========================================================
   Minijogos (V3.5): puzzle, pontos (ligar os pontos), apanhar (letras que caem)
   e percurso (labirinto com letras e palavras). Sem som: tudo tem pistas visuais.
   Funcionam com rato, toque e teclado (setas).
   ========================================================== */
Object.assign(EXTRA_ICONES, { puzzle: '🧩', pontos: '✏️', apanhar: '🧺', percurso: '🗺️' });
const TIPOS_JOGO = ['puzzle', 'pontos', 'apanhar', 'percurso'];
// erros num minijogo → estrelas (um engano ainda vale 3 estrelas)
const errosJogo = n => n <= 1 ? 0 : n <= 3 ? 1 : 2;

/* ---------- formas para ligar os pontos (coordenadas de 0 a 100) ----------
   Cada forma é uma lista de traços; cada traço é uma lista de pontos [x, y].
   Um ponto que repete outro já usado não leva número: a linha liga-se sozinha a ele. */
const FORMAS_PONTOS = {
  p: [[[32, 96], [32, 76], [32, 56], [32, 36], [40, 28], [52, 25], [63, 29], [70, 39], [71, 51], [65, 61], [54, 66], [42, 64], [32, 56]]],
  t: [[[46, 10], [46, 34], [46, 56], [47, 74], [53, 85], [63, 87], [71, 81]], [[29, 34], [46, 34], [64, 34]]],
  P: [[[30, 94], [30, 74], [30, 54], [30, 34], [30, 14], [47, 14], [61, 19], [68, 31], [62, 43], [48, 49], [30, 54]]],
  T: [[[16, 16], [33, 16], [50, 16], [67, 16], [84, 16]], [[50, 16], [50, 36], [50, 56], [50, 76], [50, 94]]]
};

/* ---------- validação ---------- */
function validarJogos(a) {
  const e = [], txt = v => typeof v === 'string' && v.trim() !== '';
  const lista = (v, min) => Array.isArray(v) && v.length >= min && v.every(txt);
  a.rondas.forEach((r, ri) => {
    if (!r || !TIPOS_JOGO.includes(r.tipo) || !Array.isArray(r.itens)) return;
    const onde = `Ronda ${ri + 1}${r.titulo ? ' («' + r.titulo + '»)' : ''}`;
    r.itens.forEach((it, ii) => {
      const w = `${onde}, item ${ii + 1}`;
      if (!it || typeof it !== 'object' || Array.isArray(it)) { e.push(`${w}: tem de ser um objeto { ... }.`); return; }
      if (r.tipo === 'puzzle') {
        if (!txt(it.emoji) && !txt(it.imagem)) e.push(`${w}: o puzzle precisa de «emoji» ou «imagem».`);
        if (it.pecas != null && ![4, 6, 9].includes(it.pecas)) e.push(`${w}: «pecas» tem de ser 4, 6 ou 9.`);
        if (it.certa != null && (!txt(it.certa) || !lista(it.erradas, 1) || it.erradas.includes(it.certa))) e.push(`${w}: com «certa» são precisas «erradas» (diferentes da certa).`);
      }
      if (r.tipo === 'pontos') {
        const tracos = it.pontos || FORMAS_PONTOS[it.forma];
        if (!tracos) e.push(`${w}: indica «forma» (${Object.keys(FORMAS_PONTOS).join(', ')}) ou «pontos».`);
        else if (!Array.isArray(tracos) || !tracos.length || !tracos.every(tr => Array.isArray(tr) && tr.length >= 2 && tr.every(p => Array.isArray(p) && p.length === 2 && p.every(n => typeof n === 'number' && n >= 0 && n <= 100)))) e.push(`${w}: «pontos» tem de ser uma lista de traços com pontos [x, y] de 0 a 100.`);
        if (it.exemplos != null && !lista(it.exemplos, 1)) e.push(`${w}: «exemplos» tem de ser uma lista de textos.`);
      }
      if (r.tipo === 'apanhar' || r.tipo === 'percurso') {
        if (!lista(it.certas, 2)) e.push(`${w}: «certas» tem de ter pelo menos 2 textos.`);
        if (!lista(it.erradas, 1)) e.push(`${w}: «erradas» tem de ter pelo menos 1 texto.`);
        if (lista(it.certas, 1) && lista(it.erradas, 1) && it.certas.some(x => it.erradas.includes(x))) e.push(`${w}: há textos que estão nas certas e nas erradas.`);
      }
      if (r.tipo === 'apanhar' && it.meta != null && (!Number.isInteger(it.meta) || it.meta < 3 || it.meta > 20)) e.push(`${w}: «meta» tem de ser um número de 3 a 20.`);
      if (r.tipo === 'percurso') {
        if (Array.isArray(it.certas) && it.certas.length > 7) e.push(`${w}: no percurso usa no máximo 7 certas.`);
        if (Array.isArray(it.erradas) && it.erradas.length > 8) e.push(`${w}: no percurso usa no máximo 8 erradas.`);
      }
    });
  });
  return e;
}

/* ---------- utilidades ---------- */
let MAPA_EMOJIS = null;
function imagemDe(it) {
  if (it.imagem) return it.imagem;
  const e = String(it.emoji || '');
  if (!MAPA_EMOJIS) { try { MAPA_EMOJIS = JSON.parse(($('#emojis-svg') || {}).textContent || '{}'); } catch (x) { MAPA_EMOJIS = {}; } }
  const src = MAPA_EMOJIS[e.replace(/️/g, '')];
  if (src) return src;
  const cv = document.createElement('canvas'); cv.width = cv.height = 256;
  const g = cv.getContext('2d');
  g.font = '200px "Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(e, 128, 140);
  return cv.toDataURL();
}
// teclas de direção enquanto o elemento estiver no ecrã
function aoTeclado(el, fn) {
  const ouvir = ev => { if (!el.isConnected) { document.removeEventListener('keydown', ouvir); return; } fn(ev); };
  document.addEventListener('keydown', ouvir);
}
// animação que para sozinha quando o elemento sai do ecrã
function animar(el, passo) {
  let antes = performance.now();
  const ciclo = agora => {
    if (!el.isConnected) return;
    const dt = Math.min(50, agora - antes); antes = agora;
    if (passo(dt) !== false) requestAnimationFrame(ciclo);
  };
  requestAnimationFrame(ciclo);
}
const ficha = (texto, classe) => h('span', { class: 'ficha ' + (classe || '') }, rico(texto));

/* ---------- puzzle ---------- */
function itemPuzzle(ri, ronda, it, area, contador, proximo) {
  const n = apoio() ? 4 : (it.pecas || ronda.pecas || 6);
  const [cols, rows] = n === 4 ? [2, 2] : n === 9 ? [3, 3] : [3, 2];
  const src = imagemDe(it);
  const c = criarItem(ri, it, it.certa ? 1 + (it.erradas || []).length : 0, () => t('respostaCerta', { r: semMarca(it.certa) }));
  let ordem = baralhar([...Array(n).keys()]);
  while (ordem.every((p, k) => p === k)) ordem = baralhar(ordem);
  let escolhida = null, feito = false;
  const tab = h('div', { class: 'puzzle-tab', style: `grid-template-columns:repeat(${cols},1fr);grid-template-rows:repeat(${rows},1fr)` });
  const celulas = ordem.map((_, k) => {
    const b = h('button', { class: 'puzzle-peca', type: 'button', draggable: 'true', 'aria-label': t('i_puzzle') });
    b.onclick = () => tocar(k);
    b.addEventListener('dragstart', ev => { ev.dataTransfer.setData('text/plain', String(k)); b.classList.add('a-arrastar'); });
    b.addEventListener('dragend', () => b.classList.remove('a-arrastar'));
    b.addEventListener('dragover', ev => ev.preventDefault());
    b.addEventListener('drop', ev => { ev.preventDefault(); const de = +ev.dataTransfer.getData('text/plain'); if (!Number.isNaN(de)) trocar(de, k); });
    return b;
  });
  tab.append(...celulas);
  function desenhar() {
    celulas.forEach((b, k) => {
      const p = ordem[k], col = p % cols, lin = Math.floor(p / cols);
      b.style.backgroundImage = `url("${src}")`;
      b.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
      b.style.backgroundPosition = `${cols > 1 ? col / (cols - 1) * 100 : 0}% ${rows > 1 ? lin / (rows - 1) * 100 : 0}%`;
      b.classList.toggle('no-sitio', p === k);
      b.classList.toggle('escolhida', escolhida === k);
    });
  }
  function tocar(k) {
    if (feito) return;
    if (escolhida === null) { escolhida = k; desenhar(); return; }
    const a = escolhida; escolhida = null;
    if (a !== k) trocar(a, k); else desenhar();
  }
  function trocar(a, b) {
    if (feito || a === b) return;
    [ordem[a], ordem[b]] = [ordem[b], ordem[a]]; escolhida = null;
    som('clique'); desenhar();
    if (ordem[a] === a) celulas[a].classList.add('encaixa');
    if (ordem[b] === b) celulas[b].classList.add('encaixa');
    depois(400, () => celulas.forEach(x => x.classList.remove('encaixa')));
    if (ordem.every((p, k) => p === k)) completo();
  }
  const depoisPuzzle = h('div', { class: 'puzzle-depois', hidden: true });
  function completo() {
    feito = true; tab.classList.add('feito'); celulas.forEach(b => { b.disabled = true; b.draggable = false; });
    festa(tab, 10); poseMascote('ideia', true); dizerBalao(t('conseguiste'));
    const palavra = it.palavra ? h('div', { class: 'puzzle-palavra' }, h('b', null, it.palavra), h('span', { class: 'manuscrita' }, it.palavra)) : null;
    if (!it.certa) { depoisPuzzle.hidden = false; encher(depoisPuzzle, palavra); c.acertou(null, it.palavra ? '«' + it.palavra + '»' : ''); return; }
    const opcoes = baralhar([it.certa, ...(apoio() ? [sorteio(it.erradas)] : it.erradas)]);
    const botoes = opcoes.map(op => h('button', { class: 'opcao', type: 'button', onclick: ev => {
      if (c.resolvido || c.bloqueado) return;
      if (op === it.certa) { botoes.forEach(x => x.disabled = true); if (palavra) depoisPuzzle.prepend(palavra); c.acertou(ev.currentTarget, ''); }
      else c.errou(ev.currentTarget);
    } }, rico(op)));
    depoisPuzzle.hidden = false;
    encher(depoisPuzzle, h('p', { class: 'pergunta-jogo' }, rico(it.pergunta || t('puzzle_pergunta'), false)), h('div', { class: 'opcoes' }, botoes));
  }
  c.aoContinuar(proximo);
  desenhar();
  encher(area, cabecalhoRonda(ronda, 'i_puzzle', contador),
    h('div', { class: 'puzzle' }, h('figure', { class: 'puzzle-modelo' }, h('img', { src, alt: it.alt || it.palavra || '' }), h('figcaption', null, '👀')), tab),
    depoisPuzzle, c.nos);
}

/* ---------- ligar os pontos ---------- */
function itemPontos(ri, ronda, it, area, contador, proximo) {
  const tracos = it.pontos || FORMAS_PONTOS[it.forma];
  const c = criarItem(ri, it, 0, null);
  // pontos únicos (numerados) e passos a percorrer
  const pontos = [], passos = [];
  tracos.forEach((tr, ti) => tr.forEach(([x, y], pi) => {
    let k = pontos.findIndex(p => Math.abs(p.x - x) < 0.5 && Math.abs(p.y - y) < 0.5);
    const auto = k >= 0;
    if (!auto) { k = pontos.length; pontos.push({ x, y, n: k + 1 }); }
    passos.push({ k, auto, novo: pi === 0, traco: ti });
  }));
  let pos = 0, erros = 0;
  const linhas = s('g', { class: 'pontos-linhas' });
  const cx = pontos.reduce((a, p) => a + p.x, 0) / pontos.length, cy = pontos.reduce((a, p) => a + p.y, 0) / pontos.length;
  const marcas = pontos.map(p => {
    // o número fica do lado de fora da forma, para não tapar outros pontos
    let dx = p.x - cx, dy = p.y - cy; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
    const g = s('g', { class: 'ponto', tabindex: '0', role: 'button', 'aria-label': String(p.n) },
      s('circle', { class: 'alvo', cx: p.x, cy: p.y, r: 7 }),
      s('circle', { class: 'bola', cx: p.x, cy: p.y, r: 3.2 }),
      s('text', { x: p.x + dx * 7.5, y: p.y + dy * 7.5 + 1.9, class: 'num', 'text-anchor': 'middle' }, String(p.n)));
    g.addEventListener('click', () => clicar(p.n - 1));
    g.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); clicar(p.n - 1); } });
    return g;
  });
  const svg = s('svg', { viewBox: '-6 -6 112 112', class: 'pontos-svg' }, linhas, ...marcas);
  const revela = h('div', { class: 'pontos-revela', hidden: true });
  function ligar(a, b) { linhas.append(s('line', { x1: pontos[a].x, y1: pontos[a].y, x2: pontos[b].x, y2: pontos[b].y })); }
  function avancarAuto() {
    while (pos < passos.length && passos[pos].auto) {
      const ant = passos[pos - 1];
      if (!passos[pos].novo && ant) ligar(ant.k, passos[pos].k);
      pos++;
    }
    marcas.forEach(m => m.classList.remove('proximo'));
    if (pos < passos.length && (apoio() || erros > 0 || pos === 0)) marcas[passos[pos].k].classList.add('proximo');
  }
  function clicar(k) {
    if (c.resolvido || pos >= passos.length) return;
    const passo = passos[pos];
    if (k !== passo.k) {
      if (marcas[k].classList.contains('feito')) return; // tocar num ponto já ligado não conta
      erros++; som('errado'); poseMascote('duvida', true);
      c.fb.className = 'feedback bad'; c.fb.textContent = t('pontos_segue', { n: pontos[passo.k].n });
      marcas[k].classList.remove('abana'); void marcas[k].getBBox(); marcas[k].classList.add('abana');
      marcas[passo.k].classList.add('proximo');
      return;
    }
    c.fb.className = 'feedback'; c.fb.textContent = '';
    const ant = passos[pos - 1];
    if (!passo.novo && ant) ligar(ant.k, k);
    marcas[k].classList.add('feito'); som('clique');
    pos++; avancarAuto();
    if (pos >= passos.length) terminar();
  }
  function suave() {
    // um caminho curvo por cada traço (passa pelos pontos médios), como uma letra escrita
    tracos.forEach(tr => {
      const q = tr.map(([x, y]) => ({ x, y }));
      if (q.length < 3) { linhas.append(s('path', { class: 'suave', d: `M${q[0].x} ${q[0].y}L${q[1].x} ${q[1].y}` })); return; }
      let d = `M${q[0].x} ${q[0].y}`;
      for (let i = 1; i < q.length - 1; i++) d += ` Q${q[i].x} ${q[i].y} ${(q[i].x + q[i + 1].x) / 2} ${(q[i].y + q[i + 1].y) / 2}`;
      d += ` L${q[q.length - 1].x} ${q[q.length - 1].y}`;
      linhas.append(s('path', { class: 'suave', d }));
    });
  }
  function terminar() {
    svg.classList.add('completo'); suave();
    const letra = it.letra || it.forma || '';
    revela.hidden = false;
    encher(revela,
      letra ? h('div', { class: 'pontos-letra' }, h('b', null, letra), h('span', { class: 'manuscrita' }, letra)) : null,
      it.exemplos ? h('div', { class: 'pontos-exemplos' }, it.exemplos.map(x => ficha(x))) : null);
    c.erros = errosJogo(erros);
    c.acertou(null, letra ? t('pontos_descobre', { l: letra }) : '');
  }
  c.aoContinuar(proximo);
  encher(area, cabecalhoRonda(ronda, 'i_pontos', contador), (it.emoji || it.imagem || it.pergunta) ? blocoPergunta(it, it.pergunta || null, null) : null,
    h('div', { class: 'pontos' }, svg, revela), c.nos);
  avancarAuto();
}

/* ---------- apanhar o que cai ---------- */
function itemApanhar(ri, ronda, it, area, contador, proximo) {
  const meta = apoio() ? Math.min(it.meta || 8, 6) : (it.meta || 8);
  const vel = (apoio() ? 0.65 : 1) * (it.velocidade || 1);
  const c = criarItem(ri, it, 0, null);
  let apanhadas = 0, erradas = 0, cestoX = 50, a_jogar = false, ate = 600, fichas = [];
  const progresso = h('div', { class: 'apanhar-meta', 'aria-label': `${apanhadas} / ${meta}` }, [...Array(meta)].map(() => h('i')));
  const cesto = h('div', { class: 'apanhar-cesto' }, h('span', { class: 'cesto-emoji' }, '🧺'));
  const campo = h('div', { class: 'apanhar-campo' }, cesto);
  const alvos = h('div', { class: 'apanhar-alvos' }, h('span', { class: 'rotulo' }, '✅'), it.certas.map(x => ficha(x, 'boa')));
  const inicio = h('div', { class: 'apanhar-inicio' },
    h('div', { class: 'apanhar-alvos grande' }, h('span', { class: 'rotulo' }, '🧺 ✅'), it.certas.map(x => ficha(x, 'boa'))),
    h('div', { class: 'apanhar-alvos grande' }, h('span', { class: 'rotulo' }, '🚫'), baralhar(it.erradas).slice(0, 4).map(x => ficha(x, 'ma'))),
    h('button', { class: 'btn grande', type: 'button', onclick: comecar }, t('comecar')));
  campo.append(inicio);
  function moverPara(x) { cestoX = Math.max(6, Math.min(94, x)); cesto.style.left = cestoX + '%'; }
  campo.addEventListener('pointermove', ev => { const r = campo.getBoundingClientRect(); moverPara((ev.clientX - r.left) / r.width * 100); });
  campo.addEventListener('pointerdown', ev => { const r = campo.getBoundingClientRect(); moverPara((ev.clientX - r.left) / r.width * 100); });
  aoTeclado(campo, ev => {
    if (!a_jogar) return;
    if (ev.key === 'ArrowLeft') { ev.preventDefault(); moverPara(cestoX - 7); }
    if (ev.key === 'ArrowRight') { ev.preventDefault(); moverPara(cestoX + 7); }
  });
  function comecar() {
    inicio.remove(); a_jogar = true; campo.classList.add('a-jogar');
    animar(campo, passo);
  }
  function largar() {
    const certa = Math.random() < 0.5;
    const texto = sorteio(certa ? it.certas : it.erradas);
    const el = h('div', { class: 'cai' }, rico(texto));
    const x = 8 + Math.random() * 84;
    el.style.left = x + '%';
    campo.append(el);
    fichas.push({ el, x, y: -50, certa, v: (55 + Math.random() * 30 + apanhadas * 4) * vel });
  }
  function passo(dt) {
    if (!a_jogar) return false;
    ate -= dt;
    if (ate <= 0) { largar(); ate = (1250 - apanhadas * 35) / vel; }
    const H = campo.clientHeight, W = campo.clientWidth, cx = cestoX / 100 * W, larg = cesto.offsetWidth;
    const topoCesto = H - cesto.offsetHeight * 0.85;
    fichas = fichas.filter(f => {
      f.y += f.v * dt / 1000;
      f.el.style.transform = `translate(-50%, ${f.y}px)`;
      const fx = f.x / 100 * W, baixo = f.y + f.el.offsetHeight;
      if (baixo >= topoCesto && baixo <= H && Math.abs(fx - cx) < larg / 2 + f.el.offsetWidth / 4) { apanhou(f); return false; }
      if (f.y > H) { f.el.remove(); return false; }
      return true;
    });
    return a_jogar;
  }
  function apanhou(f) {
    f.el.remove();
    if (f.certa) {
      apanhadas++; som('certo');
      progresso.children[apanhadas - 1].classList.add('cheia');
      cesto.classList.remove('boa', 'ma'); void cesto.offsetWidth; cesto.classList.add('boa');
      c.fb.className = 'feedback ok'; c.fb.textContent = `${apanhadas} / ${meta}`;
      if (apanhadas >= meta) acabar();
    } else {
      erradas++; som('errado'); poseMascote('duvida', true);
      cesto.classList.remove('boa', 'ma'); void cesto.offsetWidth; cesto.classList.add('ma');
      c.fb.className = 'feedback bad'; c.fb.textContent = t('apanhar_errada');
    }
  }
  function acabar() {
    a_jogar = false; campo.classList.remove('a-jogar'); campo.classList.add('fim');
    fichas.forEach(f => f.el.remove()); fichas = [];
    festa(cesto, 16);
    c.erros = errosJogo(erradas);
    c.acertou(null, `${apanhadas} / ${meta}` + (erradas ? '' : ' ⭐'));
  }
  c.aoContinuar(proximo);
  encher(area, cabecalhoRonda(ronda, 'i_apanhar', contador),
    h('div', { class: 'apanhar' }, h('div', { class: 'apanhar-topo' }, alvos, progresso), campo), c.nos);
}

/* ---------- percurso (labirinto) ---------- */
function itemPercurso(ri, ronda, it, area, contador, proximo) {
  const C = apoio() ? 6 : (it.colunas || 7), L = apoio() ? 4 : (it.linhas || 5);
  const certas = it.certas.slice(0, apoio() ? 4 : 7), erradasTx = baralhar(it.erradas).slice(0, apoio() ? 3 : 8);
  const c = criarItem(ri, it, 0, null);
  const id = (x, y) => y * C + x, xy = k => [k % C, Math.floor(k / C)];
  const inicio = 0, saida = C * L - 1;
  // gera um mapa em que dá para apanhar tudo e chegar à saída sem pisar as erradas
  let mapa;
  for (let tent = 0; tent < 300 && !mapa; tent++) {
    const livres = baralhar([...Array(C * L).keys()].filter(k => k !== inicio && k !== saida && k !== 1 && k !== C));
    const nObs = tent < 200 ? Math.round(C * L * 0.16) : Math.round(C * L * 0.08);
    const m = Array(C * L).fill(null);
    let p = 0;
    certas.forEach(tx => { m[livres[p++]] = { tipo: 'certa', tx }; });
    erradasTx.forEach(tx => { m[livres[p++]] = { tipo: 'errada', tx }; });
    for (let o = 0; o < nObs; o++) m[livres[p++]] = { tipo: 'obst', tx: sorteio(['🌳', '🪨', '🌲', '🌳']) };
    const visto = new Set([inicio]), fila = [inicio];
    while (fila.length) {
      const [x, y] = xy(fila.shift());
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
        const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= C || ny >= L) return;
        const k = id(nx, ny); if (visto.has(k) || (m[k] && m[k].tipo !== 'certa')) return;
        visto.add(k); fila.push(k);
      });
    }
    if (visto.has(saida) && m.every((v, k) => !v || v.tipo !== 'certa' || visto.has(k))) mapa = m;
  }
  let pos = inicio, faltam = certas.length, erros = 0, feito = false;
  const saco = h('div', { class: 'percurso-saco' }, h('span', { class: 'rotulo' }, '🎒'), certas.map(() => h('i', { class: 'vazio' })));
  const tab = h('div', { class: 'percurso-tab', style: `grid-template-columns:repeat(${C},1fr)` });
  const casas = mapa.map((v, k) => {
    const b = h('button', { class: 'pc-casa' + (v ? ' ' + v.tipo : ''), type: 'button', tabindex: '-1' },
      v && v.tipo === 'obst' ? h('span', { class: 'obst' }, v.tx) : v ? ficha(v.tx, semMarca(v.tx).length >= 6 ? 'muito-longa' : semMarca(v.tx).length >= 5 ? 'longa' : '') : k === saida ? h('span', { class: 'saida' }, '🌰') : null);
    b.onclick = () => { const [x, y] = xy(pos), [a, bq] = xy(k); if (Math.abs(x - a) + Math.abs(y - bq) === 1) mover(a - x, bq - y); };
    return b;
  });
  tab.append(...casas);
  const ticlas = h('div', { class: 'pc-ticlas' }, h('img', { src: MASCOTE.ola, alt: 'Ticl@s' }));
  ticlas.style.width = 100 / C + '%'; ticlas.style.height = 100 / L + '%';
  tab.append(ticlas);
  casas[saida].classList.add('fechada');
  function colocar() {
    const [x, y] = xy(pos);
    ticlas.style.left = (x + 0.5) / C * 100 + '%'; ticlas.style.top = (y + 0.5) / L * 100 + '%';
    casas.forEach((b, k) => { const [a, bq] = xy(k); b.classList.toggle('vizinha', !feito && Math.abs(x - a) + Math.abs(y - bq) === 1); });
  }
  function bate(classe) { ticlas.classList.remove('bate', 'mau'); void ticlas.offsetWidth; ticlas.classList.add(classe); }
  function mover(dx, dy) {
    if (feito || c.resolvido) return;
    const [x, y] = xy(pos), nx = x + dx, ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= C || ny >= L) { bate('bate'); return; }
    const k = id(nx, ny), v = mapa[k];
    if (v && v.tipo === 'obst') { bate('bate'); c.fb.className = 'feedback'; c.fb.textContent = t('percurso_bloqueado'); return; }
    if (v && v.tipo === 'errada') {
      erros++; som('errado'); poseMascote('duvida', true); bate('mau');
      casas[k].classList.remove('abana'); void casas[k].offsetWidth; casas[k].classList.add('abana');
      c.fb.className = 'feedback bad'; c.fb.textContent = t('percurso_errada');
      return;
    }
    if (k === saida && faltam > 0) {
      bate('bate'); c.fb.className = 'feedback bad'; c.fb.textContent = t('percurso_falta', { n: faltam });
      saco.classList.remove('abana'); void saco.offsetWidth; saco.classList.add('abana');
      return;
    }
    pos = k; colocar(); som('clique');
    c.fb.className = 'feedback'; c.fb.textContent = '';
    if (v && v.tipo === 'certa') {
      mapa[k] = null; faltam--;
      const f = casas[k].querySelector('.ficha'); if (f) f.remove();
      casas[k].classList.remove('certa'); casas[k].classList.add('apanhada');
      const vazio = saco.querySelector('i.vazio'); if (vazio) { vazio.classList.remove('vazio'); vazio.replaceChildren(rico(v.tx)); }
      som('certo');
      if (!faltam) { casas[saida].classList.remove('fechada'); casas[saida].classList.add('aberta'); c.fb.className = 'feedback ok'; c.fb.textContent = t('percurso_saida'); }
    }
    if (k === saida) {
      feito = true; colocar(); festa(ticlas, 18);
      c.erros = errosJogo(erros);
      c.acertou(null, '');
    }
  }
  const seta = (rot, dx, dy, cl) => h('button', { class: 'btn seta ' + cl, type: 'button', 'aria-label': rot, onclick: () => mover(dx, dy) }, rot);
  const comando = h('div', { class: 'percurso-setas' }, seta('⬆', 0, -1, 'cima'), seta('⬅', -1, 0, 'esq'), seta('⬇', 0, 1, 'baixo'), seta('➡', 1, 0, 'dir'));
  aoTeclado(tab, ev => {
    const d = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] }[ev.key];
    if (d && !c.resolvido) { ev.preventDefault(); mover(...d); }
  });
  c.aoContinuar(proximo);
  encher(area, cabecalhoRonda(ronda, 'i_percurso', contador),
    h('div', { class: 'percurso-alvo' }, h('span', { class: 'rotulo' }, '🎒 ✅'), it.alvo ? h('b', null, rico(it.alvo, false)) : certas.map(x => ficha(x, 'boa'))),
    h('div', { class: 'percurso' }, h('div', { class: 'percurso-mapa', style: `aspect-ratio:${C}/${L}` }, tab), h('div', { class: 'percurso-lado' }, saco, comando)),
    c.nos);
  colocar();
}
Object.assign(EXTRA_ITENS, { puzzle: itemPuzzle, pontos: itemPontos, apanhar: itemApanhar, percurso: itemPercurso });


/* ==========================================================
   Caderno do Ticl@s (V3.6): páginas de consulta com a matéria da aula.
   "consulta": [{ "id", "titulo", "emoji", "paragrafos": [...], "lista": [...],
                  "tabela": [[cabeçalho...], [linha...]], "imagem", "alt" }]
   Numa ronda, "consulta": "id" mostra o botão «📖 Rever» que abre essa página.
   Texto entre **…** aparece a negrito. Sem som: tudo se lê no ecrã.
   ========================================================== */
const temConsulta = () => Array.isArray(AULA && AULA.consulta) && AULA.consulta.length > 0;
function textoRico(s) {
  return String(s).split(/\*\*(.+?)\*\*/g).map((p, i) => i % 2 ? h('b', null, p) : p);
}
function botaoRever(ronda) {
  if (!temConsulta() || !ronda || !ronda.consulta) return null;
  const k = AULA.consulta.findIndex(p => p.id === ronda.consulta);
  if (k < 0) return null;
  return h('button', { class: 'rever', title: t('rever'), onclick: () => abrirConsulta(k) }, '📖 ', t('rever'));
}
function abrirConsulta(inicio) {
  if (!temConsulta()) return;
  calar();
  const paginas = AULA.consulta;
  const corpo = h('div', { class: 'consulta' });
  const j = janela(corpo);
  j.querySelector('.cartao').classList.add('larga');
  const fechar = () => { calar(); j.remove(); document.removeEventListener('keydown', teclas); };
  j.onclick = e => { if (e.target === j) fechar(); };
  let atual = Number.isInteger(inicio) ? inicio : -1;
  function teclas(e) {
    if (e.key === 'Escape') fechar();
    else if (atual >= 0 && e.key === 'ArrowRight' && atual < paginas.length - 1) { atual++; mostrar(); }
    else if (atual >= 0 && e.key === 'ArrowLeft' && atual > 0) { atual--; mostrar(); }
  }
  document.addEventListener('keydown', teclas);
  const topo = () => h('div', { class: 'consulta-topo' },
    h('img', { class: 'consulta-mascote', src: MASCOTE.ideia || MASCOTE.aponta || '', alt: '' }),
    h('div', null, h('h2', { class: 'titulo-ronda' }, '📖 ' + t('consulta')), h('p', { class: 'instrucao' }, AULA.titulo)),
    h('button', { class: 'icon consulta-fechar', 'aria-label': t('fechar'), title: t('fechar'), onclick: fechar }, '✖'));
  function mostrar() {
    calar();
    if (atual < 0) {
      encher(corpo, topo(), h('p', { class: 'consulta-intro' }, t('consultaSub')),
        h('div', { class: 'consulta-indice' }, paginas.map((p, k) =>
          h('button', { class: 'consulta-cartao', onclick: () => { atual = k; mostrar(); } },
            h('span', { class: 'consulta-num' }, k + 1),
            h('span', { class: 'consulta-emoji', 'aria-hidden': 'true' }, p.emoji || '📄'),
            h('strong', null, p.titulo)))),
        h('div', { class: 'linha', style: 'margin-top:12px' }, h('button', { class: 'btn', onclick: fechar }, '✔ ' + t('fechar'))));
      corpo.querySelector('.consulta-cartao')?.focus({ preventScroll: true });
      return;
    }
    const p = paginas[atual];
    const lerPagina = () => lerSequencia([p.titulo, ...(p.paragrafos || []), ...(p.lista || [])].map(s => String(s).replace(/\*\*/g, '')));
    const tabela = Array.isArray(p.tabela) && p.tabela.length ? h('div', { class: 'consulta-tabela-wrap' }, h('table', { class: 'consulta-tabela' },
      h('thead', null, h('tr', null, p.tabela[0].map(c => h('th', null, textoRico(c))))),
      h('tbody', null, p.tabela.slice(1).map(l => h('tr', null, l.map(c => h('td', null, textoRico(c)))))))) : null;
    encher(corpo, topo(),
      h('article', { class: 'consulta-pagina' },
        h('div', { class: 'consulta-cabeca' },
          h('span', { class: 'consulta-emoji grande', 'aria-hidden': 'true' }, p.emoji || '📄'),
          h('div', null, h('small', null, t('pagina', { a: atual + 1, b: paginas.length })), h('h3', null, p.titulo)),
          somLigado() ? h('button', { class: 'ouvir', 'aria-label': t('ouvir'), title: t('ouvir'), onclick: lerPagina }, '🔊') : null),
        p.imagem ? h('img', { class: 'consulta-img', src: p.imagem, alt: p.alt || '' }) : null,
        ...(p.paragrafos || []).map(s => h('p', null, textoRico(s))),
        Array.isArray(p.lista) && p.lista.length ? h('ul', null, p.lista.map(s => h('li', null, textoRico(s)))) : null,
        tabela,
        p.lembra ? h('div', { class: 'consulta-lembra' }, h('span', { 'aria-hidden': 'true' }, '💡 '), textoRico(p.lembra)) : null),
      h('div', { class: 'nav consulta-nav' },
        h('button', { class: 'btn leve', disabled: atual === 0 || null, onclick: () => { atual--; mostrar(); } }, t('anterior')),
        h('button', { class: 'btn leve', onclick: () => { atual = -1; mostrar(); } }, '☰ ' + t('indice')),
        atual < paginas.length - 1
          ? h('button', { class: 'btn azul', onclick: () => { atual++; mostrar(); } }, t('proximo'))
          : h('button', { class: 'btn', onclick: fechar }, '✔ ' + t('fechar'))));
    corpo.scrollTop = 0; j.querySelector('.cartao').scrollTop = 0;
  }
  mostrar();
}
function validarConsulta(a) {
  const e = [], txt = v => typeof v === 'string' && v.trim() !== '';
  if (a.consulta === undefined) {
    a.rondas.forEach((r, ri) => { if (r && r.consulta) e.push(`Ronda ${ri + 1}: tem «consulta» mas a aula não tem páginas de «consulta».`); });
    return e;
  }
  if (!Array.isArray(a.consulta) || !a.consulta.length) return ['«consulta» tem de ser uma lista de páginas.'];
  const ids = new Set();
  a.consulta.forEach((p, k) => {
    const w = `Página de consulta ${k + 1}`;
    if (!p || typeof p !== 'object' || Array.isArray(p)) { e.push(`${w}: tem de ser um objeto { ... }.`); return; }
    if (!txt(p.titulo)) e.push(`${w}: falta o «titulo».`);
    if (p.id !== undefined) { if (!txt(p.id)) e.push(`${w}: «id» tem de ser texto.`); else if (ids.has(p.id)) e.push(`${w}: o «id» «${p.id}» está repetido.`); else ids.add(p.id); }
    const temP = Array.isArray(p.paragrafos) && p.paragrafos.length, temL = Array.isArray(p.lista) && p.lista.length, temT = Array.isArray(p.tabela) && p.tabela.length;
    if (!temP && !temL && !temT) e.push(`${w}: precisa de «paragrafos», «lista» ou «tabela».`);
    if (p.paragrafos !== undefined && !(Array.isArray(p.paragrafos) && p.paragrafos.every(txt))) e.push(`${w}: «paragrafos» tem de ser uma lista de textos.`);
    if (p.lista !== undefined && !(Array.isArray(p.lista) && p.lista.every(txt))) e.push(`${w}: «lista» tem de ser uma lista de textos.`);
    if (p.tabela !== undefined && !(Array.isArray(p.tabela) && p.tabela.length >= 2 && p.tabela.every(l => Array.isArray(l) && l.length === p.tabela[0].length && l.every(c => txt(c) || typeof c === 'number'))))
      e.push(`${w}: «tabela» tem de ter um cabeçalho e linhas com o mesmo número de colunas.`);
  });
  a.rondas.forEach((r, ri) => {
    if (r && r.consulta !== undefined && !ids.has(r.consulta)) e.push(`Ronda ${ri + 1}: «consulta» «${r.consulta}» não corresponde a nenhuma página (usa o «id» da página).`);
  });
  return e;
}

/* ==========================================================
   Animações (V3.7): «filmes» sem som, com legendas, antes do jogo e de cada missão.
   "abertura": [cenas]  → antes do mapa de missões
   Numa ronda, "animacao": [cenas] → antes da missão. Obrigatórias: o botão para
   começar só aparece no fim (a professora pode permitir saltar no painel ⚙️).
   Cena: { "texto" (legenda, obrigatório), "titulo", "emoji" (um ou vários, separados
   por espaços), "imagem" + "alt" + "efeito" ("zoom" ou "revelar"), "itens" (aparecem
   um a um), "friso" ([[data, texto], ...]), "pose" do Ticl@s, "duracao" (segundos) }
   ========================================================== */
const POSES = ['ola', 'aponta', 'duvida', 'ideia', 'portatil', 'trofeu'];
const temCenas = c => Array.isArray(c) && c.length > 0;
const semMovimentoFilme = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
function duracaoCena(c) {
  if (typeof c.duracao === 'number' && c.duracao > 0) return c.duracao * 1000;
  const palavras = s => String(s || '').replace(/\*\*/g, '').split(/\s+/).filter(Boolean).length;
  const n = palavras(c.texto) + palavras(c.titulo) + (c.itens || []).reduce((s, x) => s + palavras(x), 0) + (c.friso || []).reduce((s, x) => s + palavras(x[1]) + 1, 0);
  const porPalavra = { 1: 0.9, 2: 0.75, 3: 0.6, 4: 0.5 }[AULA.ano] || 0.6;
  let s = 2.5 + n * porPalavra + ((c.itens || []).length + (c.friso || []).length) * 0.6;
  if (apoio()) s *= 1.3;
  if (somLigado()) s = Math.max(s, palavras(c.texto) * 0.45 + 2);
  return Math.round(Math.min(30, Math.max(5, s)) * 1000);
}
// Leitor: devolve o elemento; opcoes = { titulo, botao, aoTerminar, aoContinuar, livre }
function filme(cenas, opcoes) {
  let k = 0, decorrido = 0, pausa = false, fim = false, intervalo = null;
  const total = cenas.map(duracaoCena);
  const barras = h('div', { class: 'filme-barras', 'aria-hidden': 'true' }, cenas.map(() => h('span', null, h('i'))));
  const palco = h('div', { class: 'filme-palco' });
  const legenda = h('div', { class: 'filme-legenda', 'aria-live': 'polite' });
  const ticlas = h('img', { class: 'filme-ticlas', alt: '' });
  const ecra = h('div', { class: 'filme-ecra' + (semMovimentoFilme() ? ' sem-movimento' : '') }, barras,
    h('div', { class: 'filme-rotulo' }, '🎬 ', opcoes.titulo || ''), palco, ticlas, legenda);
  const btAnt = h('button', { class: 'btn leve', 'aria-label': t('filmeAnterior'), title: t('filmeAnterior'), onclick: () => irPara(k - 1) }, '⏮️');
  const btPausa = h('button', { class: 'btn leve filme-pausa', onclick: () => fim ? recomecar() : alternar() });
  const contador = h('span', { class: 'filme-contador' });
  const btSaltar = (!opcoes.livre && prefs.saltarFilmes) ? h('button', { class: 'btn leve', onclick: () => terminar(true) }, '⏭️ ' + t('filmeSaltar')) : null;
  const btSeguir = h('button', { class: 'btn', disabled: true, onclick: () => { parar(); calar(); opcoes.aoContinuar && opcoes.aoContinuar(); } }, opcoes.botao || '▶');
  const aviso = h('div', { class: 'filme-aviso' }, '⏳ ', t('filmeEspera'));
  const raiz = h('div', { class: 'filme' }, ecra,
    h('div', { class: 'filme-controlos' }, btAnt, btPausa, contador, h('span', { class: 'filme-espaco' }), btSaltar, btSeguir), aviso);
  function desenhar() {
    calar();
    const c = cenas[k];
    decorrido = 0;
    contador.textContent = t('filmeCena', { a: k + 1, b: cenas.length });
    btAnt.disabled = k === 0;
    [...barras.children].forEach((b, i) => { b.firstChild.style.width = i < k ? '100%' : '0%'; });
    ticlas.src = MASCOTE[POSES.includes(c.pose) ? c.pose : (k === 0 ? 'ola' : k === cenas.length - 1 ? 'ideia' : 'aponta')] || MASCOTE.ola;
    ticlas.classList.remove('entra'); void ticlas.offsetWidth; ticlas.classList.add('entra');
    const dur = total[k] / 1000;
    const visual = [];
    if (c.titulo) visual.push(h('h3', { class: 'filme-titulo' }, textoRico(c.titulo)));
    if (c.emoji) {
      const emojis = String(c.emoji).trim().split(/\s+/);
      visual.push(h('div', { class: 'filme-emojis' + (emojis.length > 3 ? ' muitos' : '') }, emojis.map((e, i) => h('span', { style: `animation-delay:${(0.25 + i * Math.min(0.7, dur * 0.4 / emojis.length)).toFixed(2)}s` }, e))));
    }
    if (c.imagem) visual.push(h('div', { class: 'filme-img ' + (c.efeito === 'revelar' ? 'revelar' : 'zoom'), style: `--dur:${dur}s` }, h('img', { src: c.imagem, alt: c.alt || '' })));
    if (Array.isArray(c.itens) && c.itens.length) {
      const passo = Math.min(1.1, (dur * 0.6) / c.itens.length);
      visual.push(h('div', { class: 'filme-itens' + (c.itens.length > 6 ? ' muitos' : '') }, c.itens.map((x, i) => h('span', { style: `animation-delay:${(0.4 + i * passo).toFixed(2)}s` }, textoRico(x)))));
    }
    if (Array.isArray(c.friso) && c.friso.length) {
      const passo = Math.min(1.2, (dur * 0.6) / c.friso.length);
      visual.push(h('div', { class: 'filme-friso', style: `--n:${c.friso.length};--dur:${(passo * c.friso.length).toFixed(2)}s` }, h('i', { class: 'linha-tempo' }),
        c.friso.map(([d, x], i) => h('div', { class: 'marco', style: `animation-delay:${(0.4 + i * passo).toFixed(2)}s` }, h('b', null, d), h('span', { class: 'ponto' }), h('small', null, textoRico(x))))));
    }
    encher(palco, visual);
    palco.classList.toggle('so-texto', !visual.length);
    encher(legenda, h('span', { class: 'filme-frase' }, textoRico(c.texto)));
    if (somLigado()) falar(String(c.texto).replace(/\*\*/g, ''));
  }
  function passo() {
    if (pausa || fim || document.hidden || !raiz.isConnected) { if (!raiz.isConnected) parar(); return; }
    decorrido += 100;
    const b = barras.children[k]; if (b) b.firstChild.style.width = Math.min(100, decorrido / total[k] * 100) + '%';
    if (decorrido >= total[k]) { if (k < cenas.length - 1) { k++; desenhar(); } else terminar(false); }
  }
  function alternar() { pausa = !pausa; ecra.classList.toggle('pausado', pausa); btPausa.textContent = pausa ? '▶ ' + t('filmeContinuar') : '⏸️ ' + t('filmePausa'); if (pausa) calar(); }
  function irPara(n) { if (n < 0 || n >= cenas.length) return; if (fim) { fim = false; aviso.hidden = false; btPausa.textContent = '⏸️ ' + t('filmePausa'); } k = n; pausa = false; ecra.classList.remove('pausado', 'terminado'); btPausa.textContent = '⏸️ ' + t('filmePausa'); desenhar(); }
  function terminar(saltou) {
    fim = true; pausa = false; ecra.classList.remove('pausado'); ecra.classList.add('terminado');
    [...barras.children].forEach(b => { b.firstChild.style.width = '100%'; });
    btSeguir.disabled = false; aviso.hidden = true;
    btPausa.textContent = '🔁 ' + t('filmeVerOutra');
    if (!saltou) { ticlas.src = MASCOTE.trofeu || ticlas.src; festa(btSeguir, 14); }
    opcoes.aoTerminar && opcoes.aoTerminar();
    btSeguir.focus({ preventScroll: true });
  }
  function recomecar() { irPara(0); }
  function parar() { clearInterval(intervalo); intervalo = null; }
  btPausa.textContent = '⏸️ ' + t('filmePausa');
  desenhar();
  intervalo = setInterval(passo, 100);
  if (opcoes.livre) { btSeguir.disabled = false; aviso.hidden = true; }
  return raiz;
}
function ecraAbertura() {
  limparTimers(); calar();
  const seguir = () => { est.vistas.abertura = true; guardarProgresso(); ecraMapa(); };
  const ver = livre => $('#app').replaceChildren(h('div', null,
    h('div', { class: 'etiqueta' }, h('span', null, '🎬 ' + t('filmeAbertura')), h('span', { class: 'fase' }, AULA.titulo)),
    filme(AULA.abertura, { titulo: AULA.titulo, botao: '▶ ' + t('filmeMissoes'), livre, aoTerminar: () => { est.vistas.abertura = true; guardarProgresso(); }, aoContinuar: seguir })));
  if (filmesOpcionais()) $('#app').replaceChildren(h('div', null, escolhaFilme(AULA.titulo, () => ver(true), seguir, t('filmeMissoes'))));
  else ver(false);
}
// V3.10: "animacoes": "opcionais" → o aluno escolhe se vê a animação (e pode avançar quando quiser)
const filmesOpcionais = () => AULA && AULA.animacoes === 'opcionais';
function escolhaFilme(titulo, aoVer, aoSaltar, rotuloSaltar) {
  return h('div', { class: 'filme-escolha' },
    h('img', { class: 'filme-escolha-mascote', src: MASCOTE.duvida || MASCOTE.aponta || '', alt: '' }),
    h('div', null,
      h('small', null, '🎬 ' + titulo),
      h('h3', null, t('filmeEscolha')),
      h('div', { class: 'linha' },
        h('button', { class: 'btn azul', onclick: aoVer }, '🎬 ' + t('filmeSim')),
        h('button', { class: 'btn', onclick: aoSaltar }, '▶ ' + rotuloSaltar))));
}
// ver outra vez, numa janela (sem obrigação)
function verFilme(cenas, titulo) {
  const j = janela();
  j.querySelector('.cartao').classList.add('larga', 'cartao-filme');
  const fechar = () => { calar(); j.remove(); };
  j.onclick = e => { if (e.target === j) fechar(); };
  encher(j.querySelector('.cartao'), filme(cenas, { titulo, botao: '✔ ' + t('fechar'), livre: true, aoContinuar: fechar }));
}
function botaoAnimacao(ronda) {
  if (!ronda || !temCenas(ronda.animacao)) return null;
  return h('button', { class: 'rever', title: t('filmeVer'), onclick: () => verFilme(ronda.animacao, ronda.titulo) }, '🎬 ', t('filmeVer'));
}
function validarFilmes(a) {
  const e = [], txt = v => typeof v === 'string' && v.trim() !== '';
  const cenas = (lista, onde) => {
    if (lista === undefined) return;
    if (!Array.isArray(lista) || !lista.length) { e.push(`${onde}: tem de ser uma lista de cenas.`); return; }
    lista.forEach((c, k) => {
      const w = `${onde}, cena ${k + 1}`;
      if (!c || typeof c !== 'object' || Array.isArray(c)) { e.push(`${w}: tem de ser um objeto { ... }.`); return; }
      if (!txt(c.texto)) e.push(`${w}: falta o «texto» (a legenda).`);
      if (c.itens !== undefined && !(Array.isArray(c.itens) && c.itens.every(txt))) e.push(`${w}: «itens» tem de ser uma lista de textos.`);
      if (c.friso !== undefined && !(Array.isArray(c.friso) && c.friso.every(x => Array.isArray(x) && x.length === 2 && x.every(y => txt(y) || typeof y === 'number')))) e.push(`${w}: «friso» tem de ser uma lista de pares [data, texto].`);
      if (c.pose !== undefined && !POSES.includes(c.pose)) e.push(`${w}: «pose» tem de ser uma destas: ${POSES.join(', ')}.`);
      if (c.efeito !== undefined && !['zoom', 'revelar'].includes(c.efeito)) e.push(`${w}: «efeito» tem de ser «zoom» ou «revelar».`);
      if (c.duracao !== undefined && !(typeof c.duracao === 'number' && c.duracao >= 2 && c.duracao <= 60)) e.push(`${w}: «duracao» tem de ser um número de 2 a 60 (segundos).`);
    });
  };
  cenas(a.abertura, 'Abertura');
  a.rondas.forEach((r, ri) => { if (r) cenas(r.animacao, `Ronda ${ri + 1}${r.titulo ? ' («' + r.titulo + '»)' : ''}, animação`); });
  return e;
}

/* ==========================================================
   Algoritmo da adição com MAB (V3.9): "tipo": "algoritmo".
   Item: { "compras": [["🎒", "mochila", 47], ["📕", "livro", 28]], "pergunta": "…" }
         ou { "parcelas": [47, 28] } (2 ou 3 parcelas; soma até 999).
   Opcional: "unidade" (por omissão "€" quando há compras), "dica", "explicacao".
   O aluno trabalha coluna a coluna, das unidades para as centenas:
   junta as peças na linha «Tudo junto», conta-as, faz as trocas
   (10 cubos → 1 barra, 10 barras → 1 placa) e escreve o algarismo na conta em pé.
   O que «vai» aparece por cima da coluna seguinte, ligado à peça trocada.
   ========================================================== */
TIPOS.push('algoritmo');
SEGUNDOS.algoritmo = 150;
EXTRA_ICONES.algoritmo = '🧾';
EXTRA_ITENS.algoritmo = itemAlgoritmo;

const ALG_VAL = { u: 1, d: 10, c: 100 };
const ALG_SUP = { u: 'd', d: 'c' };
const ALG_COR = { c: '#E8834A', d: '#5BA3D0', u: '#5aa748' };

function parcelasAlg(it) {
  if (Array.isArray(it.compras)) return it.compras.map(c => (Array.isArray(c) ? c[2] : undefined));
  return Array.isArray(it.parcelas) ? it.parcelas : [];
}
function validarAlgoritmo(a) {
  const e = [];
  a.rondas.forEach((r, ri) => {
    if (!r || r.tipo !== 'algoritmo' || !Array.isArray(r.itens)) return;
    const onde = `Ronda ${ri + 1}${r.titulo ? ' («' + r.titulo + '»)' : ''}`;
    r.itens.forEach((it, ii) => {
      const w = `${onde}, item ${ii + 1}`;
      if (!it || typeof it !== 'object' || Array.isArray(it)) { e.push(`${w}: tem de ser um objeto { ... }.`); return; }
      if (it.compras !== undefined && (!Array.isArray(it.compras) || !it.compras.every(c => Array.isArray(c) && c.length === 3 && temTexto(c[1])))) { e.push(`${w}: cada compra tem de ser ["emoji", "nome", preço].`); return; }
      const p = parcelasAlg(it);
      if (p.length < 2 || p.length > 3 || !p.every(x => inteiro(x) && x >= 1 && x <= 999)) e.push(`${w}: indica 2 ou 3 «compras» (ou «parcelas») com números inteiros de 1 a 999.`);
      else if (p.reduce((s, x) => s + x, 0) > 999) e.push(`${w}: a soma tem de ser no máximo 999 (o MAB só tem centenas, dezenas e unidades).`);
    });
  });
  return e;
}

/* peças pequenas, à mesma escala: cubo 1×1, barra deitada 10×1, placa 10×10 */
function svgBlocoAlg(k) {
  const [cols, rows] = k === 'c' ? [10, 10] : k === 'd' ? [10, 1] : [1, 1];
  const cel = 10, d = 3, cor = CORES_MAB[k], W = cols * cel + d, H = rows * cel + d, f = 0.062;
  let lin = '';
  for (let i = 1; i < cols; i++) lin += `<line x1="${i * cel}" y1="${d}" x2="${i * cel}" y2="${H}"/>`;
  for (let j = 1; j < rows; j++) lin += `<line x1="0" y1="${d + j * cel}" x2="${cols * cel}" y2="${d + j * cel}"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" style="width:${(W * f).toFixed(3)}rem;height:${(H * f).toFixed(3)}rem" aria-hidden="true" focusable="false">` +
    `<polygon points="0,${d} ${d},0 ${W},0 ${cols * cel},${d}" fill="${cor.t}" stroke="${cor.l}" stroke-width=".7"/>` +
    `<polygon points="${cols * cel},${d} ${W},0 ${W},${H - d} ${cols * cel},${H}" fill="${cor.s}" stroke="${cor.l}" stroke-width=".7"/>` +
    `<rect x="0" y="${d}" width="${cols * cel}" height="${rows * cel}" fill="${cor.f}" stroke="${cor.l}" stroke-width="1"/>` +
    `<g stroke="${cor.l}" stroke-width=".6" opacity=".75">${lin}</g></svg>`;
}
function pecaAlg(k, classe) {
  const p = h('span', { class: 'alg-peca' + (classe ? ' ' + classe : '') });
  p.innerHTML = svgBlocoAlg(k);
  return p;
}
const digitoAlg = (n, k) => Math.floor(n / ALG_VAL[k]) % 10;

function itemAlgoritmo(ri, ronda, it, area, contador, proximo) {
  const parc = parcelasAlg(it), soma = parc.reduce((s, x) => s + x, 0);
  const compras = Array.isArray(it.compras) ? it.compras : null;
  const unid = it.unidade !== undefined ? String(it.unidade) : compras ? '€' : '';
  const comU = n => n + (unid ? ' ' + unid : '');
  const cols = soma >= 100 ? ['c', 'd', 'u'] : soma >= 10 ? ['d', 'u'] : ['u'];
  const ordem = cols.slice().reverse();                     // u → d → c
  const nomes = parc.map((p, i) => (compras ? compras[i][1] : (i + 1) + '.ª'));
  const tot = { c: 0, d: 0, u: 0 }, vai = { c: 0, d: 0, u: 0 }, vem = { c: 0, d: 0, u: 0 }, junto = {};
  let passo = 0, fase = 'juntar', erros = 0, tent = 0, ocupado = false, feito = false;
  const limite = apoio() ? 3 : 2;

  /* ---------- talão (lista de compras) ---------- */
  const totalTalao = h('span', { class: 'p' }, '? ' + unid);
  const talao = compras ? h('div', { class: 'talao', role: 'group', 'aria-label': t('alg_lista') },
    h('h3', null, '🧾 ' + t('alg_lista')),
    compras.map(c => h('div', { class: 'talao-linha' }, h('span', { class: 'e', 'aria-hidden': 'true' }, c[0]), h('span', { class: 'n' }, c[1]), h('span', { class: 'p' }, comU(c[2])))),
    h('div', { class: 'talao-linha talao-total' }, h('span', { class: 'n' }, t('alg_total')), totalTalao)) : null;

  /* ---------- conta em pé ---------- */
  const conta = h('div', { class: 'conta', style: `grid-template-columns:auto repeat(${cols.length},auto)`, role: 'group', 'aria-label': t('alg_conta') });
  const celConta = { c: [], d: [], u: [] }, vaiEl = {}, res = {};
  conta.append(h('span'));
  cols.forEach(k => { const c = h('span', { class: 'cab', style: 'background:' + ALG_COR[k], title: t('mab_' + k) }, k.toUpperCase()); celConta[k].push(c); conta.append(c); });
  conta.append(h('span'));
  cols.forEach(k => { vaiEl[k] = h('span', { class: 'cel vai', 'aria-label': t('alg_vaiLabel') }); celConta[k].push(vaiEl[k]); conta.append(vaiEl[k]); });
  parc.forEach((p, i) => {
    conta.append(h('span', { class: 'cel sinal' }, i === parc.length - 1 ? '+' : ''));
    cols.forEach(k => { const c = h('span', { class: 'cel' }, p >= ALG_VAL[k] ? digitoAlg(p, k) : ''); celConta[k].push(c); conta.append(c); });
  });
  conta.append(h('span', { class: 'linha-soma' }));
  conta.append(h('span'));
  cols.forEach(k => {
    res[k] = h('input', { class: 'num', inputmode: 'numeric', maxlength: '1', autocomplete: 'off', disabled: true, 'aria-label': t('alg_pEscrever', { col: t('mab_' + k).toLowerCase() }) });
    res[k].addEventListener('input', () => { res[k].value = res[k].value.replace(/\D/g, '').slice(-1); res[k].classList.remove('mal'); });
    res[k].addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); confirmarDigito(); } });
    const c = h('span', { class: 'cel' }, res[k]); celConta[k].push(c); conta.append(c);
  });

  /* ---------- tabuleiro do MAB: uma linha por compra + linha «Tudo junto» ---------- */
  const largura = { c: 'minmax(8.2rem,1.3fr)', d: 'minmax(7.4rem,1.1fr)', u: 'minmax(5.4rem,.9fr)' };
  const tab = h('div', { class: 'alg-mab', style: `grid-template-columns:minmax(4.6rem,auto) ${cols.map(k => largura[k]).join(' ')}` });
  const cab = {}, celP = parc.map(() => ({})), celT = {}, contT = {}, badgeT = {};
  tab.append(h('span'));
  cols.forEach(k => { cab[k] = h('div', { class: 'alg-cab', style: 'background:' + ALG_COR[k] }, h('strong', null, k.toUpperCase()), h('small', null, t('mab_' + k))); tab.append(cab[k]); });
  const contentor = (k, extra) => h('div', { class: 'alg-pecas alg-' + k + (extra ? ' ' + extra : '') });
  const desenharPecas = (cx, k, n, classe) => { for (let i = 0; i < n; i++) { if (k === 'u' && i && i % 10 === 0) cx.append(h('span', { class: 'quebra' })); cx.append(pecaAlg(k, classe)); } };
  parc.forEach((p, i) => {
    tab.append(h('div', { class: 'alg-rot' }, compras ? h('span', { class: 'e', 'aria-hidden': 'true' }, compras[i][0]) : null, h('b', null, comU(p))));
    cols.forEach(k => {
      const cx = contentor(k), n = p >= ALG_VAL[k] ? digitoAlg(p, k) : 0;
      desenharPecas(cx, k, n);
      celP[i][k] = h('div', { class: 'alg-cel' }, cx, apoio() && n ? h('span', { class: 'alg-n' }, n) : null);
      tab.append(celP[i][k]);
    });
  });
  tab.append(h('div', { class: 'alg-sep' }));
  tab.append(h('div', { class: 'alg-rot tudo' }, h('span', { class: 'e', 'aria-hidden': 'true' }, '🧺'), h('b', null, t('alg_juntos'))));
  cols.forEach(k => {
    contT[k] = contentor(k, 'junto');
    badgeT[k] = h('span', { class: 'alg-n', hidden: true }, '0');
    celT[k] = h('div', { class: 'alg-cel tot' }, contT[k], badgeT[k]);
    tab.append(celT[k]);
  });

  /* ---------- painel do passo ---------- */
  const etapa = h('div', { class: 'etapa' });
  const texto = h('p');
  const controlos = h('div', { class: 'linha' });
  const btPista = apoio() ? h('button', { class: 'btn leve', type: 'button', onclick: () => { dica.hidden = false; dica.textContent = '💡 ' + pistaAtual(); poseMascote('ideia'); } }, t('pista')) : null;
  const fb = h('div', { class: 'feedback', role: 'status', 'aria-live': 'polite' });
  const dica = h('div', { class: 'dica', hidden: true });
  const explica = it.explicacao ? h('div', { class: 'explica', hidden: true }, it.explicacao) : null;
  const btContinuar = h('button', { class: 'btn azul', hidden: true, onclick: () => { calar(); proximo(); } }, t('continuar'));
  const painelPasso = h('div', { class: 'alg-passo', role: 'group' }, etapa, texto, controlos, fb, dica, explica, btPista, btContinuar);

  const kAtual = () => ordem[passo];
  const temPecas = k => parc.some(p => p >= ALG_VAL[k] && digitoAlg(p, k) > 0);
  const contagem = k => tot[k];
  const dizer = (txt, classe) => { fb.className = 'feedback' + (classe ? ' ' + classe : ''); fb.textContent = txt; };
  const pistaAtual = () => ({ juntar: t('alg_pista_juntar'), contar: t('alg_pista_contar'), decidir: t('alg_pista_decidir'), escrever: t('alg_pista_escrever') }[fase] || '');
  function errar(msg) {
    erros++; tent++; som('errado'); poseMascote('duvida', true); dizerBalao(t('pensaOutra'));
    dizer(msg, 'bad');
    if (it.dica && erros === 1) { dica.hidden = false; dica.textContent = '💡 ' + it.dica; }
    ocupado = true; depois(650, () => { ocupado = false; });
  }
  function marcarColuna() {
    cols.forEach(k => {
      const on = !feito && k === kAtual();
      celConta[k].forEach(c => c.classList.toggle('ativa', on));
      cab[k].classList.toggle('ativa', on);
      celT[k].classList.toggle('ativa', on);
      parc.forEach((_, i) => celP[i][k].classList.toggle('ativa', on && fase === 'juntar'));
    });
  }
  function atualizarBadges() { cols.forEach(k => { badgeT[k].textContent = tot[k]; badgeT[k].hidden = !apoio() || !(junto[k] || vai[k]); }); }

  function mostrarPasso() {
    const k = kAtual();
    tent = 0; dica.hidden = true;
    etapa.textContent = t('alg_passo', { a: passo + 1, b: ordem.length }) + ' · ' + t('mab_' + k);
    etapa.style.color = ALG_COR[k];
    painelPasso.style.borderColor = ALG_COR[k];
    let fala = '';
    if (fase === 'juntar') {
      fala = t('alg_pJuntar_' + k);
      encher(controlos, h('button', { class: 'btn amarelo grande', type: 'button', onclick: juntar }, t('alg_juntar_' + k)));
    } else if (fase === 'contar') {
      fala = t('alg_pContar_' + k);
      const campo = campoNumero({ maxlength: '2' }), bt = h('button', { class: 'btn', type: 'button' }, t('confirmar'));
      const ok = () => {
        if (ocupado || !campo.value) { campo.focus(); return; }
        const v = Number(campo.value), n = contagem(k);
        if (v === n) { campo.disabled = bt.disabled = true; campo.classList.add('certo'); som('certo'); dizer(t('certo') + ' ' + n + ' ' + t('alg_pl_' + k) + '.', 'ok'); fase = 'decidir'; depois(500, mostrarPasso); return; }
        errar(t('alg_contaMal', { partes: partesColuna(k) }));
        campo.classList.add('mal'); campo.select();
        if (tent >= limite) { campo.value = n; campo.disabled = bt.disabled = true; dizer(t('alg_revela', { n }), 'bad'); fase = 'decidir'; depois(1400, mostrarPasso); }
      };
      bt.onclick = ok; campo.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); ok(); } });
      encher(controlos, h('span', { class: 'alg-pergunta-n' }, t('alg_pl_' + k) + ':'), campo, bt);
      if (prefs.modo === 'computador') depois(60, () => campo.focus({ preventScroll: true }));
    } else if (fase === 'decidir') {
      fala = t('alg_pDecidir', { n: contagem(k), pecas: t('alg_pl_' + k) });
      encher(controlos,
        ALG_SUP[k] ? h('button', { class: 'btn amarelo', type: 'button', onclick: trocar }, t('alg_trocar_' + k)) : null,
        h('button', { class: 'btn azul', type: 'button', onclick: irEscrever }, t('alg_escrever')));
    } else if (fase === 'escrever') {
      fala = t('alg_pEscrever', { col: t('mab_' + k).toLowerCase() });
      res[k].disabled = false; res[k].classList.add('atual');
      encher(controlos, h('span', { class: 'alg-seta' }, '⬅️ ' + t('alg_naConta')), h('button', { class: 'btn', type: 'button', onclick: confirmarDigito }, t('confirmar')));
      depois(60, () => res[k].focus({ preventScroll: true }));
    }
    texto.textContent = fala;
    marcarColuna(); atualizarBadges();
    if (somLigado()) lerSequencia([fala]);
  }
  function partesColuna(k) {
    const p = parc.map((x, i) => [x >= ALG_VAL[k] ? digitoAlg(x, k) : 0, nomes[i]]).filter(([n]) => n).map(([n, nome]) => `${n} (${nome})`);
    if (vai[k]) p.push(`${vai[k]} (${t('alg_troca')})`);
    return p.length ? p.join(' + ') : '0';
  }
  function juntar() {
    if (ocupado) return;
    const k = kAtual();
    ocupado = true; som('certo');
    let atraso = 0;
    parc.forEach((p, i) => {
      const pecas = celP[i][k].querySelectorAll('.alg-peca');
      pecas.forEach(pc => pc.classList.add('usada'));
      const n = p >= ALG_VAL[k] ? digitoAlg(p, k) : 0;
      for (let j = 0; j < n; j++) {
        depois(atraso, () => { if (k === 'u' && tot.u && tot.u % 10 === 0) contT.u.append(h('span', { class: 'quebra' })); contT[k].append(pecaAlg(k, 'entra')); tot[k]++; atualizarBadges(); });
        atraso += 70;
      }
    });
    junto[k] = true;
    depois(atraso + 250, () => { ocupado = false; fase = 'contar'; dizer(''); mostrarPasso(); });
  }
  function reorganizar(k) { // volta a desenhar a coluna «Tudo junto» (as peças da troca ficam com contorno amarelo)
    contT[k].replaceChildren();
    desenharPecas(contT[k], k, tot[k] - vem[k]);
    desenharPecas(contT[k], k, vem[k], 'vem');
  }
  function trocar() {
    if (ocupado) return;
    const k = kAtual(), sup = ALG_SUP[k];
    if (!sup || tot[k] < 10) { errar(t('alg_naoTroca')); return; }
    ocupado = true; som('certo');
    const pecas = [...contT[k].querySelectorAll('.alg-peca')].slice(0, 10);
    pecas.forEach(pc => pc.classList.add('sai'));
    depois(420, () => {
      tot[k] -= 10; vem[k] = Math.min(vem[k], tot[k]);
      reorganizar(k);
      tot[sup]++; vai[sup]++; vem[sup]++;
      contT[sup].append(pecaAlg(sup, 'vem entra'));
      vaiEl[sup].textContent = vai[sup];
      vaiEl[sup].classList.remove('pop'); void vaiEl[sup].offsetWidth; vaiEl[sup].classList.add('pop');
      atualizarBadges();
      poseMascote('ideia', true); dizerBalao(t('alg_vaiBalao', { n: vai[sup] }));
      dizer(t('alg_trocou_' + k, { n: tot[k] }), 'ok');
      texto.textContent = t('alg_pDecidir', { n: tot[k], pecas: t('alg_pl_' + k) });
      ocupado = false;
    });
  }
  function irEscrever() {
    if (ocupado) return;
    const k = kAtual();
    if (tot[k] >= 10) { errar(t('alg_aindaTroca')); return; }
    fase = 'escrever'; dizer(''); mostrarPasso();
  }
  function confirmarDigito() {
    const k = kAtual();
    if (fase !== 'escrever' || ocupado) return;
    const campo = res[k];
    if (!campo.value) { campo.focus(); return; }
    const v = Number(campo.value), n = tot[k];
    if (v === n) { campo.disabled = true; campo.classList.remove('atual'); campo.classList.add('certo'); som('certo'); avancar(); return; }
    const vaiDaqui = ALG_SUP[k] ? vai[ALG_SUP[k]] : 0;
    errar(vaiDaqui && v === vaiDaqui ? t('alg_digitoVai', { n: v }) : t('alg_digitoMal'));
    campo.classList.add('mal'); campo.select();
    if (tent >= limite) { campo.value = n; campo.disabled = true; campo.classList.remove('atual'); dizer(t('alg_revela', { n }), 'bad'); depois(1300, avancar); }
  }
  function avancar() {
    if (passo < ordem.length - 1) { passo++; fase = temPecas(ordem[passo]) ? 'juntar' : 'contar'; if (fase === 'contar') junto[ordem[passo]] = true; dizer(''); mostrarPasso(); return; }
    terminar();
  }
  function terminar() {
    feito = true; fase = 'fim'; marcarColuna();
    const p = erros === 0 ? 3 : erros === 1 ? 2 : erros <= 3 ? 1 : 0;
    est.pontos[ri] += p; est.maximos[ri] += 3; atualizarEstrelas(); guardarProgresso();
    som('certo'); poseMascote('trofeu', true); dizerBalao(p === 3 ? t('primeira') : t('conseguiste'));
    totalTalao.textContent = comU(soma); totalTalao.classList.add('certo');
    conta.classList.add('feita');
    encher(controlos); texto.textContent = parc.map(comU).join(' + ') + ' = ' + comU(soma);
    etapa.textContent = '✅ ' + t('alg_feito');
    etapa.style.color = ''; painelPasso.style.borderColor = 'var(--ok)'; painelPasso.classList.add('feito');
    dizer(t('certo') + ' ' + (compras ? t('alg_custa', { n: comU(soma) }) : ''), 'ok');
    dica.hidden = true; if (btPista) btPista.hidden = true;
    if (explica) explica.hidden = false;
    festa(conta, 30);
    btContinuar.hidden = false; btContinuar.focus({ preventScroll: true });
  }

  const pergunta = it.pergunta || (compras ? t('alg_pergunta') : parc.join(' + ') + ' = ?');
  encher(area, cabecalhoRonda(ronda, 'i_algoritmo', contador),
    blocoPergunta(it, pergunta, pergunta),
    painelPasso,
    h('div', { class: 'alg' }, h('div', { class: 'alg-esq' }, talao, conta), tab));
  if (!temPecas(ordem[0])) { fase = 'contar'; junto[ordem[0]] = true; }
  mostrarPasso();
}

/* ==========================================================
   Escape room (V3.8): "escape": { "titulo", "historia", "palavra", "pista", "cadeado",
   "vitoria", "sequencial" }. Cada sala (ronda principal) pode ter "chave" (letra ou
   número). Ao terminar a sala, o aluno ganha a chave; no fim abre o cadeado final
   com a palavra secreta formada pelas chaves (podem vir baralhadas).
   ========================================================== */
const modoEscape = () => !!(AULA && AULA.escape && typeof AULA.escape === 'object');
const normEscape = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N}]/gu, '').toUpperCase();
function salaFechada(k, principais) {
  if (AULA.escape.sequencial === false || k === 0) return false;
  if (prefs.escapeAberto) return false; // painel do professor: todos os desafios abertos
  if (est.desbloqueadas && est.desbloqueadas[principais[k]]) return false; // desbloqueada no painel do professor
  return !principais.slice(0, k).every(ri => est.feitas[ri]);
}
function barraChaves(principais) {
  const salas = principais.filter(ri => AULA.rondas[ri].chave !== undefined);
  if (!salas.length) return null;
  return h('div', { class: 'escape-chaves', 'aria-label': t('escChaves') },
    h('span', { class: 'escape-chaves-rotulo' }, '🔑 ' + t('escChaves')),
    salas.map(ri => h('span', { class: 'chave-slot' + (est.feitas[ri] ? '' : ' vazia'), title: AULA.rondas[ri].titulo || '' }, est.feitas[ri] ? String(AULA.rondas[ri].chave) : '?')));
}
function chaveGanha(ronda) {
  if (!modoEscape() || !ronda || ronda.chave === undefined) return null;
  return h('div', { class: 'chave-ganha' },
    h('span', { class: 'chave-icone', 'aria-hidden': 'true' }, '🔑'),
    h('div', null, h('strong', null, t('escChave')), h('small', null, t('escGuarda'))),
    h('span', { class: 'chave-slot grande' }, String(ronda.chave)));
}
/* Escape room (V3.11): textos de sala, melhor pontuação, próxima sala disponível e desbloqueio pela professora */
function aplicarTextosEscape() { Object.keys(T_ESCAPE).forEach(l => { if (T[l]) Object.assign(T[l], T_ESCAPE[l]); }); }
function proximaSalaPorAbrir() { // próxima sala ainda sem chave e já acessível
  const pr = listaRondas('principal');
  for (let d = 1; d <= pr.length; d++) { const k = (est.p + d) % pr.length; if (!est.feitas[pr[k]] && !salaFechada(k, pr)) return k; }
  return -1;
}
function reporMelhor() { // sala repetida e abandonada a meio: volta a melhor pontuação
  const m = est.melhor || {}, salas = Object.keys(m);
  est.melhor = {};
  if (!salas.length) return;
  salas.forEach(ri => { est.pontos[ri] = m[ri].p; est.maximos[ri] = m[ri].m; });
  guardarProgresso(); atualizarEstrelas();
}
function painelEscape(j) { // secção do painel do professor
  const pr = listaRondas('principal');
  if ($('#app .inicio')) return h('div', null, h('h4', { style: 'margin:12px 0 4px' }, '🔓 Desbloquear salas'),
    h('p', { class: 'info' }, 'Primeiro o aluno entra no jogo (com o seu número). Depois abre este painel para desbloquear salas ou dar chaves.'));
  est.desbloqueadas = est.desbloqueadas || {}; est.chavesProf = est.chavesProf || {};
  const atualizar = () => { guardarProgresso(); atualizarEstrelas(); j.remove(); if ($('#app .escape')) ecraMapa(); painelProfessor(); };
  const linhas = pr.map((ri, k) => {
    const r = AULA.rondas[ri], feita = est.feitas[ri], fechada = salaFechada(k, pr);
    const estado = feita ? (est.chavesProf[ri] ? `🔑 ${r.chave} (dada pela professora)` : `🔑 ${r.chave}`)
      : fechada ? '🔒 fechada' : est.desbloqueadas[ri] ? '🔓 desbloqueada' : 'por abrir';
    return h('tr', null, h('td', null, `${k + 1}. ${r.titulo}`), h('td', null, estado),
      h('td', null, h('span', { class: 'linha', style: 'justify-content:flex-start;gap:6px;flex-wrap:nowrap' },
        fechada ? h('button', { class: 'btn leve', style: 'padding:5px 9px;font-size:.8rem;min-height:0;box-shadow:none;white-space:nowrap', onclick: () => { est.desbloqueadas[ri] = true; atualizar(); } }, '🔓 Desbloquear') : null,
        feita ? null : h('button', { class: 'btn leve', style: 'padding:5px 9px;font-size:.8rem;min-height:0;box-shadow:none;white-space:nowrap', onclick: () => {
          if (!confirm(`Dar a chave «${r.chave}» da sala ${k + 1} sem a resolver?`)) return;
          est.feitas[ri] = true; est.chavesProf[ri] = true; est.pontos[ri] = est.pontos[ri] || 0; est.maximos[ri] = est.maximos[ri] || 0; atualizar();
        } }, '🔑 Dar a chave'))));
  });
  return h('div', null,
    h('h4', { style: 'margin:12px 0 4px' }, `🔓 Desbloquear salas · aluno n.º ${est.numero || '—'}`),
    h('p', { class: 'info' }, 'Desbloquear deixa o aluno entrar na sala sem ter aberto as anteriores. Dar a chave conta a sala como aberta (sem estrelas), para quem ficar preso.'),
    h('table', { class: 'resultados' }, h('tbody', null, linhas)),
    prefs.escapeAberto ? h('p', { class: 'info' }, 'Todos os desafios estão abertos neste computador. Para voltar à ordem das salas, desliga a opção acima.') : h('div', { class: 'linha', style: 'justify-content:flex-start;margin-top:6px' },
      h('button', { class: 'btn leve', onclick: () => { pr.forEach(ri => { est.desbloqueadas[ri] = true; }); atualizar(); } }, '🔓 Desbloquear todas'),
      h('button', { class: 'btn leve', onclick: () => { est.desbloqueadas = {}; atualizar(); } }, '🔒 Repor a ordem das salas')));
}
function ecraMapaEscape() {
  reporMelhor();
  const E = AULA.escape, principais = listaRondas('principal'), bonus = listaRondas('bonus');
  const todas = principais.every(ri => est.feitas[ri]);
  const sala = (ri, k) => {
    const r = AULA.rondas[ri], feita = est.feitas[ri], fechada = salaFechada(k, principais);
    const atual = !feita && !fechada && k === principais.findIndex(x => !est.feitas[x]);
    return h('button', {
      class: 'missao sala' + (feita ? ' feita' : '') + (atual ? ' sugerida' : '') + (fechada ? ' fechada' : ''), disabled: fechada || null,
      onclick: () => { est.seq = 'principal'; est.p = k; iniciarRonda(); }
    },
      h('span', { class: 'missao-num' }, k + 1),
      h('span', { class: 'missao-icone', 'aria-hidden': 'true' }, fechada ? '🔒' : feita ? '🔓' : (r.icone || '🚪')),
      h('strong', null, r.titulo || t('escSala', { n: k + 1 })),
      h('small', null, t('escSala', { n: k + 1 })),
      feita && !fechada ? h('span', { class: 'missao-estado' }, `🔑 ${r.chave !== undefined ? r.chave : '✔'} · ${est.pontos[ri] ?? 0}/${est.maximos[ri] ?? 0} ⭐`)
        : fechada ? h('span', { class: 'missao-estado' }, t('escFechada')) : h('span', { class: 'missao-estado' }, atual ? t('escEntrar') : t('escPorAbrir')));
  };
  const final = h('button', { class: 'missao sala cadeado-final' + (est.escapou ? ' feita' : todas ? ' sugerida' : ' fechada'), disabled: !todas || null, onclick: ecraCadeado },
    h('span', { class: 'missao-icone', 'aria-hidden': 'true' }, est.escapou ? '🏆' : todas ? '🔐' : '🔒'),
    h('strong', null, t('escCadeado')),
    h('small', null, est.escapou ? t('escLivre') : t('escCadeadoSub')));
  $('#app').replaceChildren(h('div', { class: 'escape' },
    h('div', { class: 'mapa-topo' }, mascote(est.escapou ? 'trofeu' : 'aponta'),
      h('div', null, h('h2', { class: 'titulo-ronda' }, E.titulo || AULA.titulo), E.historia ? h('p', { class: 'instrucao' }, textoRico(prefs.escapeAberto && E.historiaAberto ? E.historiaAberto : E.historia)) : null)),
    temConsulta() ? h('button', { class: 'consulta-faixa', onclick: () => abrirConsulta() },
      h('span', { class: 'consulta-faixa-icone', 'aria-hidden': 'true' }, '📖'),
      h('span', null, h('strong', null, t('consulta')), h('small', null, t('consultaSub')))) : null,
    barraChaves(principais),
    h('div', { class: 'mapa' }, principais.map((ri, k) => sala(ri, k)), final),
    bonus.length ? h('div', { class: 'grupo-titulo' }, (todas || prefs.escapeAberto) ? nomeFase('bonus') : t('bonusFechado')) : null,
    bonus.length ? h('div', { class: 'mapa' }, bonus.map((ri, k) => h('button', {
      class: 'missao' + (est.feitas[ri] ? ' feita' : ''), disabled: !(todas || prefs.escapeAberto) || null, onclick: () => { est.seq = 'bonus'; est.p = k; iniciarRonda(); }
    }, h('span', { class: 'missao-num' }, '★'), h('span', { class: 'missao-icone', 'aria-hidden': 'true' }, (todas || prefs.escapeAberto) ? iconeRonda(AULA.rondas[ri]) : '🔒'),
      h('strong', null, AULA.rondas[ri].titulo || nomeFase('bonus')), h('small', null, nomeFase('bonus'))))) : null,
    h('div', { class: 'nav' },
      h('button', { class: 'btn leve', onclick: ecraInicio }, t('inicio')),
      temCenas(AULA.abertura) ? h('button', { class: 'btn leve', onclick: () => verFilme(AULA.abertura, AULA.titulo) }, '🎬 ' + t('filmeAbertura')) : null,
      est.escapou ? h('button', { class: 'btn', id: 'btResultado', onclick: () => { est.seq = 'principal'; ecraFim(); } }, t('resultado')) : h('span'))));
}
function ecraCadeado() {
  reporMelhor();
  limparTimers(); calar();
  const E = AULA.escape, principais = listaRondas('principal');
  if (!principais.every(ri => est.feitas[ri])) { ecraMapa(); return; }
  let erros = 0;
  const msg = h('p', { class: 'cadeado-msg', 'aria-live': 'polite' });
  const pista = h('div', { class: 'consulta-lembra', hidden: true }, '💡 ', textoRico(E.pista || ''));
  const campo = h('input', { class: 'cadeado-campo', maxlength: String(normEscape(E.palavra).length + 6), autocomplete: 'off', spellcheck: 'false', 'aria-label': t('escCadeado'), placeholder: '_ '.repeat(Math.min(12, normEscape(E.palavra).length)).trim() });
  const caixa = h('div', { class: 'cadeado' }, h('span', { class: 'cadeado-icone', 'aria-hidden': 'true' }, '🔐'));
  const tentar = () => {
    if (!campo.value.trim()) return;
    if (normEscape(campo.value) === normEscape(E.palavra)) return abrir();
    erros++; som('errado');
    caixa.classList.remove('treme'); void caixa.offsetWidth; caixa.classList.add('treme');
    msg.textContent = t('escQuase');
    if (erros >= 2 && E.pista) pista.hidden = false;
    campo.select();
  };
  campo.addEventListener('keydown', e => { if (e.key === 'Enter') tentar(); });
  function abrir() {
    est.escapou = true; guardarProgresso(); som('fim'); festa(null, 60);
    $('#app').replaceChildren(h('div', { class: 'escape-vitoria' },
      mascote('trofeu'),
      h('div', { class: 'cadeado aberto' }, h('span', { class: 'cadeado-icone', 'aria-hidden': 'true' }, '🔓')),
      h('h2', { class: 'titulo-ronda' }, '🎉 ' + t('escLivre')),
      E.vitoria ? h('p', { class: 'instrucao' }, textoRico(E.vitoria)) : null,
      h('div', { class: 'escape-palavra' }, [...normEscape(E.palavra)].map(l => h('span', { class: 'chave-slot' }, l))),
      h('div', { class: 'linha' },
        listaRondas('bonus').length ? h('button', { class: 'btn leve', onclick: ecraMapa }, '★ ' + nomeFase('bonus')) : null,
        h('button', { class: 'btn', onclick: () => { est.seq = 'principal'; ecraFim(); } }, t('verResultado')))));
  }
  $('#app').replaceChildren(h('div', { class: 'escape-cadeado' },
    h('div', { class: 'mapa-topo' }, mascote('duvida'),
      h('div', null, h('h2', { class: 'titulo-ronda' }, '🔐 ' + t('escCadeado')), h('p', { class: 'instrucao' }, textoRico(E.cadeado || t('escCadeadoSub'))))),
    caixa,
    barraChaves(principais),
    h('div', { class: 'linha' }, campo, h('button', { class: 'btn', onclick: tentar }, '🔑 ' + t('escAbrir'))),
    msg, pista,
    h('div', { class: 'nav' }, h('button', { class: 'btn leve', onclick: ecraMapa }, t('missoes')),
      temConsulta() ? h('button', { class: 'btn leve', onclick: () => abrirConsulta() }, '📖 ' + t('consulta')) : null, h('span'))));
  campo.focus({ preventScroll: true });
}
function validarEscape(a) {
  if (a.escape === undefined) return [];
  const e = [], E = a.escape, txt = v => typeof v === 'string' && v.trim() !== '';
  if (!E || typeof E !== 'object' || Array.isArray(E)) return ['«escape» tem de ser um objeto { ... }.'];
  if (!txt(E.palavra)) e.push('Escape room: falta a «palavra» secreta do cadeado final.');
  if (E.tema !== undefined && !(E.tema === 'auto' || TEMAS[E.tema])) e.push(`Escape room: «tema» tem de ser "auto" ou um destes: ${Object.keys(TEMAS).join(', ')}.`);
  if (E.historiaAberto !== undefined && !txt(E.historiaAberto)) e.push('Escape room: «historiaAberto» tem de ser um texto.');
  const chaves = a.rondas.filter(r => r && r.fase !== 'bonus' && r.chave !== undefined).map(r => String(r.chave));
  a.rondas.forEach((r, ri) => { if (r && r.chave !== undefined && !(txt(String(r.chave)) && String(r.chave).length <= 4)) e.push(`Ronda ${ri + 1}: «chave» tem de ser uma letra, um número ou um texto curto (até 4 caracteres).`); });
  if (txt(E.palavra) && chaves.length) {
    const ordena = s => [...normEscape(s)].sort().join('');
    if (ordena(chaves.join('')) !== ordena(E.palavra)) e.push(`Escape room: as chaves das salas («${chaves.join(' ')}») não têm exatamente as letras da palavra «${E.palavra}».`);
  }
  return e;
}

(function arrancar() {
  $('#btAcess').onclick = abrirAcessibilidade;
  $('#btProf').onclick = abrirProfessor;
  $('#btEcra').onclick = ecraInteiro;
  if ($('#btMab')) $('#btMab').onclick = abrirFerramentaMAB;
  $('#btSom').onclick = () => { prefs.som = !somLigado(); guardarPrefs(); atualizarBotaoSom(); if (!prefs.som) calar(); };
  if (!T[prefs.lingua]) prefs.lingua = 'pt';
  try { MASCOTE = JSON.parse($('#mascote').textContent); } catch (e) { MASCOTE = {}; }
  if (temFala()) { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices(); }
  let erros;
  try { AULA = JSON.parse($('#aula').textContent); erros = validarAula(AULA); }
  catch (e) { erros = ['O bloco AULA não é JSON válido: ' + e.message + '. Verifica vírgulas, aspas e chavetas.']; }
  aplicarAparencia();
  if (erros.length) { ecraErros(erros); return; }
  if (modoEscape()) aplicarTextosEscape();
  // botão MAB no cabeçalho: nas aulas com rondas de MAB ou com "ferramentaMAB": true
  if ($('#btMab')) $('#btMab').hidden = !(AULA.ferramentaMAB === true || (AULA.ferramentaMAB !== false && AULA.rondas.some(r => r && r.tipo === 'mab')));
  if ($('#btConsulta')) { $('#btConsulta').hidden = !temConsulta(); $('#btConsulta').onclick = () => abrirConsulta(); $('#btConsulta').title = t('consulta'); }
  document.title = AULA.titulo + ' · Investigadores Digitais';
  $('#subtitulo').textContent = 'com o Ticl@s · ' + AULA.titulo;
  ecraInicio();
})();
