import {
  OUTPUT_SIZE,
  buildRenderModel,
  drawRenderPage,
  getTemplates,
  normalizeDraft,
  paginateRenderModel,
  parseInlineMarkdown,
} from "./renderer.js";

const STORAGE_KEY = "redbook-renderer-state";

const defaultDraft = {
  title: "把普通文字排得更好看",
  body: "## 一张适合手机阅读的文字卡\n- 标题更醒目\n- 段落更有层次\n\n> 普通文案也可以有杂志感。\n\n用 **Markdown** 标出重点，也能保留 `关键词`。",
  signature: "布洛克琴",
};

const templates = getTemplates();
const categories = ["全部", "简约", "专业", "高科技", "炫酷", "复古", "手帐"];

const libraryView = document.querySelector("#libraryView");
const editorView = document.querySelector("#editorView");
const templateGrid = document.querySelector("#templateGrid");
const categoryFilter = document.querySelector("#categoryFilter");
const templateSelect = document.querySelector("#templateSelect");
const titleInput = document.querySelector("#titleInput");
const bodyInput = document.querySelector("#bodyInput");
const signatureInput = document.querySelector("#signatureInput");
const statusText = document.querySelector("#statusText");
const backBtn = document.querySelector("#backBtn");
const exportPngBtn = document.querySelector("#exportPngBtn");
const exportPdfBtn = document.querySelector("#exportPdfBtn");
const previewPages = document.querySelector("#previewPages");

let selectedTemplateId = templates[0].id;
let draft = { ...defaultDraft };
let selectedCategory = "全部";

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ selectedTemplateId, draft }));
}

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (stored?.selectedTemplateId) selectedTemplateId = stored.selectedTemplateId;
    if (stored?.draft) draft = { ...defaultDraft, ...stored.draft };
  } catch {
    selectedTemplateId = templates[0].id;
    draft = { ...defaultDraft };
  }
}

function getTemplate(templateId = selectedTemplateId) {
  return templates.find((template) => template.id === templateId) || templates[0];
}

function renderTemplateThumbnail(template) {
  const thumb = document.createElement("div");
  thumb.className = "template-thumb";
  thumb.dataset.template = template.decoration;
  thumb.style.setProperty("--template-bg", template.bg);
  thumb.style.setProperty("--template-surface", template.surface);
  thumb.style.setProperty("--template-text", template.text);
  thumb.style.setProperty("--template-accent", template.accent);
  thumb.innerHTML = `
    <span></span>
    <strong>${template.name}</strong>
    <p>文字排版预览</p>
  `;
  return thumb;
}

function renderCategories() {
  categoryFilter.innerHTML = "";
  categories.forEach((category) => {
    const count = category === "全部"
      ? templates.length
      : templates.filter((template) => template.category === category).length;
    const button = document.createElement("button");
    button.type = "button";
    button.className = category === selectedCategory ? "category-button active" : "category-button";
    button.textContent = `${category} ${count}`;
    button.addEventListener("click", () => {
      selectedCategory = category;
      renderCategories();
      renderLibrary();
    });
    categoryFilter.append(button);
  });
}

function renderLibraryStats() {
  const templateCountNodes = document.querySelectorAll("[data-template-count]");
  const categoryCountNodes = document.querySelectorAll("[data-category-count]");
  templateCountNodes.forEach((node) => {
    node.textContent = String(templates.length);
  });
  categoryCountNodes.forEach((node) => {
    node.textContent = String(categories.length - 1);
  });
}

function renderLibrary() {
  templateGrid.innerHTML = "";
  const visibleTemplates = selectedCategory === "全部"
    ? templates
    : templates.filter((template) => template.category === selectedCategory);
  visibleTemplates.forEach((template) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "template-card";
    card.dataset.templateId = template.id;
    card.append(renderTemplateThumbnail(template));

    const content = document.createElement("div");
    content.className = "template-card-copy";
    const title = document.createElement("h2");
    title.textContent = template.name;
    const category = document.createElement("span");
    category.className = "template-category";
    category.textContent = template.category;
    const description = document.createElement("p");
    description.textContent = template.description;
    content.append(category, title, description);
    card.append(content);

    card.addEventListener("click", () => openEditor(template.id));
    templateGrid.append(card);
  });
}

