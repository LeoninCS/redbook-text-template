const CATEGORY_KEYWORDS = [
  { category: "高科技", words: ["ai", "AI", "自动化", "效率", "工具", "科技", "工作流", "数据", "代码", "系统", "产品"] },
  { category: "专业", words: ["复盘", "方法", "策略", "商业", "职场", "增长", "框架", "清单", "步骤", "流程", "方案"] },
  { category: "炫酷", words: ["爆款", "高级", "视觉", "潮流", "酷", "赛博", "霓虹", "态度", "金句"] },
  { category: "简约", words: ["日常", "简单", "干净", "极简", "生活", "阅读", "观点", "随笔"] },
  { category: "复古", words: ["故事", "回忆", "电影", "旧", "胶片", "复古", "怀旧"] },
  { category: "手帐", words: ["笔记", "手帐", "计划", "记录", "灵感", "生活", "学习"] },
];

const TEMPLATE_PRIORITY = {
  list: ["clean-list", "constructivist-ledger", "blueprint-editorial", "luxury-serif"],
  long: ["editorial", "monochrome-essay", "newspaper-column", "luxury-serif"],
  tech: ["data-hud", "terminal-green", "blueprint-editorial", "night-glow"],
  quote: ["bold-quote", "ink-negative-space", "holographic-foil", "cyber-neon"],
  story: ["liminal-polaroid", "retro-print", "newspaper-column", "daily-note"],
  note: ["daily-note", "pencil-margin", "botanical-card", "paper-collage"],
  minimal: ["ink-negative-space", "monochrome-essay", "swiss-grid", "editorial"],
};

function cleanText(value) {
  return String(value || "").replace(/\r\n/g, "\n").trim();
}

