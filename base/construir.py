#!/usr/bin/env python3
"""Investigadores Digitais · Jogo-base V3 · construir e validar jogos.

Uso (a partir da raiz do repositório):
  python3 base/construir.py                         reconstrói base/modelo-jogo.html (com o exemplo)
  python3 base/construir.py aula.json               valida e gera aula.html ao lado do JSON
  python3 base/construir.py aula.json -o jogo.html  valida e gera no caminho indicado
  python3 base/construir.py aula.json --publicar    gera em jogos/AAAA-MM-DD/ e acrescenta a jogos.json
  python3 base/construir.py --validar ficheiro      só valida (aceita .json ou um .html já gerado)
  python3 base/construir.py --imagens a.html b.html  embute as imagens dos emojis em jogos já feitos
  python3 base/construir.py --aulas                  gera os jogos de todas as aulas em aulas/ (usado no GitHub)
  python3 base/construir.py --verificar-site         verifica todos os jogos e o jogos.json (usado no GitHub)
  python3 base/construir.py --preparar-site _site    copia o site e embute as imagens (usado no GitHub)

As imagens dos emojis (Noto Emoji, Apache 2.0) precisam de: pip install emoji
e de acesso à Internet (descarregadas uma vez e guardadas em base/.cache-emojis/).
"""
import argparse
import shutil
import urllib.error
import urllib.parse
import urllib.request
import datetime as dt
import json
import re
import sys
import unicodedata
from pathlib import Path

BASE = Path(__file__).resolve().parent
RAIZ = BASE.parent
SRC = BASE / "src"
EXEMPLO = BASE / "exemplos" / "exemplo-2ano-grupos-consonanticos.json"
AULAS = RAIZ / "aulas"
MODELO = BASE / "modelo-jogo.html"
TIPOS = ["escolher", "verdadeiro_falso", "completar", "escrever", "ditado", "copiar", "pares", "classificar", "ordenar", "mab", "cadeia", "reta", "tabela100", "puzzle", "pontos", "apanhar", "percurso", "algoritmo"]
FASES = ["aquecimento", "desafios", "escrita", "bonus"]
MESES = ["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."]
SEGUNDOS = {"escolher": 30, "verdadeiro_falso": 25, "completar": 35, "escrever": 60, "frase": 180,
            "ditado": 45, "copiar": 60, "pares": 20, "classificar": 20, "ordenar": 45,
            "mab": 60, "cadeia": 70, "reta": 35, "tabela100": 110, "puzzle": 70, "pontos": 50, "apanhar": 120, "percurso": 150, "algoritmo": 150}
CACHE = BASE / ".cache-emojis"
NOTO = "https://raw.githubusercontent.com/googlefonts/noto-emoji/main/2D/svg/emoji_u{}.svg"
COPIAVEIS = re.compile(r"^[A-Za-zÇçÁÉÍÓÚáéíóúÀàÂÊÔâêôÃÕãõ .,!?-]+$")  # o mesmo que COPIAVEIS em src/motor.js
BLOCO_EMOJIS = re.compile(r"\n?<!-- EMOJIS:INICIO -->.*?<!-- EMOJIS:FIM -->\n?", re.S)
BLOCO = re.compile(r'(<!-- AULA:INICIO -->\s*<script type="application/json" id="aula">)(.*?)(</script>\s*<!-- AULA:FIM -->)', re.S)


def norm(s):
    return unicodedata.normalize("NFC", re.sub(r"\s+", " ", str(s)).strip().lower())


def tem_texto(v):
    return (isinstance(v, str) and v.strip() != "") or (isinstance(v, (int, float)) and not isinstance(v, bool))


def inteiro(v):
    return isinstance(v, int) and not isinstance(v, bool)


FORMAS_PONTOS = ("p", "t", "P", "T")  # as mesmas de FORMAS_PONTOS em src/motor.js


def validar_minijogo(tipo, it, w):
    """Minijogos (V3.5): as mesmas regras de validarJogos() em src/motor.js."""
    e = []
    lista = lambda v, n: isinstance(v, list) and len(v) >= n and all(tem_texto(x) for x in v)
    if tipo == "puzzle":
        if not tem_texto(it.get("emoji")) and not tem_texto(it.get("imagem")):
            e.append(f"{w}: o puzzle precisa de «emoji» ou «imagem».")
        if it.get("pecas") is not None and it["pecas"] not in (4, 6, 9):
            e.append(f"{w}: «pecas» tem de ser 4, 6 ou 9.")
        if it.get("certa") is not None and (not tem_texto(it["certa"]) or not lista(it.get("erradas"), 1) or it["certa"] in it["erradas"]):
            e.append(f"{w}: com «certa» são precisas «erradas» (diferentes da certa).")
    elif tipo == "pontos":
        tr = it.get("pontos")
        if tr is None and it.get("forma") not in FORMAS_PONTOS:
            e.append(f"{w}: indica «forma» ({', '.join(FORMAS_PONTOS)}) ou «pontos».")
        elif tr is not None and not (isinstance(tr, list) and tr and all(isinstance(t, list) and len(t) >= 2 and all(isinstance(p, list) and len(p) == 2 and all(isinstance(n, (int, float)) and 0 <= n <= 100 for n in p) for p in t) for t in tr)):
            e.append(f"{w}: «pontos» tem de ser uma lista de traços com pontos [x, y] de 0 a 100.")
        if it.get("exemplos") is not None and not lista(it["exemplos"], 1):
            e.append(f"{w}: «exemplos» tem de ser uma lista de textos.")
    else:
        if not lista(it.get("certas"), 2):
            e.append(f"{w}: «certas» tem de ter pelo menos 2 textos.")
        if not lista(it.get("erradas"), 1):
            e.append(f"{w}: «erradas» tem de ter pelo menos 1 texto.")
        if lista(it.get("certas"), 1) and lista(it.get("erradas"), 1) and set(it["certas"]) & set(it["erradas"]):
            e.append(f"{w}: há textos que estão nas certas e nas erradas.")
        if tipo == "apanhar" and it.get("meta") is not None and not (inteiro(it["meta"]) and 3 <= it["meta"] <= 20):
            e.append(f"{w}: «meta» tem de ser um número de 3 a 20.")
        if tipo == "percurso":
            if isinstance(it.get("certas"), list) and len(it["certas"]) > 7:
                e.append(f"{w}: no percurso usa no máximo 7 certas.")
            if isinstance(it.get("erradas"), list) and len(it["erradas"]) > 8:
                e.append(f"{w}: no percurso usa no máximo 8 erradas.")
    return e


