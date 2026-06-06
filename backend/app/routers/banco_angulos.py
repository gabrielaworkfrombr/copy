from fastapi import APIRouter
from typing import Optional
from app.services.supabase_service import get_supabase

router = APIRouter(prefix="/banco-de-angulos", tags=["banco-de-angulos"])


@router.get("")
def get_banco_angulos(search: Optional[str] = None):
    sb = get_supabase()

    query = (
        sb.table("anuncios")
        .select("*, campanhas(nome)")
        .eq("status", "vencedor")
        .order("criado_em", desc=True)
    )

    res = query.execute()
    anuncios = res.data

    # load diagnostics for each
    result = []
    for a in anuncios:
        camp = a.pop("campanhas", None)
        a["campanha_nome"] = camp["nome"] if camp else None

        diag_res = (
            sb.table("diagnosticos")
            .select("conteudo")
            .eq("anuncio_id", a["id"])
            .eq("tipo", "anuncio")
            .order("criado_em", desc=True)
            .limit(1)
            .execute()
        )
        a["diagnostico"] = diag_res.data[0]["conteudo"] if diag_res.data else None
        result.append(a)

    if search:
        q = search.lower()
        result = [
            a for a in result
            if q in (a.get("nome_anuncio") or "").lower()
            or q in (a.get("legenda") or "").lower()
            or q in (a.get("texto_imagem") or "").lower()
            or q in (a.get("texto_video") or "").lower()
        ]

    return result
