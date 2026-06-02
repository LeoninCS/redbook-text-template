export const OUTPUT_SIZE = {
  width: 1080,
  height: 1440,
};

const PLACEHOLDER_BODY = "在这里输入你想展示的小红书文字。换行会被保留，长文本会自动适配到手机预览。";

export const templates = [
  {
    id: "daily-note",
    name: "日常手记",
    category: "手帐",
    description: "温柔、有呼吸感，适合生活感文案",
    bg: "#fff7ed",
    surface: "#fffdf8",
    text: "#2b2118",
    muted: "#7a6757",
    accent: "#e86f4a",
    titleFont: 56,
    bodyFont: 38,
    align: "left",
    decoration: "corner",
  },
  {
    id: "clean-list",
    name: "清单卡片",
    category: "专业",
    description: "清晰利落，适合干货步骤和知识点",
    bg: "#edf7f5",
    surface: "#ffffff",
    text: "#102a2a",
    muted: "#51706f",
    accent: "#0f766e",
    titleFont: 54,
    bodyFont: 36,
    align: "left",
    decoration: "grid",
  },
  {
    id: "bold-quote",
    name: "醒目观点",
    category: "炫酷",
    description: "强对比大字，适合金句和态度表达",
    bg: "#1f1b2e",
    surface: "#28233a",
    text: "#fff8e8",
    muted: "#cfc3df",
    accent: "#ffcc4d",
    titleFont: 68,
    bodyFont: 42,
    align: "center",
    decoration: "bars",
  },
  {
    id: "soft-pink",
    name: "粉色灵感",
    category: "手帐",
    description: "精致轻甜，适合情绪流和美学分享",
    bg: "#fff0f5",
    surface: "#ffffff",
    text: "#3b1f2b",
    muted: "#8d6575",
    accent: "#d92d72",
    titleFont: 56,
    bodyFont: 37,
    align: "left",
    decoration: "dots",
  },
  {
    id: "solar-clay-ui",
    name: "Solar Clay UI",
    category: "手帐",
    description: "暖阳粉彩和柔软 3D 泥塑块，适合温暖灵感和生活记录",
    bg: "#ffe7b8",
    surface: "#fff3d8",
    text: "#392315",
    muted: "#8a6545",
    accent: "#f59e0b",
    titleFont: 59,
    bodyFont: 36,
    align: "left",
    decoration: "solar-clay",
  },
  {
    id: "editorial",
    name: "杂志专栏",
    category: "简约",
    description: "克制高级，适合长观点和品牌表达",
    bg: "#f4f1eb",
    surface: "#fbfaf6",
    text: "#1f2933",
    muted: "#667085",
    accent: "#111827",
    titleFont: 60,
    bodyFont: 36,
    align: "left",
    decoration: "rule",
  },
  {
    id: "night-glow",
    name: "夜间灵感",
    category: "高科技",
    description: "深色发光，适合思考、复盘和摘录",
    bg: "#07121f",
    surface: "#0c1d2f",
    text: "#eaf6ff",
    muted: "#8db3c7",
    accent: "#6ee7f9",
    titleFont: 58,
    bodyFont: 37,
    align: "left",
    decoration: "glow",
  },
  {
    id: "swiss-grid",
    name: "瑞士网格",
    category: "简约",
    description: "强秩序排版，适合观点拆解和理性表达",
    bg: "#f8f8f3",
    surface: "#ffffff",
    text: "#111111",
    muted: "#5c6470",
    accent: "#e11d2e",
    titleFont: 64,
    bodyFont: 35,
    align: "left",
    decoration: "swiss",
  },
  {
    id: "brutalist-block",
    name: "粗野标题",
    category: "炫酷",
    description: "大块色面和强冲突，适合态度文案",
    bg: "#f4ff1f",
    surface: "#111111",
    text: "#ffffff",
    muted: "#d7d7d7",
    accent: "#f97316",
    titleFont: 72,
    bodyFont: 40,
    align: "left",
    decoration: "block",
  },
  {
    id: "retro-print",
    name: "复古印刷",
    category: "复古",
    description: "旧海报质感，适合怀旧、复盘和故事",
    bg: "#f0dfbd",
    surface: "#fff2d2",
    text: "#352218",
    muted: "#80634c",
    accent: "#c2410c",
    titleFont: 60,
    bodyFont: 37,
    align: "left",
    decoration: "sun",
  },
  {
    id: "liminal-polaroid",
    name: "Liminal Polaroid",
    category: "复古",
    description: "空旷过渡空间、宝丽来白边和褪色胶片感，适合回忆、故事和情绪文案",
    bg: "#d8d5c9",
    surface: "#f8f1df",
    text: "#22302c",
    muted: "#7a7568",
    accent: "#a87639",
    titleFont: 58,
    bodyFont: 36,
    align: "left",
    decoration: "liminal-polaroid",
  },
  {
    id: "paper-collage",
    name: "纸张拼贴",
    category: "手帐",
    description: "手帐拼贴感，适合灵感摘录和生活记录",
    bg: "#ece7dc",
    surface: "#fffaf0",
    text: "#292524",
    muted: "#78716c",
    accent: "#0ea5e9",
    titleFont: 57,
    bodyFont: 36,
    align: "left",
    decoration: "collage",
  },
  {
    id: "art-deco",
    name: "装饰艺术",
    category: "复古",
    description: "对称线条和精致边框，适合高级感表达",
    bg: "#16110b",
    surface: "#22180f",
    text: "#fff7df",
    muted: "#d7b77d",
    accent: "#f6c85f",
    titleFont: 60,
    bodyFont: 36,
    align: "center",
    decoration: "deco",
  },
  {
    id: "glass-gradient",
    name: "渐变玻璃",
    category: "高科技",
    description: "柔和渐变和透明感，适合情绪和趋势内容",
    bg: "#dff5ff",
    surface: "rgba(255,255,255,0.78)",
    text: "#14213d",
    muted: "#516176",
    accent: "#7c3aed",
    titleFont: 58,
    bodyFont: 37,
    align: "left",
    decoration: "glass",
  },
  {
    id: "organic-glassmorphism",
    name: "Organic Glassmorphism",
    category: "高科技",
    description: "磨砂玻璃、有机流体形体和柔和层次，适合轻科技与灵感内容",
    bg: "#d9f0ee",
    surface: "rgba(255,255,255,0.66)",
    text: "#17313b",
    muted: "#60757c",
    accent: "#45b8ac",
    titleFont: 59,
    bodyFont: 36,
    align: "left",
    decoration: "organic-glass",
  },
  {
    id: "solarpunk-editorial",
    name: "Solarpunk Editorial",
    category: "高科技",
    description: "暖阳、植物曲线和未来感排版，适合可持续生活与趋势观察",
    bg: "#e9f4dc",
    surface: "#fffbea",
    text: "#1d2a19",
    muted: "#687c55",
    accent: "#f5a524",
    titleFont: 60,
    bodyFont: 36,
    align: "left",
    decoration: "solarpunk",
  },
  {
    id: "riso-pop",
    name: "Riso 撞色",
    category: "炫酷",
    description: "明亮油墨感，适合年轻化、活动和清单",
    bg: "#fff1f2",
    surface: "#fff7ed",
    text: "#2f1b3d",
    muted: "#7c516f",
    accent: "#ff3d81",
    titleFont: 62,
    bodyFont: 37,
    align: "left",
    decoration: "riso",
  },
  {
    id: "risograph-zine",
    name: "Risograph Zine",
    category: "复古",
    description: "荧光专色、颗粒纸感和套印偏移，适合独立杂志风内容",
    bg: "#f1dfc1",
    surface: "#fff3d6",
    text: "#241816",
    muted: "#8b645b",
    accent: "#ff4f87",
    titleFont: 61,
    bodyFont: 36,
    align: "left",
    decoration: "riso-zine",
  },
  {
    id: "terminal-green",
    name: "终端绿字",
    category: "高科技",
    description: "科技感信息屏，适合效率、工具和复盘",
    bg: "#06130d",
    surface: "#071a12",
    text: "#d6ffe8",
    muted: "#7bbf99",
    accent: "#22c55e",
    titleFont: 56,
    bodyFont: 35,
    align: "left",
    decoration: "terminal",
  },
  {
    id: "botanical-card",
    name: "植物边框",
    category: "手帐",
    description: "自然、安静、亲近，适合疗愈和生活方式",
    bg: "#eef7e9",
    surface: "#fbfff7",
    text: "#19351f",
    muted: "#5d765f",
    accent: "#65a30d",
    titleFont: 56,
    bodyFont: 36,
    align: "left",
    decoration: "leaf",
  },
  {
    id: "pixel-botanical",
    name: "Pixel Botanical",
    category: "手帐",
    description: "像素网格和块状植物，适合轻松、复古、生活记录",
    bg: "#dff3d8",
    surface: "#fff9df",
    text: "#17331f",
    muted: "#5b7a5b",
    accent: "#2f9e44",
    titleFont: 58,
    bodyFont: 35,
    align: "left",
    decoration: "pixel-botanical",
  },
  {
    id: "pencil-margin",
    name: "铅笔边注",
    category: "手帐",
    description: "手写批注氛围，适合学习笔记和读书摘录",
    bg: "#f6f1e7",
    surface: "#fffdf6",
    text: "#2c2a27",
    muted: "#77716a",
    accent: "#64748b",
    titleFont: 55,
    bodyFont: 36,
    align: "left",
    decoration: "scribble",
  },
  {
    id: "monochrome-essay",
    name: "黑白随笔",
    category: "简约",
    description: "极简黑白，适合沉静观点和短文",
    bg: "#f7f7f5",
    surface: "#ffffff",
    text: "#111111",
    muted: "#6b7280",
    accent: "#111111",
    titleFont: 58,
    bodyFont: 36,
    align: "left",
    decoration: "minimal",
  },
  {
    id: "data-hud",
    name: "数据 HUD",
    category: "高科技",
    description: "仪表盘科技感，适合效率、AI、工具内容",
    bg: "#07111f",
    surface: "#0b1628",
    text: "#dff7ff",
    muted: "#7da7bd",
    accent: "#38bdf8",
    titleFont: 58,
    bodyFont: 35,
    align: "left",
    decoration: "hud",
  },
  {
    id: "blueprint-editorial",
    name: "Blueprint Editorial",
    category: "专业",
    description: "蓝图纸底、白色工程线和尺寸标注，适合方案、方法论和结构化观点",
    bg: "#06245a",
    surface: "#07306d",
    text: "#eff8ff",
    muted: "#a8c7e8",
    accent: "#7dd3fc",
    titleFont: 60,
    bodyFont: 35,
    align: "left",
    decoration: "blueprint-editorial",
  },
  {
    id: "cyber-neon",
    name: "霓虹赛博",
    category: "炫酷",
    description: "高饱和霓虹，适合趋势和强视觉标题",
    bg: "#090014",
    surface: "#160022",
    text: "#fff7ff",
    muted: "#d8b4fe",
    accent: "#f0abfc",
    titleFont: 68,
    bodyFont: 38,
    align: "center",
    decoration: "neon",
  },
  {
    id: "cyber-rococo",
    name: "Cyber Rococo",
    category: "炫酷",
    description: "洛可可卷草、粉金装饰和霓虹科技线，适合华丽态度文案",
    bg: "#120018",
    surface: "#1f0b2e",
    text: "#fff4fb",
    muted: "#e7b8cf",
    accent: "#ff4fd8",
    titleFont: 66,
    bodyFont: 37,
    align: "center",
    decoration: "cyber-rococo",
  },
  {
    id: "holographic-foil",
    name: "Holographic Foil",
    category: "炫酷",
    description: "银白金属底和虹彩折射，适合潮流、活动和强视觉摘录",
    bg: "#eef4f7",
    surface: "#fbfdff",
    text: "#15212d",
    muted: "#64748b",
    accent: "#7c3aed",
    titleFont: 64,
    bodyFont: 36,
    align: "center",
    decoration: "holographic-foil",
  },
  {
    id: "luxury-serif",
    name: "高级留白",
    category: "专业",
    description: "品牌杂志感，适合商业复盘和产品观点",
    bg: "#f4f2ed",
    surface: "#fffdfa",
    text: "#171717",
    muted: "#737373",
    accent: "#9a7b42",
    titleFont: 62,
    bodyFont: 36,
    align: "left",
    decoration: "luxury",
  },
  {
    id: "constructivist-ledger",
    name: "Constructivist Ledger",
    category: "专业",
    description: "红黑几何斜线和账本分栏，适合复盘、清单和观点台账",
    bg: "#e8dcc8",
    surface: "#f7efd9",
    text: "#181512",
    muted: "#6d6257",
    accent: "#c1121f",
    titleFont: 64,
    bodyFont: 35,
    align: "left",
    decoration: "constructivist-ledger",
  },
  {
    id: "vaporwave-card",
    name: "蒸汽波",
    category: "炫酷",
    description: "复古未来感，适合音乐、潮流和灵感",
    bg: "#1b1233",
    surface: "#2a1850",
    text: "#fff7ff",
    muted: "#d8c4ff",
    accent: "#22d3ee",
    titleFont: 64,
    bodyFont: 38,
    align: "left",
    decoration: "vapor",
  },
  {
    id: "newspaper-column",
    name: "报纸专栏",
    category: "复古",
    description: "报刊专栏质感，适合评论和长观点",
    bg: "#eee5d3",
    surface: "#fbf3df",
    text: "#1c1917",
    muted: "#75695e",
    accent: "#7f1d1d",
    titleFont: 58,
    bodyFont: 34,
    align: "left",
    decoration: "newspaper",
  },
];

