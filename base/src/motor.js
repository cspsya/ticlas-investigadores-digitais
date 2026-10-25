'use strict';
/* ==========================================================
   Investigadores Digitais · Jogo-base V3 · motor
   Para criar um jogo novo NÃO se altera este código:
   muda-se apenas o bloco AULA (JSON) no ficheiro HTML.
   ========================================================== */

const VERSAO = 'V3';
const PASS_HASH = '0ab6d63e627eaf2f63a43514d1722ec6de93c49fc7452a9de39fe1882e2f0d98'; // a mesma palavra-passe dos outros jogos do Ticl@s
const TIPOS = ['escolher', 'verdadeiro_falso', 'completar', 'escrever', 'pares', 'classificar', 'ordenar'];
const FASES = { aquecimento: 'Aquecimento', desafios: 'Desafios', escrita: 'Escrita', bonus: 'Bónus' };
const SEGUNDOS = { escolher: 30, verdadeiro_falso: 25, completar: 35, escrever: 60, frase: 180, pares: 20, classificar: 20, ordenar: 45 };
const INSTRUCOES = {
  escolher: 'Escolhe a resposta certa.',
  verdadeiro_falso: 'Lê com atenção: é verdadeiro ou falso?',
  completar: 'Completa a frase com a palavra que falta.',
  escrever: 'Escreve a resposta e carrega em «Confirmar».',
  frase: 'Escreve uma frase completa e carrega em «Confirmar».',
  pares: 'Toca num elemento da esquerda e depois no seu par da direita.',
  memoria: 'Vira duas cartas de cada vez e encontra os pares.',
  classificar: 'Toca numa palavra e depois na caixa certa.',
  ordenar: 'Toca nas peças pela ordem certa.'
};
const MSG_CERTO = ['Muito bem!', 'Isso mesmo!', 'Excelente investigação!', 'Boa! Acertaste!', 'Fantástico!'];
const MSG_ERRADO = ['Ainda não. Pensa outra vez.', 'Quase! Lê com atenção.', 'Tenta de novo, com calma.'];
const MSG_ANIMO = ['Vamos investigar!', 'Pensa com calma.', 'Tu consegues!', 'Lê com atenção.'];

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
  carnaval:    { nome: 'Carnaval', c: ['#9b4fd0', '#5e2a85', '#f1e4fa', '#e0861a', '#a35f0c', '#fffaf2', '#f3e6fb'], d: ['🎭', '🎉', '🎊', '🪅'], a: '🎭' },
  primavera:   { nome: 'Primavera', c: ['#4fa36b', '#2b6a40', '#e3f3e7', '#E8834A', '#b9582e', '#fbfff8', '#e5f4e8'], d: ['🌸', '🌼', '🦋', '🌱'], a: '🌼' },
  pascoa:      { nome: 'Páscoa', c: ['#5f9e59', '#3d6e38', '#e6f3e4', '#d9578a', '#a63a63', '#fffaf8', '#eef6ea'], d: ['🐣', '🌷', '🥚', '🐰'], a: '🐣' },
  festadaflor: { nome: 'Festa da Flor', c: ['#c93f80', '#8e2459', '#fbe3ef', '#e2802a', '#a85c12', '#fff8fb', '#fae5ef'], d: ['🌺', '🌸', '🌷', '💐'], a: '🌺' },
  crianca:     { nome: 'Dia da Criança', c: ['#3a8fd6', '#1e5a8f', '#e3f0fb', '#f07a24', '#b5550f', '#fffaf2', '#e6f1fb'], d: ['🎈', '🪁', '🧸', '🎨'], a: '🎈' },
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
function baralhar(lista) { const a = lista.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function baralharDiferente(lista, igual = (x, y) => x === y) {
  if (lista.length < 2) return lista.slice();
  let b, n = 0;
  do { b = baralhar(lista); n++; } while (n < 30 && b.every((x, i) => igual(x, lista[i])));
  return b;
}
const sorteio = lista => lista[Math.floor(Math.random() * lista.length)];
const norm = s => String(s ?? '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('pt-PT').normalize('NFC');
const semAcentos = s => norm(s).normalize('NFD').replace(/[̀-ͯ]/g, '');
const semPontuacaoFinal = s => norm(s).replace(/[.!?…]+$/, '');
const palavras = s => String(s || '').normalize('NFC').split(/[^\p{L}\p{N}-]+/u).filter(Boolean);
const temTexto = v => (typeof v === 'string' && v.trim() !== '') || typeof v === 'number';
const timers = new Set();
function depois(ms, fn) { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); return t; }
function limparTimers() { timers.forEach(clearTimeout); timers.clear(); }
function guardar(chave, valor) { try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (e) { /* sem armazenamento: o jogo continua */ } }
function ler(chave) { try { return JSON.parse(localStorage.getItem(chave) || 'null'); } catch (e) { return null; } }
function apagar(chave) { try { localStorage.removeItem(chave); } catch (e) { } }

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
    if (r.fase && !FASES[r.fase]) e.push(`${onde}: fase desconhecida «${r.fase}». Fases possíveis: ${Object.keys(FASES).join(', ')}.`);
    if (!Array.isArray(r.itens) || !r.itens.length) { e.push(`${onde}: falta a lista «itens».`); return; }
    if (r.tipo === 'classificar' && (!Array.isArray(r.caixas) || r.caixas.length < 2 || !r.caixas.every(temTexto))) e.push(`${onde}: «caixas» tem de ter pelo menos 2 caixas.`);
    r.itens.forEach((it, ii) => {
      const w = `${onde}, item ${ii + 1}`;
      const opErradas = () => {
        if (!Array.isArray(it.erradas) || !it.erradas.length || !it.erradas.every(temTexto)) { e.push(`${w}: «erradas» tem de ter pelo menos 1 opção.`); return; }
        if (it.erradas.some(x => norm(x) === norm(it.certa))) e.push(`${w}: a resposta certa também aparece em «erradas».`);
        if (new Set(it.erradas.map(norm)).size !== it.erradas.length) e.push(`${w}: há opções repetidas em «erradas».`);
      };
      if (['escolher', 'verdadeiro_falso', 'completar', 'escrever', 'ordenar'].includes(r.tipo) && (!it || typeof it !== 'object' || Array.isArray(it))) { e.push(`${w}: tem de ser um objeto { ... }.`); return; }
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
  if (!a.rondas.some(r => r && r.fase !== 'bonus')) e.push('Tem de existir pelo menos uma ronda que não seja de bónus.');
  return e;
}
function minutosEstimados(rondas) {
  const s = rondas.reduce((t, r) => t + 30 + (r.itens || []).reduce((u, it) =>
    u + (r.tipo === 'escrever' && it && it.resposta === undefined ? SEGUNDOS.frase : (SEGUNDOS[r.tipo] || 30)), 0), 0);
  return Math.max(1, Math.round(s / 60));
}

/* ---------- estado ---------- */
const PREF = 'ticlas3-preferencias';
let prefs = Object.assign({ modo: 'computador', perfil: 'turma', escala: 1, contraste: false, legivel: false, tema: 'auto', livre: false }, ler(PREF) || {});
let AULA = null, MASCOTE = {};
const est = { seq: 'principal', p: 0, pontos: {}, maximos: {}, feitas: {}, frases: [], numero: '', profOk: false };
const somLigado = () => prefs.modo === 'quadro' ? prefs.som !== false : prefs.som === true;
const apoio = () => prefs.perfil === 'apoio';
const listaRondas = seq => AULA.rondas.map((r, i) => ({ r, i })).filter(x => seq === 'bonus' ? x.r.fase === 'bonus' : x.r.fase !== 'bonus').map(x => x.i);
const chaveProgresso = () => 'ticlas3:' + (AULA.id || AULA.titulo) + ':' + (est.numero || 'sem-numero');
function guardarProgresso() { guardar(chaveProgresso(), { seq: est.seq, p: est.p, pontos: est.pontos, maximos: est.maximos, feitas: est.feitas, frases: est.frases }); }
function totalEstrelas() { return Object.values(est.pontos).reduce((a, b) => a + b, 0); }
function totalMaximo() { return Object.values(est.maximos).reduce((a, b) => a + b, 0); }
function atualizarEstrelas() { $('#estrelas').textContent = '⭐ ' + totalEstrelas(); }

/* ---------- som e narração ---------- */
let audio = null;
function som(tipo) {
  if (!somLigado()) return;
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const notas = { certo: [660, 880], errado: [220, 185], fim: [523, 659, 784, 1046] }[tipo] || [440];
    notas.forEach((f, i) => {
      const o = audio.createOscillator(), g = audio.createGain(), t = audio.currentTime + i * 0.12;
      o.type = tipo === 'errado' ? 'triangle' : 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.14, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);
      o.connect(g).connect(audio.destination); o.start(t); o.stop(t + 0.26);
    });
  } catch (e) { }
}
function falar(texto) {
  if (!('speechSynthesis' in window) || !texto) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(texto).replace(/_{3,}/g, ' … '));
    u.lang = 'pt-PT'; u.rate = 0.9;
    const vozes = speechSynthesis.getVoices();
    const v = vozes.find(x => /pt[-_]PT/i.test(x.lang)) || vozes.find(x => /^pt/i.test(x.lang));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  } catch (e) { }
}
function calar() { try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { } }

