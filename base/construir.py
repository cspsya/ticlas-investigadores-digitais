#!/usr/bin/env python3
"""Investigadores Digitais · Jogo-base V3 · construir e validar jogos.

Uso (a partir da raiz do repositório):
  python3 base/construir.py                         reconstrói base/modelo-jogo.html (com o exemplo)
  python3 base/construir.py aula.json               valida e gera aula.html ao lado do JSON
  python3 base/construir.py aula.json -o jogo.html  valida e gera no caminho indicado
  python3 base/construir.py aula.json --publicar    gera em jogos/AAAA-MM-DD/ e acrescenta a jogos.json
  python3 base/construir.py --validar ficheiro      só valida (aceita .json ou um .html já gerado)

Não precisa de bibliotecas externas.
"""
import argparse
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
MODELO = BASE / "modelo-jogo.html"
TIPOS = ["escolher", "verdadeiro_falso", "completar", "escrever", "pares", "classificar", "ordenar"]
FASES = ["aquecimento", "desafios", "escrita", "bonus"]
MESES = ["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."]
SEGUNDOS = {"escolher": 30, "verdadeiro_falso": 25, "completar": 35, "escrever": 60, "frase": 180,
            "pares": 20, "classificar": 20, "ordenar": 45}
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

            if tipo in ("escolher", "verdadeiro_falso", "completar", "escrever", "ordenar") and not isinstance(it, dict):
                e.append(f"{w}: tem de ser um objeto {{ ... }}.")
                continue
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
    return e


def minutos(rondas):
    s = 0
    for r in rondas:
        s += 30
        for it in r.get("itens", []):
            livre = r["tipo"] == "escrever" and isinstance(it, dict) and "resposta" not in it
            s += SEGUNDOS["frase"] if livre else SEGUNDOS.get(r["tipo"], 30)
    return max(1, round(s / 60))


def json_seguro(aula):
    # "</" dentro de <script> fecharia o bloco; "<\/" continua a ser JSON válido
    return json.dumps(aula, ensure_ascii=False, indent=2).replace("</", "<\\/")


def montar_modelo():
    molde = (SRC / "molde.html").read_text(encoding="utf-8")
    return (molde.replace("/*ESTILO*/", (SRC / "estilo.css").read_text(encoding="utf-8").strip())
                 .replace("__MASCOTE__", (SRC / "mascote.json").read_text(encoding="utf-8").strip())
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
          f"≈ {minutos(princ)} min (+ {minutos(bonus)} min de bónus)" if bonus else
          f"✓ Conteúdo válido: «{aula['titulo']}» · {len(princ)} rondas · ≈ {minutos(princ)} min")
    alvo = aula.get("minutos")
    if isinstance(alvo, (int, float)) and minutos(princ) < 0.6 * alvo:
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


def publicar(aula, html):
    for campo in ("data", "turma", "disciplina"):
        if not tem_texto(aula.get(campo)):
            sys.exit(f"Erro: para publicar, a AULA precisa do campo «{campo}».")
    data = dt.date.fromisoformat(aula["data"])
    seg, texto_semana = semana(data)
    pasta = RAIZ / "jogos" / seg.isoformat()
    pasta.mkdir(parents=True, exist_ok=True)
    destino = pasta / nome_ficheiro(aula)
    destino.write_text(html, encoding="utf-8")
    url = destino.relative_to(RAIZ).as_posix()
    catalogo_path = RAIZ / "jogos.json"
    catalogo = json.loads(catalogo_path.read_text(encoding="utf-8")) if catalogo_path.exists() else []
    registo = {
        "id": aula.get("id") or f"{aula['data']}-{nome_ficheiro(aula)[:-5]}",
        "turma": aula["turma"], "ano": aula["ano"], "titulo": aula["titulo"],
        "descricao": aula.get("descricao") or aula.get("objetivo") or "",
        "disciplina": aula["disciplina"], "data": aula["data"], "semana": texto_semana, "url": url,
        "duracao": f"até {aula['minutos']} min" if aula.get("minutos") else f"≈ {minutos([r for r in aula['rondas'] if r.get('fase') != 'bonus'])} min",
        "estado": "em validação",
    }
    catalogo = [c for c in catalogo if c.get("id") != registo["id"]] + [registo]
    catalogo_path.write_text(json.dumps(catalogo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"✓ Publicado em {url} e registado em jogos.json (semana {texto_semana}).")


def main():
    ap = argparse.ArgumentParser(description="Construir e validar jogos Investigadores Digitais (V3).")
    ap.add_argument("aula", nargs="?", help="ficheiro JSON com a AULA")
    ap.add_argument("-o", "--saida", help="ficheiro HTML a gerar")
    ap.add_argument("--publicar", action="store_true", help="gerar em jogos/AAAA-MM-DD/ e registar em jogos.json")
    ap.add_argument("--validar", metavar="FICHEIRO", help="só validar um .json ou um .html já gerado")
    a = ap.parse_args()

    if a.validar:
        aula = ler_aula(a.validar)
        sys.exit(0 if relatorio(aula, validar(aula)) else 1)

    modelo = montar_modelo()
    if not a.aula:
        aula = ler_aula(str(EXEMPLO))
        if not relatorio(aula, validar(aula)):
            sys.exit(1)
        MODELO.write_text(com_aula(modelo, aula), encoding="utf-8")
        print(f"✓ Modelo reconstruído: {MODELO.relative_to(RAIZ)}")
        return

    aula = ler_aula(a.aula)
    if not relatorio(aula, validar(aula)):
        sys.exit(1)
    html = com_aula(modelo, aula)
    if a.publicar:
        publicar(aula, html)
        return
    destino = Path(a.saida) if a.saida else Path(a.aula).with_suffix(".html")
    destino.write_text(html, encoding="utf-8")
    print(f"✓ Jogo gerado: {destino}")


if __name__ == "__main__":
    main()
