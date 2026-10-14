# Magic UI for the new website

Installed on 10 October 2026 in the canonical website folder at `01 New Website/tools/magicui`.

Source: https://github.com/magicuidesign/magicui

Source revision: `cdb348cb4c72a9b54b554d8617801e479fbc8714`.

The repository dependencies are installed with its frozen lockfile. The local pnpm configuration allows the esbuild and unrs resolver installation scripts. Optional core js, lefthook, and msw installation scripts are disabled. The upstream MIT license remains in the repository.

## First effects to explore

1. Blur Fade: a gentle reveal for the introduction and selected sections. Keep the movement short and the blur very small. Reveal once rather than replaying on every scroll.
2. Marquee: the company credibility strip with real logos, slow movement, a visible pause control, and pause on hover or keyboard focus. Preserve the wording about founders and leaders Jan has coached. Hide repeated decorative copies from assistive technology.
3. Magic Card: a restrained bronze pointer highlight on selected Journey and AI cards. Keep the contents readable and give keyboard users a clear focus treatment.
4. Border Beam: an optional bronze accent around the Journey entrance. Try this only after reviewing the quieter effects in context.

## Integration approach

The current concept is plain HTML. The actual Magic UI components are React components with Tailwind styling and, for several effects, Motion dependencies. Installing this repository provides the source and component preview. It does not automatically integrate the components into the current HTML website.

When building the next homepage, choose deliberately between a React frontend that imports selected components and lightweight adaptations for the static site. Preserve the current hosting and release boundaries when making that choice. Do not migrate frameworks solely to obtain a decorative effect.

Use the existing stone, charcoal, and bronze palette. Keep Lora and Manrope on the personal website and the established Journey typography inside the Journey feature.

Add reduced motion behavior explicitly. The inspected component files do not provide their own reduced motion handling. All essential content must remain visible when movement is disabled. Continuous movement needs a pause control. Pointer effects should be optional on touch devices.

## Current status

The current website concept has not been changed or published during this installation. Jan plans to supply a new hero portrait. Once received, use it for the next homepage draft and review movement with the actual composition.

Local component preview command, from the installed repository:

```sh
pnpm --filter www exec next dev --hostname 127.0.0.1 --port 8766
```

The next concrete design deliverable is the homepage structure with provisional copy, the logo credibility strip, the new portrait, and a small selection of these effects.