function normalizeTemplate(template) {
  return {
    ...template,
    tokens: {
      color: {
        background: template.bg,
        surface: template.surface,
        text: template.text,
        muted: template.muted,
        accent: template.accent,
      },
      typography: {
        titleFont: template.titleFont,
        bodyFont: template.bodyFont,
      },
    },
    layout: {
      titleFont: template.titleFont,
      bodyFont: template.bodyFont,
      align: template.align,
      padding: 92,
      aspectRatio: `${OUTPUT_SIZE.width}:${OUTPUT_SIZE.height}`,
    },
    decoration: {
      kind: template.decoration,
      category: template.category,
    },
    decorationId: template.decoration,
  };
}

function templateDecoration(template) {
  return typeof template.decoration === "string" ? template.decoration : template.decoration?.kind;
}

export function getTemplates() {
  return templates.map((template) => normalizeTemplate(template));
}

export function getTemplate(templateId) {
  return normalizeTemplate(templates.find((template) => template.id === templateId) || templates[0]);
}

function cleanText(value) {
  return String(value ?? "").replace(/\r\n/g, "\n").trim();
}

function clamp(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function cleanColor(value, fallback) {
  const color = String(value || "").trim();
  return /^#[0-9a-f]{6}$/i.test(color) ? color : fallback;
}

export function normalizeControls(controls = {}, template = templates[0]) {
  return {
    fontScale: clamp(controls.fontScale, 0.82, 1.28, 1),
    lineHeightScale: clamp(controls.lineHeightScale, 0.86, 1.28, 1),
    paddingScale: clamp(controls.paddingScale, 0.76, 1.16, 1),
    accent: cleanColor(controls.accent, template.accent),
    surfaceAlpha: clamp(controls.surfaceAlpha, 0.16, 1, 1),
    align: ["left", "center"].includes(controls.align) ? controls.align : template.align,
  };
}

export function normalizeDraft(draft = {}) {
  return {
    title: cleanText(draft.title) || "把普通文字排得更好看",
    body: cleanText(draft.body) || PLACEHOLDER_BODY,
    signature: cleanText(draft.signature) || "小红书文本模板",
    controls: draft.controls || {},
  };
}

export function parseInlineMarkdown(text) {
  const segments = [];
  const pattern = /(\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", text: text.slice(lastIndex, match.index) });
    }

    if (match[2]) segments.push({ type: "strong", text: match[2] });
    else if (match[3]) segments.push({ type: "code", text: match[3] });
    else if (match[4]) segments.push({ type: "em", text: match[4] });

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", text: text.slice(lastIndex) });
  }

  return segments.length ? segments : [{ type: "text", text }];
}

