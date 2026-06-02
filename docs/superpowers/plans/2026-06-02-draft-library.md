# Draft Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add local draft management, template favorites, and collapsible editor groups.

**Architecture:** Create `src/project-store.js` for pure state operations and localStorage persistence. Update `src/app.js` to render recent drafts, favorite template cards, draft actions, and collapsible panels.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript modules, Node test runner.

---

### Task 1: Store Layer

**Files:**
- Create: `src/project-store.js`
- Create: `tests/project-store.test.js`

- [ ] Write tests for create/update/duplicate/delete drafts and favorite toggles.
- [ ] Implement pure store helpers.
- [ ] Run `npm test`.

### Task 2: Library UI

**Files:**
- Modify: `index.html`
- Modify: `src/app.js`
- Modify: `src/styles.css`

- [ ] Add recent drafts container and favorites category.
- [ ] Render draft cards and favorite star buttons.
- [ ] Open editor with selected draft.
- [ ] Run `npm test`.

### Task 3: Editor UI

**Files:**
- Modify: `index.html`
- Modify: `src/app.js`
- Modify: `src/styles.css`

- [ ] Wrap content, style, AI, and export controls in `<details>`.
- [ ] Add new, duplicate, rename, delete draft actions.
- [ ] Persist draft state after input/template/control changes.
- [ ] Run `npm test` and local smoke checks.

### Task 4: Release

**Files:**
- Modify: `README.md`

- [ ] Document draft library and favorites.
- [ ] Run final `npm test`.
- [ ] Commit and push to `main`.
- [ ] Confirm GitHub Pages deploy succeeds.
