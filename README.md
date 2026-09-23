# Orbit

[![Frontend CI](https://github.com/nisaruddin-dev/orbit/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/nisaruddin-dev/orbit/actions/workflows/frontend-ci.yml)
[![Backend CI](https://github.com/nisaruddin-dev/orbit/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/nisaruddin-dev/orbit/actions/workflows/backend-ci.yml)

> A personal immersive 3D to-do environment.

**Orbit** turns tasks into physical objects in a persistent spatial world. You enter a quiet twilight space, place your tasks in orbit around a central Core, and physically release them when complete.

This is a personal project — single-owner, single-user, no collaboration.

---

## Status

🚧 **Under construction.** Currently in early scaffolding.

---

## What Orbit Is

- **A place, not a list.** You arrive; you don't open a dashboard.
- **Physical interaction.** Tasks have weight, momentum, and position.
- **Calm by design.** No red alarms, no streaks, no guilt mechanics.
- **Local-first.** Works offline; syncs when connected.
- **Single-owner.** Designed for one person.

## What Orbit Is Not

- Not a team tool.
- Not a productivity analytics dashboard.
- Not a gamified habit tracker.
- Not a social product.

---

## Stack

**Frontend**
- React + TypeScript
- Vite
- React Three Fiber + Three.js
- Zustand (local state)
- TanStack Query (server state)
- IndexedDB (offline persistence)

**Backend**
- FastAPI (Python)
- PostgreSQL (via Supabase)
- Row-Level Security
- Supabase Realtime

**Deployment**
- Frontend → Vercel
- Backend → Render
- Database + Auth → Supabase

---

## Documentation

The complete specification lives in `docs/`:

- `PRD.md` — Product Requirements
- `TRD.md` — Technical Requirements
- `UI-UX.md` — Design system and experience contract
- `SYSTEM-ARCHITECTURE.md` — System blueprint
- `CHOREOGRAPHY.md` — Animation timelines

---

## License

Personal project. Not licensed for redistribution.
