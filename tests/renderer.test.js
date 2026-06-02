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

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

test("homepage uses a compact Chinese product title", () => {
  assert.match(html, /<h1 id="library-title">小红书文字模板库<\/h1>/);
});

test("homepage chrome keeps copy to a minimum", () => {
  assert.doesNotMatch(html, /subcopy/);
  assert.doesNotMatch(html, /hero-stats/);
  assert.doesNotMatch(html, /Redbook Text Template<\/p>/);
  assert.doesNotMatch(html, />Drafts</);
  assert.doesNotMatch(html, />Categories</);
  assert.doesNotMatch(styles, /\.template-card-copy p\s*{/);
  assert.doesNotMatch(styles, /\.template-category\s*{/);
});

test("provides at least thirty-two distinct templates", () => {
  const templates = getTemplates();
  const ids = new Set(templates.map((template) => template.id));

  assert.ok(templates.length >= 32);
  assert.equal(ids.size, templates.length);
});

test("templates cover many visual decoration styles", () => {
  const decorations = new Set(getTemplates().map((template) => template.decoration.kind));

  assert.ok(decorations.size >= 28);
});

test("templates expose tokens layout and decoration metadata", () => {
  for (const template of getTemplates()) {
    assert.equal(typeof template.tokens.color.background, "string");
    assert.equal(typeof template.tokens.color.surface, "string");
    assert.equal(typeof template.tokens.color.text, "string");
    assert.equal(typeof template.tokens.color.accent, "string");
    assert.equal(typeof template.layout.titleFont, "number");
    assert.equal(typeof template.layout.bodyFont, "number");
    assert.equal(typeof template.layout.align, "string");
    assert.equal(typeof template.decoration.kind, "string");
  }
});

test("includes a risograph zine template from archived style research", () => {
  const template = getTemplates().find((item) => item.id === "risograph-zine");

  assert.equal(template?.name, "Risograph Zine");
  assert.equal(template?.category, "复古");
  assert.equal(template?.decoration.kind, "riso-zine");
});

test("includes a solarpunk editorial template from archived style research", () => {
  const template = getTemplates().find((item) => item.id === "solarpunk-editorial");

  assert.equal(template?.name, "Solarpunk Editorial");
  assert.equal(template?.category, "高科技");
  assert.equal(template?.decoration.kind, "solarpunk");
});

test("includes an organic glassmorphism template from archived style research", () => {
  const template = getTemplates().find((item) => item.id === "organic-glassmorphism");

  assert.equal(template?.name, "Organic Glassmorphism");
  assert.equal(template?.category, "高科技");
  assert.equal(template?.decoration.kind, "organic-glass");
});

test("includes a constructivist ledger template from archived style research", () => {
  const template = getTemplates().find((item) => item.id === "constructivist-ledger");

  assert.equal(template?.name, "Constructivist Ledger");
  assert.equal(template?.category, "专业");
  assert.equal(template?.decoration.kind, "constructivist-ledger");
});

test("includes a pixel botanical template from archived style research", () => {
  const template = getTemplates().find((item) => item.id === "pixel-botanical");

  assert.equal(template?.name, "Pixel Botanical");
  assert.equal(template?.category, "手帐");
  assert.equal(template?.decoration.kind, "pixel-botanical");
});

test("includes a cyber rococo template from archived style research", () => {
  const template = getTemplates().find((item) => item.id === "cyber-rococo");

  assert.equal(template?.name, "Cyber Rococo");
  assert.equal(template?.category, "炫酷");
  assert.equal(template?.decoration.kind, "cyber-rococo");
});

test("includes a holographic foil template from archived style research", () => {
  const template = getTemplates().find((item) => item.id === "holographic-foil");

  assert.equal(template?.name, "Holographic Foil");
  assert.equal(template?.category, "炫酷");
  assert.equal(template?.decoration.kind, "holographic-foil");
});

test("includes a solar clay ui template from archived style research", () => {
  const template = getTemplates().find((item) => item.id === "solar-clay-ui");

  assert.equal(template?.name, "Solar Clay UI");
  assert.equal(template?.category, "手帐");
  assert.equal(template?.decoration.kind, "solar-clay");
});

test("includes a blueprint editorial template from archived style research", () => {
  const template = getTemplates().find((item) => item.id === "blueprint-editorial");

  assert.equal(template?.name, "Blueprint Editorial");
  assert.equal(template?.category, "专业");
  assert.equal(template?.decoration.kind, "blueprint-editorial");
});

test("includes a liminal polaroid template from archived style research", () => {
  const template = getTemplates().find((item) => item.id === "liminal-polaroid");

  assert.equal(template?.name, "Liminal Polaroid");
  assert.equal(template?.category, "复古");
  assert.equal(template?.decoration.kind, "liminal-polaroid");
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
  assert.match(styles, /h1\s*{\s*font-size: clamp\(27px, 8vw, 34px\);/);
  assert.match(styles, /\.template-card\s*{\s*min-height: auto;/);
});

test("styles include the ink wash paper UI language", () => {
  assert.match(styles, /--paper:\s*#f7f0df;/);
  assert.match(styles, /--mist-pink:\s*#d96488;/);
  assert.match(styles, /--seal-red:\s*#9f3f36;/);
  assert.match(styles, /body::before\s*{/);
  assert.match(styles, /body::after\s*{/);
  assert.match(styles, /\.site-nav::after\s*{/);
  assert.match(styles, /\.hero::before\s*{/);
  assert.match(styles, /\.template-grid\s*{[\s\S]*linear-gradient\(180deg, rgba\(247, 240, 223, 0.86\), rgba\(239, 183, 199, 0.22\)\)/);
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

test("honors manual markdown page breaks", () => {
  const ctx = createMeasureContext();
  const paginated = paginateRenderModel(ctx, buildRenderModel("clean-list", {
    title: "手动分页",
    body: "第一页正文\n\n---\n\n第二页正文",
    signature: "布洛克琴",
  }));

  assert.equal(paginated.pages.length, 2);
  assert.equal(paginated.pages[0].items.some((item) => item.segments?.some((segment) => segment.text.includes("第一页"))), true);
  assert.equal(paginated.pages[1].items.some((item) => item.segments?.some((segment) => segment.text.includes("第二页"))), true);
});

test("moves a heading with its following body when the pair would orphan", () => {
  const ctx = createMeasureContext();
  const filler = Array.from({ length: 14 }, (_, index) => `铺垫段落 ${index + 1}`).join("\n");
  const paginated = paginateRenderModel(ctx, buildRenderModel("clean-list", {
    title: "标题跟随",
    body: `${filler}\n## 跟随标题\n标题后的正文内容`,
    signature: "布洛克琴",
  }));

  assert.ok(paginated.pages.length > 1);
  assert.equal(paginated.pages.slice(0, -1).some((page) => page.items.at(-1)?.blockType === "heading"), false);
});

test("keeps wrapped list items in the same page group when possible", () => {
  const ctx = createMeasureContext();
  const filler = Array.from({ length: 13 }, (_, index) => `前置段落 ${index + 1}`).join("\n");
  const paginated = paginateRenderModel(ctx, buildRenderModel("clean-list", {
    title: "列表成组",
    body: `${filler}\n- ${"成组列表项".repeat(20)}`,
    signature: "布洛克琴",
  }));
  const listLocations = paginated.pages.flatMap((page) => page.items
    .filter((item) => item.blockType === "list")
    .map((item) => ({ pageNumber: page.pageNumber, groupId: item.groupId })));
  const firstGroupId = listLocations[0]?.groupId;
  const pagesWithFirstGroup = new Set(listLocations
    .filter((item) => item.groupId === firstGroupId)
    .map((item) => item.pageNumber));

  assert.ok(firstGroupId);
  assert.equal(pagesWithFirstGroup.size, 1);
});

test("reports remaining page space for pagination hints", () => {
  const ctx = createMeasureContext();
  const paginated = paginateRenderModel(ctx, buildRenderModel("clean-list", {
    title: "空白提示",
    body: "短正文",
    signature: "布洛克琴",
  }));

  assert.equal(typeof paginated.pages[0].remainingHeight, "number");
  assert.equal(typeof paginated.pages[0].remainingRatio, "number");
  assert.ok(paginated.pages[0].remainingHeight > 0);
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

test("quality fixtures paginate and draw stable pages", () => {
  const fixtures = [
    {
      name: "short text",
      title: "短文",
      body: "一句话也要排得好看。",
    },
    {
      name: "long text",
      title: "长文",
      body: Array.from({ length: 90 }, (_, index) => `第 ${index + 1} 段内容，保持手机阅读节奏。`).join("\n"),
    },
    {
      name: "mixed zh en",
      title: "中英混排",
      body: "Build in public，也要把中文段落、English keywords 和 `code` 放在同一个版式里。",
    },
    {
      name: "list text",
      title: "清单",
      body: "- 选择模板\n- 输入 Markdown\n- 导出 PNG ZIP\n- 生成 PDF",
    },
    {
      name: "quote text",
      title: "引用",
      body: "> 好的排版会让普通文字更容易被读完。\n\n正文继续解释观点。",
    },
  ];

  for (const fixture of fixtures) {
    const measureCtx = createMeasureContext();
    const drawCtx = createDrawingContext();
    const paginated = paginateRenderModel(measureCtx, buildRenderModel("clean-list", {
      ...fixture,
      signature: "布洛克琴",
    }));

    assert.ok(paginated.pages.length >= 1, fixture.name);
    assert.ok(paginated.pages.every((page) => page.items.every((item) => item.y + item.height <= paginated.bodyBottomY)), fixture.name);
    assert.doesNotThrow(() => drawRenderModel(drawCtx, paginated), fixture.name);
  }
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

test("applies draft style controls to render model", () => {
  const model = buildRenderModel("clean-list", {
    body: "正文",
    controls: {
      fontScale: 1.2,
      lineHeightScale: 1.15,
      paddingScale: 0.9,
      accent: "#ff3366",
      surfaceAlpha: 0.35,
      align: "center",
    },
  });

  assert.equal(model.template.accent, "#ff3366");
  assert.equal(model.template.align, "center");
  assert.ok(model.template.bodyFont > getTemplates().find((template) => template.id === "clean-list").bodyFont);
  assert.ok(model.lineHeight > Math.round(model.template.bodyFont * 1.62));
  assert.ok(model.padding < 92);
  assert.equal(model.surfaceAlpha, 0.35);
});

test("applies output tone mode to render model colors", () => {
  const darkModel = buildRenderModel("clean-list", {
    body: "正文",
    controls: {
      toneMode: "dark",
      accent: "#ff3366",
    },
  });
  const lightModel = buildRenderModel("night-glow", {
    body: "正文",
    controls: {
      toneMode: "light",
      accent: "#0f766e",
    },
  });

  assert.equal(darkModel.controls.toneMode, "dark");
  assert.equal(darkModel.template.bg, "#111111");
  assert.equal(darkModel.template.surface, "#1f1f1f");
  assert.equal(darkModel.template.text, "#f7f4ed");
  assert.equal(darkModel.template.accent, "#ff3366");
  assert.equal(lightModel.controls.toneMode, "light");
  assert.equal(lightModel.template.bg, "#f7f4ed");
  assert.equal(lightModel.template.surface, "#ffffff");
  assert.equal(lightModel.template.text, "#171717");
  assert.equal(lightModel.template.accent, "#0f766e");
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
