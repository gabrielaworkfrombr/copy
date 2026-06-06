from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.supabase_service import get_supabase
from app.services.md_parser import extract_metadata

router = APIRouter(prefix="/contextos", tags=["contextos"])


@router.get("")
def list_contextos():
    sb = get_supabase()
    res = sb.table("contextos").select("*").order("criado_em", desc=True).execute()
    return res.data


@router.post("")
async def create_contexto(file: UploadFile = File(...)):
    if not file.filename or not file.filename.endswith(".md"):
        raise HTTPException(400, "Apenas arquivos .md são aceitos")

    content = await file.read()
    text = content.decode("utf-8", errors="replace")

    meta = extract_metadata(text)
    nome = meta["nome"] or file.filename.replace(".md", "").replace("-", " ").replace("_", " ").title()

    sb = get_supabase()
    res = sb.table("contextos").insert({
        "nome": nome,
        "tipo": meta["tipo"],
        "nicho": meta["nicho"],
        "conteudo": text,
    }).execute()

    return res.data[0]


@router.delete("/{contexto_id}")
def delete_contexto(contexto_id: str):
    sb = get_supabase()
    sb.table("contextos").delete().eq("id", contexto_id).execute()
    return {"ok": True}
