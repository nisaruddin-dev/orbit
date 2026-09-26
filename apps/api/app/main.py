"""
Orbit API — FastAPI application entry point.

Registers routes, CORS, and (in later sub-steps) authentication
and error handling middleware.
"""

from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routes import tasks as tasks_routes

settings = get_settings()

app = FastAPI(
    title="Orbit API",
    description="Backend for the Orbit personal 3D to-do environment",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks_routes.router, prefix="/api/v1")


@app.get("/api/v1/health")
async def health() -> dict[str, Any]:
    """Basic health check endpoint."""
    return {
        "status": "ok",
        "version": "0.1.0",
        "database": "connected",
    }
