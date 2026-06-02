# Implementation Plan: Redbook Text Template Renderer

**Branch**: `001-redbook-template-tool` | **Date**: 2026-06-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-redbook-template-tool/spec.md`

## Summary

Build a static template-rendering app for Xiaohongshu text creators. The home
screen is a large template library inspired by modern typography poster styles.
Selecting a template opens an editor with text input on the left and a
phone-sized preview on the right. The same render model drives DOM preview and
canvas PNG export; PDF export uses a print-ready route.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript ES2022

**Primary Dependencies**: Browser Web APIs only

**Storage**: `localStorage` for selected template and text draft

**Testing**: Node.js built-in test runner for template rendering model; browser visual and interaction checks

**Target Platform**: Modern desktop and mobile browsers

**Project Type**: Static web application

**Performance Goals**: Template switch and preview update feel instant for typical text

**Constraints**: No backend, account, build step, or required network access for v1

**Scale/Scope**: 20+ style templates, 6 category filters, single editor view, PNG export, and PDF export

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Text Readability: PASS. The tool displays user text clearly and preserves Chinese readability.
- Template Visual Integrity: PASS. Selected template and visual rules are visible.
- Static-First Delivery: PASS. Pure static app using browser-native APIs.
- Preview-And-Export Workflow: PASS. Exported image and PDF-ready output produce usable assets.
- Small Surface, Strong Verification: PASS. Rendering model is isolated and tested.

## Project Structure

### Documentation (this feature)

```text
specs/001-redbook-template-tool/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── renderer-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
index.html
src/
├── app.js
├── renderer.js
└── styles.css
tests/
└── renderer.test.js
package.json
README.md
```

**Structure Decision**: Keep template definitions and canvas render helpers in
`src/renderer.js`; keep DOM state, editor behavior, PNG export, and PDF export in
`src/app.js`; keep visual presentation in `src/styles.css`.

## Complexity Tracking

No constitution violations.
