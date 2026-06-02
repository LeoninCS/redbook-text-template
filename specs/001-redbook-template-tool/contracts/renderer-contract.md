# Renderer Contract

## Functions

`getTemplates(): Template[]`

Returns all available templates.

`normalizeDraft(draft: TextDraft): TextDraft`

Trims user input and applies placeholder defaults.

`buildRenderModel(templateId: string, draft: TextDraft): RenderModel`

Combines selected template and normalized text for DOM preview and canvas export.

`drawRenderModel(ctx: CanvasRenderingContext2D, model: RenderModel): void`

Draws the render model into a canvas context.

## Output Rules

- Template list contains at least twenty templates.
- Every template has a category.
- Render model always contains a valid template.
- Render model keeps mobile-post aspect ratio metadata.
- Text wraps into readable lines inside the canvas.
- Missing body text renders a placeholder prompt.
