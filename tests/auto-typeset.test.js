import assert from "node:assert/strict";
import test from "node:test";

import {
  analyzeText,
  autoTypeset,
  enhanceMarkdown,
} from "../src/auto-typeset.js";
import { getTemplates } from "../src/renderer.js";

const templates = getTemplates();

test("analyzes draft structure for local typesetting decisions", () => {
  const analysis = analyzeText({
    title: "方法复盘",
    body: "目标：让文案更适合手机阅读\n1. 选择模板\n2. 输入正文\n> 保留重点提醒",
  });

  assert.equal(analysis.listCount, 2);
  assert.equal(analysis.quoteCount, 1);
  assert.equal(analysis.intent, "list");
  assert.equal(analysis.hasMarkdown, true);
});

test("enhances plain numbered text into markdown-friendly structure", () => {
  const body = "排版步骤\n1. 选择模板\n2. 输入正文\n3. 导出图片";
  const enhanced = enhanceMarkdown(body, analyzeText({ body }));

  assert.match(enhanced, /^## 排版步骤/);
  assert.match(enhanced, /- 选择模板/);
  assert.match(enhanced, /- 输入正文/);
  assert.match(enhanced, /- 导出图片/);
});

test("auto typesets list-heavy drafts with a professional left layout", () => {
  const result = autoTypeset({
    title: "内容发布流程",
    body: "准备：先定主题\n1. 选择模板\n2. 输入正文\n3. 导出图片\n4. 发布小红书",
    signature: "布洛克琴",
    controls: {},
  }, templates);

  assert.equal(result.template.category, "专业");
  assert.equal(result.draft.controls.align, "left");
  assert.ok(result.draft.controls.fontScale <= 1);
  assert.ok(result.draft.controls.paddingScale <= 0.96);
  assert.match(result.draft.body, /- 发布小红书/);
});

test("auto typesets long drafts with tighter typography for pagination", () => {
  const longBody = Array.from({ length: 18 }, (_, index) => `第 ${index + 1} 段：这一段用于模拟长文排版，需要在手机竖版页面里保持舒适阅读节奏。`).join("\n");
  const result = autoTypeset({
    title: "长文观点",
    body: longBody,
    signature: "布洛克琴",
    controls: {},
  }, templates);

  assert.equal(result.draft.controls.align, "left");
  assert.ok(result.draft.controls.fontScale < 1);
  assert.ok(result.draft.controls.paddingScale < 1);
  assert.ok(result.reason.includes("长文"));
});

test("auto typesets short quote drafts with larger centered typography", () => {
  const result = autoTypeset({
    title: "",
    body: "真正拉开差距的是审美和执行节奏。",
    signature: "布洛克琴",
    controls: {},
  }, templates);

  assert.equal(result.draft.controls.align, "center");
  assert.ok(result.draft.controls.fontScale > 1);
  assert.match(result.draft.body, /^## 真正拉开差距/);
});
