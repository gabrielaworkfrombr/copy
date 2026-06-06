import csv
import io
from typing import Any

COLUMN_MAP = {
    "nome do anúncio": "nome_anuncio",
    "nome do anuncio": "nome_anuncio",
    "ad name": "nome_anuncio",
    "impressões": "impressoes",
    "impressoes": "impressoes",
    "impressions": "impressoes",
    "cliques": "cliques",
    "cliques no link": "cliques",
    "link clicks": "cliques",
    "ctr": "ctr",
    "ctr (todos)": "ctr",
    "ctr (taxa de cliques no link)": "ctr",
    "ctr (link)": "ctr",
    "link ctr": "ctr",
    "cpl": "cpl",
    "custo por resultado": "cpl",
    "cost per result": "cpl",
    "valor gasto": "valor_gasto",
    "valor usado (brl)": "valor_gasto",
    "amount spent (brl)": "valor_gasto",
    "legenda": "legenda",
    "body": "legenda",
    "texto do anúncio": "legenda",
    "texto da imagem": "texto_imagem",
    "image text": "texto_imagem",
    "texto do vídeo": "texto_video",
    "texto do video": "texto_video",
    "video text": "texto_video",
}


def parse_csv(content: bytes) -> list[dict[str, Any]]:
    text = content.decode("utf-8-sig", errors="replace")
    reader = csv.DictReader(io.StringIO(text))
    rows = []
    for row in reader:
        normalized: dict[str, Any] = {}
        for k, v in row.items():
            key = k.strip().lower()
            mapped = COLUMN_MAP.get(key, key)
            normalized[mapped] = v.strip() if v else None
        if not normalized.get("nome_anuncio"):
            continue
        rows.append(_coerce(normalized))
    return rows


def _coerce(row: dict) -> dict:
    def to_float(v):
        if v is None:
            return None
        v = str(v).replace(",", ".").replace("%", "").replace("R$", "").strip()
        try:
            return float(v)
        except (ValueError, TypeError):
            return None

    def to_int(v):
        f = to_float(v)
        return int(f) if f is not None else None

    ctr_raw = to_float(row.get("ctr"))
    # Meta Ads exports CTR as a percentage (e.g. 2.4 means 2.4%)
    # normalise to decimal (0.024)
    if ctr_raw is not None and ctr_raw > 1:
        ctr_raw = ctr_raw / 100

    return {
        "nome_anuncio": row.get("nome_anuncio"),
        "impressoes": to_int(row.get("impressoes")),
        "cliques": to_int(row.get("cliques")),
        "ctr": ctr_raw,
        "cpl": to_float(row.get("cpl")),
        "valor_gasto": to_float(row.get("valor_gasto")),
        "legenda": row.get("legenda"),
        "texto_imagem": row.get("texto_imagem"),
        "texto_video": row.get("texto_video"),
    }


def classify_status(ctr: float | None, media: float) -> str:
    if ctr is None or media == 0:
        return "neutro"
    ratio = ctr / media
    if ratio > 1.2:
        return "vencedor"
    if ratio < 0.8:
        return "morto"
    return "neutro"
