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
  const textCalls = [];
  return {
    textCalls,
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
    fillText(text, x, y) {
      textCalls.push({ text, x, y, font: this.font });
    },
    measureText(text) {
      return { width: String(text).length * 20 };
    },
  };
}

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
const rendererSource = readFileSync(new URL("../src/renderer.js", import.meta.url), "utf8");

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

test("site nav shows author with a GitHub icon link", () => {
  assert.match(html, /<a class="author-link" href="https:\/\/github\.com\/LeoninCS\/redbook-text-template"[\s\S]*aria-label="布洛克琴 GitHub"/);
  assert.match(html, /<span>布洛克琴<\/span>/);
  assert.match(html, /class="github-icon"/);
  assert.doesNotMatch(html, /<footer class="site-credit"/);
  assert.doesNotMatch(styles, /\.site-nav::after\s*{/);
  assert.match(styles, /\.author-link\s*{[\s\S]*justify-self:\s*end;/);
  assert.match(styles, /\.github-icon\s*{[\s\S]*width:\s*18px;/);
});

test("homepage removes the top decorative illustration strip", () => {
  assert.doesNotMatch(html, /class="hero-art"/);
  assert.doesNotMatch(html, /class="ink-panel/);
  assert.doesNotMatch(styles, /\.hero-art\s*{/);
  assert.doesNotMatch(styles, /\.ink-panel/);
  assert.doesNotMatch(styles, /\.hero::before\s*{/);
  assert.doesNotMatch(styles, /\.hero::after\s*{/);
  assert.match(styles, /--ink-silhouette:\s*rgba\(17, 16, 13, 0\.92\);/);
  assert.match(styles, /--gallery-paper:\s*#f4f1ea;/);
  assert.match(styles, /--charcoal:\s*#11100d;/);
});

test("template thumbnails render from the same canvas path as export output", () => {
  assert.match(appSource, /const thumbnailDraft = \{/);
  assert.match(appSource, /const thumbnailModel = buildRenderModel\(template\.id, thumbnailDraft\);/);
  assert.match(appSource, /const thumbnailPage = paginateRenderModel\(/);
  assert.match(appSource, /function renderCanvasThumbnail\(paginated, page = paginated\.pages\[0\]\)/);
  assert.match(appSource, /drawRenderPage\(ctx, paginated, page\);/);
  assert.match(appSource, /thumb\.append\(renderCanvasThumbnail\(thumbnailPage\)\);/);
  assert.match(appSource, /thumb\.append\(renderCanvasThumbnail\(workPage\)\);/);
  assert.doesNotMatch(appSource, /function getInkScene/);
  assert.doesNotMatch(appSource, /ink-motif/);
  assert.doesNotMatch(styles, /\.template-thumb \.ink-motif/);
  assert.doesNotMatch(styles, /\.template-thumb\[data-scene=/);
});

test("homepage shows works library as a category tab", () => {
  assert.doesNotMatch(html, /<section class="works-section"/);
  assert.doesNotMatch(html, /class="drafts-section"/);
  assert.doesNotMatch(html, /id="worksGrid"/);
  assert.doesNotMatch(html, /id="saveWorkBtn"/);
  assert.doesNotMatch(html, /id="createWorkBtn"/);
  assert.doesNotMatch(appSource, /createWorkBtn/);
  assert.match(appSource, /CATEGORY_WORKS/);
  assert.match(appSource, /selectedCategory === CATEGORY_WORKS/);
  assert.match(appSource, /function renderWorksLibrary\(\)/);
  assert.match(appSource, /function createWorkFromSelectedTemplate\(\)/);
  assert.match(appSource, /function openWork\(workId\)/);
  assert.match(appSource, /function deleteSavedWork\(workId\)/);
  assert.match(styles, /\.works-empty\s*{/);
  assert.match(styles, /\.work-card\s*{/);
});

test("template library requires creating a work before editing", () => {
  assert.doesNotMatch(appSource, /card\.addEventListener\("click", \(\) => openEditor\(template\.id\)\);/);
  assert.doesNotMatch(appSource, /openEditor\(template\.id\);/);
  assert.match(appSource, /function selectTemplateForCreation\(templateId\)/);
  assert.match(appSource, /function createWorkFromSelectedTemplate\(\)/);
  assert.match(appSource, /createWork\(projectState, selectedTemplateId, defaultDraft\)/);
  assert.match(appSource, /openWorkEditor\(result\.activeWorkId\)/);
});

test("template cards reveal their own create action on hover", () => {
  assert.match(appSource, /createButton\.className = "template-create-button";/);
  assert.match(appSource, /createButton\.textContent = "新建";/);
  assert.match(appSource, /createButton\.setAttribute\("aria-label", `用 \$\{template\.name\} 新建作品`\);/);
  assert.match(appSource, /createButton\.addEventListener\("click", \(event\) => \{/);
  assert.match(appSource, /selectTemplateForCreation\(template\.id\);[\s\S]*createWorkFromSelectedTemplate\(\);/);
  assert.match(styles, /\.template-create-button\s*{/);
  assert.match(styles, /\.template-card:hover \.template-create-button/);
  assert.match(styles, /\.template-card:focus-within \.template-create-button/);
});

test("editor exposes local auto typesetting", () => {
  assert.match(html, /<button class="secondary-button small-button" id="autoTypesetBtn" type="button">自动排版<\/button>/);
  assert.match(appSource, /import \{ autoTypeset \} from "\.\/auto-typeset\.js";/);
  assert.match(appSource, /function applyAutoTypeset\(\)/);
  assert.match(appSource, /autoTypeset\(draft, templates\)/);
  assert.match(appSource, /autoTypesetBtn\.addEventListener\("click", applyAutoTypeset\);/);
});

test("editor keeps only essential work actions", () => {
  assert.match(html, /<div class="draft-action-bar" aria-label="作品操作">/);
  assert.doesNotMatch(html, /id="newDraftBtn"/);
  assert.doesNotMatch(html, /id="duplicateDraftBtn"/);
  assert.doesNotMatch(html, /id="renameDraftBtn"/);
  assert.match(styles, /\.draft-action-bar\s*{[\s\S]*grid-template-columns:\s*repeat\(auto-fit,\s*minmax\(76px,\s*max-content\)\);/);
  assert.match(styles, /\.draft-action-bar \.small-button\s*{[\s\S]*white-space:\s*nowrap;/);
  assert.match(styles, /\.draft-action-bar \.small-button\s*{[\s\S]*width:\s*max-content;/);
  assert.doesNotMatch(appSource, /newDraftBtn\.addEventListener/);
  assert.doesNotMatch(appSource, /duplicateDraftBtn\.addEventListener/);
  assert.doesNotMatch(appSource, /renameDraftBtn\.addEventListener/);
});

test("homepage uses a redbook style waterfall feed", () => {
  assert.match(styles, /\.library-layout\s*{[\s\S]*display:\s*block;/);
  assert.match(styles, /\.library-sidebar\s*{[\s\S]*position:\s*sticky;/);
  assert.match(styles, /\.category-filter\s*{[\s\S]*display:\s*flex;/);
  assert.match(styles, /\.template-grid\s*{[\s\S]*column-count:\s*4;/);
  assert.match(styles, /\.template-card\s*{[\s\S]*break-inside:\s*avoid;/);
  assert.doesNotMatch(appSource, /thumb\.dataset\.size/);
  assert.match(styles, /@media \(max-width: 640px\)[\s\S]*\.template-grid\s*{[\s\S]*column-count:\s*2;/);
});

test("homepage keeps the feed header compact", () => {
  assert.match(styles, /\.hero\s*{[\s\S]*min-height:\s*96px;/);
  assert.match(styles, /\.hero\s*{[\s\S]*border:\s*0;/);
  assert.match(styles, /\.hero\s*{[\s\S]*box-shadow:\s*none;/);
  assert.doesNotMatch(styles, /width:\s*min\(360px, 36%\);/);
});

test("homepage uses gallery chrome while thumbnails keep each template effect", () => {
  assert.match(appSource, /title\.className = "template-title";/);
  assert.match(styles, /--gallery-wall:\s*#d8d4cc;/);
  assert.match(styles, /--brush-wash:\s*rgba\(17, 16, 13, 0\.18\);/);
  assert.match(styles, /\.template-card\s*{[\s\S]*border-radius:\s*0;/);
  assert.match(styles, /\.template-card\s*{[\s\S]*background:\s*transparent;/);
  assert.match(styles, /\.template-thumb\s*{[\s\S]*aspect-ratio:\s*3 \/ 4;/);
  assert.match(styles, /\.template-thumb\s*{[\s\S]*border-radius:\s*1px;/);
  assert.match(styles, /\.template-thumb-canvas\s*{/);
  assert.doesNotMatch(styles, /\.template-thumb-card\s*{/);
  assert.doesNotMatch(styles, /\.template-preview-title\s*{/);
  assert.doesNotMatch(styles, /\.template-preview-body\s*{/);
  assert.match(styles, /\.template-title\s*{/);
  assert.match(styles, /\.favorite-button\s*{[\s\S]*opacity:\s*0;/);
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

test("includes a monochrome negative-space ink template for the new gallery style", () => {
  const template = getTemplates().find((item) => item.id === "ink-negative-space");

  assert.equal(template?.name, "黑白留白画幅");
  assert.equal(template?.category, "简约");
  assert.equal(template?.decoration.kind, "ink-negative-space");
  assert.equal(template?.tokens.color.background, "#d8d4cc");
  assert.equal(template?.tokens.color.surface, "#f4f1ea");
  assert.match(rendererSource, /decoration === "ink-negative-space"/);
  assert.match(rendererSource, /const birds = \[/);
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
  assert.match(styles, /\.library-layout\s*{\s*display: block;/);
  assert.match(styles, /\.category-filter\s*{\s*display: flex;/);
  assert.match(styles, /@media \(max-width: 640px\)[\s\S]*\.category-filter\s*{[\s\S]*justify-content: space-between;/);
  assert.match(styles, /@media \(max-width: 640px\)[\s\S]*\.category-button\s*{[\s\S]*padding: 0 7px;/);
  assert.match(styles, /\.preview-page-shell\s*{\s*width: min\(320px, 100%\);/);
  assert.match(styles, /\.preview-panel\s*{\s*order: -1;/);
  assert.match(styles, /h1\s*{\s*font-size: clamp\(24px, 7vw, 30px\);/);
  assert.match(styles, /\.template-grid\s*{\s*column-count: 2;/);
  assert.match(styles, /@media \(max-width: 640px\)[\s\S]*\.editor-topbar\s*{[\s\S]*padding: 8px 10px;/);
  assert.match(styles, /@media \(max-width: 640px\)[\s\S]*\.control-grid\s*{\s*grid-template-columns: 1fr;/);
  assert.match(styles, /@media \(max-width: 640px\)[\s\S]*\.editor-section-body\s*{[\s\S]*gap: 16px;/);
  assert.match(styles, /@media \(max-width: 640px\)[\s\S]*\.phone-frame\s*{[\s\S]*aspect-ratio: 3 \/ 4;/);
});

test("styles include the ink wash paper UI language", () => {
  assert.match(styles, /--paper:\s*var\(--gallery-paper\);/);
  assert.match(styles, /--charcoal:\s*#11100d;/);
  assert.match(styles, /--gallery-paper:\s*#f4f1ea;/);
  assert.match(styles, /body::before\s*{/);
  assert.match(styles, /body::after\s*{/);
  assert.match(styles, /\.author-link\s*{[\s\S]*color:\s*rgba\(17, 16, 13, 0\.64\);/);
  assert.match(styles, /\.template-thumb-canvas\s*{[\s\S]*display:\s*block;/);
  assert.match(styles, /\.preview-canvas\s*{[\s\S]*display:\s*block;/);
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

test("draws render kicker with separated words and clear title spacing", () => {
  const measureCtx = createMeasureContext();
  const drawCtx = createDrawingContext();
  const paginated = paginateRenderModel(measureCtx, buildRenderModel("daily-note", {
    title: "把普通文字排得更好看",
    body: "正文",
    signature: "作者",
    controls: {
      fontScale: 1.28,
    },
  }));

  drawRenderModel(drawCtx, paginated);

  const rednote = drawCtx.textCalls.find((call) => call.text === "REDNOTE");
  const text = drawCtx.textCalls.find((call) => call.text === "TEXT");
  const title = drawCtx.textCalls.find((call) => call.text === paginated.pages[0].titleLines[0]);

  assert.equal(drawCtx.textCalls.some((call) => call.text === "REDNOTE TEXT"), false);
  assert.ok(rednote);
  assert.ok(text);
  assert.ok(title);
  const kickerFontSize = Number(rednote.font.match(/(\d+)px/)?.[1] || 0);

  assert.equal(text.y, rednote.y);
  assert.ok(text.x - (rednote.x + "REDNOTE".length * 20) >= 18);
  assert.ok(title.y - (rednote.y + kickerFontSize) >= 44);
});

test("draws continued pages without continued label", () => {
  const measureCtx = createMeasureContext();
  const drawCtx = createDrawingContext();
  const paginated = paginateRenderModel(measureCtx, buildRenderModel("clean-list", {
    title: "长文分页",
    body: Array.from({ length: 80 }, (_, index) => `第 ${index + 1} 条内容，用于制造第二页。`).join("\n"),
    signature: "布洛克琴",
  }));

  drawRenderModel(drawCtx, paginated, 2);

  assert.ok(paginated.pages.length > 1);
  assert.equal(drawCtx.textCalls.some((call) => call.text === "CONTINUED"), false);
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

test("keeps markdown heading levels with distinct render sizes", () => {
  const model = buildRenderModel("clean-list", {
    title: "标题",
    body: "# 一级标题\n正文\n## 二级标题\n正文\n### 三级标题\n正文",
    signature: "作者",
  });
  const paginated = paginateRenderModel(createMeasureContext(), model);
  const headings = paginated.pages
    .flatMap((page) => page.items)
    .filter((item) => item.type === "line" && item.blockType === "heading");

  assert.deepEqual(headings.map((item) => item.level), [1, 2, 3]);
  assert.ok(headings[0].fontSize > headings[1].fontSize);
  assert.ok(headings[1].fontSize > headings[2].fontSize);
  assert.ok(headings[2].fontSize > model.template.bodyFont);
});

test("editor preview renders from the same canvas path as export output", () => {
  assert.match(appSource, /function renderPreviewCanvas\(paginated, page\)/);
  assert.match(appSource, /const canvas = createCanvasForPage\(paginated, page, 1\);/);
  assert.match(appSource, /canvas\.className = "preview-canvas";/);
  assert.match(appSource, /phoneScreen\.append\(renderPreviewCanvas\(paginated, page\)\);/);
  assert.doesNotMatch(appSource, /function applyPreviewTheme/);
  assert.doesNotMatch(appSource, /function renderPreviewLine/);
  assert.doesNotMatch(appSource, /previewCard/);
  assert.match(styles, /\.phone-frame\s*{[\s\S]*padding:\s*0;/);
  assert.match(styles, /\.phone-screen\s*{[\s\S]*box-shadow:\s*0 0 0 10px/);
  assert.match(styles, /\.preview-canvas\s*{[\s\S]*width:\s*100%;/);
  assert.match(styles, /\.preview-canvas\s*{[\s\S]*aspect-ratio:\s*3 \/ 4;/);
  assert.doesNotMatch(styles, /\.preview-card/);
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
