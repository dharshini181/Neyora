import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routers import patterns, fabric, pdf

load_dotenv()

app = FastAPI(
    title="Neyora Backend",
    description="Optional Python service: Pattern Rule Engine (mirrored from the Next.js app) + server-side PDF invoice generation.",
    version="1.0.0",
)

allowed_origins = os.getenv("ALLOWED_ORIGINS", "https://neyora-ai.vercel.app/").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(patterns.router)
app.include_router(fabric.router)
app.include_router(pdf.router)


@app.get("/")
def root():
    return {
        "service": "Neyora Backend",
        "status": "ok",
        "docs": "/docs",
        "note": "This service is optional — the Next.js app runs fully without it.",
    }


@app.get("/health")
def health():
    return {"status": "ok"}
