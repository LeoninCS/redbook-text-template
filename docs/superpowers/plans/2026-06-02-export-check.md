# Export Check Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a live export summary strip to the editor export panel.

**Architecture:** Keep export math in `src/exporter.js` as a pure helper and render it from `src/app.js`. The HTML adds one summary node in the existing export panel, and CSS styles it as a compact two-column strip.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript modules, Node test runner.

---

### Task 1: Export Summary Helper

**Files:**
- Modify: `src/exporter.js`
- Modify: `tests/exporter.test.js`

- [ ] Add tests for `buildExportSummary(input, pageCount, scale, size)`.
- [ ] Implement the helper using `parsePageRange`.
- [ ] Run `npm test -- tests/exporter.test.js`.

### Task 2: Export Panel UI

**Files:**
- Modify: `index.html`
- Modify: `src/app.js`
- Modify: `src/styles.css`

- [ ] Add `#exportSummary` inside the export panel.
- [ ] Render summary after pagination, page range input, scale change, and failed export range.
- [ ] Style normal and warning states.
- [ ] Run `npm test` and syntax checks.

### Task 3: Release

**Files:**
- Modify: `README.md`

- [ ] Document export check strip.
- [ ] Commit and push to `main`.
- [ ] Confirm GitHub Pages serves the new HTML, JS, and CSS.