def validar_matematica(tipo, it, w):
    """Tipos de Matemática (V3.4): as mesmas regras de validarExtra() em src/motor.js."""
    e = []
    if tipo == "mab":
        if it.get("modo") == "ler":
            c, d, u = (it.get(k, 0) for k in "cdu")
            if not all(inteiro(x) and 0 <= x <= 20 for x in (c, d, u)) or not (c + d + u):
                e.append(f"{w}: no modo «ler» indica c, d e u (números de 0 a 20).")
        elif not (inteiro(it.get("numero")) and 1 <= it["numero"] <= 299):
            e.append(f"{w}: «numero» tem de ser um número inteiro de 1 a 299.")
    elif tipo == "cadeia":
        passos = it.get("passos")
        if not inteiro(it.get("inicio")) or not isinstance(passos, list) or not passos or not all(inteiro(x) and x != 0 for x in passos):
            e.append(f"{w}: precisa de «inicio» e de «passos» (lista de números, ex.: [5, 10, -10]).")
        else:
            v = it["inicio"]
            for x in passos:
                v += x
                if not 0 <= v <= 999:
                    e.append(f"{w}: a sequência sai dos números de 0 a 999.")
                    break
    elif tipo == "reta":
        a0, a1, p = it.get("inicio"), it.get("fim"), it.get("passo")
        if not all(inteiro(x) for x in (a0, a1, p)) or p <= 0 or a1 <= a0 or (a1 - a0) % p:
            return [f"{w}: «inicio», «fim» e «passo» têm de formar uma reta certa (ex.: 0, 100, 10)."]
        if it.get("modo") == "colocar":
            n = it.get("numero")
            if not inteiro(n) or not a0 < n < a1 or (n - a0) % p == 0:
                e.append(f"{w}: «numero» tem de ficar entre duas marcas (não em cima de uma marca).")
        else:
            mk = it.get("marca")
            if not inteiro(mk) or not a0 <= mk <= a1 or (mk - a0) % p:
                e.append(f"{w}: «marca» tem de ser uma das marcas da reta.")
            if "erradas" in it and (not isinstance(it["erradas"], list) or mk in it["erradas"]):
                e.append(f"{w}: «erradas» não pode incluir a resposta certa.")
    elif tipo == "tabela100":
        ini, lin, lac = it.get("inicio"), it.get("linhas"), it.get("lacunas")
        if not (inteiro(ini) and ini % 10 == 1 and inteiro(lin) and lin >= 1 and ini + lin * 10 - 1 <= 100):
            return [f"{w}: «inicio» tem de ser 1, 11, 21… e as linhas não podem passar do 100."]
        if not isinstance(lac, list) or not lac or any(not inteiro(x) or not ini <= x <= ini + lin * 10 - 1 for x in lac):
            e.append(f"{w}: «lacunas» tem de ter números que estejam nessas linhas.")
    return e


def validar_algoritmo(it, w):
    """Algoritmo da adição com MAB (V3.9): as mesmas regras de validarAlgoritmo() em src/motor.js."""
    compras = it.get("compras")
    if compras is not None:
        if not isinstance(compras, list) or not all(isinstance(c, list) and len(c) == 3 and tem_texto(c[1]) for c in compras):
            return [f"{w}: cada compra tem de ser [\"emoji\", \"nome\", preço]."]
        p = [c[2] for c in compras]
    else:
        p = it.get("parcelas") if isinstance(it.get("parcelas"), list) else []
    if not 2 <= len(p) <= 3 or not all(inteiro(x) and 1 <= x <= 999 for x in p):
        return [f"{w}: indica 2 ou 3 «compras» (ou «parcelas») com números inteiros de 1 a 999."]
    if sum(p) > 999:
        return [f"{w}: a soma tem de ser no máximo 999 (o MAB só tem centenas, dezenas e unidades)."]
    return []


