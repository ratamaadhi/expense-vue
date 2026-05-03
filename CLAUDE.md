# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 expense tracker UI application that connects to the Expsense API. The app manages personal expenses, income, categories, and budgets.

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Build for production (requires type checking first)
npm run build

# Preview production build locally
npm run preview
```

## Tech Stack & Architecture

- **Vue 3** with Composition API using `<script setup lang="ts">` syntax
- **TypeScript** with strict type checking via `vue-tsc`
- **Vite** for build tooling with HMR
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **shadcn-vue** component library configured in `components.json`

## Path Aliases

All paths use `@/*` alias mapping to `./src/*`:
- `@/components` → component files
- `@/lib` → utility functions (includes `cn()` for className merging)
- `@/composables` → Vue composables (when created)

## Component Library

This project uses shadcn-vue with the following configuration:
- Style variant: "new-york"
- Font: Geist Sans
- Icon library: Lucide Vue (`lucide-vue-next`)
- Base color: neutral with CSS variables for theming
- Dark mode support via `.dark` class

Components are added via `npx shadcn-vue@latest add` and should be placed in `src/components/ui/`.

## Build Process

The build command `npm run build` runs `vue-tsc -b && vite build`, which:
1. First runs TypeScript compilation with `vue-tsc -b` (build mode)
2. Then builds with Vite if type checking passes

Type errors will block the build—fix all TypeScript errors before building.

## API Integration

The OpenAPI specification for the Expsense API is located in `context/api-1.json`. Use this for:
- Understanding API endpoints and data models
- Generating TypeScript types
- Reference for API integration

## Styling

- Global styles in `src/style.css` using Tailwind CSS v4 syntax
- CSS variables defined for theming (light/dark mode)
- Use the `cn()` utility from `@/lib/utils` for conditional className merging
