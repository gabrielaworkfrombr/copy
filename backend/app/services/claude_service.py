import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

MODEL = "gemini-3.5-flash"

SYSTEM = (
    "Você analisa copies de anúncios pagos. Fala como copywriter experiente, não como analista de dados. "
    "Nunca menciona frameworks ou metodologias. Sempre conecta métrica com decisão de copy. "
    "Sempre termina com ação concreta. Responda apenas em JSON válido, sem texto fora do objeto."
)


def _call(user_prompt: str) -> dict:
    api_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(model_name=MODEL, system_instruction=SYSTEM)
    response = model.generate_content(user_prompt)
    raw = response.text.strip()
    raw = raw.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    return json.loads(raw)


def diagnostico_campanha(nome_campanha: str, anuncios: list[dict], contexto: str | None) -> dict:
    ctx_block = ""
    if contexto:
        ctx_block = (
            "Antes de analisar, considere o seguinte sobre o mercado e o avatar desta campanha:\n"
            f"---\n{contexto}\n---\n\n"
        )

    prompt = (
        f"{ctx_block}"
        f"Analise os anúncios da campanha '{nome_campanha}' e responda com JSON:\n"
        '{\n'
        '  "padrao_mortos": "...",\n'
        '  "padrao_vencedores": "...",\n'
        '  "o_que_legenda_revela": "...",\n'
        '  "acao_concreta": "..."\n'
        '}\n\n'
        f"Anúncios:\n{json.dumps(anuncios, ensure_ascii=False, indent=2)}"
    )
    return _call(prompt)


def diagnostico_anuncio(anuncio: dict, contexto: str | None) -> dict:
    ctx_block = ""
    if contexto:
        ctx_block = (
            "Antes de analisar, considere o seguinte sobre o mercado e o avatar desta campanha:\n"
            f"---\n{contexto}\n---\n\n"
        )

    prompt = (
        f"{ctx_block}"
        "Analise este anúncio e responda com JSON:\n"
        '{\n'
        '  "analise_hook": "...",\n'
        '  "analise_legenda": "...",\n'
        '  "veredicto": "...",\n'
        '  "acao_concreta": "..."\n'
        '}\n\n'
        f"Anúncio:\n{json.dumps(anuncio, ensure_ascii=False, indent=2)}"
    )
    return _call(prompt)
