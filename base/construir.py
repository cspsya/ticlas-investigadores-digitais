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
  python3 base/construir.py --ficha aula.json        gera a ficha da aula (HTML para imprimir) a partir do «guia»
  python3 base/construir.py --exportar-generico PASTA aulas com «guia» em versão genérica, sem dados da escola

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
TIPOS = ["escolher", "verdadeiro_falso", "completar", "escrever", "ditado", "pares", "classificar", "ordenar"]
FASES = ["aquecimento", "desafios", "escrita", "bonus"]
MESES = ["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."]
SEGUNDOS = {"escolher": 30, "verdadeiro_falso": 25, "completar": 35, "escrever": 60, "frase": 180,
            "ditado": 45, "pares": 20, "classificar": 20, "ordenar": 45}
CACHE = BASE / ".cache-emojis"
NOTO = "https://raw.githubusercontent.com/googlefonts/noto-emoji/main/2D/svg/emoji_u{}.svg"
BLOCO_EMOJIS = re.compile(r"\n?<!-- EMOJIS:INICIO -->.*?<!-- EMOJIS:FIM -->\n?", re.S)
BLOCO = re.compile(r'(<!-- AULA:INICIO -->\s*<script type="application/json" id="aula">)(.*?)(</script>\s*<!-- AULA:FIM -->)', re.S)


def norm(s):
    return unicodedata.normalize("NFC", re.sub(r"\s+", " ", str(s)).strip().lower())


def tem_texto(v):
    return (isinstance(v, str) and v.strip() != "") or (isinstance(v, (int, float)) and not isinstance(v, bool))


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

            if tipo in ("escolher", "verdadeiro_falso", "completar", "escrever", "ditado", "ordenar") and not isinstance(it, dict):
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
        if tipo == "pares":
            ok = [p for p in itens if isinstance(p, list) and len(p) == 2]
            esq, dirt = [norm(p[0]) for p in ok], [norm(p[1]) for p in ok]
            if len(set(esq)) != len(esq) or len(set(dirt)) != len(dirt):
                e.append(f"{onde}: há textos repetidos nos pares (cada lado tem de ser diferente).")
            if r.get("visual") == "memoria" and len(set(esq + dirt)) != len(esq) + len(dirt):
                e.append(f"{onde}: no jogo da memória um texto não pode aparecer dos dois lados.")
    if not any(isinstance(r, dict) and r.get("fase") != "bonus" for r in rondas):
        e.append("Tem de existir pelo menos uma ronda que não seja de bónus.")
    if "guia" in a:
        e.extend(validar_guia(a["guia"]))
    return e


RECURSOS = ["jogo", "apresentacao"]


def lista_textos(v):
    return isinstance(v, list) and bool(v) and all(tem_texto(x) for x in v)


def validar_guia(g):
    """Guia da aula (opcional): sequência, indicadores e materiais. O jogo ignora-o; só serve a ficha da aula."""
    if not isinstance(g, dict):
        return ["«guia» tem de ser um objeto { ... }."]
    e = []
    seq = g.get("sequencia")
    if not isinstance(seq, list) or not seq:
        e.append("Guia: falta a lista «sequencia» (os momentos da aula).")
    else:
        for i, m in enumerate(seq, 1):
            w = f"Guia, momento {i}"
            if not isinstance(m, dict):
                e.append(f"{w}: tem de ser um objeto {{ ... }}.")
                continue
            if not tem_texto(m.get("momento")):
                e.append(f"{w}: falta o nome do «momento» (ex.: Explorar).")
            if not (isinstance(m.get("minutos"), int) and not isinstance(m.get("minutos"), bool) and m["minutos"] > 0):
                e.append(f"{w}: «minutos» tem de ser um número inteiro (sem aspas).")
            if not tem_texto(m.get("descricao")):
                e.append(f"{w}: falta a «descricao» do que se faz.")
            if "recurso" in m and m["recurso"] not in RECURSOS:
                e.append(f"{w}: «recurso» tem de ser {' ou '.join(RECURSOS)}.")
    if not lista_textos(g.get("indicadores")):
        e.append("Guia: falta a lista «indicadores» (o que se observa nos alunos).")
    for campo in ("materiais", "aprendizagens"):
        if campo in g and not lista_textos(g[campo]):
            e.append(f"Guia: «{campo}» tem de ser uma lista de textos.")
    if "apresentacao" in g and not tem_texto(g["apresentacao"]):
        e.append("Guia: «apresentacao» tem de ser o endereço da apresentação.")
    return e


