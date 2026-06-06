import re


def extract_metadata(content: str) -> dict:
    meta = {"nome": None, "tipo": "outro", "nicho": None}

    lines = content.strip().splitlines()

    for line in lines[:10]:
        low = line.lower()
        if low.startswith("# "):
            meta["nome"] = line[2:].strip()
        elif "tipo:" in low:
            val = line.split(":", 1)[1].strip().lower()
            if val in ("processo", "icp", "mercado", "outro"):
                meta["tipo"] = val
        elif "nicho:" in low:
            meta["nicho"] = line.split(":", 1)[1].strip()

    return meta
