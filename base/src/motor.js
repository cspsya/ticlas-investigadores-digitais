/* ==========================================================
   Investigadores Digitais · Jogo-base V3 · motor
   Para criar um jogo novo NÃO se altera este código:
   muda-se apenas o bloco AULA (JSON) no ficheiro HTML.
   ========================================================== */

const VERSAO = 'V3.4';
const PASS_HASH = '0ab6d63e627eaf2f63a43514d1722ec6de93c49fc7452a9de39fe1882e2f0d98'; // a mesma palavra-passe dos outros jogos do Ticl@s
const TIPOS = ['escolher', 'verdadeiro_falso', 'completar', 'escrever', 'ditado', 'copiar', 'pares', 'classificar', 'ordenar', 'mab', 'cadeia', 'reta', 'tabela100'];
const FASES = ['aquecimento', 'desafios', 'escrita', 'bonus'];
const SEGUNDOS = { escolher: 30, verdadeiro_falso: 25, completar: 35, escrever: 60, frase: 180, ditado: 45, copiar: 60, pares: 20, classificar: 20, ordenar: 45, mab: 60, cadeia: 70, reta: 35, tabela100: 110 };

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
  verao:       { nome: 'Verão', c: ['#1a9bb5', '#0e6476', '#dff4f8', '#e28a12', '#a8620a', '#fffdf5', '#dff3f7'], d: ['☀️', '🏖️', '🌊', '🐚'], a: '🕶️' }
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
  if (!a.rondas.some(r => r && r.fase !== 'bonus')) e.push('Tem de existir pelo menos uma ronda que não seja de bónus.');
  return e;
}
const FATOR_ANO = { 1: 1.5, 2: 1.2, 3: 1.0, 4: 0.9 }; // os mais novos demoram mais em cada item
function minutosEstimados(rondas) {
  const s = rondas.reduce((t, r) => t + 30 + (r.itens || []).reduce((u, it) =>
    u + (r.tipo === 'escrever' && it && it.resposta === undefined ? SEGUNDOS.frase : (SEGUNDOS[r.tipo] || 30)), 0), 0);
  return Math.max(1, Math.round(s * (FATOR_ANO[AULA && AULA.ano] || 1) / 60));
}

