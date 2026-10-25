/* Imagens dos emojis: Noto Emoji (Google, licença Apache 2.0).
   Troca cada emoji do texto pela imagem embutida neste ficheiro, para que apareça
   igual em todos os computadores (mesmo nos que mostram um retângulo).
   O emoji original fica escondido ao lado da imagem: o texto do jogo não muda. */
(function () {
  'use strict';
  var bloco = document.getElementById('emojis-svg');
  if (!bloco || !window.MutationObserver) return;
  var MAPA;
  try { MAPA = JSON.parse(bloco.textContent); } catch (e) { return; }
  var RE;
  try {
    RE = new RegExp('(?:[#*0-9]\\uFE0F?\\u20E3|(?:\\p{Emoji_Presentation}|\\p{Extended_Pictographic}\\uFE0F)\\p{Emoji_Modifier}?(?:\\u200D(?:\\p{Emoji_Presentation}|\\p{Extended_Pictographic}\\uFE0F?)\\p{Emoji_Modifier}?)*)', 'gu');
  } catch (e) { return; }
  var IGNORAR = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, OPTION: 1, SELECT: 1, TITLE: 1, NOSCRIPT: 1, CANVAS: 1, svg: 1, SVG: 1 };
  var estilo = document.createElement('style');
  estilo.textContent = '.emo{display:inline-block;position:relative;line-height:1;vertical-align:baseline}' +
    '.emo>img{height:1.15em;width:1.15em;vertical-align:-0.17em;object-fit:contain;pointer-events:none;user-select:none}' +
    '.emo>span{position:absolute;left:0;top:0;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}';
  document.head.appendChild(estilo);
  function chave(s) { return s.replace(/️/g, ''); }
  function trocar(no) {
    var t = no.nodeValue, pai = no.parentNode;
    if (!t || !pai || IGNORAR[pai.nodeName]) return;
    RE.lastIndex = 0;
    if (!RE.test(t)) return;
    if (pai.closest && pai.closest('.emo,[contenteditable="true"],svg')) return;
    RE.lastIndex = 0;
    var frag = document.createDocumentFragment(), i = 0, m, trocou = false;
    while ((m = RE.exec(t))) {
      var src = MAPA[chave(m[0])];
      if (!src) continue;
      trocou = true;
      if (m.index > i) frag.appendChild(document.createTextNode(t.slice(i, m.index)));
      var w = document.createElement('span'); w.className = 'emo';
      var img = document.createElement('img'); img.src = src; img.alt = ''; img.draggable = false;
      var tx = document.createElement('span'); tx.textContent = m[0];
      w.appendChild(img); w.appendChild(tx); frag.appendChild(w);
      i = m.index + m[0].length;
    }
    if (!trocou) return;
    if (i < t.length) frag.appendChild(document.createTextNode(t.slice(i)));
    pai.replaceChild(frag, no);
  }
  function percorrer(raiz) {
    if (raiz.nodeType === 3) { trocar(raiz); return; }
    if (raiz.nodeType !== 1 || IGNORAR[raiz.nodeName] || (raiz.classList && raiz.classList.contains('emo'))) return;
    var w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, null), lista = [], n;
    while ((n = w.nextNode())) lista.push(n);
    for (var k = 0; k < lista.length; k++) trocar(lista[k]);
  }
  new MutationObserver(function (ms) {
    for (var a = 0; a < ms.length; a++) {
      if (ms[a].type === 'characterData') trocar(ms[a].target);
      else for (var b = 0; b < ms[a].addedNodes.length; b++) percorrer(ms[a].addedNodes[b]);
    }
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
  percorrer(document.body);
})();