function visibleText(value) {
  return cleanText(value)
    .replace(/<!--\s*pagebreak\s*-->/gi, "")
    .replace(/[#>*_`[\]（）()「」『』]/g, "")
    .replace(/\s+/g, "");
}

function isHeading(line) {
  return /^#{1,3}\s+/.test(line);
}

function isList(line) {
  return /^[-*]\s+/.test(line) || /^\d+[.)、]\s+?/.test(line) || /^[一二三四五六七八九十]+[、.]\s*/.test(line);
}

function isQuote(line) {
  return /^>\s?/.test(line);
}

function isPageBreak(line) {
  return /^(---|\*\*\*|<!--\s*pagebreak\s*-->)$/i.test(line);
}

function lineText(line) {
  return line
    .replace(/^#{1,3}\s+/, "")
    .replace(/^>\s?/, "")
    .replace(/^[-*]\s+/, "")
    .replace(/^\d+[.)、]\s*/, "")
    .replace(/^[一二三四五六七八九十]+[、.]\s*/, "")
    .trim();
}

function keywordScore(text, category) {
  const rule = CATEGORY_KEYWORDS.find((item) => item.category === category);
  if (!rule) return 0;
  return rule.words.reduce((score, word) => score + (text.includes(word) ? 1 : 0), 0);
}

function bestCategory(text) {
  return CATEGORY_KEYWORDS
    .map((item) => ({ category: item.category, score: keywordScore(text, item.category) }))
    .sort((a, b) => b.score - a.score)[0];
}

export function analyzeText(draft = {}) {
  const body = cleanText(draft.body);
  const title = cleanText(draft.title);
  const lines = body.split("\n").map((line) => line.trim()).filter(Boolean);
  const charCount = visibleText(`${title}\n${body}`).length;
  const headingCount = lines.filter(isHeading).length;
  const listCount = lines.filter(isList).length;
  const quoteCount = lines.filter(isQuote).length;
  const paragraphCount = lines.filter((line) => !isHeading(line) && !isList(line) && !isQuote(line) && !isPageBreak(line)).length;
  const shortLineCount = lines.filter((line) => lineText(line).length > 0 && lineText(line).length <= 18).length;
  const hasMarkdown = headingCount > 0
    || listCount > 0
    || quoteCount > 0
    || /^[-*]\s+/m.test(body)
    || /\*\*[^*]+\*\*|`[^`]+`|^(---|\*\*\*)$/m.test(body);
  const text = `${title}\n${body}`;
  const category = bestCategory(text);

  let intent = "minimal";
  if (listCount >= 2 || /清单|步骤|流程|方法|要点|攻略|指南/.test(text)) intent = "list";
  else if (/ai|AI|自动化|数据|工具|代码|系统|科技|产品/.test(text)) intent = "tech";
  else if (charCount >= 420 || paragraphCount >= 10) intent = "long";
  else if (quoteCount > 0 || (charCount <= 48 && lines.length <= 2)) intent = "quote";
  else if (/故事|回忆|电影|胶片|旧|复古/.test(text)) intent = "story";
  else if (/日常|记录|灵感|笔记|手帐|生活|计划/.test(text)) intent = "note";
  else if (category.score > 0 && category.category === "高科技") intent = "tech";
  else if (category.score > 0 && category.category === "专业") intent = "list";

  return {
    body,
    title,
    lines,
    charCount,
    headingCount,
    listCount,
    quoteCount,
    paragraphCount,
    shortLineCount,
    hasMarkdown,
    category: category.category,
    intent,
  };
}

function shouldPromoteFirstLine(line, index, analysis) {
  if (index !== 0) return false;
  if (analysis.headingCount > 0) return false;
  if (isList(line) || isQuote(line) || isPageBreak(line)) return false;
  const text = lineText(line);
  return text.length > 0 && text.length <= 22 && (analysis.lines.length >= 2 || analysis.intent === "quote");
}

function shouldPromoteLabelLine(line, analysis) {
  if (analysis.headingCount > 0) return false;
  if (isList(line) || isQuote(line) || isPageBreak(line)) return false;
  const match = line.match(/^(.{2,10})[：:]\s*(.{0,42})$/);
  return Boolean(match && match[2]);
}

function normalizeListLine(line) {
  const numbered = line.match(/^(?:\d+[.)、]|[一二三四五六七八九十]+[、.])\s*(.+)$/);
  if (numbered) return `- ${numbered[1].trim()}`;
  return line;
}

function emphasizeNumbers(line) {
  if (/^#{1,3}\s+/.test(line)) return line;
  return line.replace(/(^|[^\d*`])(\d+(?:\.\d+)?%?)(?=([^\d*`]|$))/g, "$1**$2**");
}

export function enhanceMarkdown(body = "", analysis = analyzeText({ body })) {
  const lines = cleanText(body).split("\n");
  const enhanced = lines.map((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) return "";
    if (isHeading(line) || isQuote(line) || isPageBreak(line) || /^[-*]\s+/.test(line)) return line;

    const listLine = normalizeListLine(line);
    if (listLine !== line) return emphasizeNumbers(listLine);

    if (shouldPromoteFirstLine(line, index, analysis)) return `## ${lineText(line)}`;
    if (shouldPromoteLabelLine(line, analysis)) return `## ${lineText(line)}`;
    return emphasizeNumbers(line);
  });

  return enhanced.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function findTemplateById(templates, id) {
  return templates.find((template) => template.id === id);
}

function chooseTemplate(analysis, templates) {
  const priority = TEMPLATE_PRIORITY[analysis.intent] || TEMPLATE_PRIORITY.minimal;
  const byPriority = priority.map((id) => findTemplateById(templates, id)).find(Boolean);
  if (byPriority) return byPriority;

  const byCategory = templates.find((template) => template.category === analysis.category);
  return byCategory || templates[0];
}

function chooseControls(analysis, template, existingControls = {}) {
  const controls = {
    fontScale: 1,
    lineHeightScale: 1,
    paddingScale: 1,
    accent: "",
    surfaceAlpha: 1,
    align: template.align || "left",
    toneMode: existingControls.toneMode || "auto",
  };

  if (analysis.intent === "long") {
    controls.fontScale = analysis.charCount > 760 ? 0.88 : 0.92;
    controls.lineHeightScale = 0.98;
    controls.paddingScale = 0.86;
    controls.align = "left";
  } else if (analysis.intent === "list") {
    controls.fontScale = 0.96;
    controls.lineHeightScale = 1.02;
    controls.paddingScale = 0.92;
    controls.align = "left";
  } else if (analysis.intent === "quote") {
    controls.fontScale = analysis.charCount <= 28 ? 1.16 : 1.08;
    controls.lineHeightScale = 0.96;
    controls.paddingScale = 1.04;
    controls.align = "center";
  } else if (analysis.intent === "tech") {
    controls.fontScale = 0.98;
    controls.lineHeightScale = 1;
    controls.paddingScale = 0.9;
    controls.align = template.align || "left";
  } else {
    controls.fontScale = analysis.charCount < 120 ? 1.06 : 1;
    controls.lineHeightScale = 1;
    controls.paddingScale = analysis.charCount < 120 ? 1.02 : 0.96;
    controls.align = template.align || "left";
  }

  if (analysis.headingCount >= 3) controls.fontScale = Math.min(controls.fontScale, 0.98);
  if (analysis.listCount >= 5) controls.lineHeightScale = Math.max(controls.lineHeightScale, 1.04);

  return {
    ...controls,
    toneMode: ["auto", "light", "dark"].includes(existingControls.toneMode) ? existingControls.toneMode : controls.toneMode,
  };
}

function reasonForIntent(intent) {
  const reasons = {
    list: "清单结构",
    long: "长文分页",
    tech: "科技关键词",
    quote: "短句观点",
    story: "故事氛围",
    note: "记录笔记",
    minimal: "简约阅读",
  };
  return reasons[intent] || reasons.minimal;
}

export function autoTypeset(draft = {}, templates = []) {
  const analysis = analyzeText(draft);
  const template = chooseTemplate(analysis, templates);
  const body = enhanceMarkdown(analysis.body, analysis);
  const controls = chooseControls(analysis, template, draft.controls || {});

  return {
    analysis,
    template,
    templateId: template.id,
    reason: reasonForIntent(analysis.intent),
    draft: {
      title: analysis.title,
      body,
      signature: cleanText(draft.signature),
      controls,
    },
  };
}