function renderTemplateSelect() {
  templateSelect.innerHTML = "";
  templates.forEach((template) => {
    const option = document.createElement("option");
    option.value = template.id;
    option.textContent = template.name;
    templateSelect.append(option);
  });
}

function setInputs() {
  const normalized = normalizeDraft(draft);
  titleInput.value = normalized.title;
  bodyInput.value = normalized.body;
  signatureInput.value = normalized.signature;
  templateSelect.value = selectedTemplateId;
}

function updateDraftFromInputs() {
  draft = {
    title: titleInput.value,
    body: bodyInput.value,
    signature: signatureInput.value,
  };
}

function applyPreviewTheme(phoneScreen, previewCard, template) {
  phoneScreen.style.setProperty("--preview-bg", template.bg);
  previewCard.style.setProperty("--preview-surface", template.surface);
  previewCard.style.setProperty("--preview-text", template.text);
  previewCard.style.setProperty("--preview-muted", template.muted);
  previewCard.style.setProperty("--preview-accent", template.accent);
  previewCard.dataset.template = template.decoration;
  previewCard.dataset.align = template.align;
}

function renderInlineMarkdown(parent, segments) {
  segments.forEach((segment) => {
    const node = document.createElement(
      segment.type === "strong" ? "strong" : segment.type === "em" ? "em" : segment.type === "code" ? "code" : "span",
    );
    node.textContent = segment.text;
    parent.append(node);
  });
}

function renderPreviewLine(parent, item) {
  if (item.blockType === "list") {
    const row = document.createElement("p");
    row.className = "preview-list-line";
    if (item.bullet) {
      const bullet = document.createElement("span");
      bullet.className = "preview-bullet";
      bullet.textContent = "•";
      row.append(bullet);
    } else {
      row.append(document.createElement("span"));
    }
    const text = document.createElement("span");
    renderInlineMarkdown(text, item.segments);
    row.append(text);
    parent.append(row);
    return;
  }

  const tagName = item.blockType === "heading" ? "h4" : "p";
  const node = document.createElement(tagName);
  if (item.quote) node.className = "preview-quote-line";
  renderInlineMarkdown(node, item.segments);
  parent.append(node);
}

function renderPreviewPage(paginated, page) {
  const shell = document.createElement("article");
  shell.className = "preview-page-shell";
  shell.setAttribute("aria-label", `预览第 ${page.pageNumber} 页，共 ${page.pageCount} 页`);

  const label = document.createElement("p");
  label.className = "preview-page-label";
  label.textContent = `Page ${page.pageNumber} / ${page.pageCount}`;

  const phoneFrame = document.createElement("div");
  phoneFrame.className = "phone-frame";
  const phoneScreen = document.createElement("div");
  phoneScreen.className = "phone-screen";
  const previewCard = document.createElement("div");
  previewCard.className = "preview-card";
  applyPreviewTheme(phoneScreen, previewCard, paginated.template);

  const kicker = document.createElement("p");
  kicker.className = "preview-kicker";
  kicker.textContent = page.pageNumber === 1 ? "REDNOTE TEXT" : "CONTINUED";
  const title = document.createElement("h3");
  title.className = "preview-title";
  title.textContent = page.titleLines.join("\n");
  if (!page.titleLines.length) title.hidden = true;
  const body = document.createElement("div");
  body.className = "preview-body";
  page.items.forEach((item) => {
    if (item.type === "line") renderPreviewLine(body, item);
  });
  const signature = document.createElement("p");
  signature.className = "preview-signature";
  signature.textContent = `@ ${paginated.draft.signature}`;
  const pageNumber = document.createElement("p");
  pageNumber.className = "preview-page-number";
  pageNumber.textContent = `${page.pageNumber} / ${page.pageCount}`;

  previewCard.append(kicker, title, body, signature, pageNumber);
  phoneScreen.append(previewCard);
  phoneFrame.append(phoneScreen);
  shell.append(label, phoneFrame);
  return shell;
}

