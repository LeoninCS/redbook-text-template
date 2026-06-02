# Export Check Design

## Goal

Add a compact export check strip in the editor export panel so creators know exactly what will be exported before pressing PNG ZIP or PDF.

## Scope

This iteration adds:

- A pure export summary helper.
- A visible summary inside the export panel.
- Live updates when preview pagination, page range, or export scale changes.

## Behavior

The export panel shows total pages, selected pages, export scale, output size, and a short status. Empty page ranges show a clear warning. Blank page range means all pages.

The export buttons keep using the existing export flow. The check strip gives creators a fast confirmation step before export.

## Testing

Unit tests cover all-pages export, subset ranges, invalid ranges, and scale-derived output dimensions.
