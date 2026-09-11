---
description: "Use when editing the language-learning dashboard application, React components, hooks, libraries, or services. Covers the project's Next.js, TypeScript, Tailwind, shadcn/ui, accessibility, responsive UI, and validation conventions."
name: 'Project Frontend Guidelines'
applyTo:[
        'app/**/*.{ts,tsx,css}',
        'components/**/*.{ts,tsx}',
        'hooks/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}',
        'services/**/*.{ts,tsx}']
---

# Project Frontend Guidelines

- Use the existing Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui conventions, CSS variables, and `lucide-react` icons.
- Read the owning route, nearby components, shared UI primitives, and relevant data flow before making changes.
- Preserve existing routing, authentication boundaries, public APIs, and user-visible behavior unless the task explicitly requires a change.
- Prefer existing components, design tokens, utilities, assets, and interaction patterns over new abstractions or dependencies.
- Keep changes focused on the requested feature. Do not modify backend, database, unrelated routes, generated files, or lockfiles without a clear need.
- Use semantic HTML, accessible labels, keyboard interaction, visible focus states, and appropriate disabled, loading, empty, error, and success states. Always use server components for page and separate sub client component to handle state
- Make layouts responsive at mobile and desktop widths. Prevent overflow, content overlap, and layout shifts when labels, icons, or dynamic data change.
- Use `lucide-react` for interface icons. Icon-only controls must have an accessible name; add a tooltip when the icon is unfamiliar.
- Reuse the existing color and typography tokens. Avoid unnecessary gradients, decorative clutter, nested cards, and one-note color palettes.
- Always use react-hook-form when create a form. Make sure create form's schema by Zod to validate and display error messages.
- Do not use placeholder content or imagery when suitable repository data or assets already exist. Every api call need handle loading UI for best experience. Use hook useTransition to handle API call
- Keep TypeScript types explicit at boundaries and avoid weakening types with `any` unless there is a documented integration reason.
- After editing, run the narrowest relevant check first, then `pnpm lint` or `pnpm build` when the change affects shared or user-facing behavior.
- Use Supabase client sdk to comunicate with database. Write all logic in services folder, except api have secret key, they will be handle by create new API Route.