export function parseMarkdownBlocks(markdown = "") {
  const blocks = [];
  const lines = String(markdown).replace(/\r\n/g, "\n").split("\n");
  let pendingList = null;

  function flushList() {
    if (!pendingList) return;
    blocks.push({ type: "list", items: pendingList });
    pendingList = null;
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }

    const listMatch = line.match(/^[-*]\s+(.+)$/);
    if (listMatch) {
      pendingList = pendingList || [];
      pendingList.push(listMatch[1]);
      continue;
    }

    flushList();

    if (/^(---|\*\*\*|<!--\s*pagebreak\s*-->)$/i.test(line)) {
      blocks.push({ type: "pageBreak" });
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2],
        segments: parseInlineMarkdown(headingMatch[2]),
      });
      continue;
    }

    const quoteMatch = line.match(/^>\s?(.+)$/);
    if (quoteMatch) {
      blocks.push({
        type: "quote",
        text: quoteMatch[1],
        segments: parseInlineMarkdown(quoteMatch[1]),
      });
      continue;
    }

    blocks.push({
      type: "paragraph",
      text: line,
      segments: parseInlineMarkdown(line),
    });
  }

  flushList();
  return blocks;
}

export function buildRenderModel(templateId, draft = {}) {
  const template = getTemplate(templateId);
  const normalizedDraft = normalizeDraft(draft);
  const controls = normalizeControls(normalizedDraft.controls, template);
  const controlledTemplate = {
    ...template,
    accent: controls.accent,
    align: controls.align,
    titleFont: Math.round(template.titleFont * controls.fontScale),
    bodyFont: Math.round(template.bodyFont * controls.fontScale),
  };
  const padding = Math.round(92 * controls.paddingScale);

  return {
    template: controlledTemplate,
    draft: normalizedDraft,
    controls,
    size: { ...OUTPUT_SIZE },
    padding,
    contentWidth: OUTPUT_SIZE.width - padding * 2,
    surfaceAlpha: controls.surfaceAlpha,
    lineHeight: Math.round(controlledTemplate.bodyFont * 1.62 * controls.lineHeightScale),
    generatedAt: new Date().toISOString(),
  };
}

const KICKER_Y = 118;
const TITLE_Y = 176;
const SIGNATURE_Y = OUTPUT_SIZE.height - 150;
const BODY_BOTTOM_Y = OUTPUT_SIZE.height - 190;
const CONTINUATION_BODY_Y = 176;

function splitLongToken(token, maxChars) {
  const pieces = [];
  for (let index = 0; index < token.length; index += maxChars) {
    pieces.push(token.slice(index, index + maxChars));
  }
  return pieces;
}

export function wrapText(ctx, text, maxWidth, maxLines = 18) {
  const paragraphs = String(text).split("\n");
  const lines = [];
  const hasLineLimit = Number.isFinite(maxLines);

  for (const paragraph of paragraphs) {
    const words = paragraph.includes(" ") ? paragraph.split(/\s+/) : [...paragraph];
    let line = "";

    for (const word of words) {
      const candidate = paragraph.includes(" ") && line ? `${line} ${word}` : `${line}${word}`;
      if (ctx.measureText(candidate).width <= maxWidth) {
        line = candidate;
        continue;
      }

      if (line) lines.push(line);
      if (ctx.measureText(word).width > maxWidth) {
        const maxChars = Math.max(1, Math.floor(maxWidth / ctx.measureText("字").width));
        const pieces = splitLongToken(word, maxChars);
        lines.push(...pieces.slice(0, -1));
        line = pieces.at(-1) || "";
      } else {
        line = word;
      }

      if (hasLineLimit && lines.length >= maxLines) break;
    }

    if (line && (!hasLineLimit || lines.length < maxLines)) lines.push(line);
    if (paragraph === "" && (!hasLineLimit || lines.length < maxLines)) lines.push("");
    if (hasLineLimit && lines.length >= maxLines) break;
  }

  if (hasLineLimit && lines.length >= maxLines) {
    const last = lines[maxLines - 1] || "";
    lines[maxLines - 1] = last.length > 1 ? `${last.slice(0, -1)}…` : "…";
  }

  return hasLineLimit ? lines.slice(0, maxLines) : lines;
}