/* ---------- aparência: tema, acessibilidade, modo ---------- */
function temaAtual() { if (prefs.tema && prefs.tema !== 'auto' && TEMAS[prefs.tema]) return prefs.tema; if (AULA && TEMAS[AULA.tema]) return AULA.tema; return temaDoDia(); }
function aplicarAparencia() {
  const t = TEMAS[temaAtual()] || TEMAS.neutro, s = document.documentElement.style;
  ['--t-1', '--t-1d', '--t-1l', '--t-2', '--t-2d', '--t-fundo', '--t-fundo2'].forEach((v, i) => s.setProperty(v, t.c[i]));
  s.setProperty('--escala', prefs.escala);
  const b = document.body;
  b.classList.toggle('contraste', !!prefs.contraste); b.classList.toggle('legivel', !!prefs.legivel);
  b.classList.toggle('quadro', prefs.modo === 'quadro');
  b.className = b.className.replace(/\bano-\d\b/g, '').trim(); if (AULA && AULA.ano) b.classList.add('ano-' + AULA.ano);
  const decor = $('#decor'); decor.innerHTML = '';
  const pos = [[4, 12], [90, 18], [8, 70], [86, 76], [48, 92], [70, 6], [24, 40], [94, 48]];
  pos.forEach(([x, y], i) => decor.append(h('span', { style: `left:${x}%;top:${y}%;animation-delay:${-i * 1.3}s` }, t.d[i % t.d.length])));
}
function mascote(pose, extra) {
  const t = TEMAS[temaAtual()] || TEMAS.neutro;
  return h('div', { class: 'mascote' },
    h('img', { src: MASCOTE[pose] || MASCOTE.ola, alt: 'Ticl@s, o esquilo investigador', id: 'imgMascote' }),
    t.a ? h('span', { class: 'acessorio', 'aria-hidden': 'true' }, t.a) : null,
    extra);
}
function poseMascote(pose, salta) {
  const img = $('#imgMascote'); if (!img) return;
  img.src = MASCOTE[pose] || MASCOTE.ola;
  if (salta) { img.classList.remove('salta'); void img.offsetWidth; img.classList.add('salta'); }
}
function dizerBalao(texto) { const b = $('#balao'); if (b) b.textContent = texto; }

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
  const temGuardado = guardado && (Object.keys(guardado.feitas || {}).length || guardado.p > 0);
  const escolha = (grupo, valor, titulo, sub) => h('button', {
    class: 'escolha', 'aria-pressed': String(prefs[grupo] === valor),
    onclick: () => { prefs[grupo] = valor; if (grupo === 'modo') delete prefs.som; guardar(PREF, prefs); ecraInicio(); }
  }, titulo, h('small', null, sub));
  const tags = [AULA.ano + '.º ano', AULA.turma, AULA.disciplina, '≈ ' + (AULA.minutos || minutosEstimados(listaRondas('principal').map(i => AULA.rondas[i]))) + ' min'].filter(Boolean);
  const numero = h('input', { id: 'numAluno', inputmode: 'numeric', maxlength: '3', value: est.numero, 'aria-label': 'Número do aluno', placeholder: 'ex.: 7' });
  numero.addEventListener('input', () => { numero.value = numero.value.replace(/\D/g, ''); est.numero = numero.value; });
  $('#app').replaceChildren(h('div', { class: 'inicio' },
    mascote('ola', h('div', { class: 'balao', id: 'balao' }, 'Olá! Eu sou o Ticl@s.')),
    h('section', null,
      h('div', { class: 'tags' }, tags.map(t => h('span', { class: 'tag' }, t))),
      h('h1', null, AULA.titulo),
      AULA.objetivo ? h('p', { class: 'instrucao' }, AULA.objetivo) : null,
      h('div', { class: 'grupo-titulo' }, 'Onde vamos jogar?'),
      h('div', { class: 'escolhas' },
        escolha('modo', 'quadro', '🖥️ Quadro interativo', 'Botões grandes, som e narração'),
        escolha('modo', 'computador', '💻 Computador', 'Cada aluno no seu, sem som')),
      h('div', { class: 'grupo-titulo' }, 'Como vamos jogar?'),
      h('div', { class: 'escolhas' },
        escolha('perfil', 'turma', '👥 Modo turma', 'Todos os desafios'),
        escolha('perfil', 'apoio', '🤝 Modo apoio', 'Menos opções e mais pistas')),
      prefs.modo === 'computador' ? h('label', { class: 'numero' }, 'N.º do aluno (opcional):', numero) : null,
      h('div', { class: 'linha', style: 'justify-content:flex-start;margin-top:12px' },
        h('button', { class: 'btn', id: 'btComecar', onclick: () => comecar(false) }, '▶ Começar'),
        temGuardado ? h('button', { class: 'btn leve', id: 'btContinuar', onclick: () => comecar(true) }, '↺ Continuar onde parei') : null))));
  numero.addEventListener('change', () => ecraInicio());
}
function comecar(continuar) {
  const g = continuar ? ler(chaveProgresso()) : null;
  Object.assign(est, { seq: 'principal', p: 0, pontos: {}, maximos: {}, feitas: {}, frases: [] }, g || {});
  if (!g) apagar(chaveProgresso());
  if (audio && audio.state === 'suspended') audio.resume();
  iniciarRonda();
}

