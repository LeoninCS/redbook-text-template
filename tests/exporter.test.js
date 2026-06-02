import assert from "node:assert/strict";
import test from "node:test";

import {
  buildExportSummary,
  buildExportFilename,
  createPdfBlob,
  createZipBlob,
  parsePageRange,
} from "../src/exporter.js";

test("parses export page ranges with ranges, single pages, duplicates, and bounds", () => {
  assert.deepEqual(parsePageRange("", 5), [1, 2, 3, 4, 5]);
  assert.deepEqual(parsePageRange("2-4, 4, 9, 1", 5), [1, 2, 3, 4]);
  assert.deepEqual(parsePageRange("4-2", 5), [2, 3, 4]);
  assert.deepEqual(parsePageRange("abc, 0, 8", 3), []);
});

test("builds stable page filenames", () => {
  assert.equal(buildExportFilename("clean-list", 3, "png"), "redbook-template-clean-list-03.png");
});

test("builds export summary for selected page ranges and scale", () => {
  const summary = buildExportSummary("1-2, 4", 5, 2, { width: 1080, height: 1440 });

  assert.deepEqual(summary.pages, [1, 2, 4]);
  assert.equal(summary.pageCount, 5);
  assert.equal(summary.selectedCount, 3);
  assert.equal(summary.scale, 2);
  assert.equal(summary.width, 2160);
  assert.equal(summary.height, 2880);
  assert.equal(summary.isValid, true);
  assert.equal(summary.message, "将导出 3 / 5 页，2x，2160 x 2880 px。");
});

test("builds export summary warning for empty page ranges", () => {
  const summary = buildExportSummary("abc, 9", 3, 3, { width: 1080, height: 1440 });

  assert.deepEqual(summary.pages, []);
  assert.equal(summary.selectedCount, 0);
  assert.equal(summary.isValid, false);
  assert.equal(summary.message, "页码范围为空，请输入如 1-3,5。");
});

test("creates a zip blob with expected signature", async () => {
  const blob = createZipBlob([
    { name: "one.txt", bytes: new TextEncoder().encode("hello") },
  ]);
  const bytes = new Uint8Array(await blob.arrayBuffer());

  assert.equal(blob.type, "application/zip");
  assert.deepEqual([...bytes.slice(0, 4)], [0x50, 0x4b, 0x03, 0x04]);
});

test("creates a pdf blob with expected signature and page count", async () => {
  const onePixelJpeg = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2w==";
  const blob = createPdfBlob([onePixelJpeg, onePixelJpeg], { width: 1080, height: 1440 });
  const text = new TextDecoder().decode(await blob.arrayBuffer());

  assert.equal(blob.type, "application/pdf");
  assert.equal(text.startsWith("%PDF-1.4"), true);
  assert.match(text, /\/Count 2/);
});
