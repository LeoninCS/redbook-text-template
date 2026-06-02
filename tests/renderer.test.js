import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  OUTPUT_SIZE,
  buildRenderModel,
  drawRenderModel,
  getTemplates,
  paginateRenderModel,
  parseMarkdownBlocks,
  normalizeDraft,
  wrapText,
} from "../src/renderer.js";

function createMeasureContext() {
  return {
    font: "",
    measureText(text) {
      return { width: String(text).length * 20 };
    },
  };
}

function createDrawingContext() {
  return {
    font: "",
    globalAlpha: 1,
    lineWidth: 1,
    textAlign: "left",
    textBaseline: "top",
    shadowBlur: 0,
    shadowColor: "",
    shadowOffsetY: 0,
    globalCompositeOperation: "source-over",
    beginPath() {},
    moveTo() {},
    lineTo() {},
    quadraticCurveTo() {},
    bezierCurveTo() {},
    closePath() {},
    clearRect() {},
    fillRect() {},
    strokeRect() {},
    fill() {},
    stroke() {},
    arc() {},
    ellipse() {},
    save() {},
    restore() {},
    translate() {},
    rotate() {},
    fillText() {},
    measureText(text) {
      return { width: String(text).length * 20 };
    },
  };
}

const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

test("provides at least thirty-two distinct templates", () => {
  const templates = getTemplates();
  const ids = new Set(templates.map((template) => template.id));

  assert.ok(templates.length >= 32);
  assert.equal(ids.size, templates.length);
});

test("templates cover many visual decoration styles", () => {
  const decorations = new Set(getTemplates().map((template) => template.decoration));

  assert.ok(decorations.size >= 28);
});

test("includes a risograph zine template from archived style research", () => {
  const template = getTemplates().find((item) => item.id === "risograph-zine");

  assert.equal(template?.name, "Risograph Zine");
  assert.equal(template?.category, "复古");
  assert.equal(template?.decoration, "riso-zine");
});

test("includes a solarpunk editorial template from archived style research", () => {
  const template = getTemplates().find((item) => item.id === "solarpunk-editorial");

  assert.equal(template?.name, "Solarpunk Editorial");
  assert.equal(template?.category, "高科技");
  assert.equal(template?.decoration, "solarpunk");
});

test("includes an organic glassmorphism template from archived style research", () => {
  const template = getTemplates().find((item) => item.id === "organic-glassmorphism");

  assert.equal(template?.name, "Organic Glassmorphism");
  assert.equal(template?.category, "高科技");
  assert.equal(template?.decoration, "organic-glass");
});

test("includes a constructivist ledger template from archived style research", () => {
  const template = getTemplates().find((item) => item.id === "constructivist-ledger");

  assert.equal(template?.name, "Constructivist Ledger");
  assert.equal(template?.category, "专业");
  assert.equal(template?.decoration, "constructivist-ledger");
});

test("includes a pixel botanical template from archived style research", () => {
  const template = getTemplates().find((item) => item.id === "pixel-botanical");

  assert.equal(template?.name, "Pixel Botanical");
  assert.equal(template?.category, "手帐");
  assert.equal(template?.decoration, "pixel-botanical");
});

test("includes a cyber rococo template from archived style research", () => {
  const template = getTemplates().find((item) => item.id === "cyber-rococo");

  assert.equal(template?.name, "Cyber Rococo");
  assert.equal(template?.category, "炫酷");
  assert.equal(template?.decoration, "cyber-rococo");
});

test("includes a holographic foil template from archived style research", () => {
  const template = getTemplates().find((item) => item.id === "holographic-foil");

  assert.equal(template?.name, "Holographic Foil");
  assert.equal(template?.category, "炫酷");
  assert.equal(template?.decoration, "holographic-foil");
});

test("includes a solar clay ui template from archived style research", () => {
  const template = getTemplates().find((item) => item.id === "solar-clay-ui");

  assert.equal(template?.name, "Solar Clay UI");
  assert.equal(template?.category, "手帐");
  assert.equal(template?.decoration, "solar-clay");
});

test("includes a blueprint editorial template from archived style research", () => {
  const template = getTemplates().find((item) => item.id === "blueprint-editorial");

  assert.equal(template?.name, "Blueprint Editorial");
  assert.equal(template?.category, "专业");
  assert.equal(template?.decoration, "blueprint-editorial");
});

test("includes a liminal polaroid template from archived style research", () => {
  const template = getTemplates().find((item) => item.id === "liminal-polaroid");

  assert.equal(template?.name, "Liminal Polaroid");
  assert.equal(template?.category, "复古");
  assert.equal(template?.decoration, "liminal-polaroid");
});