/* ---------- estado ---------- */
const PREF = 'ticlas3-preferencias';
let prefs = Object.assign({ modo: 'computador', perfil: 'turma', escala: 1, contraste: false, legivel: false, tema: 'auto', livre: false, lingua: 'pt' }, ler(PREF) || {});
let AULA = null, MASCOTE = {};
const est = { seq: 'principal', p: 0, pontos: {}, maximos: {}, feitas: {}, frases: [], numero: '', concluido: false, profOk: false };
const somLigado = () => prefs.som === true || (prefs.som !== false && prefs.modo === 'quadro');
const apoio = () => prefs.perfil === 'apoio';
const listaRondas = seq => AULA.rondas.map((r, i) => ({ r, i })).filter(x => seq === 'bonus' ? x.r.fase === 'bonus' : x.r.fase !== 'bonus').map(x => x.i);
const prefixoProgresso = () => 'ticlas3:' + (AULA.id || AULA.titulo) + ':';
const chaveProgresso = () => prefixoProgresso() + (est.numero || 'sem-numero');
function guardarProgresso() {
  guardar(chaveProgresso(), { seq: est.seq, p: est.p, pontos: est.pontos, maximos: est.maximos, feitas: est.feitas, frases: est.frases, concluido: est.concluido, atualizado: new Date().toISOString() });
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
function temaAtual() { if (prefs.tema && prefs.tema !== 'auto' && TEMAS[prefs.tema]) return prefs.tema; if (AULA && TEMAS[AULA.tema]) return AULA.tema; return temaDoDia(); }
function aplicarAparencia() {
  const tema = TEMAS[temaAtual()] || TEMAS.neutro, s = document.documentElement.style;
  ['--t-1', '--t-1d', '--t-1l', '--t-2', '--t-2d', '--t-fundo', '--t-fundo2'].forEach((v, i) => s.setProperty(v, tema.c[i]));
  s.setProperty('--escala', prefs.escala);
  const b = document.body;
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
  Object.assign(est, { seq: 'principal', p: 0, pontos: {}, maximos: {}, feitas: {}, frases: [], concluido: false }, g || {});
  if (!g) apagar(chaveProgresso());
  if (audio && audio.state === 'suspended') audio.resume();
  ecraMapa();
}

/* ---------- mapa de missões: escolha livre, pausa e retoma ---------- */
function iconeRonda(r) {
  if (r.tipo === 'escolher' || (r.tipo === 'completar' && r.visual)) return { baloes: '🎈', comboio: '🚂', buracos: '🕳️', aviao: '✈️' }[r.visual] || (r.tipo === 'completar' ? '🧩' : '🃏');
  return { verdadeiro_falso: '✅', completar: '🧩', escrever: '✏️', ditado: '🎧', copiar: '⌨️', pares: r.visual === 'memoria' ? '🃏' : '🔗', classificar: '🗂️', ordenar: '🔢' }[r.tipo] || EXTRA_ICONES[r.tipo] || '⭐';
}
function ecraMapa() {
  limparTimers(); calar();
  est.seq = 'principal'; guardarProgresso(); atualizarEstrelas();
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
    h('div', { class: 'mapa' }, principais.map((ri, k) => cartao(ri, k, 'principal', false))),
    bonus.length ? h('div', { class: 'grupo-titulo' }, todas ? nomeFase('bonus') : t('bonusFechado')) : null,
    bonus.length ? h('div', { class: 'mapa' }, bonus.map((ri, k) => cartao(ri, k, 'bonus', !todas))) : null,
    h('div', { class: 'nav' },
      h('button', { class: 'btn leve', onclick: ecraInicio }, t('inicio')),
      todas ? h('button', { class: 'btn', id: 'btResultado', onclick: () => { est.seq = 'principal'; ecraFim(); } }, t('resultado')) : h('span'))));
}