function wrapFullText(ctx, text, maxWidth) {
  return wrapText(ctx, text, maxWidth, Number.POSITIVE_INFINITY);
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawDecoration(ctx, model) {
  const { template, size } = model;
  const decoration = templateDecoration(template);
  ctx.save();
  ctx.strokeStyle = template.accent;
  ctx.fillStyle = template.accent;
  ctx.globalAlpha = 0.85;

  if (decoration === "corner") {
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(80, 190);
    ctx.lineTo(80, 80);
    ctx.lineTo(210, 80);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size.width - 80, size.height - 190);
    ctx.lineTo(size.width - 80, size.height - 80);
    ctx.lineTo(size.width - 210, size.height - 80);
    ctx.stroke();
  }

  if (decoration === "grid") {
    ctx.globalAlpha = 0.18;
    ctx.lineWidth = 2;
    for (let x = 80; x < size.width; x += 72) {
      ctx.beginPath();
      ctx.moveTo(x, 80);
      ctx.lineTo(x, size.height - 80);
      ctx.stroke();
    }
    for (let y = 80; y < size.height; y += 72) {
      ctx.beginPath();
      ctx.moveTo(80, y);
      ctx.lineTo(size.width - 80, y);
      ctx.stroke();
    }
  }

  if (decoration === "bars") {
    ctx.fillRect(90, 100, 260, 18);
    ctx.fillRect(size.width - 350, size.height - 126, 260, 18);
  }

  if (decoration === "dots") {
    for (let index = 0; index < 18; index += 1) {
      ctx.beginPath();
      ctx.arc(110 + index * 48, 118, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (decoration === "solar-clay") {
    const sun = ctx.createRadialGradient(size.width - 190, 180, 20, size.width - 190, 180, 280);
    sun.addColorStop(0, "rgba(245, 158, 11, 0.58)");
    sun.addColorStop(1, "rgba(245, 158, 11, 0)");
    ctx.globalAlpha = 1;
    ctx.fillStyle = sun;
    ctx.fillRect(size.width - 470, 20, 420, 420);

    const drawClayBlob = (x, y, width, height, color) => {
      ctx.save();
      ctx.shadowColor = "rgba(112, 66, 20, 0.2)";
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 18;
      ctx.fillStyle = color;
      roundRect(ctx, x, y, width, height, 38);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      roundRect(ctx, x + 18, y + 18, width - 36, Math.max(18, height * 0.22), 20);
      ctx.fill();
      ctx.restore();
    };

    ctx.globalAlpha = 0.82;
    drawClayBlob(104, 118, 168, 92, "#ffd166");
    drawClayBlob(size.width - 318, size.height - 274, 214, 124, "#ffb4a2");
    drawClayBlob(126, size.height - 360, 140, 140, "#9be7c9");
  }

  if (decoration === "rule") {
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(92, 236);
    ctx.lineTo(size.width - 92, 236);
    ctx.stroke();
    ctx.globalAlpha = 0.28;
    ctx.beginPath();
    ctx.moveTo(92, size.height - 180);
    ctx.lineTo(size.width - 92, size.height - 180);
    ctx.stroke();
  }

  if (decoration === "glow") {
    const gradient = ctx.createRadialGradient(size.width - 160, 160, 20, size.width - 160, 160, 360);
    gradient.addColorStop(0, template.accent);
    gradient.addColorStop(1, "rgba(110, 231, 249, 0)");
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size.width, size.height);
  }

  if (decoration === "swiss") {
    ctx.globalAlpha = 0.16;
    ctx.lineWidth = 2;
    for (let x = 92; x <= size.width - 92; x += 118) {
      ctx.beginPath();
      ctx.moveTo(x, 92);
      ctx.lineTo(x, size.height - 92);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.9;
    ctx.fillRect(92, 96, 138, 22);
    ctx.fillRect(size.width - 300, 96, 208, 22);
  }

  if (decoration === "block") {
    ctx.globalAlpha = 1;
    ctx.fillRect(62, 62, size.width - 124, 84);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(size.width - 220, size.height - 220, 120, 120);
  }

  if (decoration === "sun") {
    ctx.globalAlpha = 0.22;
    ctx.beginPath();
    ctx.arc(size.width - 172, 180, 126, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.35;
    for (let y = 124; y < size.height - 120; y += 54) {
      ctx.fillRect(92, y, size.width - 184, 2);
    }
  }

  if (decoration === "liminal-polaroid") {
    const frameX = 114;
    const frameY = 104;
    const frameW = size.width - 228;
    const frameH = size.height - 208;
    const photoX = frameX + 44;
    const photoY = frameY + 54;
    const photoW = frameW - 88;
    const photoH = 850;
    const centerX = photoX + photoW / 2;

    ctx.globalAlpha = 0.26;
    ctx.fillStyle = "#615b4e";
    roundRect(ctx, frameX + 16, frameY + 20, frameW, frameH, 26);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.fillStyle = "#fff8e8";
    roundRect(ctx, frameX, frameY, frameW, frameH, 26);
    ctx.fill();

    const photo = ctx.createLinearGradient(photoX, photoY, photoX, photoY + photoH);
    photo.addColorStop(0, "#e6dfbd");
    photo.addColorStop(0.42, "#c9c5a3");
    photo.addColorStop(0.72, "#a0a88d");
    photo.addColorStop(1, "#6f7a68");
    ctx.fillStyle = photo;
    roundRect(ctx, photoX, photoY, photoW, photoH, 14);
    ctx.fill();

    ctx.globalAlpha = 0.22;
    ctx.fillStyle = "#f6f0cc";
    for (let index = 0; index < 6; index += 1) {
      ctx.fillRect(photoX + 28, photoY + 72 + index * 132, photoW - 56, 8);
    }

    ctx.globalAlpha = 0.28;
    ctx.strokeStyle = "#fff8d8";
    ctx.lineWidth = 3;
    for (let index = 0; index < 7; index += 1) {
      const offset = 68 + index * 54;
      ctx.beginPath();
      ctx.moveTo(photoX + offset, photoY + photoH);
      ctx.lineTo(centerX, photoY + 160);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(photoX + photoW - offset, photoY + photoH);
      ctx.lineTo(centerX, photoY + 160);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.56;
    ctx.fillStyle = "rgba(248, 241, 223, 0.72)";
    roundRect(ctx, photoX + 28, photoY + 120, photoW - 56, 560, 18);
    ctx.fill();

    ctx.globalAlpha = 0.34;
    ctx.fillStyle = "#a87639";
    ctx.fillRect(frameX + 60, frameY + frameH - 152, 190, 4);
    ctx.fillRect(frameX + frameW - 250, frameY + frameH - 152, 190, 4);
  }

  if (decoration === "collage") {
    ctx.globalAlpha = 0.82;
    ctx.fillRect(110, 116, 180, 54);
    ctx.globalAlpha = 0.16;
    ctx.fillRect(size.width - 300, 150, 188, 260);
    ctx.fillRect(120, size.height - 310, 220, 130);
  }

  if (decoration === "deco") {
    ctx.globalAlpha = 0.88;
    ctx.lineWidth = 5;
    roundRect(ctx, 96, 96, size.width - 192, size.height - 192, 18);
    ctx.stroke();
    ctx.lineWidth = 2;
    roundRect(ctx, 124, 124, size.width - 248, size.height - 248, 10);
    ctx.stroke();
  }

  if (decoration === "glass") {
    const gradient = ctx.createLinearGradient(62, 62, size.width - 62, size.height - 62);
    gradient.addColorStop(0, "rgba(124, 58, 237, 0.22)");
    gradient.addColorStop(0.5, "rgba(14, 165, 233, 0.18)");
    gradient.addColorStop(1, "rgba(244, 114, 182, 0.2)");
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 1;
    ctx.fillRect(62, 62, size.width - 124, size.height - 124);
  }

  if (decoration === "organic-glass") {
    const wash = ctx.createLinearGradient(70, 70, size.width - 70, size.height - 70);
    wash.addColorStop(0, "rgba(69, 184, 172, 0.22)");
    wash.addColorStop(0.45, "rgba(202, 135, 244, 0.2)");
    wash.addColorStop(1, "rgba(255, 190, 118, 0.2)");
    ctx.globalAlpha = 1;
    ctx.fillStyle = wash;
    ctx.fillRect(62, 62, size.width - 124, size.height - 124);

    ctx.globalAlpha = 0.58;
    ctx.fillStyle = "rgba(255,255,255,0.58)";
    ctx.strokeStyle = "rgba(255,255,255,0.82)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(248, 210, 166, 104, -0.34, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(size.width - 238, size.height - 254, 178, 118, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.globalAlpha = 0.32;
    ctx.strokeStyle = "#45b8ac";
    ctx.lineWidth = 3;
    for (let index = 0; index < 6; index += 1) {
      const y = 180 + index * 135;
      ctx.beginPath();
      ctx.moveTo(98, y);
      ctx.bezierCurveTo(260, y + 70, 360, y - 70, 520, y + 20);
      ctx.stroke();
    }
  }

  if (decoration === "solarpunk") {
    const sun = ctx.createRadialGradient(size.width - 210, 185, 24, size.width - 210, 185, 250);
    sun.addColorStop(0, "rgba(245, 165, 36, 0.58)");
    sun.addColorStop(1, "rgba(245, 165, 36, 0)");
    ctx.globalAlpha = 1;
    ctx.fillStyle = sun;
    ctx.fillRect(size.width - 470, 40, 430, 430);

    ctx.globalAlpha = 0.56;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#5f9f43";
    for (let index = 0; index < 7; index += 1) {
      const y = 180 + index * 132;
      ctx.beginPath();
      ctx.moveTo(72, y);
      ctx.bezierCurveTo(190, y - 70, 230, y + 70, 360, y - 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(118, y - 12, 18, 42, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "#1d766f";
    ctx.lineWidth = 2;
    for (let x = size.width - 360; x < size.width - 96; x += 52) {
      ctx.beginPath();
      ctx.moveTo(x, 98);
      ctx.lineTo(x + 110, 320);
      ctx.stroke();
    }
    for (let y = size.height - 330; y < size.height - 112; y += 42) {
      ctx.beginPath();
      ctx.moveTo(size.width - 374, y);
      ctx.lineTo(size.width - 112, y);
      ctx.stroke();
    }
  }

  if (decoration === "riso") {
    ctx.globalAlpha = 0.34;
    ctx.beginPath();
    ctx.arc(190, 180, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#00a6a6";
    ctx.beginPath();
    ctx.arc(size.width - 190, size.height - 210, 150, 0, Math.PI * 2);
    ctx.fill();
  }

  if (decoration === "riso-zine") {
    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = 0.34;
    ctx.fillStyle = "#ff4f87";
    ctx.fillRect(92, 128, 270, 148);
    ctx.fillStyle = "#00a6a6";
    ctx.fillRect(size.width - 376, size.height - 338, 258, 176);
    ctx.fillStyle = "#f7ff5a";
    ctx.beginPath();
    ctx.arc(size.width - 230, 218, 112, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 0.52;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#ff4f87";
    roundRect(ctx, 92, 92, size.width - 184, size.height - 184, 16);
    ctx.stroke();
    ctx.strokeStyle = "#00a6a6";
    roundRect(ctx, 102, 86, size.width - 184, size.height - 184, 16);
    ctx.stroke();

    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#241816";
    for (let index = 0; index < 240; index += 1) {
      const x = 76 + ((index * 47) % (size.width - 152));
      const y = 78 + ((index * 83) % (size.height - 156));
      ctx.fillRect(x, y, 2, 2);
    }
  }

  if (decoration === "terminal") {
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 2;
    for (let y = 92; y < size.height - 92; y += 36) {
      ctx.beginPath();
      ctx.moveTo(92, y);
      ctx.lineTo(size.width - 92, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillRect(92, 96, 18, 18);
    ctx.fillRect(126, 96, 18, 18);
    ctx.fillRect(160, 96, 18, 18);
  }

  if (decoration === "leaf") {
    ctx.globalAlpha = 0.78;
    for (let index = 0; index < 12; index += 1) {
      const y = 130 + index * 86;
      ctx.beginPath();
      ctx.ellipse(80, y, 18, 36, Math.PI / 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(size.width - 80, y + 38, 18, 36, -Math.PI / 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (decoration === "pixel-botanical") {
    const pixel = 18;
    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = "#2f9e44";
    ctx.lineWidth = 1;
    for (let x = 92; x <= size.width - 92; x += pixel * 2) {
      ctx.beginPath();
      ctx.moveTo(x, 92);
      ctx.lineTo(x, size.height - 92);
      ctx.stroke();
    }
    for (let y = 92; y <= size.height - 92; y += pixel * 2) {
      ctx.beginPath();
      ctx.moveTo(92, y);
      ctx.lineTo(size.width - 92, y);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.9;
    const drawPixelPlant = (originX, originY, scale = 1) => {
      const unit = 18 * scale;
      ctx.fillStyle = "#2f9e44";
      ctx.fillRect(originX, originY + unit * 2, unit, unit * 5);
      ctx.fillRect(originX - unit * 2, originY + unit * 3, unit * 2, unit);
      ctx.fillRect(originX + unit, originY + unit * 4, unit * 2, unit);
      ctx.fillStyle = "#75c46b";
      ctx.fillRect(originX - unit * 3, originY + unit * 2, unit * 2, unit * 2);
      ctx.fillRect(originX + unit * 2, originY + unit * 3, unit * 2, unit * 2);
      ctx.fillStyle = "#f08a5d";
      ctx.fillRect(originX - unit, originY, unit * 3, unit * 2);
      ctx.fillStyle = "#17331f";
      ctx.fillRect(originX, originY + unit, unit, unit);
    };

    drawPixelPlant(130, size.height - 320, 1.1);
    drawPixelPlant(size.width - 190, 132, 0.9);
  }

  if (decoration === "scribble") {
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 3;
    for (let index = 0; index < 7; index += 1) {
      const y = 120 + index * 150;
      ctx.beginPath();
      ctx.moveTo(88, y);
      ctx.bezierCurveTo(130, y - 28, 180, y + 28, 230, y);
      ctx.stroke();
    }
  }

  if (decoration === "minimal") {
    ctx.globalAlpha = 1;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(92, 118);
    ctx.lineTo(size.width - 92, 118);
    ctx.moveTo(92, size.height - 118);
    ctx.lineTo(size.width - 92, size.height - 118);
    ctx.stroke();
  }

  if (decoration === "hud") {
    ctx.globalAlpha = 0.42;
    ctx.lineWidth = 3;
    for (let index = 0; index < 6; index += 1) {
      const y = 150 + index * 86;
      ctx.strokeRect(92, y, 170 + index * 28, 34);
    }
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.arc(size.width - 190, 190, 128, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(size.width - 190, 190, 72, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (decoration === "blueprint-editorial") {
    ctx.globalAlpha = 0.32;
    ctx.strokeStyle = "rgba(239, 248, 255, 0.72)";
    ctx.lineWidth = 1.5;
    for (let x = 92; x <= size.width - 92; x += 42) {
      ctx.beginPath();
      ctx.moveTo(x, 92);
      ctx.lineTo(x, size.height - 92);
      ctx.stroke();
    }
    for (let y = 92; y <= size.height - 92; y += 42) {
      ctx.beginPath();
      ctx.moveTo(92, y);
      ctx.lineTo(size.width - 92, y);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.85;
    ctx.strokeStyle = "#eff8ff";
    ctx.lineWidth = 4;
    roundRect(ctx, 112, 112, size.width - 224, size.height - 224, 6);
    ctx.stroke();

    ctx.globalAlpha = 0.7;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(144, 232);
    ctx.lineTo(144, 168);
    ctx.lineTo(326, 168);
    ctx.moveTo(size.width - 144, size.height - 232);
    ctx.lineTo(size.width - 144, size.height - 168);
    ctx.lineTo(size.width - 326, size.height - 168);
    ctx.stroke();

    ctx.globalAlpha = 0.76;
    ctx.lineWidth = 2;
    const centerX = size.width - 250;
    const centerY = 238;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 112, 0, Math.PI * 2);
    ctx.moveTo(centerX - 150, centerY);
    ctx.lineTo(centerX + 150, centerY);
    ctx.moveTo(centerX, centerY - 150);
    ctx.lineTo(centerX, centerY + 150);
    ctx.stroke();

    ctx.globalAlpha = 0.9;
    ctx.fillStyle = "#7dd3fc";
    ctx.fillRect(122, size.height - 178, 260, 3);
    ctx.fillRect(122, size.height - 214, 3, 74);
    ctx.fillRect(379, size.height - 214, 3, 74);

    ctx.globalAlpha = 0.72;
    ctx.font = "24px Inter, Arial, sans-serif";
    ctx.fillText("LAYOUT 1080 x 1440", 132, size.height - 232);
    ctx.fillText("TEXT FIELD", size.width - 314, 168);
  }

  if (decoration === "neon") {
    ctx.globalAlpha = 0.9;
    ctx.shadowColor = template.accent;
    ctx.shadowBlur = 34;
    ctx.lineWidth = 7;
    roundRect(ctx, 112, 112, size.width - 224, size.height - 224, 34);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "#22d3ee";
    ctx.fillRect(112, size.height - 250, size.width - 224, 12);
  }

  if (decoration === "cyber-rococo") {
    const glow = ctx.createRadialGradient(size.width / 2, 180, 30, size.width / 2, 180, 470);
    glow.addColorStop(0, "rgba(255, 79, 216, 0.42)");
    glow.addColorStop(0.55, "rgba(34, 211, 238, 0.16)");
    glow.addColorStop(1, "rgba(255, 79, 216, 0)");
    ctx.globalAlpha = 1;
    ctx.fillStyle = glow;
    ctx.fillRect(62, 62, size.width - 124, size.height - 124);

    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 2;
    for (let y = 138; y < size.height - 132; y += 64) {
      ctx.beginPath();
      ctx.moveTo(92, y);
      ctx.lineTo(size.width - 92, y);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.95;
    ctx.shadowColor = "#ff4fd8";
    ctx.shadowBlur = 20;
    ctx.strokeStyle = "#ff4fd8";
    ctx.lineWidth = 5;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(size.width / 2, 132);
      ctx.bezierCurveTo(size.width / 2 + side * 130, 70, size.width / 2 + side * 270, 132, size.width / 2 + side * 300, 230);
      ctx.bezierCurveTo(size.width / 2 + side * 320, 300, size.width / 2 + side * 222, 315, size.width / 2 + side * 198, 250);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(size.width / 2, size.height - 132);
      ctx.bezierCurveTo(size.width / 2 + side * 130, size.height - 70, size.width / 2 + side * 270, size.height - 132, size.width / 2 + side * 300, size.height - 230);
      ctx.bezierCurveTo(size.width / 2 + side * 320, size.height - 300, size.width / 2 + side * 222, size.height - 315, size.width / 2 + side * 198, size.height - 250);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    ctx.globalAlpha = 0.82;
    ctx.strokeStyle = "#f6c85f";
    ctx.lineWidth = 2;
    roundRect(ctx, 126, 126, size.width - 252, size.height - 252, 32);
    ctx.stroke();
  }

  if (decoration === "holographic-foil") {
    const foil = ctx.createLinearGradient(82, 82, size.width - 82, size.height - 82);
    foil.addColorStop(0, "rgba(255, 255, 255, 0.82)");
    foil.addColorStop(0.16, "rgba(103, 232, 249, 0.44)");
    foil.addColorStop(0.32, "rgba(216, 180, 254, 0.48)");
    foil.addColorStop(0.5, "rgba(251, 207, 232, 0.46)");
    foil.addColorStop(0.68, "rgba(254, 240, 138, 0.42)");
    foil.addColorStop(0.84, "rgba(134, 239, 172, 0.4)");
    foil.addColorStop(1, "rgba(255, 255, 255, 0.76)");
    ctx.globalAlpha = 1;
    ctx.fillStyle = foil;
    ctx.fillRect(62, 62, size.width - 124, size.height - 124);

    ctx.globalAlpha = 0.32;
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 2;
    for (let y = 112; y < size.height - 112; y += 22) {
      ctx.beginPath();
      ctx.moveTo(92, y);
      ctx.lineTo(size.width - 92, y + 86);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.72;
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.beginPath();
    ctx.moveTo(120, 250);
    ctx.lineTo(310, 112);
    ctx.lineTo(500, 250);
    ctx.lineTo(310, 388);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(size.width - 130, size.height - 320);
    ctx.lineTo(size.width - 320, size.height - 450);
    ctx.lineTo(size.width - 510, size.height - 320);
    ctx.lineTo(size.width - 320, size.height - 190);
    ctx.closePath();
    ctx.fill();
  }

  if (decoration === "luxury") {
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(92, 244);
    ctx.lineTo(size.width - 92, 244);
    ctx.stroke();
    ctx.globalAlpha = 0.16;
    ctx.beginPath();
    ctx.arc(size.width - 170, 168, 92, 0, Math.PI * 2);
    ctx.fill();
  }

  if (decoration === "constructivist-ledger") {
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#181512";
    ctx.fillRect(92, 104, 250, 18);
    ctx.fillStyle = "#c1121f";
    ctx.fillRect(92, 132, 420, 16);

    ctx.save();
    ctx.translate(size.width - 276, 102);
    ctx.rotate(-Math.PI / 9);
    ctx.fillRect(0, 0, 320, 86);
    ctx.fillStyle = "#181512";
    ctx.fillRect(34, 114, 240, 24);
    ctx.restore();

    ctx.globalAlpha = 0.28;
    ctx.strokeStyle = "#181512";
    ctx.lineWidth = 2;
    for (let y = 286; y < size.height - 182; y += 76) {
      ctx.beginPath();
      ctx.moveTo(92, y);
      ctx.lineTo(size.width - 92, y);
      ctx.stroke();
    }
    for (let x = 260; x < size.width - 100; x += 220) {
      ctx.beginPath();
      ctx.moveTo(x, 248);
      ctx.lineTo(x, size.height - 182);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = "#c1121f";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(92, size.height - 214);
    ctx.lineTo(size.width - 92, size.height - 330);
    ctx.stroke();
  }

  if (decoration === "vapor") {
    ctx.globalAlpha = 0.35;
    const gradient = ctx.createLinearGradient(92, 92, size.width - 92, size.height - 92);
    gradient.addColorStop(0, "#fb7185");
    gradient.addColorStop(0.5, "#22d3ee");
    gradient.addColorStop(1, "#a78bfa");
    ctx.fillStyle = gradient;
    ctx.fillRect(62, 62, size.width - 124, size.height - 124);
    ctx.globalAlpha = 0.28;
    ctx.strokeStyle = "#22d3ee";
    for (let y = size.height - 440; y < size.height - 112; y += 44) {
      ctx.beginPath();
      ctx.moveTo(92, y);
      ctx.lineTo(size.width - 92, y);
      ctx.stroke();
    }
  }

  if (decoration === "newspaper") {
    ctx.globalAlpha = 0.24;
    ctx.lineWidth = 2;
    for (let x = 270; x < size.width - 180; x += 220) {
      ctx.beginPath();
      ctx.moveTo(x, 270);
      ctx.lineTo(x, size.height - 210);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillRect(92, 112, size.width - 184, 8);
    ctx.fillRect(92, 134, size.width - 184, 2);
  }

  ctx.restore();
}

function markdownText(block) {
  if (block.type === "list") return block.items.join("\n");
  return block.text || "";
}

function fontForMarkdownSegment(template, block, segment) {
  if (segment.type === "code") return `700 ${Math.max(24, template.bodyFont - 4)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  if (block.type === "heading" || segment.type === "strong") return `800 ${block.type === "heading" ? template.bodyFont + 8 : template.bodyFont}px system-ui, sans-serif`;
  if (segment.type === "em") return `600 italic ${template.bodyFont}px system-ui, sans-serif`;
  return `500 ${template.bodyFont}px system-ui, sans-serif`;
}

function drawMarkdownLine(ctx, segments, x, y, template, block) {
  let cursor = x;
  for (const segment of segments) {
    ctx.font = fontForMarkdownSegment(template, block, segment);
    if (segment.type === "code") {
      const width = ctx.measureText(segment.text).width + 20;
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = template.accent;
      roundRect(ctx, cursor - 2, y - 3, width, template.bodyFont + 12, 8);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = template.text;
      ctx.fillText(segment.text, cursor + 8, y);
      cursor += width + 4;
      continue;
    }

    ctx.fillStyle = segment.type === "strong" ? template.accent : template.text;
    ctx.fillText(segment.text, cursor, y);
    cursor += ctx.measureText(segment.text).width;
  }
}

function blockLineHeight(model, block) {
  return block.type === "heading" ? Math.round(model.lineHeight * 1.12) : model.lineHeight;
}

function blockGap(block) {
  if (block.type === "heading") return 18;
  if (block.type === "list") return 12;
  return 10;
}

function getItemHeight(item) {
  return item.height || 0;
}

function groupHeight(group) {
  return group.items.reduce((total, item) => total + getItemHeight(item), 0);
}

function createLineGroup(type, items, index, keepTogether = true) {
  return {
    type,
    keepTogether,
    groupId: `${type}-${index}`,
    items,
  };
}

function buildBodyGroups(ctx, model) {
  const { template, draft, contentWidth, lineHeight } = model;
  const blocks = parseMarkdownBlocks(draft.body);
  const groups = [];
  let groupIndex = 0;

  for (const block of blocks) {
    if (block.type === "pageBreak") {
      groups.push({
        type: "pageBreak",
        groupId: `pageBreak-${groupIndex}`,
        items: [{ type: "pageBreak", height: 0 }],
      });
      groupIndex += 1;
      continue;
    }

    if (block.type === "list") {
      const listGroups = [];
      for (const item of block.items) {
        const listItems = [];
        ctx.font = `500 ${template.bodyFont}px system-ui, sans-serif`;
        const lines = wrapFullText(ctx, item, contentWidth - 42);
        lines.forEach((line, lineIndex) => {
          listItems.push({
            type: "line",
            blockType: "list",
            segments: parseInlineMarkdown(line),
            bullet: lineIndex === 0,
            indent: 42,
            height: lineHeight,
          });
        });
        listGroups.push(createLineGroup("listItem", listItems, groupIndex));
        groupIndex += 1;
      }
      listGroups.push(createLineGroup("gap", [{ type: "gap", height: blockGap(block) }], groupIndex, false));
      groupIndex += 1;
      groups.push(...listGroups);
      continue;
    }

    const text = markdownText(block);
    const indent = block.type === "quote" ? 32 : 0;
    const fontSize = block.type === "heading" ? template.bodyFont + 8 : template.bodyFont;
    ctx.font = `500 ${fontSize}px system-ui, sans-serif`;
    const lines = wrapFullText(ctx, text, contentWidth - indent);
    const height = blockLineHeight(model, block);
    const items = [];

    lines.forEach((line) => {
      const lineSegments = block.segments?.length === 1 ? [{ ...block.segments[0], text: line }] : parseInlineMarkdown(line);
      items.push({
        type: "line",
        blockType: block.type,
        segments: lineSegments,
        indent,
        height,
        quote: block.type === "quote",
      });
    });
    items.push({ type: "gap", height: blockGap(block) });
    groups.push(createLineGroup(block.type, items, groupIndex));
    groupIndex += 1;
  }

  while (groups.at(-1)?.type === "gap" || groups.at(-1)?.items.at(-1)?.type === "gap") {
    const group = groups.at(-1);
    if (!group) break;
    if (group.type === "gap") {
      groups.pop();
      continue;
    }
    if (group.items.at(-1)?.type === "gap") group.items.pop();
    if (group.items.length === 0) groups.pop();
    else break;
  }

  return groups;
}

function keepHeadingWithFollower(groups) {
  return groups.map((group, index) => {
    if (group.type !== "heading") return group;
    const nextGroup = groups.slice(index + 1).find((candidate) => candidate.type !== "pageBreak" && candidate.type !== "gap");
    if (!nextGroup) return group;
    return {
      ...group,
      keepWithNextGroupId: nextGroup.groupId,
      keepWithNextHeight: groupHeight(nextGroup),
    };
  });
}

function paginateGroups(groups, pageStarts, maxY) {
  const pages = [];
  let pageIndex = 0;
  let currentPage = { items: [], cursorY: pageStarts[0] };

  function commitPage() {
    pages.push(currentPage);
    pageIndex += 1;
    currentPage = { items: [], cursorY: pageStarts[Math.min(pageIndex, pageStarts.length - 1)] };
  }

  function placeItem(item, group) {
    if (item.type === "gap" && currentPage.items.length === 0) return;
    currentPage.items.push({
      ...item,
      y: currentPage.cursorY,
      groupId: group.groupId,
    });
    currentPage.cursorY += getItemHeight(item);
  }

  for (const group of keepHeadingWithFollower(groups)) {
    if (group.type === "pageBreak") {
      if (currentPage.items.length) commitPage();
      continue;
    }

    const height = groupHeight(group);
    const reserveHeight = height + (group.keepWithNextHeight || 0);
    const pageStart = pageStarts[Math.min(pageIndex, pageStarts.length - 1)];
    const fitsAsGroup = height <= maxY - pageStart;
    const shouldMoveGroup = currentPage.items.length
      && group.keepTogether
      && fitsAsGroup
      && currentPage.cursorY + reserveHeight > maxY;

    if (shouldMoveGroup) {
      commitPage();
    }

    for (const item of group.items) {
      const itemHeight = getItemHeight(item);
      if (currentPage.items.length && currentPage.cursorY + itemHeight > maxY) {
        commitPage();
      }
      placeItem(item, group);
    }
  }

  if (currentPage.items.length || pages.length === 0) pages.push(currentPage);
  return pages;
}

export function paginateRenderModel(ctx, model) {
  ctx.textBaseline = "top";
  ctx.textAlign = model.template.align;
  ctx.font = `800 ${model.template.titleFont}px system-ui, sans-serif`;
  const titleLines = wrapText(ctx, model.draft.title, model.contentWidth, 3);
  const firstBodyY = TITLE_Y + titleLines.length * Math.round(model.template.titleFont * 1.24) + 30;
  const bodyGroups = buildBodyGroups(ctx, model);
  const pages = paginateGroups(bodyGroups, [firstBodyY, CONTINUATION_BODY_Y], BODY_BOTTOM_Y);
  const pageCount = pages.length;

  return {
    ...model,
    bodyBottomY: BODY_BOTTOM_Y,
    pages: pages.map((page, index) => ({
      pageNumber: index + 1,
      pageCount,
      titleLines: index === 0 ? titleLines : [],
      bodyStartY: index === 0 ? firstBodyY : CONTINUATION_BODY_Y,
      remainingHeight: Math.max(0, BODY_BOTTOM_Y - page.cursorY),
      remainingRatio: Math.max(0, Math.min(1, (BODY_BOTTOM_Y - page.cursorY) / (BODY_BOTTOM_Y - (index === 0 ? firstBodyY : CONTINUATION_BODY_Y)))),
      items: page.items,
    })),
  };
}

function drawMarkdownItems(ctx, model, page, x) {
  const { template } = model;

  for (const item of page.items) {
    if (item.type !== "line") continue;

    if (item.blockType === "list" && item.bullet) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = template.accent;
      ctx.font = `800 ${template.bodyFont}px system-ui, sans-serif`;
      ctx.fillText("•", x, item.y);
    }

    if (item.quote) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = template.accent;
      ctx.fillRect(x, item.y - 2, 6, Math.max(42, item.height - 10));
    }

    ctx.globalAlpha = item.quote ? 0.92 : 1;
    drawMarkdownLine(ctx, item.segments, x + item.indent, item.y, template, { type: item.blockType });
  }
}

export function drawRenderPage(ctx, paginatedModel, page = paginatedModel.pages[0]) {
  const { template, draft, size, padding } = paginatedModel;

  ctx.clearRect(0, 0, size.width, size.height);
  ctx.fillStyle = template.bg;
  ctx.fillRect(0, 0, size.width, size.height);

  ctx.globalAlpha = paginatedModel.surfaceAlpha ?? 1;
  ctx.fillStyle = template.surface;
  roundRect(ctx, 62, 62, size.width - 124, size.height - 124, 42);
  ctx.fill();
  ctx.globalAlpha = 1;
  drawDecoration(ctx, paginatedModel);

  ctx.textBaseline = "top";
  ctx.textAlign = template.align;
  const x = template.align === "center" ? size.width / 2 : padding;

  ctx.fillStyle = template.accent;
  ctx.font = "700 28px system-ui, sans-serif";
  ctx.fillText("REDNOTE TEXT", x, KICKER_Y);

  if (page.titleLines.length) {
    ctx.fillStyle = template.text;
    ctx.font = `800 ${template.titleFont}px system-ui, sans-serif`;
    let titleY = TITLE_Y;
    page.titleLines.forEach((line) => {
      ctx.fillText(line, x, titleY);
      titleY += Math.round(template.titleFont * 1.24);
    });
  } else {
    ctx.fillStyle = template.muted;
    ctx.font = "700 26px system-ui, sans-serif";
    ctx.fillText("CONTINUED", x, TITLE_Y - 56);
  }

  drawMarkdownItems(ctx, paginatedModel, page, x);

  ctx.fillStyle = template.muted;
  ctx.font = "600 30px system-ui, sans-serif";
  ctx.fillText(`@ ${draft.signature}`, x, SIGNATURE_Y);
  ctx.textAlign = "right";
  ctx.font = "600 24px system-ui, sans-serif";
  ctx.fillText(`${page.pageNumber} / ${page.pageCount}`, size.width - padding, SIGNATURE_Y);
}

export function drawRenderModel(ctx, model, pageNumber = 1) {
  const paginatedModel = model.pages ? model : paginateRenderModel(ctx, model);
  const page = paginatedModel.pages[Math.max(0, pageNumber - 1)] || paginatedModel.pages[0];
  drawRenderPage(ctx, paginatedModel, page);
}