def validar(a):
    """As mesmas regras de validarAula() em src/motor.js."""
    e = []
    if not isinstance(a, dict):
        return ["O bloco AULA tem de ser um objeto JSON { ... }."]
    if not tem_texto(a.get("titulo")):
        e.append("Falta o «titulo» da aula.")
    if a.get("ano") not in (1, 2, 3, 4) or isinstance(a.get("ano"), bool):
        e.append("«ano» tem de ser 1, 2, 3 ou 4 (número, sem aspas).")
    rondas = a.get("rondas")
    if not isinstance(rondas, list) or not rondas:
        e.append("Falta a lista «rondas».")
        return e
    for ri, r in enumerate(rondas, 1):
        onde = f"Ronda {ri}" + (f" («{r.get('titulo')}»)" if isinstance(r, dict) and r.get("titulo") else "")
        if not isinstance(r, dict) or r.get("tipo") not in TIPOS:
            e.append(f"{onde}: tipo desconhecido «{r.get('tipo') if isinstance(r, dict) else r}». Tipos possíveis: {', '.join(TIPOS)}.")
            continue
        tipo = r["tipo"]
        if r.get("fase") and r["fase"] not in FASES:
            e.append(f"{onde}: fase desconhecida «{r['fase']}». Fases possíveis: {', '.join(FASES)}.")
        itens = r.get("itens")
        if not isinstance(itens, list) or not itens:
            e.append(f"{onde}: falta a lista «itens».")
            continue
        caixas = r.get("caixas")
        if tipo == "classificar" and (not isinstance(caixas, list) or len(caixas) < 2 or not all(tem_texto(c) for c in caixas)):
            e.append(f"{onde}: «caixas» tem de ter pelo menos 2 caixas.")
        for ii, it in enumerate(itens, 1):
            w = f"{onde}, item {ii}"

            def op_erradas():
                er = it.get("erradas")
                if not isinstance(er, list) or not er or not all(tem_texto(x) for x in er):
                    e.append(f"{w}: «erradas» tem de ter pelo menos 1 opção.")
                    return
                if any(norm(x) == norm(it.get("certa")) for x in er):
                    e.append(f"{w}: a resposta certa também aparece em «erradas».")
                if len({norm(x) for x in er}) != len(er):
                    e.append(f"{w}: há opções repetidas em «erradas».")

            if tipo in ("escolher", "verdadeiro_falso", "completar", "escrever", "ditado", "copiar", "ordenar", "mab", "cadeia", "reta", "tabela100", "puzzle", "pontos", "apanhar", "percurso", "algoritmo") and not isinstance(it, dict):
                e.append(f"{w}: tem de ser um objeto {{ ... }}.")
                continue
            if isinstance(it, dict) and "maiusculas" in it and not isinstance(it["maiusculas"], bool):
                e.append(f"{w}: «maiusculas» tem de ser true ou false (sem aspas).")
            if tipo == "escolher":
                if not tem_texto(it.get("pergunta")):
                    e.append(f"{w}: falta a «pergunta».")
                if not tem_texto(it.get("certa")):
                    e.append(f"{w}: falta a resposta «certa».")
                else:
                    op_erradas()
            elif tipo == "verdadeiro_falso":
                if not tem_texto(it.get("afirmacao")):
                    e.append(f"{w}: falta a «afirmacao».")
                if not isinstance(it.get("verdade"), bool):
                    e.append(f"{w}: «verdade» tem de ser true ou false (sem aspas).")
            elif tipo == "completar":
                f = it.get("frase")
                if not tem_texto(f) or str(f).count("___") != 1 or "____" in str(f):
                    e.append(f"{w}: «frase» tem de ter ___ (três traços) uma única vez.")
                if not tem_texto(it.get("certa")):
                    e.append(f"{w}: falta a resposta «certa».")
                elif "erradas" in it:
                    op_erradas()
            elif tipo == "escrever":
                if not tem_texto(it.get("pergunta")):
                    e.append(f"{w}: falta a «pergunta».")
                if "resposta" in it:
                    rs = it["resposta"]
                    if not (tem_texto(rs) or (isinstance(rs, list) and rs and all(tem_texto(x) for x in rs))):
                        e.append(f"{w}: «resposta» tem de ser um texto ou uma lista de respostas aceites.")
                if "minPalavras" in it and not (isinstance(it["minPalavras"], int) and not isinstance(it["minPalavras"], bool) and it["minPalavras"] > 0):
                    e.append(f"{w}: «minPalavras» tem de ser um número inteiro.")
            elif tipo == "ditado":
                if not tem_texto(it.get("palavra")):
                    e.append(f"{w}: falta a «palavra» a ditar.")
            elif tipo == "copiar":
                if not tem_texto(it.get("palavra")):
                    e.append(f"{w}: falta a «palavra» a copiar.")
                elif not COPIAVEIS.match(unicodedata.normalize("NFC", str(it["palavra"]))):
                    e.append(f"{w}: «{it['palavra']}» tem caracteres que o tipo copiar não ensina (usa letras, acentos, espaço e . , ! ? -).")
            elif tipo == "pares":
                if not (isinstance(it, list) and len(it) == 2 and all(tem_texto(x) for x in it)):
                    e.append(f"{w}: cada par tem de ser [\"esquerda\", \"direita\"].")
            elif tipo == "classificar":
                if not (isinstance(it, list) and len(it) == 2 and tem_texto(it[0])):
                    e.append(f"{w}: cada item tem de ser [\"texto\", \"caixa\"].")
                elif isinstance(caixas, list) and it[1] not in caixas:
                    e.append(f"{w}: a caixa «{it[1]}» não existe em «caixas».")
            elif tipo == "ordenar":
                p = it.get("pecas")
                if not (isinstance(p, list) and len(p) >= 2 and all(tem_texto(x) for x in p)):
                    e.append(f"{w}: «pecas» tem de ter pelo menos 2 peças, já pela ordem certa.")
                elif len({norm(x) for x in p}) == 1:
                    e.append(f"{w}: as peças são todas iguais.")
            elif tipo in ("mab", "cadeia", "reta", "tabela100"):
                e.extend(validar_matematica(tipo, it, w))
            elif tipo in ("puzzle", "pontos", "apanhar", "percurso"):
                e.extend(validar_minijogo(tipo, it, w))
            elif tipo == "algoritmo":
                e.extend(validar_algoritmo(it, w))
        if tipo == "pares":
            ok = [p for p in itens if isinstance(p, list) and len(p) == 2]
            esq, dirt = [norm(p[0]) for p in ok], [norm(p[1]) for p in ok]
            if len(set(esq)) != len(esq) or len(set(dirt)) != len(dirt):
                e.append(f"{onde}: há textos repetidos nos pares (cada lado tem de ser diferente).")
            if r.get("visual") == "memoria" and len(set(esq + dirt)) != len(esq) + len(dirt):
                e.append(f"{onde}: no jogo da memória um texto não pode aparecer dos dois lados.")
    if not any(isinstance(r, dict) and r.get("fase") != "bonus" for r in rondas):
        e.append("Tem de existir pelo menos uma ronda que não seja de bónus.")
    e.extend(validar_consulta(a))
    e.extend(validar_filmes(a))
    e.extend(validar_escape(a))
    if "animacoes" in a and a["animacoes"] not in ("obrigatorias", "opcionais"):
        e.append("«animacoes» tem de ser «obrigatorias» ou «opcionais».")
    return e


def norm_escape(x):
    x = unicodedata.normalize("NFD", str(x or ""))
    return "".join(ch for ch in x if unicodedata.category(ch) != "Mn" and ch.isalnum()).upper()


