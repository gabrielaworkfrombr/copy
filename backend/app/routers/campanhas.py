from fastapi import APIRouter, HTTPException
from app.services.supabase_service import get_supabase

router = APIRouter(prefix="/campanhas", tags=["campanhas"])


@router.get("")
def list_campanhas():
    sb = get_supabase()
    res = sb.table("campanhas").select("*").order("criado_em", desc=True).execute()
    return res.data


@router.get("/{campanha_id}")
def get_campanha(campanha_id: str):
    sb = get_supabase()
    res = sb.table("campanhas").select("*").eq("id", campanha_id).single().execute()
    if not res.data:
        raise HTTPException(404, "Campanha não encontrada")
    return res.data


@router.get("/{campanha_id}/anuncios")
def get_anuncios_por_campanha(campanha_id: str):
    sb = get_supabase()
    res = (
        sb.table("anuncios")
        .select("*")
        .eq("campanha_id", campanha_id)
        .order("ctr", desc=True)
        .execute()
    )
    return res.data
