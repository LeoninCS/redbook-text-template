# Feature Specification: Redbook Text Template Renderer

**Feature Branch**: `001-redbook-template-tool`

**Created**: 2026-06-02

**Status**: Draft

**Input**: User description: "Product for Xiaohongshu creators who publish text posts. Plain text looks ugly, so the product should make text visually attractive. Users choose a template, input text, preview the mobile display, and export PDF or image. Homepage is a template library; after selecting a template, the editor has input on the left and phone preview on the right."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Choose Template From Library (Priority: P1)

A Xiaohongshu text creator opens the product, sees a template library on the
homepage, compares visual styles, and selects one template to start editing.

**Why this priority**: Template selection is the first step and defines the
visual output.

**Independent Test**: Open the product and confirm the homepage shows multiple
templates with distinct visual styles; click one template and enter the editor.

**Acceptance Scenarios**:

1. **Given** the user opens the product, **When** the homepage loads, **Then** the system shows at least twenty text layout templates grouped by category.
2. **Given** the user clicks a template, **When** the editor opens, **Then** the selected template appears in the phone preview.

---

### User Story 2 - Render Text Into Mobile Preview (Priority: P1)

A creator inputs text and immediately sees how the post will look inside a
mobile Xiaohongshu-style canvas.

**Why this priority**: The main product value is turning plain text into a good
looking mobile visual.

**Independent Test**: Select a template, input multiline text, and confirm the
right-side phone preview updates with the selected template and formatted text.

**Acceptance Scenarios**:

1. **Given** a template is selected, **When** the user types text, **Then** the phone preview updates with formatted text.
2. **Given** the user changes template, **When** the template is selected, **Then** the same text is re-rendered with the new visual style.
3. **Given** the text is long, **When** the preview renders, **Then** the layout keeps text readable inside the mobile canvas.

---

### User Story 3 - Export Image And PDF (Priority: P2)

A creator exports the rendered result as an image or PDF for sharing, saving, or
uploading to mobile workflows.

**Why this priority**: Export turns the preview into a usable asset.

**Independent Test**: Render text, click export image, and confirm a PNG is
downloaded; click export PDF and confirm a print-to-PDF view contains the mobile
preview.

**Acceptance Scenarios**:

1. **Given** text is rendered in preview, **When** the user exports image, **Then** the system downloads a PNG matching the selected template.
2. **Given** text is rendered in preview, **When** the user exports PDF, **Then** the system opens a PDF-ready print view with the rendered design.

### Edge Cases

- Empty text: the editor shows placeholder copy and prompts the user to input text.
- Long text: the preview uses readable wrapping, compact spacing, and controlled overflow.
- Template switch after editing: the input text stays intact and updates the preview.
- Export on unsupported browser APIs: the interface communicates the limitation and keeps the preview visible.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST show a homepage template library with at least twenty templates inspired by modern typography poster styles.
- **FR-002**: Each template MUST have a distinct visual style, name, description, and preview thumbnail.
- **FR-003**: System MUST provide category filters for all templates, including minimal, professional, high-tech, cool, retro, and journal styles.
- **FR-004**: Users MUST be able to select a template and enter an editor view.
- **FR-005**: Editor MUST provide left-side text input controls and right-side mobile preview on desktop.
- **FR-006**: Mobile layout MUST keep the template list, input, preview, and export controls usable in a single-column flow.
- **FR-007**: System MUST render user text into the selected template preview.
- **FR-008**: Users MUST be able to switch templates without losing entered text.
- **FR-009**: System MUST support PNG image export of the rendered template.
- **FR-010**: System MUST support PDF export through a PDF-ready browser print flow.
- **FR-011**: System MUST preserve a mobile-post aspect ratio suitable for phone viewing.

### Key Entities *(include if feature involves data)*

- **Template**: Visual layout preset with id, category, name, description, theme colors, typography, spacing, and decorative rules.
- **Text Draft**: User input text plus optional title and signature.
- **Rendered Asset**: Visual output produced from a template and text draft, downloadable as PNG or PDF.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: User can select a template and reach the editor in under 10 seconds.
- **SC-002**: User can render text into a mobile preview in under 30 seconds.
- **SC-003**: Homepage presents at least twenty visually distinct templates across at least six categories.
- **SC-004**: PNG export creates an image with the same template, text, and visual hierarchy shown in preview.
- **SC-005**: Layout remains usable at 375px mobile width and 1280px desktop width without horizontal overflow.

## Assumptions

- First release is a static browser app.
- The product focuses on visual rendering of user-provided text.
- The interface language is Simplified Chinese.
- PDF export uses the browser print flow for v1.
- Visual inspiration can come from modern typography poster styles such as Swiss grid, editorial, collage, neon, vintage print, decorative art, futuristic HUD, cyberpunk, vaporwave, and bold sans layouts.
