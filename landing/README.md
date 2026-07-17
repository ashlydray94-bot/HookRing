# HookRing Landing Page

Marketing landing page for [HookRing](https://hookring.app) — turn any Spotify track into a high-quality ringtone.

Built with [TanStack Start](https://tanstack.com/start) (React 19 + Vite + Tailwind CSS v4).

## Quick Start

**Prerequisites:** [Bun](https://bun.sh) (v1.x)

```bash
cd landing
bun install
bun run dev        # dev server at http://localhost:3000
```

## Publish to Production

```bash
bun run publish    # builds + restarts the production server on :3000
```

The `publish` script runs `vite build` then starts the SSR server. It binds to `0.0.0.0:3000`.

## Deploy to Vercel

```bash
export VERCEL_TOKEN=...
bun run go-live    # deploys SSR handler to Vercel
```

## Project Structure

```
landing/
  src/
    routes/
      __root.tsx      # HTML shell: <head>, meta tags, fonts, global layout
      index.tsx       # Landing page: Hero, How It Works, Features, Pricing, CTA, Footer
    styles/app.css    # Tailwind entrypoint + base styles
  public/
    hero-mockup.png   # AI-generated app mockup (1024x1024)
    waveform-bg.png   # Audio waveform background (1536x1024)
  site.json           # { "businessName": "HookRing" }
  vite.config.ts      # Vite config — serves on 0.0.0.0:3000
  publish.sh          # Build + restart production server
  go-live.sh          # Deploy to Vercel
```

## Design

- **Colors:** Purple (`#9333EA`) to Indigo (`#4F46E5`) gradient brand
- **Font:** [Inter](https://fonts.google.com/specimen/Inter) (400–800)
- **Responsive:** Mobile-first with Tailwind breakpoints
- **Sections:** Nav, Hero, How It Works (3 steps), Features (6 cards), Pricing (Free/Pro), Email CTA, Footer

## Making It Dynamic

The site supports server functions and API routes — see `SITE.md` for details.
