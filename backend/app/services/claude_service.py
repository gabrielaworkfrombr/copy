import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

MODEL = "llama-3.3-70b-versatile"

SYSTEM = (
    "Você analisa copies de anúncios pagos. Fala como copywriter experiente, não como analista de dados. "
    "Nunca menciona frameworks ou metodologias. Sempre conecta métrica com decisão de copy. "
    "Sempre termina com ação concreta. Responda apenas em JSON válido, sem texto fora do objeto."
)


def _call(user_prompt: str) -> dict:
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    completion = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.7,
    )
    raw = completion.choices[0].message.content.strip()
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