def validar_escape(a):
    """Escape room (V3.8): as mesmas regras de validarEscape() em src/motor.js."""
    E = a.get("escape")
    if E is None:
        return []
    if not isinstance(E, dict):
        return ["«escape» tem de ser um objeto { ... }."]
    e = []
    if not tem_texto(E.get("palavra")):
        e.append("Escape room: falta a «palavra» secreta do cadeado final.")
    rondas = [r for r in a.get("rondas", []) if isinstance(r, dict)]
    for ri, r in enumerate(a.get("rondas", []), 1):
        if isinstance(r, dict) and "chave" in r and not (tem_texto(str(r["chave"])) and len(str(r["chave"])) <= 4):
            e.append(f"Ronda {ri}: «chave» tem de ser uma letra, um número ou um texto curto (até 4 caracteres).")
    chaves = [str(r["chave"]) for r in rondas if r.get("fase") != "bonus" and "chave" in r]
    if tem_texto(E.get("palavra")) and chaves and sorted(norm_escape("".join(chaves))) != sorted(norm_escape(E["palavra"])):
        e.append(f"Escape room: as chaves das salas («{' '.join(chaves)}») não têm exatamente as letras da palavra «{E['palavra']}».")
    return e

POSES = ["ola", "aponta", "duvida", "ideia", "portatil", "trofeu"]


def validar_filmes(a):
    """Animações (V3.7): as mesmas regras de validarFilmes() em src/motor.js."""
    e = []

    def cenas(lista, onde):
        if lista is None:
            return
        if not isinstance(lista, list) or not lista:
            e.append(f"{onde}: tem de ser uma lista de cenas."); return
        for k, c in enumerate(lista, 1):
            w = f"{onde}, cena {k}"
            if not isinstance(c, dict):
                e.append(f"{w}: tem de ser um objeto {{ ... }}."); continue
            if not tem_texto(c.get("texto")):
                e.append(f"{w}: falta o «texto» (a legenda).")
            if "itens" in c and not (isinstance(c["itens"], list) and all(tem_texto(x) for x in c["itens"])):
                e.append(f"{w}: «itens» tem de ser uma lista de textos.")
            if "friso" in c and not (isinstance(c["friso"], list) and all(isinstance(x, list) and len(x) == 2 and all(tem_texto(y) for y in x) for x in c["friso"])):
                e.append(f"{w}: «friso» tem de ser uma lista de pares [data, texto].")
            if "pose" in c and c["pose"] not in POSES:
                e.append(f"{w}: «pose» tem de ser uma destas: {', '.join(POSES)}.")
            if "efeito" in c and c["efeito"] not in ("zoom", "revelar"):
                e.append(f"{w}: «efeito» tem de ser «zoom» ou «revelar».")
            if "duracao" in c and not (isinstance(c["duracao"], (int, float)) and not isinstance(c["duracao"], bool) and 2 <= c["duracao"] <= 60):
                e.append(f"{w}: «duracao» tem de ser um número de 2 a 60 (segundos).")
    cenas(a.get("abertura"), "Abertura")
    for ri, r in enumerate(a.get("rondas", []), 1):
        if isinstance(r, dict):
            cenas(r.get("animacao"), f"Ronda {ri}" + (f" («{r['titulo']}»)" if r.get("titulo") else "") + ", animação")
    return e


def validar_consulta(a):
    """Caderno do Ticl@s (V3.6): as mesmas regras de validarConsulta() em src/motor.js."""
    e, rondas = [], [r for r in a.get("rondas", []) if isinstance(r, dict)]
    consulta = a.get("consulta")
    if consulta is None:
        for ri, r in enumerate(a.get("rondas", []), 1):
            if isinstance(r, dict) and r.get("consulta"):
                e.append(f"Ronda {ri}: tem «consulta» mas a aula não tem páginas de «consulta».")
        return e
    if not isinstance(consulta, list) or not consulta:
        return ["«consulta» tem de ser uma lista de páginas."]
    ids = set()
    textos = lambda v: isinstance(v, list) and all(tem_texto(x) for x in v)
    for k, p in enumerate(consulta, 1):
        w = f"Página de consulta {k}"
        if not isinstance(p, dict):
            e.append(f"{w}: tem de ser um objeto {{ ... }}."); continue
        if not tem_texto(p.get("titulo")):
            e.append(f"{w}: falta o «titulo».")
        if "id" in p:
            if not isinstance(p["id"], str) or not p["id"].strip():
                e.append(f"{w}: «id» tem de ser texto.")
            elif p["id"] in ids:
                e.append(f"{w}: o «id» «{p['id']}» está repetido.")
            else:
                ids.add(p["id"])
        if not any(isinstance(p.get(c), list) and p.get(c) for c in ("paragrafos", "lista", "tabela")):
            e.append(f"{w}: precisa de «paragrafos», «lista» ou «tabela».")
        for c in ("paragrafos", "lista"):
            if c in p and not textos(p[c]):
                e.append(f"{w}: «{c}» tem de ser uma lista de textos.")
        tb = p.get("tabela")
        if tb is not None and not (isinstance(tb, list) and len(tb) >= 2 and all(isinstance(l, list) and len(l) == len(tb[0]) and all(tem_texto(c) for c in l) for l in tb)):
            e.append(f"{w}: «tabela» tem de ter um cabeçalho e linhas com o mesmo número de colunas.")
    for ri, r in enumerate(a.get("rondas", []), 1):
        if isinstance(r, dict) and "consulta" in r and r["consulta"] not in ids:
            e.append(f"Ronda {ri}: «consulta» «{r['consulta']}» não corresponde a nenhuma página (usa o «id» da página).")
    return e


FATOR_ANO = {1: 1.5, 2: 1.2, 3: 1.0, 4: 0.9}  # os mais novos demoram mais em cada item


def segundos_cena(c, ano):
    """Igual a duracaoCena() em src/motor.js (perfil turma, sem som)."""
    if isinstance(c.get("duracao"), (int, float)) and not isinstance(c.get("duracao"), bool) and c["duracao"] > 0:
        return c["duracao"]
    pal = lambda x: len(str(x or "").replace("**", "").split())
    n = pal(c.get("texto")) + pal(c.get("titulo")) + sum(pal(x) for x in c.get("itens", [])) + sum(pal(x[1]) + 1 for x in c.get("friso", []) if isinstance(x, list) and len(x) == 2)
    s = 2.5 + n * {1: 0.9, 2: 0.75, 3: 0.6, 4: 0.5}.get(ano, 0.6) + (len(c.get("itens", [])) + len(c.get("friso", []))) * 0.6
    return min(30, max(5, s))


