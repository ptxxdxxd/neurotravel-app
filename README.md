# NeuroTravel

A trip planner built for neurodivergent travelers. NeuroTravel walks you through planning a trip around sensory, accessibility and safety needs, and saves each plan to your account.

> **Status:** early prototype. Trip planning, accounts and accessibility settings work. The AI companion, emergency kit and profile editor are placeholders in the dashboard and are not built yet. See [What's built](#whats-built) for the details.

## What it does

The core of the app is a six-step trip planner:

1. **Trip basics:** title, destination, dates, travel type, budget range and number of companions.
2. **Accommodation:** room type, noise level, lighting, floor preference and special requests.
3. **Transportation:** mode, seating, motion sensitivity, early boarding and assistance needs.
4. **Accessibility:** a checklist of accessibility requirements.
5. **Itinerary:** day-by-day morning, afternoon and evening activities, with planned sensory breaks and accessibility notes.
6. **Emergency plan:** emergency contacts, sensory triggers, coping strategies and backup plans for overwhelm, quiet spaces and exits.

Plans are saved to Supabase and can be reopened and edited later.

## What's built

| Area | Status |
| --- | --- |
| Sign up, log in, password reset (Supabase Auth) | Working |
| Six-step trip planner, save and edit trips | Working |
| Dashboard with recent trips | Working |
| Themes: light, dark, high contrast, warm and cool, plus font size and reduced motion | Working, saved in the browser |
| Onboarding tour for first-time users | Working |
| Pricing page with Free, Premium and Pro plans | UI works; checkout calls a `create-subscription` Supabase Edge Function that is not in this repo |
| Offline page, service worker and web app manifest | Included |
| AI travel companion | Not built yet (dashboard button is a placeholder) |
| Emergency kit and profile editor | Not built yet (dashboard buttons are placeholders) |

`NeuroTravel_App_Description.md` is the full product vision, including features that are planned but not built.

## Tech stack

- React 18, TypeScript and Vite
- Tailwind CSS with Radix UI components
- React Router, React Hook Form and Zod
- Supabase for auth and Postgres (`profiles`, `travel_plans`, `trip_itinerary_days` and `subscriptions` tables)
- Deployed on Vercel

## Run it locally

You need Node.js 18 or newer and [pnpm](https://pnpm.io/).

```bash
git clone https://github.com/ptxxdxxd/neurotravel-app.git
cd neurotravel-app
cp .env.example .env   # optional, see below
pnpm dev
```

`pnpm dev` installs dependencies and starts the Vite dev server.

By default the app talks to the hosted NeuroTravel Supabase project. To use your own, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`. Your project needs the four tables listed above; their schema isn't in this repo yet.

## Build

```bash
pnpm build
```

The output goes to `dist/`. The current Vercel config (`vercel.json`) deploys the committed `dist/` folder as static files, so rebuild and commit `dist/` after changing the source.

## Project layout

```
src/
  components/   pages and UI (TripPlanning, Dashboard, PricingPage, ...)
  contexts/     auth and theme state
  lib/          Supabase client and shared UI components
  utils/        analytics, error monitoring and performance helpers
public/         images, icons, manifest, service worker, offline page
```