/* ---------- moldura de cada ronda ---------- */
function iniciarRonda() {
  limparTimers(); calar();
  const lista = listaRondas(est.seq);
  if (est.p >= lista.length) { ecraFim(); return; }
  const ri = lista[est.p], ronda = AULA.rondas[ri];
  est.pontos[ri] = 0; est.maximos[ri] = 0; delete est.feitas[ri];
  guardarProgresso(); atualizarEstrelas();
  const progresso = h('div', { class: 'progresso', 'aria-hidden': 'true' },
    lista.map((x, k) => h('i', { class: k === est.p ? 'atual' : est.feitas[x] ? 'feito' : '' })));
  const fase = FASES[ronda.fase || 'desafios'];
  const area = h('div', { class: 'area', id: 'area' });
  const btAnterior = h('button', { class: 'btn leve', id: 'btAnterior', disabled: est.p === 0, onclick: () => { est.p--; iniciarRonda(); } }, '◀ Anterior');
  const btProximo = h('button', { class: 'btn azul', id: 'btProximo', disabled: !prefs.livre, onclick: () => { est.p++; guardarProgresso(); iniciarRonda(); } }, est.p === lista.length - 1 ? 'Terminar ▶' : 'Próximo ▶');
  $('#app').replaceChildren(
    progresso,
    h('div', { class: 'etiqueta' },
      h('span', null, `${est.seq === 'bonus' ? 'Bónus' : 'Ronda'} ${est.p + 1} de ${lista.length}`),
      h('span', { class: 'fase' }, fase)),
    h('div', { class: 'palco' },
      mascote(ronda.tipo === 'escrever' ? 'portatil' : 'aponta', h('div', { class: 'balao', id: 'balao' }, sorteio(MSG_ANIMO))),
      area),
    h('div', { class: 'nav' }, btAnterior,
      h('button', { class: 'btn leve', onclick: ecraInicio }, '🏠 Início'),
      btProximo));
  const motor = { escolher: rondaItens, verdadeiro_falso: rondaItens, completar: rondaItens, escrever: rondaItens, ordenar: rondaItens, pares: rondaPares, classificar: rondaClassificar }[ronda.tipo];
  motor(ri, ronda, area);
}
function rondaConcluida(ri) {
  est.feitas[ri] = true; guardarProgresso();
  const lista = listaRondas(est.seq), ultima = est.p === lista.length - 1;
  poseMascote('trofeu', true); dizerBalao('Ronda concluída!'); som('fim');
  const bt = $('#btProximo'); bt.disabled = false; bt.focus();
  $('#area').replaceChildren(h('div', { style: 'text-align:center;padding:20px 0' },
    h('div', { class: 'estrelas-grandes' }, '⭐'),
    h('h2', { class: 'titulo-ronda' }, 'Ronda concluída!'),
    h('p', { class: 'instrucao' }, `Conquistaste ${est.pontos[ri]} de ${est.maximos[ri]} estrelas nesta ronda.`),
    h('div', { class: 'linha' },
      h('button', { class: 'btn leve', onclick: iniciarRonda }, '🔁 Repetir ronda'),
      h('button', { class: 'btn', id: 'btSeguinte', onclick: () => { est.p++; guardarProgresso(); iniciarRonda(); } }, ultima ? 'Ver resultado ▶' : 'Próxima ronda ▶'))));
}

/* ---------- cabeçalho comum dentro da área ---------- */
function encher(alvo, ...nos) { alvo.replaceChildren(...nos.flat().filter(Boolean)); }
function cabecalhoRonda(ronda, instrucaoPadrao, contador) {
  return [
    h('h2', { class: 'titulo-ronda' }, ronda.titulo || FASES[ronda.fase || 'desafios']),
    h('p', { class: 'instrucao' }, (ronda.instrucao || instrucaoPadrao) + (contador ? ' · ' + contador : ''))
  ];
}
function blocoPergunta(it, conteudo, textoFala) {
  const filhos = [];
  if (it.emoji) filhos.push(h('span', { class: 'emoji', 'aria-hidden': 'true' }, it.emoji));
  if (it.imagem) filhos.push(h('img', { class: 'ilustra', src: it.imagem, alt: it.alt || '' }));
  if (conteudo) filhos.push(h('span', null, conteudo));
  if (somLigado() && textoFala) filhos.push(h('button', { class: 'ouvir', 'aria-label': 'Ouvir', title: 'Ouvir', onclick: () => falar(textoFala) }, '🔊'));
  if (somLigado() && textoFala && (AULA.ano <= 2 || AULA.lerAutomatico)) depois(350, () => falar(textoFala));
  return h('div', { class: 'pergunta' }, filhos);
}

