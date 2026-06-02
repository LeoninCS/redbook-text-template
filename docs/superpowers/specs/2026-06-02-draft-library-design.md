# Draft Library Design

## Goal

Add a creator workflow layer for saving multiple works, favoriting templates, and keeping the editor easier to scan as controls grow.

## Scope

This iteration adds:

- A local draft library stored in `localStorage`.
- Recent draft cards on the template library page.
- Editor commands for new draft, duplicate draft, rename draft, and delete draft.
- Template favorite toggles and a favorites category.
- Collapsible editor groups for content, style, AI, and export controls.

## Architecture

`src/project-store.js` owns local draft and favorite state. It exposes pure helpers for tests plus browser persistence wrappers. `src/app.js` keeps rendering and DOM interaction, calling the store helpers when draft or template state changes.

Draft records store `id`, `name`, `templateId`, `draft`, `updatedAt`, and `createdAt`. The existing single-draft state migrates into the first draft automatically when no draft library exists.

## UI

The library page shows recent drafts above the template grid. Draft cards open the editor directly. Template cards include a star button; favorited templates appear in a `收藏` category.

The editor left panel uses native `<details>` sections:

- 内容: template, title, body, signature, draft actions.
- 样式: current micro controls.
- AI: current local AI suggestions.
- 导出: page range, scale, PNG ZIP, PDF.

## Testing

Unit tests cover draft creation, updating, duplication, deletion, favorite toggling, and migration from legacy state. Existing renderer, exporter, and assistant tests continue to run.
