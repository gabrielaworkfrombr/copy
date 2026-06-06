from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from app.services.supabase_service import get_supabase
from app.services.csv_parser import parse_csv, classify_status

router = APIRouter(tags=["upload"])


@router.post("/upload")
async def upload_campanha(
    file: UploadFile = File(...),
    nome: str = Form(...),
    contexto_id: Optional[str] = Form(None),
):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(400, "Apenas arquivos .csv são aceitos")

    content = await file.read()
    rows = parse_csv(content)

    if not rows:
        raise HTTPException(422, "CSV vazio ou colunas não reconhecidas")

    sb = get_supabase()

    campanha_res = sb.table("campanhas").insert({
        "nome": nome,
        "contexto_id": contexto_id or None,
    }).execute()
    campanha = campanha_res.data[0]
    campanha_id = campanha["id"]

    ctrs = [r["ctr"] for r in rows if r["ctr"] is not None]
    media_ctr = sum(ctrs) / len(ctrs) if ctrs else 0

    anuncios_payload = []
    for row in rows:
        status = classify_status(row["ctr"], media_ctr)
        anuncios_payload.append({
            "campanha_id": campanha_id,
            "nome_anuncio": row["nome_anuncio"],
            "impressoes": row["impressoes"],
            "cliques": row["cliques"],
            "ctr": row["ctr"],
            "cpl": row["cpl"],
            "valor_gasto": row["valor_gasto"],
            "legenda": row["legenda"],
            "texto_imagem": row["texto_imagem"],
            "texto_video": row["texto_video"],
            "status": status,
        })

    sb.table("anuncios").insert(anuncios_payload).execute()

    return campanha