/* ---------- controlador de um item (tentativas, pontos, pistas) ---------- */
function criarItem(ri, it, nOpcoes, aoRevelar) {
  const limiteBase = apoio() ? 3 : 2;
  const limite = nOpcoes ? Math.max(1, Math.min(limiteBase, nOpcoes - 1)) : limiteBase;
  const fb = h('div', { class: 'feedback', role: 'status', 'aria-live': 'polite' });
  const dica = it.dica ? h('div', { class: 'dica', hidden: true }, '💡 ' + it.dica) : null;
  const explica = it.explicacao ? h('div', { class: 'explica', hidden: true }, it.explicacao) : null;
  const btDica = it.dica && apoio() ? h('button', { class: 'btn leve', onclick: () => { dica.hidden = false; poseMascote('ideia'); btDica.hidden = true; } }, '💡 Pedir pista') : null;
  const btContinuar = h('button', { class: 'btn azul', hidden: true }, 'Continuar ▶');
  const c = {
    erros: 0, resolvido: false, bloqueado: false,
    nos: [fb, dica, explica, h('div', { class: 'linha' }, btDica, btContinuar)],
    aoContinuar(fn) { btContinuar.onclick = fn; },
    errou(el, msg) {
      if (c.resolvido) return;
      c.erros++; som('errado'); poseMascote('duvida', true); dizerBalao('Hmm… pensa outra vez.');
      fb.className = 'feedback bad'; fb.textContent = msg || sorteio(MSG_ERRADO);
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
      som('certo'); poseMascote('ideia', true); dizerBalao(p === 3 ? 'À primeira! ⭐⭐⭐' : 'Conseguiste!');
      fb.className = 'feedback ok'; fb.textContent = sorteio(MSG_CERTO) + (extra ? ' ' + extra : '');
      if (el) el.classList.add('certo');
      if (explica) explica.hidden = false;
      if (dica) dica.hidden = true; if (btDica) btDica.hidden = true;
      btContinuar.hidden = false; btContinuar.focus({ preventScroll: true });
    },
    revelar() {
      c.resolvido = true; est.maximos[ri] += 3; guardarProgresso();
      poseMascote('ideia'); dizerBalao('Vamos ver juntos.');
      fb.className = 'feedback bad';
      fb.textContent = aoRevelar ? aoRevelar() : 'Vê a resposta certa.';
      if (explica) explica.hidden = false;
      if (btDica) btDica.hidden = true;
      btContinuar.hidden = false; btContinuar.focus({ preventScroll: true });
    }
  };
  return c;
}