test("parses markdown blocks for preview rendering", () => {
  const blocks = parseMarkdownBlocks("## 小标题\n- 要点一\n> 引用\n正文 **重点** 和 `代码`");

  assert.deepEqual(blocks.map((block) => block.type), ["heading", "list", "quote", "paragraph"]);
  assert.equal(blocks[0].text, "小标题");
  assert.equal(blocks[1].items[0], "要点一");
  assert.equal(blocks[3].segments.some((segment) => segment.type === "strong" && segment.text === "重点"), true);
  assert.equal(blocks[3].segments.some((segment) => segment.type === "code" && segment.text === "代码"), true);
});

test("styles include a dedicated mobile layout", () => {
  assert.match(styles, /@media \(max-width: 640px\)/);
  assert.match(styles, /\.library-layout\s*{\s*grid-template-columns: 1fr;/);
  assert.match(styles, /\.category-filter\s*{\s*display: flex;/);
  assert.match(styles, /\.preview-page-shell\s*{\s*width: min\(310px, 100%\);/);
  assert.match(styles, /\.preview-panel\s*{\s*order: -1;/);
});

test("paginates long markdown drafts into bounded render pages", () => {
  const ctx = createMeasureContext();
  const body = Array.from({ length: 80 }, (_, index) => `第 ${index + 1} 条内容 **重点** 和 \`标签\`，用于测试长文自动分页。`).join("\n");
  const paginated = paginateRenderModel(ctx, buildRenderModel("clean-list", {
    title: "长文自动分页",
    body,
    signature: "布洛克琴",
  }));

  assert.ok(paginated.pages.length > 1);
  assert.equal(paginated.pages[0].pageNumber, 1);
  assert.equal(paginated.pages.at(-1).pageCount, paginated.pages.length);
  assert.ok(paginated.pages[0].titleLines.length > 0);
  assert.equal(paginated.pages[1].titleLines.length, 0);
  assert.ok(paginated.pages.every((page) => page.items.length > 0));
  assert.ok(paginated.pages.every((page) => page.items.every((item) => item.y + item.height <= paginated.bodyBottomY)));
});

test("keeps inline markdown segments inside paginated list items", () => {
  const ctx = createMeasureContext();
  const paginated = paginateRenderModel(ctx, buildRenderModel("clean-list", {
    title: "列表 Markdown",
    body: "- 第一条 **重点** 和 `标签`",
    signature: "布洛克琴",
  }));
  const listLine = paginated.pages[0].items.find((item) => item.blockType === "list");

  assert.equal(listLine.segments.some((segment) => segment.type === "strong" && segment.text === "重点"), true);
  assert.equal(listLine.segments.some((segment) => segment.type === "code" && segment.text === "标签"), true);
});

test("draws a paginated page without runtime errors", () => {
  const ctx = createDrawingContext();

  assert.doesNotThrow(() => {
    drawRenderModel(ctx, buildRenderModel("clean-list", {
      title: "导出绘制",
      body: Array.from({ length: 20 }, (_, index) => `- 第 ${index + 1} 条 **重点**`).join("\n"),
      signature: "布洛克琴",
    }));
  });
});

test("templates cover the expected categories", () => {
  const categories = new Set(getTemplates().map((template) => template.category));

  for (const category of ["简约", "专业", "高科技", "炫酷", "复古", "手帐"]) {
    assert.ok(categories.has(category));
  }
  assert.equal([...getTemplates()].every((template) => template.category), true);
});

test("normalizes draft with placeholder defaults", () => {
  const draft = normalizeDraft({ title: "", body: "", signature: "" });

  assert.ok(draft.title.length > 0);
  assert.ok(draft.body.length > 0);
  assert.ok(draft.signature.length > 0);
});

test("builds render model with mobile post dimensions", () => {
  const model = buildRenderModel("clean-list", {
    title: "测试标题",
    body: "测试正文",
    signature: "作者",
  });

  assert.equal(model.template.id, "clean-list");
  assert.deepEqual(model.size, OUTPUT_SIZE);
  assert.ok(model.contentWidth > 0);
  assert.ok(model.lineHeight > 0);
});

test("falls back to a valid template for unknown id", () => {
  const model = buildRenderModel("missing-template", { body: "正文" });

  assert.equal(model.template.id, getTemplates()[0].id);
});

test("wraps long Chinese text into bounded lines", () => {
  const ctx = createMeasureContext();
  const lines = wrapText(ctx, "这是一段很长很长很长很长很长的中文文本", 120, 3);

  assert.ok(lines.length <= 3);
  assert.ok(lines.at(-1).endsWith("…"));
});