def avisos_guia(aula):
    """Avisos (não impedem a publicação): tempos da sequência que não batem certo com o jogo."""
    g = aula.get("guia")
    if not isinstance(g, dict) or not isinstance(g.get("sequencia"), list):
        return []
    av = []
    seq = [m for m in g["sequencia"] if isinstance(m, dict) and isinstance(m.get("minutos"), int)]
    total = sum(m["minutos"] for m in seq)
    if total > 60:
        av.append(f"a sequência soma {total} min, mais do que uma aula de 60 min.")
    pratica = sum(m["minutos"] for m in seq if m.get("recurso") == "jogo")
    princ = [r for r in aula["rondas"] if r.get("fase") != "bonus"]
    estimado = minutos(princ, aula["ano"])
    if not pratica:
        av.append("nenhum momento da sequência tem \"recurso\": \"jogo\".")
    elif estimado > pratica * 1.25:
        av.append(f"o jogo precisa de ≈ {estimado} min, mas o momento com o jogo tem {pratica} min. "
                  "Retira rondas (ou passa-as a bónus) ou dá mais tempo à prática.")
    elif estimado < pratica * 0.6:
        av.append(f"o momento com o jogo tem {pratica} min, mas o jogo só dá para ≈ {estimado} min. Acrescenta itens ou rondas.")
    n = len(g.get("indicadores") or [])
    if n > 5:
        av.append(f"há {n} indicadores; 3 a 5 são mais fáceis de observar numa aula.")
    return av


FATOR_ANO = {1: 1.5, 2: 1.2, 3: 1.0, 4: 0.9}  # os mais novos demoram mais em cada item


def minutos(rondas, ano=3):
    s = 0
    for r in rondas:
        s += 30
        for it in r.get("itens", []):
            livre = r["tipo"] == "escrever" and isinstance(it, dict) and "resposta" not in it
            s += SEGUNDOS["frase"] if livre else SEGUNDOS.get(r["tipo"], 30)
    return max(1, round(s * FATOR_ANO.get(ano, 1.0) / 60))


def json_seguro(aula):
    # "</" dentro de <script> fecharia o bloco; "<\/" continua a ser JSON válido
    return json.dumps(aula, ensure_ascii=False, indent=2).replace("</", "<\\/")


def montar_modelo():
    molde = (SRC / "molde.html").read_text(encoding="utf-8")
    return (molde.replace("/*ESTILO*/", (SRC / "estilo.css").read_text(encoding="utf-8").strip())
                 .replace("__MASCOTE__", (SRC / "mascote.json").read_text(encoding="utf-8").strip())
                 .replace("/*LINGUAS*/", (SRC / "linguas.js").read_text(encoding="utf-8").strip())
                 .replace("/*MOTOR*/", (SRC / "motor.js").read_text(encoding="utf-8").strip()))


def com_aula(html, aula):
    if not BLOCO.search(html):
        sys.exit("Erro: o modelo não tem o bloco AULA:INICIO / AULA:FIM.")
    return BLOCO.sub(lambda m: m.group(1) + "\n" + json_seguro(aula) + "\n" + m.group(3), html, count=1)


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
          f"≈ {minutos(princ, aula['ano'])} min (+ {minutos(bonus, aula['ano'])} min de bónus)" if bonus else
          f"✓ Conteúdo válido: «{aula['titulo']}» · {len(princ)} rondas · ≈ {minutos(princ, aula['ano'])} min")
    alvo = aula.get("minutos")
    if isinstance(alvo, (int, float)) and minutos(princ, aula["ano"]) < 0.6 * alvo and "guia" not in aula:
        print(f"  ! Aviso: a duração estimada é bem inferior aos {alvo} min indicados. Acrescenta itens ou rondas.")
    for x in avisos_guia(aula):
        print("  ! Aviso (guia):", x)
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
        "duracao": f"até {aula['minutos']} min" if aula.get("minutos") else f"≈ {minutos(principais, aula['ano'])} min",
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
    shutil.copytree(RAIZ, destino, ignore=shutil.ignore_patterns(".git", ".github", ".cache-emojis", "__pycache__", "exportar-generico", destino.name))
    total = 0
    for f in sorted(destino.rglob("*.html")):
        texto = f.read_text(encoding="utf-8")
        html, n, falta = embutir_emojis(texto)
        if n:
            f.write_text(html, encoding="utf-8")
            total += 1
        if falta:
            print(f"  ! {f.relative_to(destino)}: sem imagem Noto para {' '.join(falta)}")
    print(f"✓ Site preparado em {destino.name}/ ({total} páginas com imagens embutidas).")


