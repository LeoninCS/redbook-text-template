const CATEGORY_KEYWORDS = [
  { category: "高科技", words: ["ai", "AI", "自动化", "效率", "工具", "科技", "工作流", "数据", "代码"] },
  { category: "专业", words: ["复盘", "方法", "策略", "商业", "职场", "增长", "框架", "清单"] },
  { category: "炫酷", words: ["爆款", "高级", "视觉", "潮流", "酷", "赛博", "霓虹"] },
  { category: "简约", words: ["日常", "简单", "干净", "极简", "生活", "阅读"] },
  { category: "复古", words: ["故事", "回忆", "电影", "旧", "胶片", "复古"] },
  { category: "手帐", words: ["笔记", "手帐", "清单", "计划", "记录", "灵感"] },
];

function textOfDraft(draft) {
  return `${draft?.title || ""}\n${draft?.body || ""}`.trim();
}

function scoreCategory(text, category) {
  const rule = CATEGORY_KEYWORDS.find((item) => item.category === category);
  if (!rule) return 0;
  return rule.words.reduce((score, word) => score + (text.includes(word) ? 2 : 0), 0);
}

function compactText(text, limit) {
  const cleaned = String(text || "")
    .replace(/[#>*`_\-]/g, "")
    .replace(/\s+/g, "")
    .trim();
  return cleaned.slice(0, limit);
}

export function recommendTemplates(text, templates) {
  const source = String(text || "");
  return templates
    .map((template) => {
      const categoryScore = scoreCategory(source, template.category);
      const descriptionScore = template.description
        .split(/[，。、\s]+/)
        .filter((word) => word && source.includes(word))
        .length;
      const score = categoryScore + descriptionScore + (template.category === "简约" ? 0.5 : 0);
      return {
        template,
        score,
        reason: `${template.category}风格匹配当前文案，可用于 ${template.description}`,
      };
    })
    .sort((a, b) => b.score - a.score || a.template.name.localeCompare(b.template.name))
    .slice(0, 5);
}

export function polishTitle(title) {
  const cleaned = compactText(title, 18);
  if (!cleaned) return "把文字排得更好看";
  if (/排版|文字|好看|模板/.test(cleaned)) return `${cleaned}指南`.slice(0, 24);
  return `${cleaned}，这样更好看`.slice(0, 24);
}

export function summarizeSections(markdown) {
  const lines = String(markdown || "").replace(/\r\n/g, "\n").split("\n");
  const sections = [];
  let current = null;

  function pushCurrent() {
    if (!current) return;
    const summary = compactText(current.lines.join(" "), 32);
    sections.push({
      title: current.title,
      summary: summary || "这一节适合保留为单独段落",
    });
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const heading = line.match(/^#{1,3}\s+(.+)$/);
    if (heading) {
      pushCurrent();
      current = { title: heading[1], lines: [] };
      continue;
    }
    if (current && line) current.lines.push(line);
  }
  pushCurrent();

  if (sections.length) return sections.slice(0, 5);
  const fallback = compactText(markdown, 48);
  return fallback ? [{ title: "内容重点", summary: fallback }] : [];
}

export function suggestCoverTitle(title, body) {
  const source = compactText(title, 12) || compactText(body, 12);
  if (/排版|文字|模板/.test(source)) return `${source}灵感`.slice(0, 18);
  return `${source}收藏版`.slice(0, 18);
}

export function buildAiSuggestions(draft, templates) {
  const text = textOfDraft(draft);
  return {
    polishedTitle: polishTitle(draft?.title || ""),
    coverTitle: suggestCoverTitle(draft?.title || "", draft?.body || ""),
    sections: summarizeSections(draft?.body || ""),
    recommendations: recommendTemplates(text, templates),
  };
}
