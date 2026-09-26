"""
Orbit API — FastAPI application entry point.

Registers routes, CORS, and error handlers. Authentication is a
dependency, not middleware — routes opt in via Depends().
"""

from typing import Any

from fastapi import FastAPI, Request
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

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


@app.exception_handler(HTTPException)
async def http_exception_handler(
    request: Request,
    exc: HTTPException,
) -> JSONResponse:
    """
    Wrap HTTPException into the ErrorResponse envelope from
    schemas.py.

    A raised HTTPException with `detail={"code": "...", "message": "..."}`
    becomes:

        {"error": {"code": "...", "message": "..."}}

    Any other detail shape is wrapped into a generic message.
    """
    detail: object = exc.detail
    if isinstance(detail, dict) and "code" in detail and "message" in detail:
        payload = {"error": detail}
    else:
        payload = {
            "error": {
                "code": "HTTP_ERROR",
                "message": str(detail),
            },
        }

    return JSONResponse(
        status_code=exc.status_code,
        content=payload,
        headers=exc.headers,
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
