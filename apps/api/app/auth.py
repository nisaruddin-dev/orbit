"""
Orbit API — Authentication.

Verifies the Supabase JWT sent by the frontend and returns the
authenticated user's UUID.

The verification calls Supabase's auth endpoint once per request.
For a single-user personal application, the extra network round
trip is acceptable and avoids the complexity of caching JWKS keys.

Source: TRD §8 (Authentication Architecture),
System Architecture §60-62 (Security Model).
"""

from functools import lru_cache
from uuid import UUID

from fastapi import Header, HTTPException, status
from supabase import Client, create_client

from app.config import get_settings


@lru_cache(maxsize=1)
def _get_supabase_client() -> Client:
    """
    Return a Supabase client using the secret key.

    Cached so the client is created once per process. The secret
    key never leaves the backend.
    """
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_secret_key)


async def get_current_user(
    authorization: str | None = Header(default=None),
) -> UUID:
    """
    FastAPI dependency. Extracts and verifies the Supabase JWT,
    returning the authenticated user's UUID.

    Raises 401 if the header is missing, malformed, or the token
    is invalid.
    """
    if authorization is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": "MISSING_TOKEN",
                "message": "Authorization header is required.",
            },
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": "MALFORMED_TOKEN",
                "message": "Authorization header must use the Bearer scheme.",
            },
        )

    token = authorization.removeprefix("Bearer ").strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": "EMPTY_TOKEN",
                "message": "Bearer token is empty.",
            },
        )

    client = _get_supabase_client()

    try:
        response = client.auth.get_user(token)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": "INVALID_TOKEN",
                "message": "Token could not be verified.",
            },
        ) from exc

    # The response is a UserResponse. The user object is at .user.
    # In some client versions, get_user returns the user directly
    # when successful, or None when the token is invalid.
    user = getattr(response, "user", None)
    if user is None or getattr(user, "id", None) is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": "INVALID_TOKEN",
                "message": "Token did not identify a user.",
            },
        )

    try:
        return UUID(str(user.id))
    except (TypeError, ValueError) as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": "INVALID_USER_ID",
                "message": "Token contained an invalid user identifier.",
            },
        ) from exc