/* ---------- rondas item a item: escolher, verdadeiro_falso, completar, escrever, ordenar ---------- */
function rondaItens(ri, ronda, area) {
  const itens = ronda.baralhar ? baralhar(ronda.itens) : ronda.itens.slice();
  let i = 0;
  const seguinte = () => {
    limparTimers(); calar();
    if (i >= itens.length) { rondaConcluida(ri); return; }
    poseMascote(ronda.tipo === 'escrever' ? 'portatil' : 'aponta'); dizerBalao(sorteio(MSG_ANIMO));
    const it = itens[i], contador = itens.length > 1 ? `${i + 1} de ${itens.length}` : '';
    const desenhar = { escolher: itemEscolha, completar: itemEscolha, verdadeiro_falso: itemVF, escrever: itemEscrever, ordenar: itemOrdenar }[ronda.tipo];
    desenhar(ri, ronda, it, area, contador, () => { i++; seguinte(); });
  };
  seguinte();
}
function itemEscolha(ri, ronda, it, area, contador, proximo) {
  const completar = ronda.tipo === 'completar';
  if (completar && !Array.isArray(it.erradas)) return itemEscrever(ri, ronda, Object.assign({}, it, { resposta: it.certa }), area, contador, proximo);
  const erradas = apoio() ? [sorteio(it.erradas)] : it.erradas;
  const opcoes = baralhar([it.certa, ...erradas]);
  let lacuna = null, pergunta;
  if (completar) {
    const [a, b] = String(it.frase).split('___');
    lacuna = h('span', { class: 'lacuna' }, '?');
    pergunta = blocoPergunta(it, h('span', null, a, lacuna, b), String(it.frase));
  } else pergunta = blocoPergunta(it, it.pergunta, it.pergunta);
  const botoes = [];
  const c = criarItem(ri, it, opcoes.length, () => {
    botoes.forEach(b => { b.disabled = true; if (b.dataset.certa) b.classList.add('revela'); });
    if (lacuna) lacuna.textContent = it.certa;
    return `A resposta certa é «${it.certa}».`;
  });
  const cores = ['#e8834a', '#5ba3d0', '#9b6bc9', '#4fa36b', '#d9578a'];
  const visual = completar ? 'cartoes' : (ronda.visual || 'cartoes');
  const grelha = h('div', { class: 'opcoes v-' + visual });
  opcoes.forEach((op, k) => {
    const b = h('button', { class: 'opcao', style: visual === 'baloes' ? `--bc:${cores[k % cores.length]}` : null, 'data-certa': op === it.certa ? '1' : null }, String(op));
    b.onclick = () => {
      if (c.resolvido || c.bloqueado) return;
      if (op === it.certa) { botoes.forEach(x => x.disabled = true); if (lacuna) lacuna.textContent = it.certa; c.acertou(b); }
      else c.errou(b);
    };
    botoes.push(b); grelha.append(b);
  });
  c.aoContinuar(proximo);
  encher(area, ...cabecalhoRonda(ronda, INSTRUCOES[ronda.tipo], contador), pergunta, grelha, ...c.nos);
}
function itemVF(ri, ronda, it, area, contador, proximo) {
  const botoes = [];
  const c = criarItem(ri, it, 2, () => {
    botoes.forEach(b => { b.disabled = true; if (b.dataset.certa) b.classList.add('revela'); });
    return `Esta afirmação é ${it.verdade ? 'verdadeira' : 'falsa'}.`;
  });
  const grelha = h('div', { class: 'opcoes' });
  [[true, '✅ Verdadeiro'], [false, '❌ Falso']].forEach(([v, txt]) => {
    const b = h('button', { class: 'opcao', 'data-certa': v === it.verdade ? '1' : null }, txt);
    b.onclick = () => { if (c.resolvido || c.bloqueado) return; if (v === it.verdade) { botoes.forEach(x => x.disabled = true); c.acertou(b); } else c.errou(b); };
    botoes.push(b); grelha.append(b);
  });
  c.aoContinuar(proximo);
  encher(area, ...cabecalhoRonda(ronda, INSTRUCOES.verdadeiro_falso, contador), blocoPergunta(it, it.afirmacao, it.afirmacao), grelha, ...c.nos);
}
function itemEscrever(ri, ronda, it, area, contador, proximo) {
  const livre = it.resposta === undefined;
  const aceites = livre ? [] : [].concat(it.resposta).map(String);
  const minimo = it.minPalavras || (AULA.ano <= 1 ? 3 : 4);
  const campo = livre
    ? h('textarea', { id: 'resposta', 'aria-label': 'A tua frase', spellcheck: 'false', autocomplete: 'off', placeholder: 'Escreve aqui a tua frase…' })
    : h('input', { id: 'resposta', 'aria-label': 'A tua resposta', spellcheck: 'false', autocomplete: 'off', autocapitalize: 'off', placeholder: 'Escreve aqui' });
  let lacuna = null, conteudo = it.pergunta;
  if (ronda.tipo === 'completar') { const [a, b] = String(it.frase).split('___'); lacuna = h('span', { class: 'lacuna' }, '?'); conteudo = h('span', null, a, lacuna, b); }
  const c = criarItem(ri, it, 0, () => { campo.disabled = true; btOk.disabled = true; if (lacuna) lacuna.textContent = aceites[0]; return `A resposta certa é «${aceites[0]}».`; });
  const btOk = h('button', { class: 'btn' }, 'Confirmar');
  let criterios = null;
  const regras = livre ? [
    it.palavra ? ['Usa a palavra «' + it.palavra + '»', t => palavras(t).some(p => norm(p) === norm(it.palavra))] : null,
    [`Pelo menos ${minimo} palavras`, t => palavras(t).length >= minimo],
    ['Começa com maiúscula', t => /^\p{Lu}/u.test(t.trim())],
    ['Termina com . ! ou ?', t => /[.!?]$/.test(t.trim())]
  ].filter(Boolean) : [];
  if (livre) {
    criterios = h('ul', { class: 'criterios' }, regras.map(([txt]) => h('li', null, txt)));
    campo.addEventListener('input', () => regras.forEach(([, f], k) => criterios.children[k].classList.toggle('sim', f(campo.value))));
  }
  const verificar = () => {
    if (c.resolvido || c.bloqueado) return;
    const t = campo.value;
    if (!t.trim()) { campo.focus(); return; }
    if (livre) {
      const falta = regras.filter(([, f]) => !f(t)).map(([txt]) => txt.toLowerCase());
      if (falta.length) { const fb = c.nos[0]; fb.className = 'feedback bad'; fb.textContent = 'Falta: ' + falta.join('; ') + '.'; poseMascote('duvida'); return; }
      est.frases.push({ pergunta: it.pergunta, frase: t.trim() });
      campo.disabled = true; btOk.disabled = true; c.acertou(null, 'Frase completa!');
      return;
    }
    if (aceites.some(a => semPontuacaoFinal(a) === semPontuacaoFinal(t))) { campo.disabled = true; btOk.disabled = true; campo.classList.add('certo'); if (lacuna) lacuna.textContent = t.trim(); c.acertou(null); }
    else if (aceites.some(a => semAcentos(a).replace(/[.!?…]+$/, '') === semAcentos(t).replace(/[.!?…]+$/, ''))) c.errou(null, 'Quase! Verifica os acentos.');
    else c.errou(null);
    if (!c.resolvido) { campo.select(); }
  };
  btOk.onclick = verificar;
  if (!livre) campo.addEventListener('keydown', e => { if (e.key === 'Enter') verificar(); });
  c.aoContinuar(proximo);
  const instr = ronda.tipo === 'completar' ? INSTRUCOES.completar : livre ? INSTRUCOES.frase : INSTRUCOES.escrever;
  encher(area, ...cabecalhoRonda(ronda, instr, contador), blocoPergunta(it, conteudo, ronda.tipo === 'completar' ? it.frase : it.pergunta),
    h('div', { class: 'escrita' }, campo, btOk), criterios, ...c.nos);
  if (prefs.modo === 'computador') depois(50, () => campo.focus({ preventScroll: true }));
}
function itemOrdenar(ri, ronda, it, area, contador, proximo) {
  const juntar = it.juntar ?? ronda.juntar ?? ' ';
  const certas = it.pecas.map(String);
  const pecas = certas.map((t, k) => ({ t, k }));
  const fixas = apoio() ? 1 : 0; // no modo apoio a primeira peça já vem colocada
  let montadas = pecas.slice(0, fixas);
  let soltas = baralharDiferente(pecas.slice(fixas), (x, y) => x.k === y.k);
  const montagem = h('div', { class: 'montagem', 'aria-live': 'polite' }), bandeja = h('div', { class: 'pecas' });
  const c = criarItem(ri, it, 0, () => { montadas = pecas.slice(); soltas = []; desenhar(true); return `A ordem certa é: «${certas.join(juntar)}».`; });
  function desenhar(fim) {
    montagem.replaceChildren(...montadas.map((p, k) => h('button', {
      class: 'peca' + (fim || k < fixas || p.ok ? ' fixa' : ''), disabled: fim || k < fixas || p.ok || null,
      onclick: () => { if (c.resolvido || c.bloqueado) return; montadas.splice(k, 1); soltas.push(p); desenhar(); }
    }, p.t)));
    bandeja.replaceChildren(...soltas.map((p, k) => h('button', {
      class: 'peca', disabled: fim || null,
      onclick: () => { if (c.resolvido || c.bloqueado) return; soltas.splice(k, 1); montadas.push(p); desenhar(); if (!soltas.length) verificar(); }
    }, p.t)));
  }
  function verificar() {
    const certo = montadas.every((p, k) => norm(p.t) === norm(certas[k]));
    if (certo) { montadas.forEach(p => p.ok = true); desenhar(true); c.acertou(null, '«' + certas.join(juntar) + '»'); return; }
    // as peças bem colocadas ficam; as outras voltam para a bandeja
    const ficam = [], voltam = [];
    montadas.forEach((p, k) => { if (k < fixas || (norm(p.t) === norm(certas[k]) && ficam.length === k)) { p.ok = true; ficam.push(p); } else voltam.push(p); });
    montadas = ficam; soltas = baralhar(voltam);
    c.errou(null, 'Ainda não. As peças verdes estão no sítio certo.');
    if (!c.resolvido) desenhar();
  }
  desenhar();
  c.aoContinuar(proximo);
  encher(area, ...cabecalhoRonda(ronda, INSTRUCOES.ordenar, contador), blocoPergunta(it, it.pergunta || null, it.pergunta), montagem, bandeja, ...c.nos);
}

