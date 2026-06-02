# Research: Redbook Text Template Renderer

## Decision: DOM preview plus Canvas export

**Rationale**: DOM preview gives immediate responsive editing. Canvas export
creates a real PNG asset with the same template model.

**Alternatives considered**: Screenshotting DOM; SVG-only export. Canvas keeps
the first release dependency-free and predictable.

## Decision: Browser print flow for PDF

**Rationale**: The static app can open a print-ready document and let the browser
save as PDF. This avoids adding PDF libraries for v1.

**Alternatives considered**: Client-side PDF library. It adds dependency weight
before the core template workflow is validated.

## Decision: Expanded curated template library in v1

**Rationale**: The initial expanded set should cover at least twenty templates
across modern typography poster directions: minimal editorial, Swiss grid, bold
sans, retro print, paper collage, art deco, glass gradient, riso, futuristic HUD,
cyber neon, vaporwave, botanical, and pencil notes. Midjourney-style poster
references are used as visual inspiration; the actual product uses hand-authored
CSS and Canvas rules so text remains clear and exportable.

**Alternatives considered**: Dozens of templates. More templates would dilute
quality and slow the first release.

## Decision: Minimal gallery/editor UI shell

**Rationale**: The application chrome should feel quiet and image-first: neutral
background, thin rules, low decoration, square panels, and restrained typography.
This keeps attention on the template previews, similar to modern AI image
gallery interfaces.

**Alternatives considered**: Colorful dashboard shell. That competes with the
templates and makes the product feel less like a visual creation tool.
