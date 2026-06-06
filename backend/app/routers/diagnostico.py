from fastapi import APIRouter, HTTPException
from app.services.supabase_service import get_supabase
from app.services import claude_service

router = APIRouter(prefix="/diagnostico", tags=["diagnostico"])


def _get_contexto_conteudo(contexto_id: str | None) -> str | None:
    if not contexto_id:
        return None
    sb = get_supabase()
    res = sb.table("contextos").select("conteudo").eq("id", contexto_id).single().execute()
    return res.data["conteudo"] if res.data else None


@router.get("/campanha/{campanha_id}")
def get_diagnostico_campanha(campanha_id: str):
    sb = get_supabase()
    res = (
        sb.table("diagnosticos")
        .select("*")
        .eq("campanha_id", campanha_id)
        .eq("tipo", "campanha")
        .order("criado_em", desc=True)
        .limit(1)
        .execute()
    )
    if not res.data:
        raise HTTPException(404, "Diagnóstico não encontrado")
    return res.data[0]


@router.post("/campanha/{campanha_id}/gerar")
def gerar_diagnostico_campanha(campanha_id: str):
    sb = get_supabase()

    campanha_res = sb.table("campanhas").select("*").eq("id", campanha_id).single().execute()
    if not campanha_res.data:
        raise HTTPException(404, "Campanha não encontrada")
    campanha = campanha_res.data

    anuncios_res = sb.table("anuncios").select("*").eq("campanha_id", campanha_id).execute()
    anuncios = anuncios_res.data

    if not anuncios:
        raise HTTPException(422, "Campanha sem anúncios")

    contexto = _get_contexto_conteudo(campanha.get("contexto_id"))

    anuncios_payload = [
        {
            "nome": a["nome_anuncio"],
            "status": a["status"],
            "ctr": a["ctr"],
            "cpl": a["cpl"],
            "valor_gasto": a["valor_gasto"],
            "legenda": a["legenda"],
            "texto_imagem": a["texto_imagem"],
            "texto_video": a["texto_video"],
        }
        for a in anuncios
    ]

    resultado = claude_service.diagnostico_campanha(campanha["nome"], anuncios_payload, contexto)

    saved = sb.table("diagnosticos").insert({
        "campanha_id": campanha_id,
        "tipo": "campanha",
        "conteudo": resultado,
    }).execute()

    return saved.data[0]


@router.get("/anuncio/{anuncio_id}")
def get_diagnostico_anuncio(anuncio_id: str):
    sb = get_supabase()
    res = (
        sb.table("diagnosticos")
        .select("*")
        .eq("anuncio_id", anuncio_id)
        .eq("tipo", "anuncio")
        .order("criado_em", desc=True)
        .limit(1)
        .execute()
    )
    if not res.data:
        raise HTTPException(404, "Diagnóstico não encontrado")
    return res.data[0]


@router.post("/anuncio/{anuncio_id}/gerar")
def gerar_diagnostico_anuncio(anuncio_id: str):
    sb = get_supabase()

    anuncio_res = sb.table("anuncios").select("*").eq("id", anuncio_id).single().execute()
    if not anuncio_res.data:
        raise HTTPException(404, "Anúncio não encontrado")
    anuncio = anuncio_res.data

    campanha_res = sb.table("campanhas").select("*").eq("id", anuncio["campanha_id"]).single().execute()
    campanha = campanha_res.data if campanha_res.data else {}

    contexto = _get_contexto_conteudo(campanha.get("contexto_id"))

    anuncio_payload = {
        "nome": anuncio["nome_anuncio"],
        "status": anuncio["status"],
        "ctr": anuncio["ctr"],
        "cpl": anuncio["cpl"],
        "valor_gasto": anuncio["valor_gasto"],
        "legenda": anuncio["legenda"],
        "texto_imagem": anuncio["texto_imagem"],
        "texto_video": anuncio["texto_video"],
    }

    resultado = claude_service.diagnostico_anuncio(anuncio_payload, contexto)

    saved = sb.table("diagnosticos").insert({
        "anuncio_id": anuncio_id,
        "campanha_id": anuncio["campanha_id"],
        "tipo": "anuncio",
        "conteudo": resultado,
    }).execute()

    return saved.data[0]
