# Design Guidelines — jantrautwein.com

## Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#E9EFE2` | Page background (sage green) |
| `--bg2` | `#F4F7EF` | Subtle surface variant |
| `--text` | `#1A1F17` | Headings, strong text |
| `--muted` | `#5A6356` | Body copy, secondary text |
| `--gold` | `#FAB700` | CTAs, links, section labels, accents |
| `--gold-hover` | `#E5A800` | Gold hover state |
| `--border` | `#D0DAC8` | Subtle dividers, borders |

## Typography
- **Serif:** Lora — headings (h1–h4), hero, blockquotes, FAQ questions
- **Sans-serif:** Inter — body copy, labels, nav links, buttons
- Base font size: `17px` on desktop, `16px` on mobile (≤600px)
- Line height: `1.7` (body), `1.3` (headings), `1.75` (blockquotes/answers)
- `-webkit-font-smoothing: antialiased`

### Heading scale
| Element | Desktop | Mobile (≤900px) | Mobile (≤600px) |
|---------|---------|-----------------|-----------------|
| `h2` | `2.4rem / 600` | `1.8rem` | `1.55rem` |
| `h3` | `1.5rem` | — | — |
| Hero headline | `2.6rem` | `2rem` | `1.65rem` |

### Section labels (eyebrows above h2)
```css
font-family: Inter; font-size: 0.85rem; font-weight: 700;
letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold);
margin-bottom: 1.2rem;
```

## Layout & Spacing
- **Max content width:** `780px` (`--max-w`) for single-column text sections
- **Wide sections** (hero, about, how, voices, next-step): `max-width: 900px–1100px`
- **Side padding:** `32px` left/right on all inner wrappers — always use `padding: 0 32px` (no CSS variable exists for this)
- **Section vertical padding:** `100px` top/bottom (`--section-py`), reduced to `72px` at ≤900px
- Consistent pattern: `max-width: Xpx; margin: 0 auto; padding: 0 32px;`

## Buttons / CTAs
- **ALL CTA buttons across every page use the gold color, no exceptions.** Background: `var(--gold)` (#FAB700), hover: `var(--gold-hover)` (#E5A800). This applies to primary CTAs, nav mini-CTAs, and any "Let's Talk" / booking button on every page.
- Text color: `var(--text)` (dark, not white)
- Font: Inter, `font-weight: 600`, `font-size: 1rem`
- Padding: `14px 36px`, border-radius: `8px`
- Nav mini-CTA: `8px 20px`, border-radius: `6px`
- Transition: `background 0.2s, transform 0.2s`

## Links
- Default color: `var(--gold)`, hover: `var(--gold-hover)`
- No underline by default; underline where inline in prose

## Background Texture
- Paper texture image repeated at `600px` tile, `opacity: 0.2`, `position: fixed`, `z-index: 0`
- All page content sits at `z-index: 1`

## Dividers (botanical illustrations)
- Three decorative dividers between sections, alternating left/right
- Width: `360px` desktop → `260px` at ≤900px → `200px` at ≤600px
- `opacity: 0.7`
- `.divider-left img`: anchored `left: -40px`
- `.divider-right img`: anchored `right: -40px`, flipped horizontally with `scaleX(-1)`

## Responsive Breakpoints
| Breakpoint | Changes |
|-----------|---------|
| `≤900px` | Single-column grids, reduced section-py (72px), smaller headings, nav hamburger |
| `≤600px` | Font 16px, further reduced headings, dividers 200px wide |

## Sections (page order)
1. **Nav** — sticky, blurred background, logo left + links + gold CTA right
2. **Hero** — 2-col grid (text left, video right), max-width 1100px
3. **Featured Quote** — centered blockquote, max-width 680px
4. *Divider (left)*
5. **The Reality** — centered text, max-width 780px
6. **Who I Am** — 2-col grid (image 320px + text), max-width 1000px
7. *Divider (right)*
8. **How I Work** — 2-col grid (text + image 300px), max-width 1000px
9. **A Holistic Approach to Growth** — centered intro, image, areas grid
10. *Divider (left)*
11. **Client Voices** — photo grid (2×2, 240px) + testimonial text, max-width 900px
12. **FAQ** — accordion toggles, max-width 760px, `padding: 0 32px`
13. **The Next Step** — 2-col grid (text + image), gold CTA button, max-width 900px
14. **Footer** — dark background (`#1A1F17`), centered links

## FAQ / Accordion Component
- Container: `max-width: 760px; margin: 0 auto; padding: 0 32px`
- Items separated by `1px solid rgba(26,31,23,0.15)` borders
- Question button: Lora serif, `1.05rem`, `600` weight, `padding: 22px 4px`
- Plus/minus icon: 22px circle, animates on open (vertical bar fades, background inverts)
- Answer panel: `max-height` transition `0.4s ease` for smooth open/close
- One item open at a time (siblings close automatically)

## Navbar
- Height: `60px`; max-width `1100px`; padding `0 32px`
- Blurred `rgba(233,239,226,0.95)` background; `box-shadow` on scroll
- Mobile (≤900px): hamburger menu, nav links hidden
