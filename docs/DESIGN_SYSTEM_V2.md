# CareerCraft Design System V2

Premium AI-native career platform visual language. Inspired by editorial calm + developer-tool precision (Linear / Vercel / Notion AI aesthetic), **not** a copy of any single brand.

## Philosophy

- **Quietly powerful** — calm, intelligent, structured, highly readable
- **AI-first** — distinct surfaces for AI workflows vs. standard UI
- **Dual theme by design** — light and dark are separate palettes, not inversion

## Files

| File | Purpose |
|------|---------|
| `src/styles/theme-tokens.css` | Color, surface, semantic, radius, motion, AI state tokens |
| `src/styles/design-system.css` | Layout, typography, navbar, forms, AI surfaces |
| `tailwind.config.ts` | Tailwind mappings |
| `src/lib/fonts.ts` | Geist Sans + Geist Mono |

## Color (Light)

| Token | Value |
|-------|-------|
| Background | `#F7F7F4` |
| Surface | `#FFFFFF` |
| Soft surface | `#FAFAF7` |
| Text | `#26251E` / `#5A5852` / `#807D72` |
| Border | `#E6E5E0` |
| Accent | `#F54E00` |

## Color (Dark)

| Token | Value |
|-------|-------|
| Background | `#111315` |
| Panel | `#1D2024` |
| Elevated | `#23272C` |
| Text | `#F5F3EE` / `#C8C2B8` / `#8D887F` |
| Border | `#2B3036` |
| Accent | `#FF6224` |

## Radius

- Input / Button: `10px`
- Card: `16px`
- Panel: `20px`

## Typography

- **Geist Sans** — UI + headings (medium weight, negative tracking on large type)
- **Geist Mono** — code / data feeds
- Hero: `clamp(2.75rem, 6.5vw, 4.5rem)`
- Body: `15px / 1.6`

## AI Surfaces

Use only inside AI experiences:

- `.ai-surface` — assistant panel shell
- `.ai-indicator` — streaming / thinking badge
- `.ai-state-{thinking|reading|editing|searching|completed}` — workflow tint

## Migration Notes

- `volt` Tailwind class maps to `--accent` (now orange, was green)
- `BrandButton` uses `rounded-button` (10px), restrained hover (no bounce)
- Container max-width: **1280px** (`80rem`)
- Legacy `apple-*` aliases remain for gradual page migration

## Next Phases

1. Resume builder form + sticky AI panel
2. Dashboard modular layout
3. Settings / tables mobile pass
4. Copilot widget → `ai-surface` styling