/* ---------- rondas por ecrãs: pares e classificar ---------- */
function porEcras(lista) { const n = apoio() ? 3 : 6, out = []; for (let k = 0; k < lista.length; k += n) out.push(lista.slice(k, k + n)); return out; }
function rondaPares(ri, ronda, area) {
  const ecras = porEcras(ronda.baralhar ? baralhar(ronda.itens) : ronda.itens.slice());
  let e = 0;
  const seguinte = () => { if (e >= ecras.length) { rondaConcluida(ri); return; } (ronda.visual === 'memoria' ? ecraMemoria : ecraLigar)(ri, ronda, area, ecras[e], ecras.length > 1 ? `parte ${e + 1} de ${ecras.length}` : '', () => { e++; seguinte(); }); };
  seguinte();
}
function ecraLigar(ri, ronda, area, pares, contador, proximo) {
  const limite = apoio() ? 3 : 2;
  const esq = pares.map((p, k) => ({ t: String(p[0]), k, erros: 0 }));
  const dir = baralharDiferente(pares.map((p, k) => ({ t: String(p[1]), k })), (x, y) => x.k === y.k);
  const cores = ['#5BA3D0', '#E8834A', '#6BBF59', '#9b6bc9', '#d9578a', '#c9a227'];
  let selE = null, selD = null, feitos = 0, bloqueado = false;
  const fb = h('div', { class: 'feedback', role: 'status' });
  const bE = esq.map(x => h('button', { class: 'peca' }, x.t)), bD = dir.map(x => h('button', { class: 'peca' }, x.t));
  const fixar = (k, revelado) => {
    const ie = esq.findIndex(x => x.k === k), id = dir.findIndex(x => x.k === k), cor = cores[k % cores.length];
    [bE[ie], bD[id]].forEach(b => { b.disabled = true; b.classList.remove('sel'); b.classList.add('fixa'); b.style.borderColor = cor; b.style.boxShadow = `0 4px 0 ${cor}`; if (revelado) b.style.borderStyle = 'dashed'; });
    feitos++;
    if (feitos === pares.length) { som('certo'); fb.className = 'feedback ok'; fb.textContent = 'Todos os pares ligados!'; depois(900, proximo); }
  };
  const tentar = () => {
    if (selE == null || selD == null) return;
    const a = esq[selE], b = dir[selD], be = bE[selE], bd = bD[selD];
    selE = selD = null; be.classList.remove('sel'); bd.classList.remove('sel');
    if (a.k === b.k) {
      const p = a.erros === 0 ? 3 : a.erros === 1 ? 1 : 0; est.pontos[ri] += p; est.maximos[ri] += 3; atualizarEstrelas(); guardarProgresso();
      som('certo'); poseMascote('ideia', true); fb.className = 'feedback ok'; fb.textContent = sorteio(MSG_CERTO); fixar(a.k);
    } else {
      a.erros++; som('errado'); poseMascote('duvida', true); fb.className = 'feedback bad';
      be.classList.add('errado'); bd.classList.add('errado'); bloqueado = true;
      depois(600, () => { be.classList.remove('errado'); bd.classList.remove('errado'); bloqueado = false; });
      if (a.erros >= limite) { fb.textContent = `«${a.t}» liga com «${pares[a.k][1]}».`; est.maximos[ri] += 3; guardarProgresso(); depois(600, () => fixar(a.k, true)); }
      else fb.textContent = sorteio(MSG_ERRADO);
    }
  };
  bE.forEach((b, k) => b.onclick = () => { if (bloqueado) return; bE.forEach(x => x.classList.remove('sel')); selE = k; b.classList.add('sel'); tentar(); });
  bD.forEach((b, k) => b.onclick = () => { if (bloqueado) return; bD.forEach(x => x.classList.remove('sel')); selD = k; b.classList.add('sel'); tentar(); });
  encher(area, ...cabecalhoRonda(ronda, INSTRUCOES.pares, contador),
    h('div', { class: 'colunas' }, h('div', { class: 'col' }, bE), h('div', { class: 'col' }, bD)), fb);
}
function ecraMemoria(ri, ronda, area, pares, contador, proximo) {
  const cartas = baralhar(pares.flatMap((p, k) => [{ t: String(p[0]), k }, { t: String(p[1]), k }]));
  let viradas = [], feitos = 0, ocupado = false;
  const fb = h('div', { class: 'feedback', role: 'status' });
  const botoes = cartas.map((c, i) => h('button', { class: 'carta', 'aria-label': 'Carta ' + (i + 1) }, '?'));
  botoes.forEach((b, i) => b.onclick = () => {
    if (ocupado || viradas.includes(i) || b.classList.contains('par')) return;
    b.textContent = cartas[i].t; b.classList.add('virada'); viradas.push(i);
    if (viradas.length < 2) return;
    const [x, y] = viradas;
    if (cartas[x].k === cartas[y].k) {
      viradas = []; feitos++; est.pontos[ri] += 3; est.maximos[ri] += 3; atualizarEstrelas(); guardarProgresso();
      [x, y].forEach(n => { botoes[n].classList.add('par'); botoes[n].disabled = true; });
      som('certo'); fb.className = 'feedback ok'; fb.textContent = 'Encontraste um par!';
      if (feitos === pares.length) { fb.textContent = 'Encontraste todos os pares!'; poseMascote('ideia', true); depois(900, proximo); }
    } else {
      ocupado = true; fb.className = 'feedback'; fb.textContent = 'Não é par. Memoriza e tenta outra vez.';
      depois(1000, () => { [x, y].forEach(n => { botoes[n].textContent = '?'; botoes[n].classList.remove('virada'); }); viradas = []; ocupado = false; });
    }
  });
  encher(area, ...cabecalhoRonda(ronda, INSTRUCOES.memoria, contador), h('div', { class: 'memoria' }, botoes), fb);
}
function rondaClassificar(ri, ronda, area) {
  const ecras = porEcras(baralhar(ronda.itens));
  let e = 0;
  const seguinte = () => { if (e >= ecras.length) { rondaConcluida(ri); return; } ecraClassificar(ri, ronda, area, ecras[e], ecras.length > 1 ? `parte ${e + 1} de ${ecras.length}` : '', () => { e++; seguinte(); }); };
  seguinte();
}
function ecraClassificar(ri, ronda, area, itens, contador, proximo) {
  const limite = apoio() ? 3 : 2;
  const pecas = itens.map(([t, cx]) => ({ t: String(t), cx, erros: 0 }));
  let sel = null, feitos = 0, bloqueado = false;
  const fb = h('div', { class: 'feedback', role: 'status' });
  const bandeja = h('div', { class: 'pecas' });
  const caixas = ronda.caixas.map(nome => {
    const lista = h('div', { style: 'display:flex;flex-wrap:wrap;gap:6px;justify-content:center' });
    const el = h('div', { class: 'caixa', role: 'button', tabindex: '0', 'aria-label': 'Caixa ' + nome }, h('h4', null, String(nome)), lista);
    el.onclick = () => largar(nome, el, lista);
    el.onkeydown = ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); largar(nome, el, lista); } };
    el.ondragover = ev => { ev.preventDefault(); el.classList.add('alvo'); };
    el.ondragleave = () => el.classList.remove('alvo');
    el.ondrop = ev => { ev.preventDefault(); el.classList.remove('alvo'); const k = +ev.dataTransfer.getData('text/plain'); if (Number.isInteger(k) && botoes[k] && !botoes[k].disabled) { escolher(k); largar(nome, el, lista); } };
    return { nome, el, lista };
  });
  const botoes = pecas.map((p, k) => {
    const b = h('button', { class: 'peca', draggable: 'true' }, p.t);
    b.onclick = () => escolher(k);
    b.ondragstart = ev => { ev.dataTransfer.setData('text/plain', String(k)); escolher(k); };
    return b;
  });
  function escolher(k) { if (bloqueado || botoes[k].disabled) return; botoes.forEach(b => b.classList.remove('sel')); sel = k; botoes[k].classList.add('sel'); }
  function colocar(k, revelado) {
    const p = pecas[k], cx = caixas.find(c => c.nome === p.cx), b = botoes[k];
    b.classList.remove('sel'); b.classList.add('fixa'); b.disabled = true; b.draggable = false; if (revelado) b.style.borderStyle = 'dashed';
    cx.lista.append(b); feitos++;
    if (feitos === pecas.length) { som('certo'); fb.className = 'feedback ok'; fb.textContent = 'Tudo arrumado!'; poseMascote('ideia', true); depois(900, proximo); }
  }
  function largar(nome, el) {
    if (bloqueado || sel == null) { if (sel == null) { fb.className = 'feedback'; fb.textContent = 'Primeiro toca numa palavra.'; } return; }
    const k = sel, p = pecas[k]; sel = null;
    if (p.cx === nome) {
      const pts = p.erros === 0 ? 3 : p.erros === 1 ? 1 : 0; est.pontos[ri] += pts; est.maximos[ri] += 3; atualizarEstrelas(); guardarProgresso();
      som('certo'); fb.className = 'feedback ok'; fb.textContent = sorteio(MSG_CERTO); colocar(k);
    } else {
      p.erros++; som('errado'); poseMascote('duvida', true); fb.className = 'feedback bad';
      botoes[k].classList.remove('sel'); botoes[k].classList.add('errado'); el.classList.add('alvo'); bloqueado = true;
      depois(650, () => { botoes[k].classList.remove('errado'); el.classList.remove('alvo'); bloqueado = false; });
      if (p.erros >= limite) { fb.textContent = `«${p.t}» vai para a caixa «${p.cx}».`; est.maximos[ri] += 3; guardarProgresso(); depois(650, () => colocar(k, true)); }
      else fb.textContent = sorteio(MSG_ERRADO);
    }
  }
  bandeja.append(...botoes);
  encher(area, ...cabecalhoRonda(ronda, INSTRUCOES.classificar, contador), bandeja, h('div', { class: 'caixas' }, caixas.map(c => c.el)), fb);
}

