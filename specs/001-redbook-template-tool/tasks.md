# Tasks: Redbook Text Template Renderer

**Input**: Design documents from `specs/001-redbook-template-tool/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Include renderer model tests and browser manual checks from quickstart.

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Replace copy generator source with renderer source in src/renderer.js and src/app.js
- [x] T002 Update package test target and test filename in package.json and tests/renderer.test.js
- [x] T003 [P] Update README.md with template renderer workflow

---

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T004 Implement at least twenty Midjourney-inspired Template definitions with categories in src/renderer.js
- [x] T005 Implement TextDraft normalization and RenderModel creation in src/renderer.js
- [x] T006 Implement canvas drawing and text wrapping helpers in src/renderer.js
- [x] T007 Build homepage template library markup and editor shell in index.html
- [x] T008 Style template library, editor layout, phone preview, and mobile states in src/styles.css
- [x] T009 Wire view state, template selection, draft persistence, and preview rendering in src/app.js

---

## Phase 3: User Story 1 - Choose Template From Library (Priority: P1)

**Goal**: User sees multiple templates and enters editor by selecting one.

**Independent Test**: Homepage shows at least twenty templates and category filters; clicking a template opens editor with selected style.

- [x] T010 [P] [US1] Add renderer tests for template count and distinct IDs in tests/renderer.test.js
- [x] T011 [US1] Render template library cards in src/app.js
- [x] T012 [US1] Implement template selection and editor transition in src/app.js
- [x] T013 [US1] Add visual thumbnails for templates using shared template metadata in src/app.js and src/styles.css
- [x] T013A [US1] Add category filters for minimal, professional, high-tech, cool, retro, and journal templates in src/app.js and src/styles.css

---

## Phase 4: User Story 2 - Render Text Into Mobile Preview (Priority: P1)

**Goal**: User types text and sees a mobile preview update with the selected template.

**Independent Test**: Enter multiline text and confirm the right-side phone preview updates; switch template and text remains.

- [x] T014 [P] [US2] Add renderer tests for draft normalization and render model fallback in tests/renderer.test.js
- [x] T015 [US2] Implement editor inputs for title, body, and signature in index.html and src/app.js
- [x] T016 [US2] Implement DOM preview rendering in src/app.js
- [x] T017 [US2] Implement template switching while preserving draft text in src/app.js
- [x] T018 [US2] Add long-text readable layout behavior in src/styles.css and src/renderer.js

---

## Phase 5: User Story 3 - Export Image And PDF (Priority: P2)

**Goal**: User exports the rendered template as PNG or PDF-ready output.

**Independent Test**: Export PNG downloads an image; PDF export opens a print-ready preview.

- [x] T019 [P] [US3] Add renderer tests for canvas model dimensions and wrapped text in tests/renderer.test.js
- [x] T020 [US3] Implement PNG export through canvas rendering in src/app.js
- [x] T021 [US3] Implement PDF-ready print export in src/app.js
- [x] T022 [US3] Add export controls and status feedback in index.html and src/styles.css

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T023 [P] Add accessibility labels and keyboard focus states in index.html and src/styles.css
- [x] T024 [P] Update Spec Kit checklist in specs/001-redbook-template-tool/checklists/requirements.md
- [x] T025 Run npm test and fix renderer issues
- [x] T026 Validate homepage/editor/export in browser at desktop and mobile widths
- [x] T027 Mark completed tasks in specs/001-redbook-template-tool/tasks.md

## Dependencies & Execution Order

- Phase 1 -> Phase 2 -> User stories -> Polish.
- US1 and US2 are both P1; US1 establishes entry flow, US2 establishes core rendering value.
- US3 depends on renderer model and preview behavior from US2.

## Implementation Strategy

1. Replace generation model with render model.
2. Ship template library and editor preview first.
3. Add PNG and PDF export.
4. Validate at desktop and mobile sizes.