# ---------- aula genérica (para o Gaveta) ----------
# O mesmo JSON serve a escola (missão da turma, no Ticl@s) e o Gaveta (aula genérica, sem dados da escola).
CAMPOS_GENERICOS = ("titulo", "ano", "disciplina", "focoTic", "resumo", "descricao", "objetivo", "minutos", "guia", "rondas")
NOMES_TIPOS = {"escolher": "escolher a resposta", "verdadeiro_falso": "verdadeiro ou falso", "completar": "completar frases",
               "escrever": "escrever", "ditado": "ditado", "pares": "ligar pares", "classificar": "classificar", "ordenar": "ordenar"}
TURMA_NO_TEXTO = re.compile(r"\b[1-4]\s*\.?\s*º\s*[A-H]\b|S[ãa]o Martinho|EB1/PE|Ticl@s", re.I)


def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def aula_generica(aula):
    gen = {k: aula[k] for k in CAMPOS_GENERICOS if k in aula}
    texto = json.dumps({k: v for k, v in gen.items() if k != "titulo"}, ensure_ascii=False)
    avisos = sorted({m.group(0) for m in TURMA_NO_TEXTO.finditer(texto)})
    return gen, avisos


def ficha_html(aula):
    g = aula.get("guia", {})
    focos = aula.get("focoTic") or []
    focos = focos if isinstance(focos, list) else [focos]
    seq = g.get("sequencia", [])
    total = sum(m.get("minutos", 0) for m in seq)
    lista = lambda xs: "".join(f"<li>{esc(x)}</li>" for x in xs)
    rec = {"jogo": "Jogo interativo", "apresentacao": "Apresentação"}
    linhas = "".join(
        f"<tr><td><b>{esc(m['momento'])}</b><span>{m['minutos']} min</span></td><td>{esc(m['descricao'])}"
        f"{'<em>' + rec[m['recurso']] + '</em>' if m.get('recurso') in rec else ''}</td></tr>" for m in seq)
    indic = "".join(f"<tr><td>{esc(x)}</td><td></td><td></td><td></td></tr>" for x in g.get("indicadores", []))
    princ = [r for r in aula["rondas"] if r.get("fase") != "bonus"]
    bonus = [r for r in aula["rondas"] if r.get("fase") == "bonus"]
    rondas = "".join(f"<li>{esc(r.get('titulo') or NOMES_TIPOS[r['tipo']])} <small>· {NOMES_TIPOS[r['tipo']]}"
                     f"{' · bónus' if r.get('fase') == 'bonus' else ''}</small></li>" for r in princ + bonus)
    meta = [f"{aula['ano']}.º ano", aula.get("disciplina", ""), f"{total} min" if total else ""] + [f"Foco TIC: {x}" for x in focos]
    blocos = []
    if aula.get("objetivo"):
        blocos.append(f"<p class='obj'>{esc(aula['objetivo'])}</p>")
    lado = ""
    if g.get("aprendizagens"):
        lado += f"<div><h2>Aprendizagens</h2><ul>{lista(g['aprendizagens'])}</ul></div>"
    if g.get("materiais"):
        lado += f"<div><h2>Materiais</h2><ul>{lista(g['materiais'])}</ul></div>"
    if lado:
        blocos.append(f"<section class='duas'>{lado}</section>")
    blocos.append(f"<h2>Sequência da aula</h2><table class='seq'>{linhas}</table>")
    blocos.append(f"<h2>Jogo interativo</h2><p class='nota'>{len(princ)} rondas, ≈ {minutos(princ, aula['ano'])} min"
                  f"{f' + {len(bonus)} de bónus para quem termina mais cedo' if bonus else ''}.</p><ol class='rondas'>{rondas}</ol>")
    if g.get("apresentacao"):
        blocos.append(f"<p class='nota'>Apresentação: <a href='{esc(g['apresentacao'])}'>{esc(g['apresentacao'])}</a></p>")
    blocos.append("<h2>Observação</h2><table class='obs'><thead><tr><th>Indicador</th><th>Sim</th><th>Em progresso</th>"
                  f"<th>Ainda não</th></tr></thead><tbody>{indic}</tbody></table>"
                  "<p class='nota'>Registo da turma: marcar o número aproximado de alunos em cada coluna.</p>")
    return f"""<!doctype html>
<html lang="pt-PT"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(aula['titulo'])} · {aula['ano']}.º ano</title>
<style>
@page{{size:A4;margin:14mm}}
*{{box-sizing:border-box}}
body{{margin:0;font:15px/1.5 "Segoe UI",Arial,sans-serif;color:#1f2937;background:#f3f4f6}}
main{{max-width:800px;margin:24px auto;background:#fff;padding:36px 40px;border-radius:12px}}
h1{{font-size:26px;line-height:1.2;margin:0 0 8px}}
h2{{font-size:15px;text-transform:uppercase;letter-spacing:.06em;color:#4b5563;margin:26px 0 8px}}
.meta{{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 14px;padding:0;list-style:none}}
.meta li{{background:#eef2f7;border-radius:999px;padding:2px 10px;font-size:13px;font-weight:600}}
.obj{{font-size:16px;margin:0}}
.duas{{display:grid;grid-template-columns:1fr 1fr;gap:24px}}
ul,ol{{margin:0;padding-left:20px}}
table{{width:100%;border-collapse:collapse}}
.seq td{{border-top:1px solid #e5e7eb;padding:10px 8px;vertical-align:top}}
.seq td:first-child{{width:150px}}
.seq td span{{display:block;color:#6b7280;font-size:13px}}
.seq em{{display:inline-block;margin-left:8px;font-style:normal;font-size:12px;background:#fef3c7;border-radius:6px;padding:1px 7px}}
.rondas small{{color:#6b7280}}
.obs th,.obs td{{border:1px solid #d1d5db;padding:8px;text-align:left}}
.obs th:not(:first-child),.obs td:not(:first-child){{width:90px}}
.obs thead{{background:#f9fafb;font-size:13px}}
.nota{{color:#4b5563;font-size:13.5px;margin:6px 0}}
footer{{margin-top:28px;font-size:12px;color:#9ca3af}}
@media print{{table,.duas{{break-inside:avoid}}h2{{break-after:avoid}}body{{background:#fff}}main{{margin:0;padding:0;max-width:none}}a{{color:inherit}}}}
@media (max-width:620px){{main{{padding:24px 18px;margin:0;border-radius:0}}.duas{{grid-template-columns:1fr}}}}
</style></head><body><main>
<h1>{esc(aula['titulo'])}</h1>
<ul class="meta">{''.join(f'<li>{esc(x)}</li>' for x in meta if x)}</ul>
{''.join(blocos)}
<footer>Ficha de aula · TIC no 1.º ciclo · C. Sofia</footer>
</main></body></html>
"""