/* ---------- fim e certificado ---------- */
function ecraFim() {
  limparTimers(); calar(); guardarProgresso();
  const pts = totalEstrelas(), max = totalMaximo() || 1, pct = pts / max;
  const grandes = pct >= 0.8 ? 3 : pct >= 0.5 ? 2 : 1;
  const temBonus = est.seq === 'principal' && listaRondas('bonus').length > 0;
  som('fim');
  $('#app').replaceChildren(h('div', { style: 'text-align:center' },
    mascote('trofeu'),
    h('div', { class: 'estrelas-grandes', 'aria-label': grandes + ' estrelas' }, '⭐'.repeat(grandes) + '☆'.repeat(3 - grandes)),
    h('h2', { class: 'titulo-ronda' }, est.seq === 'bonus' ? 'Desafios bónus concluídos!' : 'Missão cumprida!'),
    h('p', { class: 'instrucao' }, `Conquistaste ${pts} de ${max} estrelas.`),
    est.frases.length ? h('div', { class: 'frases-lista' }, h('strong', null, 'As tuas frases:'), h('ul', null, est.frases.map(f => h('li', null, f.frase)))) : null,
    h('div', { class: 'linha', style: 'margin-top:14px' },
      h('button', { class: 'btn', onclick: certificado }, '🏅 Certificado'),
      temBonus ? h('button', { class: 'btn azul', id: 'btBonus', onclick: () => { est.seq = 'bonus'; est.p = 0; iniciarRonda(); } }, '⭐ Desafios bónus') : null,
      h('button', { class: 'btn leve', onclick: () => comecar(false) }, '🔁 Jogar outra vez'),
      h('button', { class: 'btn leve', onclick: ecraInicio }, '🏠 Início'))));
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
    h('h3', null, 'Aa  Opções de leitura'),
    h('label', null, 'Tamanho da letra', h('span', { class: 'linha' },
      h('button', { class: 'icon', onclick: () => mudar('escala', Math.max(0.85, +(prefs.escala - 0.15).toFixed(2))) }, 'A−'),
      h('button', { class: 'icon', onclick: () => mudar('escala', Math.min(1.45, +(prefs.escala + 0.15).toFixed(2))) }, 'A+'))),
    h('label', null, 'Alto contraste', h('input', { type: 'checkbox', checked: prefs.contraste || null, onchange: e => mudar('contraste', e.target.checked) })),
    h('label', null, 'Letra mais legível', h('input', { type: 'checkbox', checked: prefs.legivel || null, onchange: e => mudar('legivel', e.target.checked) })),
    h('div', { class: 'linha' }, h('button', { class: 'btn', onclick: () => j.remove() }, 'Fechar')));
  function mudar(k, v) { prefs[k] = v; guardar(PREF, prefs); aplicarAparencia(); }
}
async function sha256(texto) {
  const dados = new TextEncoder().encode(texto);
  const r = await crypto.subtle.digest('SHA-256', dados);
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
function painelProfessor() {
  const sel = (valor, opcoes, aoMudar) => h('select', { onchange: e => aoMudar(e.target.value) }, opcoes.map(([v, t]) => h('option', { value: v, selected: v === valor || null }, t)));
  const principais = listaRondas('principal'), bonus = listaRondas('bonus');
  const destino = sel('', [['', '— escolher —'],
    ...principais.map((ri, k) => ['principal:' + k, `${k + 1}. ${AULA.rondas[ri].titulo || AULA.rondas[ri].tipo}`]),
    ...bonus.map((ri, k) => ['bonus:' + k, `Bónus ${k + 1}. ${AULA.rondas[ri].titulo || AULA.rondas[ri].tipo}`])], () => { });
  const guardarPref = (k, v) => { prefs[k] = v; guardar(PREF, prefs); aplicarAparencia(); };
  const nItens = AULA.rondas.reduce((t, r) => t + r.itens.length, 0);
  const j = janela(
    h('h3', null, '⚙️ Painel do professor'),
    h('div', { class: 'info' }, `«${AULA.titulo}» · ${principais.length} rondas + ${bonus.length} de bónus · ${nItens} itens · duração estimada ≈ ${minutosEstimados(principais.map(i => AULA.rondas[i]))} min (+ ${minutosEstimados(bonus.map(i => AULA.rondas[i]))} min de bónus) · tema de hoje: ${TEMAS[temaDoDia()].nome} · motor ${VERSAO}`),
    h('label', null, 'Tema', sel(prefs.tema, [['auto', 'Automático (pela data)'], ...Object.entries(TEMAS).map(([k, t]) => [k, t.nome])], v => guardarPref('tema', v))),
    h('label', null, 'Modo', sel(prefs.modo, [['quadro', 'Quadro interativo'], ['computador', 'Computador']], v => { delete prefs.som; guardarPref('modo', v); })),
    h('label', null, 'Perfil', sel(prefs.perfil, [['turma', 'Turma'], ['apoio', 'Apoio']], v => guardarPref('perfil', v))),
    h('label', null, 'Som e narração', h('input', { type: 'checkbox', checked: somLigado() || null, onchange: e => guardarPref('som', e.target.checked) })),
    h('label', null, 'Navegação livre (Próximo sempre ativo)', h('input', { type: 'checkbox', checked: prefs.livre || null, onchange: e => { guardarPref('livre', e.target.checked); const b = $('#btProximo'); if (b && e.target.checked) b.disabled = false; } })),
    h('label', null, 'Ir para a ronda', h('span', { class: 'linha' }, destino, h('button', {
      class: 'btn azul', onclick: () => { if (!destino.value) return; const [s, k] = destino.value.split(':'); est.seq = s; est.p = +k; j.remove(); iniciarRonda(); }
    }, 'Ir'))),
    h('label', null, 'Progresso guardado neste computador', h('button', { class: 'btn leve', onclick: e => { apagar(chaveProgresso()); e.target.textContent = 'Apagado ✓'; } }, 'Apagar')),
    h('p', { style: 'font-size:.7rem;color:var(--muted)' }, 'As alterações de modo e perfil aplicam-se na ronda seguinte ou ao voltar ao início. Só se guarda o número do aluno, neste computador.'),
    h('div', { class: 'linha' }, h('button', { class: 'btn leve', onclick: () => { j.remove(); ecraInicio(); } }, '🏠 Início'), h('button', { class: 'btn', onclick: () => j.remove() }, 'Fechar')));
}
function ecraInteiro() {
  const el = document.documentElement;
  if (document.fullscreenElement) { document.exitFullscreen(); return; }
  if (el.requestFullscreen && document.fullscreenEnabled) el.requestFullscreen().catch(() => window.open(location.href, '_blank'));
  else window.open(location.href, '_blank'); // ex.: dentro do Google Sites sem permissão de ecrã inteiro
}

/* ---------- arranque ---------- */
(function arrancar() {
  $('#btAcess').onclick = abrirAcessibilidade;
  $('#btProf').onclick = abrirProfessor;
  $('#btEcra').onclick = ecraInteiro;
  try { MASCOTE = JSON.parse($('#mascote').textContent); } catch (e) { MASCOTE = {}; }
  if ('speechSynthesis' in window) { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices(); }
  let erros;
  try { AULA = JSON.parse($('#aula').textContent); erros = validarAula(AULA); }
  catch (e) { erros = ['O bloco AULA não é JSON válido: ' + e.message + '. Verifica vírgulas, aspas e chavetas.']; }
  aplicarAparencia();
  if (erros.length) { ecraErros(erros); return; }
  document.title = AULA.titulo + ' · Investigadores Digitais';
  $('#subtitulo').textContent = 'com o Ticl@s · ' + AULA.titulo;
  ecraInicio();
})();