def minutos(rondas, ano=3, abertura=None):
    s = filmes = 0
    for r in rondas:
        s += 30
        for it in r.get("itens", []):
            livre = r["tipo"] == "escrever" and isinstance(it, dict) and "resposta" not in it
            s += SEGUNDOS["frase"] if livre else SEGUNDOS.get(r["tipo"], 30)
        filmes += sum(segundos_cena(c, ano) for c in (r.get("animacao") or []) if isinstance(c, dict))
    filmes += sum(segundos_cena(c, ano) for c in (abertura or []) if isinstance(c, dict))
    return max(1, round((s * FATOR_ANO.get(ano, 1.0) + filmes) / 60))


def json_seguro(aula):
    # "</" dentro de <script> fecharia o bloco; "<\/" continua a ser JSON válido
    return json.dumps(aula, ensure_ascii=False, indent=2).replace("</", "<\\/")


def montar_modelo():
    molde = (SRC / "molde.html").read_text(encoding="utf-8")
    return (molde.replace("/*ESTILO*/", (SRC / "estilo.css").read_text(encoding="utf-8").strip())
                 .replace("/*MANUSCRITA*/", (SRC / "manuscrita.css").read_text(encoding="utf-8").strip())
                 .replace("__MASCOTE__", (SRC / "mascote.json").read_text(encoding="utf-8").strip())
                 .replace("/*LINGUAS*/", (SRC / "linguas.js").read_text(encoding="utf-8").strip())
                 .replace("/*MOTOR*/", (SRC / "motor.js").read_text(encoding="utf-8").strip()))



# ---------- navegação comum dos jogos ----------
PORTAL_TICLAS = "https://cspsya.github.io/ticlas-investigadores-digitais/"
BOTAO_PORTAL = (
    '<a id="ticlas-voltar-portal" href="' + PORTAL_TICLAS + '" '
    'aria-label="Voltar à página inicial do Ticl@s" title="Voltar à página inicial do Ticl@s">'
    '<span aria-hidden="true">←</span> Voltar ao Ticl@s</a>'
)
ESTILO_PORTAL = """<style id="ticlas-estilo-portal">
#ticlas-voltar-portal {
  box-sizing:border-box; display:inline-flex; align-items:center; justify-content:center;
  gap:7px; flex:0 0 auto; min-height:44px; padding:8px 14px;
  border:2px solid #285775; border-radius:12px; background:#fff; color:#285775;
  font:800 16px/1.2 'Nunito','Segoe UI',sans-serif; white-space:nowrap;
  text-decoration:none; cursor:pointer; touch-action:manipulation; position:relative;
}
#ticlas-voltar-portal:hover {background:#285775;color:#fff}
#ticlas-voltar-portal:focus-visible {outline:3px solid #E8834A;outline-offset:3px}
#ticlas-voltar-portal span {font-size:21px;line-height:1}
#ticlas-nav-portal {box-sizing:border-box;flex:0 0 auto;width:100%;max-width:1180px;
  margin:0 auto;padding:6px 14px;display:flex;justify-content:flex-start;align-items:center}
body > #ticlas-nav-portal + .app {min-height:calc(100% - 56px)}
@media print {#ticlas-voltar-portal,#ticlas-nav-portal {display:none!important}}
</style>"""


def com_botao_portal(html):
    """Acrescenta uma ligação real ao portal sem modificar a lógica do jogo."""
    if 'id="ticlas-voltar-portal"' in html:
        return html
    corpo = re.search(r"<body\b[^>]*>", html, re.I)
    cabeca = re.search(r"</head\s*>", html, re.I)
    if not corpo or not cabeca:
        raise ValueError("HTML sem head/body para acrescentar o botão do portal.")
    # Limita a pesquisa ao HTML inicial, evitando modelos de ecrãs em JavaScript.
    inicio = corpo.end()
    script = re.search(r"<script\b", html[inicio:], re.I)
    fim = inicio + script.start() if script else len(html)
    trecho = html[inicio:fim]
    antigo = re.search(r'<a\b[^>]*class="(?:portal-link|back)"[^>]*href="[^"]*index\.html[^"]*"[^>]*>.*?</a>', trecho, re.I | re.S)
    header = re.search(r"</header\s*>", trecho, re.I)
    jogador = re.search(r'<div\s+id="app">\s*(?=<div\s+id="ecra-wrap">)', trecho, re.I)
    if antigo:
        # Substitui o botão antigo para não duplicar a navegação.
        trecho = trecho[:antigo.start()] + BOTAO_PORTAL + trecho[antigo.end():]
    elif header:
        trecho = trecho[:header.start()] + "\n    " + BOTAO_PORTAL + "\n  " + trecho[header.start():]
    else:
        nav = '\n<div id="ticlas-nav-portal">' + BOTAO_PORTAL + '</div>\n'
        # Os jogos com palco fixo ocupam 100vh: a barra fica dentro do flex,
        # permitindo que o palco se adapte à área restante sem cortar controlos.
        pos = jogador.end() if jogador else 0
        trecho = trecho[:pos] + nav + trecho[pos:]
    html = html[:inicio] + trecho + html[fim:]
    return html[:cabeca.start()] + ESTILO_PORTAL + "\n" + html[cabeca.start():]


def atualizar_botoes_portal():
    """Aplica a navegação também aos jogos antigos e aos HTML autónomos."""
    total = 0
    for f in sorted((RAIZ / "jogos").rglob("*.html")):
        original = f.read_text(encoding="utf-8")
        atualizado = com_botao_portal(original)
        if atualizado != original:
            f.write_text(atualizado, encoding="utf-8")
            total += 1
    print(f"✓ Botão do portal: {total} jogos atualizados.")


def com_aula(html, aula):
    if not BLOCO.search(html):
        sys.exit("Erro: o modelo não tem o bloco AULA:INICIO / AULA:FIM.")
    return com_botao_portal(BLOCO.sub(lambda m: m.group(1) + "\n" + json_seguro(aula) + "\n" + m.group(3), html, count=1))