function renderPreview() {
  const model = buildRenderModel(selectedTemplateId, draft);
  const measureCanvas = document.createElement("canvas");
  const paginated = paginateRenderModel(measureCanvas.getContext("2d"), model);

  previewPages.innerHTML = "";
  paginated.pages.forEach((page) => {
    previewPages.append(renderPreviewPage(paginated, page));
  });
  statusText.textContent = `${paginated.template.name} · 已自动分页 ${paginated.pages.length} 页`;
  saveState();
}

function openEditor(templateId = selectedTemplateId) {
  selectedTemplateId = templateId;
  libraryView.hidden = true;
  editorView.hidden = false;
  templateSelect.value = selectedTemplateId;
  setInputs();
  renderPreview();
}

function openLibrary() {
  editorView.hidden = true;
  libraryView.hidden = false;
}

function createPaginatedModel() {
  const measureCanvas = document.createElement("canvas");
  return paginateRenderModel(measureCanvas.getContext("2d"), buildRenderModel(selectedTemplateId, draft));
}

function createCanvasForPage(paginated, page) {
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE.width;
  canvas.height = OUTPUT_SIZE.height;
  const ctx = canvas.getContext("2d");
  drawRenderPage(ctx, paginated, page);
  return canvas;
}

function createCanvases() {
  const paginated = createPaginatedModel();
  return paginated.pages.map((page) => createCanvasForPage(paginated, page));
}

function exportPng() {
  updateDraftFromInputs();
  const canvases = createCanvases();
  canvases.forEach((canvas, index) => {
    const link = document.createElement("a");
    const pageLabel = String(index + 1).padStart(2, "0");
    link.download = `redbook-template-${selectedTemplateId}-${pageLabel}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
  statusText.textContent = `PNG 已导出 ${canvases.length} 页。`;
}

function exportPdf() {
  updateDraftFromInputs();
  const dataUrls = createCanvases().map((canvas) => canvas.toDataURL("image/png"));
  const printWindow = window.open("", "_blank", "noopener,noreferrer");
  if (!printWindow) {
    statusText.textContent = "浏览器拦截了 PDF 窗口。";
    return;
  }

  printWindow.document.write(`
    <!doctype html>
    <html lang="zh-CN">
      <head>
        <meta charset="utf-8">
        <title>导出 PDF</title>
        <style>
          @page { size: 1080px 1440px; margin: 0; }
          body { margin: 0; background: #f3f4f6; }
          img { width: 1080px; height: 1440px; display: block; page-break-after: always; break-after: page; }
          img:last-child { page-break-after: auto; break-after: auto; }
          @media print { body { background: white; } img { width: 100vw; height: 133.333vw; } }
        </style>
      </head>
      <body>
        ${dataUrls.map((dataUrl, index) => `<img src="${dataUrl}" alt="小红书文本模板导出预览第 ${index + 1} 页">`).join("")}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.addEventListener("load", () => {
    printWindow.focus();
    printWindow.print();
  });
  statusText.textContent = `PDF 打印窗口已打开，共 ${dataUrls.length} 页。`;
}

function bindEvents() {
  templateSelect.addEventListener("change", () => {
    selectedTemplateId = templateSelect.value;
    updateDraftFromInputs();
    renderPreview();
  });

  [titleInput, bodyInput, signatureInput].forEach((input) => {
    input.addEventListener("input", () => {
      updateDraftFromInputs();
      renderPreview();
    });
  });

  backBtn.addEventListener("click", openLibrary);
  exportPngBtn.addEventListener("click", exportPng);
  exportPdfBtn.addEventListener("click", exportPdf);
}

loadState();
renderTemplateSelect();
renderLibraryStats();
renderCategories();
renderLibrary();
setInputs();
renderPreview();
openLibrary();
bindEvents();