/* ---------- moldura de cada ronda ---------- */
function iniciarRonda() {
  limparTimers(); calar();
  const lista = listaRondas(est.seq);
  if (est.p >= lista.length) {
    if (est.seq === 'principal' && !lista.every(ri => est.feitas[ri])) { ecraMapa(); return; }
    ecraFim(); return;
  }
  const ri = lista[est.p], ronda = AULA.rondas[ri];
  RONDA = ronda;
  est.pontos[ri] = 0; est.maximos[ri] = 0; delete est.feitas[ri];
  guardarProgresso(); atualizarEstrelas();
  const progresso = h('div', { class: 'progresso', 'aria-hidden': 'true' },
    lista.map((x, k) => h('i', { class: k === est.p ? 'atual' : est.feitas[x] ? 'feito' : '' })));
  const area = h('div', { class: 'area', id: 'area' });
  const btAnterior = h('button', { class: 'btn leve', id: 'btAnterior', disabled: est.p === 0, onclick: () => { est.p--; iniciarRonda(); } }, t('anterior'));
  const btProximo = h('button', { class: 'btn azul', id: 'btProximo', disabled: !prefs.livre, onclick: () => { est.p++; guardarProgresso(); iniciarRonda(); } }, est.p === lista.length - 1 ? t('terminar') : t('proximo'));
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
  const motor = { escolher: rondaItens, verdadeiro_falso: rondaItens, completar: rondaItens, escrever: rondaItens, ditado: rondaItens, copiar: rondaItens, ordenar: rondaItens, pares: rondaPares, classificar: rondaClassificar, mab: rondaItens, cadeia: rondaItens, reta: rondaItens, tabela100: rondaItens }[ronda.tipo];
  motor(ri, ronda, area);
}
function rondaConcluida(ri) {
  est.feitas[ri] = true; guardarProgresso();
  const lista = listaRondas(est.seq), ultima = est.p === lista.length - 1;
  const tudoFeito = est.seq === 'bonus' || lista.every(x => est.feitas[x]);
  poseMascote('trofeu', true); dizerBalao(t('rondaConcluida')); som('fim'); festa(null, 40);
  const bt = $('#btProximo'); bt.disabled = false;
  encher($('#area'), h('div', { style: 'text-align:center;padding:20px 0' },
    h('div', { class: 'estrelas-grandes' }, '⭐'),
    h('h2', { class: 'titulo-ronda' }, t('rondaConcluida')),
    h('p', { class: 'instrucao' }, t('estrelasRonda', { a: est.pontos[ri], b: est.maximos[ri] })),
    h('div', { class: 'linha' },
      h('button', { class: 'btn leve', onclick: iniciarRonda }, t('repetirRonda')),
      est.seq === 'principal' ? h('button', { class: 'btn leve', onclick: ecraMapa }, t('missoes')) : null,
      h('button', { class: 'btn', id: 'btSeguinte', onclick: () => { est.p++; guardarProgresso(); iniciarRonda(); } }, ultima ? (tudoFeito ? t('verResultado') : t('missoes')) : t('proximaRonda')))));
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
      fala && somLigado() ? h('button', { class: 'ouvir', 'aria-label': t('ouvir'), title: t('ouvir'), onclick: () => lerSequencia(fala()) }, '🔊') : null),
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
  const j = janela(
    h('h3', null, '⚙️ Painel do professor'),
    h('div', { class: 'info' }, `«${AULA.titulo}» · ${principais.length} rondas + ${bonus.length} de bónus · ${nItens} itens · duração estimada ≈ ${minutosEstimados(principais.map(i => AULA.rondas[i]))} min (+ ${minutosEstimados(bonus.map(i => AULA.rondas[i]))} min de bónus) · tema de hoje: ${TEMAS[temaDoDia()].nome} · voz em português: ${voz ? voz.name : 'não encontrada neste computador'} · motor ${VERSAO}`),
    h('label', null, 'Tema', sel(prefs.tema, [['auto', 'Automático (pela data)'], ...Object.entries(TEMAS).map(([k, x]) => [k, x.nome])], v => mudar('tema', v))),
    h('label', null, 'Modo', sel(prefs.modo, [['quadro', 'Quadro interativo'], ['computador', 'Computador']], v => { delete prefs.som; mudar('modo', v); })),
    h('label', null, 'Perfil', sel(prefs.perfil, [['turma', 'Turma'], ['apoio', 'Apoio']], v => mudar('perfil', v))),
    h('label', null, 'Língua da interface', sel(prefs.lingua, Object.entries(LINGUAS), v => mudar('lingua', v))),
    h('label', null, 'Som e narração', h('input', { type: 'checkbox', checked: somLigado() || null, onchange: e => mudar('som', e.target.checked) })),
    h('label', null, 'Navegação livre (Próximo sempre ativo)', h('input', { type: 'checkbox', checked: prefs.livre || null, onchange: e => { mudar('livre', e.target.checked); const b = $('#btProximo'); if (b && e.target.checked) b.disabled = false; } })),
    h('label', null, 'Ir para a ronda', h('span', { class: 'linha' }, destino, h('button', {
      class: 'btn azul', onclick: () => { if (!destino.value) return; const [s, k] = destino.value.split(':'); est.seq = s; est.p = +k; j.remove(); iniciarRonda(); }
    }, 'Ir'))),
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
  // botão MAB no cabeçalho: nas aulas com rondas de MAB ou com "ferramentaMAB": true
  if ($('#btMab')) $('#btMab').hidden = !(AULA.ferramentaMAB === true || (AULA.ferramentaMAB !== false && AULA.rondas.some(r => r && r.tipo === 'mab')));
  document.title = AULA.titulo + ' · Investigadores Digitais';
  $('#subtitulo').textContent = 'com o Ticl@s · ' + AULA.titulo;
  ecraInicio();
})();
