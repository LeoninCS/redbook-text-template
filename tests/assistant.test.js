import assert from "node:assert/strict";
import test from "node:test";

import {
  buildAiSuggestions,
  polishTitle,
  recommendTemplates,
  suggestCoverTitle,
  summarizeSections,
} from "../src/assistant.js";
import { getTemplates } from "../src/renderer.js";

const templates = getTemplates();

test("recommends templates from text intent", () => {
  const results = recommendTemplates("今天分享 AI 工作流、自动化、效率工具和科技感排版", templates);

  assert.ok(results.length >= 3);
  assert.equal(results[0].template.category, "高科技");
  assert.ok(results[0].reason.length > 0);
});

test("polishes title into a concise rednote-style headline", () => {
  const title = polishTitle("如何把普通文字排得更好看");

  assert.ok(title.length <= 24);
  assert.match(title, /文字|排版|好看/);
});

test("summarizes sections from markdown text", () => {
  const sections = summarizeSections("## 开头\n先讲背景\n\n## 方法\n- 选择模板\n- 导出图片");

  assert.deepEqual(sections.map((section) => section.title), ["开头", "方法"]);
  assert.ok(sections[1].summary.includes("选择模板"));
});

test("suggests a cover title from title and body", () => {
  const coverTitle = suggestCoverTitle("小红书文字排版", "让纯文本变成适合手机阅读的图片");

  assert.ok(coverTitle.length <= 18);
  assert.match(coverTitle, /排版|文字|手机/);
});

test("builds all ai suggestions together", () => {
  const suggestions = buildAiSuggestions({
    title: "效率工具分享",
    body: "## AI 工作流\n用模板把文字变成图片\n\n## 导出\n支持 PNG 和 PDF",
  }, templates);

  assert.ok(suggestions.polishedTitle);
  assert.ok(suggestions.coverTitle);
  assert.ok(suggestions.sections.length >= 2);
  assert.ok(suggestions.recommendations.length >= 3);
});
