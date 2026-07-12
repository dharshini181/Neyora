# Neyora Backend (optional)

A small FastAPI service that mirrors the frontend's Pattern Rule Engine in
Python and adds one thing the frontend can't do on its own: **server-generated
PDF invoices** with consistent branding, regardless of the customer's browser.

## Do you need this?

No, not to run Neyora. The Next.js app is fully self-contained — Pattern
Studio, Fabric Calculator, and Invoices all work today using the built-in
TypeScript engine and the browser's Print/Save-as-PDF dialog.

Reach for this service if you specifically want:
- PDF invoices generated server-side (for emailing, or a consistent look
  regardless of browser/OS print settings)
- To eventually run the pattern math somewhere other than the Next.js
  server (e.g. a heavier compute step you don't want blocking a page render)

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Open http://localhost:8000/docs for interactive API docs (Swagger UI).

## Endpoints

- `POST /patterns/generate` — same inputs/outputs as `lib/pattern-engine/generate.ts`'s `generatePattern()`
- `POST /fabric/calculate` — same as `calculateFabric()`
- `POST /pdf/invoice` — returns a downloadable PDF (`application/pdf`) built with ReportLab

## Connecting it to the frontend

Set `NEXT_PUBLIC_API_URL=http://localhost:8000` in the frontend's `.env.local`
(already in `.env.example`). The frontend doesn't call this service by
default — wire up a `fetch(process.env.NEXT_PUBLIC_API_URL + "/pdf/invoice")`
call wherever you want the server-generated PDF instead of the browser print
dialog (e.g. in `components/patterns/PrintButton.tsx` or the invoice detail
page).

## Deployment

Free-tier friendly on Render or Railway — both auto-detect a `requirements.txt`
+ `uvicorn` app. Set `ALLOWED_ORIGINS` to your deployed frontend's URL.

## Keeping the two engines in sync

`app/engine/rules.py` and `app/engine/generate.py` are a manual Python port
of `lib/pattern-engine/rules.ts` and `generate.ts`. There's no shared source
of truth between the two languages — if you change the drafting formulas or
add a dress type, update both. For most projects this is fine (the engine is
small and changes rarely); if it starts drifting, consider making the
Next.js app call this service for all pattern math instead of keeping a
duplicate.
