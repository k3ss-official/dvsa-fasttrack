# DVSA FastTrack

UK motorcycle **theory** trainer for the 2026 DVSA paper. Teach the Highway Code first, then drill, then sit a mock.

Not an official DVSA product. Facts follow the current Highway Code, National Standard for Riding, Resuscitation Council UK, and GOV.UK motorcycle theory rules as of 2026.

## What it is

Path: **Learn → Drill → One-shot → Mock → Weak spots**

- **Learn** — 14 official categories, 95 facts. Each card teaches the rule, names the trap, then tests you.
- **Drill** — flashcards, true/false, number snap (stopping distances, 1.0 mm tread, 44/75, 30:2…), trailing mix of unread and weak items.
- **Shot** — one question, four answers, instant teach-back, next.
- **Mocks** — 50 questions, 57 minutes, pass 43. Random papers plus five fixed seeds and case studies.
- **Weak** — Leitner gauntlet of anything you missed.

Yard (Module 1), road (Module 2) and hazard cadence are still there, off to the side. The written test is the point.

Progress lives in `localStorage` on this device. No account.

## 2026 paper, as trained here

| Part | Mark |
| --- | --- |
| Multiple choice | 50 questions, 57 minutes, pass **43** |
| Hazard perception | 14 clips, pass **44/75** |
| Same sitting | Certificate lasts **2 years** |
| Fee | £23 (GOV.UK, 2026) |
| Car theory | Does **not** count for a motorcycle test |
| Learners | **Must not** use motorways. Dual carriageways are allowed with L plates |

Also drilled: H1/H2/H3 (Jan 2022), Wales 20 mph defaults, bus-lane motorcycle plates, CPR 5–6 cm / 100–120 / 30:2, AED pads, theory + CBT validity.

## Run locally

Node 22.

```bash
npm install
npm run dev
```

Dev server: `http://localhost:8080`

```bash
npm run typecheck
npm run build
```

This repo is a TanStack Start + React 19 + Tailwind v4 app. Auth and database are wired in the scaffold but **off** — the trainer does not use them.

## Licence

Study notes for personal use. Highway Code wording is Crown copyright. Do not treat this as a substitute for the official revision materials.
