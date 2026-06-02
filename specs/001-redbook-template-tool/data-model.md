# Data Model: Redbook Text Template Renderer

## Template

- `id`: stable identifier
- `name`: display name
- `description`: one-line use case
- `theme`: colors, background style, accent, text color
- `typography`: title size, body size, weight, line height
- `layout`: padding, alignment, content blocks, decorative elements
- `decoration`: visual style rule used by DOM preview and Canvas export

## TextDraft

- `title`: optional text shown as template heading
- `body`: required multiline text
- `signature`: optional footer text

## RenderedAsset

- `templateId`: selected template
- `draft`: current TextDraft
- `size`: output canvas width and height
- `format`: `png` or `pdf-print`

## State Transitions

1. Template library -> Selected template
2. Selected template -> Editor
3. Editor text input -> Preview update
4. Template switch -> Preview re-render
5. Preview -> PNG download or PDF print flow