def exportar_generico(destino):
    """Cria, para cada aula com «guia», a versão genérica (JSON) e a ficha da aula (HTML), sem dados da escola."""
    destino = Path(destino)
    destino.mkdir(parents=True, exist_ok=True)
    feitas, ok = 0, True
    for f in sorted(AULAS.rglob("*.json")):
        try:
            aula = json.loads(f.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            continue
        if not isinstance(aula, dict) or "guia" not in aula:
            continue
        erros = validar(aula)
        if erros:
            ok = False
            print(f"✗ {f.name}: não exportada (conteúdo com problemas):")
            for x in erros:
                print("  -", x)
            continue
        gen, avisos = aula_generica(aula)
        nome = re.sub(r"[^a-z0-9]+", "-", unicodedata.normalize("NFKD", f"{aula['ano']}ano {aula['titulo']}").encode("ascii", "ignore").decode().lower()).strip("-")
        (destino / f"{nome}.json").write_text(json.dumps(gen, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        (destino / f"{nome}.html").write_text(ficha_html(aula), encoding="utf-8")
        feitas += 1
        print(f"✓ {f.name} → {nome}.json + {nome}.html")
        for x in avisos_guia(aula):
            print("  ! Aviso (guia):", x)
        if avisos:
            print(f"  ! Rever: o texto menciona {', '.join(avisos)} (dados da escola numa aula genérica).")
    print(f"✓ Aulas genéricas: {feitas} exportadas para {destino}/" if feitas else "Nenhuma aula com «guia» em aulas/.")
    return ok


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
    ap.add_argument("--ficha", metavar="AULA_JSON", help="gerar a ficha da aula (HTML para imprimir) a partir do «guia»")
    ap.add_argument("--exportar-generico", metavar="PASTA", help="exportar as aulas com «guia» em versão genérica (JSON + ficha)")
    a = ap.parse_args()

    if a.ficha:
        aula = ler_aula(a.ficha)
        if "guia" not in aula:
            print("✗ Esta aula não tem «guia» (sequência e indicadores).")
            sys.exit(1)
        if not relatorio(aula, validar(aula)):
            sys.exit(1)
        saida = Path(a.saida) if a.saida else Path(a.ficha).with_name(Path(a.ficha).stem + "_ficha.html")
        saida.write_text(ficha_html(aula), encoding="utf-8")
        print(f"✓ Ficha da aula: {saida}")
        return
    if a.exportar_generico:
        sys.exit(0 if exportar_generico(a.exportar_generico) else 1)

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
