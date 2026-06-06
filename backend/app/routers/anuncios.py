from fastapi import APIRouter, HTTPException
from app.services.supabase_service import get_supabase

router = APIRouter(prefix="/anuncios", tags=["anuncios"])


@router.get("/{anuncio_id}")
def get_anuncio(anuncio_id: str):
    sb = get_supabase()
    res = sb.table("anuncios").select("*").eq("id", anuncio_id).single().execute()
    if not res.data:
        raise HTTPException(404, "Anúncio não encontrado")
    return res.data