def ler_aula(caminho):
    texto = Path(caminho).read_text(encoding="utf-8")
    if caminho.lower().endswith((".html", ".htm")):
        m = BLOCO.search(texto)
        if not m:
            sys.exit("Erro: este HTML não tem o bloco AULA:INICIO / AULA:FIM.")
        texto = m.group(2)
    try:
        return json.loads(texto)
    except json.JSONDecodeError as err:
        sys.exit(f"Erro: o JSON não é válido (linha {err.lineno}, coluna {err.colno}): {err.msg}. Verifica vírgulas, aspas e chavetas.")


def relatorio(aula, erros):
    if erros:
        print("✗ O conteúdo tem problemas:")
        for x in erros:
            print("  -", x)
        return False
    princ = [r for r in aula["rondas"] if r.get("fase") != "bonus"]
    bonus = [r for r in aula["rondas"] if r.get("fase") == "bonus"]
    print(f"✓ Conteúdo válido: «{aula['titulo']}» · {len(princ)} rondas + {len(bonus)} de bónus · "
          f"≈ {minutos(princ, aula['ano'], aula.get('abertura'))} min (+ {minutos(bonus, aula['ano'])} min de bónus)" if bonus else
          f"✓ Conteúdo válido: «{aula['titulo']}» · {len(princ)} rondas · ≈ {minutos(princ, aula['ano'], aula.get('abertura'))} min")
    alvo = aula.get("minutos")
    if isinstance(alvo, (int, float)) and minutos(princ, aula["ano"], aula.get("abertura")) < 0.6 * alvo:
        print(f"  ! Aviso: a duração estimada é bem inferior aos {alvo} min indicados. Acrescenta itens ou rondas.")
    return True


def semana(data):
    seg = data - dt.timedelta(days=data.weekday())
    sex = seg + dt.timedelta(days=4)
    if seg.month == sex.month:
        texto = f"{seg.day}–{sex.day} {MESES[seg.month - 1]} {seg.year}"
    else:
        texto = f"{seg.day} {MESES[seg.month - 1]}–{sex.day} {MESES[sex.month - 1]} {sex.year}"
    return seg, texto


def nome_ficheiro(aula):
    turma = re.sub(r"[^A-Za-z0-9]", "", str(aula.get("turma", "")).replace("º", ""))
    base = unicodedata.normalize("NFD", f"{turma}_{aula['titulo']}")
    base = "".join(c for c in base if unicodedata.category(c) != "Mn")
    return re.sub(r"[^A-Za-z0-9]+", "_", base).strip("_")[:70] + ".html"


