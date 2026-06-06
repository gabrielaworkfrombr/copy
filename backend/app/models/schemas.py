from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class ContextoOut(BaseModel):
    id: str
    nome: str
    tipo: str
    nicho: Optional[str]
    conteudo: str
    criado_em: datetime


class CampanhaOut(BaseModel):
    id: str
    nome: str
    contexto_id: Optional[str]
    criado_em: datetime


class AnuncioOut(BaseModel):
    id: str
    campanha_id: str
    nome_anuncio: str
    impressoes: Optional[int]
    cliques: Optional[int]
    ctr: Optional[float]
    cpl: Optional[float]
    valor_gasto: Optional[float]
    legenda: Optional[str]
    texto_imagem: Optional[str]
    texto_video: Optional[str]
    status: str
    criado_em: datetime


class DiagnosticoOut(BaseModel):
    id: str
    anuncio_id: Optional[str]
    campanha_id: str
    tipo: str
    conteudo: dict
    criado_em: datetime
