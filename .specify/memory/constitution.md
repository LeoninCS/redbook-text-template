<!--
Sync Impact Report
Version change: 1.0.0 -> 1.1.0
Modified principles:
- Chinese Copy Quality -> Text Readability
- Template Transparency -> Template Visual Integrity
- Copy-And-Use Workflow -> Preview-And-Export Workflow
Added sections: None
Removed sections: None
Templates requiring updates:
- .specify/templates/plan-template.md: OK
- .specify/templates/spec-template.md: OK
- .specify/templates/tasks-template.md: OK
Follow-up TODOs: None
-->

# redbook-text-template Constitution

## Core Principles

### I. Text Readability

Rendered Chinese text MUST stay readable inside a mobile-first canvas. Typography,
line height, spacing, contrast, and wrapping MUST support quick phone reading.
Long text MUST degrade gracefully through wrapping, spacing, or controlled
overflow.

### II. Template Visual Integrity

Templates MUST be visually distinct, internally consistent, and suitable for
Xiaohongshu text posts. Each template MUST define its own colors, typography,
spacing, and decorative language. Template switching MUST preserve user text.

### III. Static-First Delivery

The product MUST deliver value as a static web tool before adding servers,
databases, accounts, or paid APIs. Browser-native rendering, canvas export,
print export, and local storage are preferred for the first production slice.

### IV. Preview-And-Export Workflow

The primary workflow MUST end in a usable visual asset. The interface MUST show a
phone-like preview, update it as the user edits text, and provide PNG plus
PDF-ready export paths that match the visible template.

### V. Small Surface, Strong Verification

The codebase MUST stay small, readable, and easy to run locally. Each feature
MUST include a practical verification path, either browser validation for UI and
export behavior or focused automated checks for reusable rendering logic.

## Product Constraints

The first release targets Xiaohongshu creators who publish text-based posts and
need attractive mobile visual presentation. It MUST work in modern desktop and
mobile browsers. It MUST avoid credential requirements in the initial version.
AI features may be added later for template recommendation or text polishing
after the rendering workflow is stable.

## Development Workflow

All product changes MUST start from a Spec Kit specification, plan, and task
list. Tasks MUST preserve independent user-story slices so the template library
and text rendering workflow can ship first. Visual changes MUST be verified in a
browser at desktop and mobile widths before completion.

## Governance

This constitution governs product scope, implementation planning, and acceptance
for this repository. Amendments require a version update, a short rationale in
the Sync Impact Report, and a review of affected Spec Kit templates or active
specs. Versioning follows semantic versioning: MAJOR for principle removals or
meaning changes, MINOR for added principles or materially expanded governance,
PATCH for clarifications.

**Version**: 1.1.0 | **Ratified**: 2026-06-02 | **Last Amended**: 2026-06-02
