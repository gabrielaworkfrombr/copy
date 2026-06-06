import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.routers import contextos, upload, campanhas, anuncios, diagnostico, banco_angulos

app = FastAPI(title="CopyEngine API")

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        frontend_url,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(contextos.router)
app.include_router(upload.router)
app.include_router(campanhas.router)
app.include_router(anuncios.router)
app.include_router(diagnostico.router)
app.include_router(banco_angulos.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "CopyEngine API"}
