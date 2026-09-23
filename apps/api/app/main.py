"""
Orbit API — FastAPI application entry point.

This is the skeleton. Real routes will be added in later chunks.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Orbit API",
    description="Backend for the Orbit personal 3D to-do environment",
    version="0.0.0",
)

# Development-only CORS — allow the frontend (Vite) to talk to us.
# This will be tightened before production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/health")
async def health() -> dict:
    """Basic health check endpoint."""
    return {
        "status": "ok",
        "version": "0.0.0",
        "database": "not_configured",
    }