def registar(aula, url, id_padrao):
    """Acrescenta ou atualiza (pelo id) o registo da aula em jogos.json. Devolve True se mudou."""
    data = dt.date.fromisoformat(aula["data"])
    _, texto_semana = semana(data)
    catalogo_path = RAIZ / "jogos.json"
    catalogo = json.loads(catalogo_path.read_text(encoding="utf-8")) if catalogo_path.exists() else []
    principais = [r for r in aula["rondas"] if r.get("fase") != "bonus"]
    registo = {
        "id": aula.get("id") or id_padrao,
        "turma": aula["turma"], "ano": aula["ano"], "titulo": aula["titulo"],
        "descricao": aula.get("descricao") or aula.get("objetivo") or "",
        "disciplina": aula["disciplina"], "data": aula["data"], "semana": texto_semana, "url": url,
        "duracao": f"até {aula['minutos']} min" if aula.get("minutos") else f"≈ {minutos(principais, aula['ano'], aula.get('abertura'))} min",
        "estado": aula.get("estado", "em validação"),
    }
    antigo = next((c for c in catalogo if c.get("id") == registo["id"]), None)
    # Campos opcionais do portal: vêm da aula; se a aula não os tiver, mantêm-se os que já estavam em jogos.json.
    for campo in ("resumo", "focoTic", "ilustracao", "tipo", "categoria"):
        valor = aula.get(campo, (antigo or {}).get(campo))
        if valor not in (None, "", []):
            registo[campo] = valor
    if antigo == registo:
        return False
    if antigo:
        catalogo[catalogo.index(antigo)] = registo
    else:
        catalogo.append(registo)
    catalogo_path.write_text(json.dumps(catalogo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return True


def campos_publicacao(aula):
    erros = [f"falta o campo «{c}» (obrigatório para publicar)." for c in ("data", "turma", "disciplina") if not tem_texto(aula.get(c))]
    if tem_texto(aula.get("data")):
        try:
            dt.date.fromisoformat(aula["data"])
        except ValueError:
            erros.append("«data» tem de ter o formato AAAA-MM-DD.")
    return erros


def publicar(aula, html):
    erros = campos_publicacao(aula)
    if erros:
        sys.exit("Erro: " + " ".join(erros))
    seg, texto_semana = semana(dt.date.fromisoformat(aula["data"]))
    pasta = RAIZ / "jogos" / seg.isoformat()
    pasta.mkdir(parents=True, exist_ok=True)
    destino = pasta / nome_ficheiro(aula)
    destino.write_text(html, encoding="utf-8")
    url = destino.relative_to(RAIZ).as_posix()
    registar(aula, url, f"{aula['data']}-{destino.stem}")
    print(f"✓ Publicado em {url} e registado em jogos.json (semana {texto_semana}).")


def gerar_aulas():
    """Cada aulas/**/*.json dá origem a jogos/<segunda-feira da semana>/<mesmo nome>.html e a um registo em jogos.json."""
    ficheiros = sorted(AULAS.rglob("*.json")) if AULAS.exists() else []
    if not ficheiros:
        print("Não há aulas em aulas/.")
        atualizar_botoes_portal()
        return True
    modelo, ok, gerados = montar_modelo(), True, 0
    for f in ficheiros:
        rel = f.relative_to(RAIZ).as_posix()
        try:
            aula = json.loads(f.read_text(encoding="utf-8-sig"))
        except json.JSONDecodeError as err:
            print(f"✗ {rel}: o JSON não é válido (linha {err.lineno}, coluna {err.colno}): {err.msg}. Verifica vírgulas, aspas e chavetas.")
            ok = False
            continue
        erros = validar(aula) + (campos_publicacao(aula) if isinstance(aula, dict) else [])
        if erros:
            print(f"✗ {rel}:")
            for x in erros:
                print("   -", x)
            ok = False
            continue
        seg, texto_semana = semana(dt.date.fromisoformat(aula["data"]))
        destino = RAIZ / "jogos" / seg.isoformat() / (f.stem + ".html")
        destino.parent.mkdir(parents=True, exist_ok=True)
        html = embutir_emojis(com_aula(modelo, aula))[0]
        if not destino.exists() or destino.read_text(encoding="utf-8") != html:
            destino.write_text(html, encoding="utf-8")
            gerados += 1
        mudou = registar(aula, destino.relative_to(RAIZ).as_posix(), f.stem)
        print(f"✓ {rel} → {destino.relative_to(RAIZ).as_posix()} (semana {texto_semana}){' · jogos.json atualizado' if mudou else ''}")
    atualizar_botoes_portal()
    print(f"{'✓' if ok else '✗'} Aulas: {len(ficheiros)} ficheiros, {gerados} jogos gerados ou atualizados.")
    return ok


# ---------- imagens dos emojis (iguais em todos os computadores) ----------
def _modulo_emoji():
    try:
        import emoji
        return emoji
    except ImportError:
        sys.exit("Para embutir as imagens dos emojis é preciso instalar: pip install emoji")


def emojis_no_texto(texto):
    """Emojis desenhados como imagem colorida (os mesmos que src/emojis.js troca)."""
    emoji = _modulo_emoji()
    texto = BLOCO_EMOJIS.sub("", texto)
    texto = re.sub(r"data:[\w/+.-]+;base64,[A-Za-z0-9+/=]+", "", texto)
    encontrados = set()
    for m in emoji.emoji_list(texto):
        e = m["emoji"]
        info = emoji.EMOJI_DATA.get(e, {})
        if "\ufe0f" in e or "\u200d" in e or "\u20e3" in e or info.get("status") == emoji.STATUS["fully_qualified"]:
            encontrados.add(e.replace("\ufe0f", ""))
    return encontrados


def svg_noto(e):
    nome = "_".join(f"{ord(c):04x}" for c in e)
    CACHE.mkdir(exist_ok=True)
    f = CACHE / f"{nome}.svg"
    if f.exists():
        return f.read_text(encoding="utf-8") or None
    try:
        with urllib.request.urlopen(NOTO.format(nome), timeout=30) as r:
            svg = r.read().decode("utf-8")
    except urllib.error.HTTPError as err:
        if err.code == 404:
            f.write_text("", encoding="utf-8")
            return None
        raise
    f.write_text(svg, encoding="utf-8")
    return svg


SVG_NS, XLINK_NS = "http://www.w3.org/2000/svg", "http://www.w3.org/1999/xlink"


def limpar_svg(svg):
    """Fica só com o desenho: tira dados do Illustrator, metadados e atributos de outros programas."""
    import xml.etree.ElementTree as ET
    svg = re.sub(r"<\?xml.*?\?>", "", svg, flags=re.S)
    try:
        raiz = ET.fromstring(svg)
    except ET.ParseError:
        return svg

    def limpar(el):
        for filho in list(el):
            tag = filho.tag if isinstance(filho.tag, str) else ""
            if not tag.startswith("{%s}" % SVG_NS) or tag.endswith(("}foreignObject", "}metadata", "}title", "}desc")):
                el.remove(filho)
            else:
                limpar(filho)
        for a in list(el.attrib):
            if a.startswith("{") and not a.startswith("{%s}" % XLINK_NS):
                del el.attrib[a]
    limpar(raiz)
    ET.register_namespace("", SVG_NS)
    ET.register_namespace("xlink", XLINK_NS)
    return ET.tostring(raiz, encoding="unicode")


def data_uri(svg):
    """SVG compacto: só o desenho, sem espaços, coordenadas com 1 casa decimal e codificação mínima."""
    svg = limpar_svg(svg)
    svg = re.sub(r"<!--.*?-->", "", svg, flags=re.S)
    svg = re.sub(r">\s+<", "><", svg).strip()
    svg = re.sub(r"\s+", " ", svg)
    svg = re.sub(r"(\d*\.\d)\d+", r"\1", svg)
    svg = re.sub(r"(?<![\d.])0\.(\d)", r".\1", svg)
    svg = svg.replace('"', "'").replace("%", "%25").replace("#", "%23")
    return "data:image/svg+xml," + svg


def embutir_emojis(html):
    """Acrescenta (ou atualiza) o bloco com as imagens dos emojis usados no ficheiro."""
    html = BLOCO_EMOJIS.sub("\n", html)
    mapa, falta = {}, []
    for e in sorted(emojis_no_texto(html)):
        svg = svg_noto(e)
        if svg:
            mapa[e] = data_uri(svg)
        else:
            falta.append(e)
    if not mapa:
        return html, 0, falta
    motor = (SRC / "emojis.js").read_text(encoding="utf-8").strip()
    bloco = ("<!-- EMOJIS:INICIO -->\n<!-- Imagens dos emojis: Noto Emoji, Google, licença Apache 2.0 (github.com/googlefonts/noto-emoji) -->\n"
             f'<script type="application/json" id="emojis-svg">{json.dumps(mapa, ensure_ascii=False, separators=(",", ":"))}</script>\n'
             f"<script>\n{motor}\n</script>\n<!-- EMOJIS:FIM -->\n")
    i = html.lower().rfind("</body>")
    html = html[:i] + bloco + html[i:] if i >= 0 else html + bloco
    return html, len(mapa), falta


def imagens(ficheiros):
    for f in ficheiros:
        p = Path(f)
        html, n, falta = embutir_emojis(p.read_text(encoding="utf-8"))
        p.write_text(html, encoding="utf-8")
        print(f"✓ {p}: {n} imagens embutidas" + (f" · sem imagem Noto: {' '.join(falta)}" if falta else ""))


# ---------- verificação do site inteiro (GitHub Actions) ----------
def verificar_site():
    erros, avisos = [], []
    cat_path = RAIZ / "jogos.json"
    try:
        catalogo = json.loads(cat_path.read_text(encoding="utf-8"))
        if not isinstance(catalogo, list):
            raise ValueError("tem de ser uma lista [ ... ]")
    except Exception as err:
        erros.append(f"jogos.json não é válido: {err}")
        catalogo = []
    ids = set()
    for i, c in enumerate(catalogo, 1):
        onde = f"jogos.json, registo {i}" + (f" («{c.get('titulo')}»)" if isinstance(c, dict) and c.get("titulo") else "")
        if not isinstance(c, dict):
            erros.append(f"{onde}: tem de ser um objeto {{ ... }}.")
            continue
        for campo in ("turma", "ano", "titulo", "descricao", "disciplina", "data", "semana", "url"):
            if not tem_texto(c.get(campo)):
                erros.append(f"{onde}: falta «{campo}».")
        if c.get("ano") not in (1, 2, 3, 4):
            erros.append(f"{onde}: «ano» tem de ser 1, 2, 3 ou 4.")
        try:
            dt.date.fromisoformat(str(c.get("data")))
        except ValueError:
            erros.append(f"{onde}: «data» tem de ter o formato AAAA-MM-DD.")
        if c.get("id"):
            if c["id"] in ids:
                erros.append(f"{onde}: o id «{c['id']}» está repetido.")
            ids.add(c["id"])
        if tem_texto(c.get("url")) and not (RAIZ / c["url"]).is_file():
            erros.append(f"{onde}: o ficheiro «{c['url']}» não existe.")
    registados = {c.get("url") for c in catalogo if isinstance(c, dict)}
    for f in sorted((RAIZ / "jogos").rglob("*.html")):
        rel = f.relative_to(RAIZ).as_posix()
        texto = f.read_text(encoding="utf-8")
        if texto.count('id="ticlas-voltar-portal"') != 1 or BOTAO_PORTAL not in texto:
            erros.append(f"{rel}: falta o botão de regresso à página inicial do Ticl@s ou está duplicado.")
        m = BLOCO.search(texto)
        if m:
            try:
                aula = json.loads(m.group(2))
            except json.JSONDecodeError as err:
                erros.append(f"{rel}: o bloco AULA não é JSON válido (linha {err.lineno}): {err.msg}.")
            else:
                erros.extend(f"{rel}: {x}" for x in validar(aula))
        if rel not in registados:
            avisos.append(f"{rel} não está registado em jogos.json (não aparece no portal).")
    for x in avisos:
        print("  ! Aviso:", x)
    if erros:
        print("✗ Há problemas que impedem a publicação:")
        for x in erros:
            print("  -", x)
        return False
    print(f"✓ Site verificado: {len(catalogo)} jogos em jogos.json, todos os jogos V3 com conteúdo válido.")
    return True


def preparar_site(destino):
    destino = Path(destino).resolve()
    if destino.exists():
        shutil.rmtree(destino)
    shutil.copytree(RAIZ, destino, ignore=shutil.ignore_patterns(".git", ".github", ".cache-emojis", "__pycache__", destino.name))
    total = 0
    for f in sorted(destino.rglob("*.html")):
        texto = f.read_text(encoding="utf-8")
        if f.is_relative_to(destino / "jogos"):
            texto = com_botao_portal(texto)
        html, n, falta = embutir_emojis(texto)
        if n or f.is_relative_to(destino / "jogos"):
            f.write_text(html, encoding="utf-8")
        if n:
            total += 1
        if falta:
            print(f"  ! {f.relative_to(destino)}: sem imagem Noto para {' '.join(falta)}")
    print(f"✓ Site preparado em {destino.name}/ ({total} páginas com imagens embutidas).")


def main():
    ap = argparse.ArgumentParser(description="Construir e validar jogos Investigadores Digitais (V3).")
    ap.add_argument("aula", nargs="?", help="ficheiro JSON com a AULA")
    ap.add_argument("-o", "--saida", help="ficheiro HTML a gerar")
    ap.add_argument("--publicar", action="store_true", help="gerar em jogos/AAAA-MM-DD/ e registar em jogos.json")
    ap.add_argument("--validar", metavar="FICHEIRO", help="só validar um .json ou um .html já gerado")
    ap.add_argument("--imagens", nargs="+", metavar="HTML", help="embutir as imagens dos emojis em jogos já feitos")
    ap.add_argument("--verificar-site", action="store_true", help="verificar todos os jogos e o jogos.json")
    ap.add_argument("--aulas", action="store_true", help="gerar os jogos de todas as aulas em aulas/")
    ap.add_argument("--preparar-site", metavar="PASTA", help="copiar o site para PASTA e embutir as imagens")
    a = ap.parse_args()

    if a.imagens:
        imagens(a.imagens)
        return
    if a.verificar_site:
        sys.exit(0 if verificar_site() else 1)
    if a.aulas:
        sys.exit(0 if gerar_aulas() else 1)
    if a.preparar_site:
        preparar_site(a.preparar_site)
        return

    if a.validar:
        aula = ler_aula(a.validar)
        sys.exit(0 if relatorio(aula, validar(aula)) else 1)

    modelo = montar_modelo()
    if not a.aula:
        aula = ler_aula(str(EXEMPLO))
        if not relatorio(aula, validar(aula)):
            sys.exit(1)
        MODELO.write_text(embutir_emojis(com_aula(modelo, aula))[0], encoding="utf-8")
        print(f"✓ Modelo reconstruído: {MODELO.relative_to(RAIZ)}")
        for ex in sorted((BASE / "exemplos").glob("*.json")):
            if ex == EXEMPLO:
                continue
            aula_ex = ler_aula(str(ex))
            if relatorio(aula_ex, validar(aula_ex)):
                ex.with_suffix(".html").write_text(embutir_emojis(com_aula(modelo, aula_ex))[0], encoding="utf-8")
                print(f"✓ Exemplo: {ex.with_suffix('.html').relative_to(RAIZ)}")
        return

    aula = ler_aula(a.aula)
    if not relatorio(aula, validar(aula)):
        sys.exit(1)
    html = embutir_emojis(com_aula(modelo, aula))[0]
    if a.publicar:
        publicar(aula, html)
        return
    destino = Path(a.saida) if a.saida else Path(a.aula).with_suffix(".html")
    destino.write_text(html, encoding="utf-8")
    print(f"✓ Jogo gerado: {destino}")


if __name__ == "__main__":
    main()
