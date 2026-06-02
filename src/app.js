import {
  OUTPUT_SIZE,
  buildRenderModel,
  drawRenderPage,
  getTemplates,
  normalizeDraft,
  paginateRenderModel,
} from "./renderer.js";
import {
  buildExportFilename,
  createPdfBlob,
  createZipBlob,
  parsePageRange,
} from "./exporter.js";
import { buildAiSuggestions } from "./assistant.js";
import {
  createNewDraft,
  deleteDraft,
  duplicateDraft,
  getActiveDraft,
  loadProjectState,
  renameDraft,
  saveProjectState,
  toggleFavoriteTemplate,
  updateActiveDraft,
} from "./project-store.js";
import {
  CATEGORY_ALL,
  CATEGORY_FAVORITES,
  getLibraryCategories,
  getRecentDrafts,
  getVisibleTemplates,
} from "./project-view.js";

const STORAGE_KEY = "redbook-renderer-state";

const defaultDraft = {
  title: "把普通文字排得更好看",
  body: "## 一张适合手机阅读的文字卡\n- 标题更醒目\n- 段落更有层次\n\n> 普通文案也可以有杂志感。\n\n用 **Markdown** 标出重点，也能保留 `关键词`。",
  signature: "布洛克琴",
  controls: {
    fontScale: 1,
    lineHeightScale: 1,
    paddingScale: 1,
    accent: "",
    surfaceAlpha: 1,
    align: "",
  },
};

const templates = getTemplates();

const libraryView = document.querySelector("#libraryView");
const editorView = document.querySelector("#editorView");
const templateGrid = document.querySelector("#templateGrid");
const categoryFilter = document.querySelector("#categoryFilter");
const draftsStrip = document.querySelector("#draftsStrip");
const templateSelect = document.querySelector("#templateSelect");
const titleInput = document.querySelector("#titleInput");
const bodyInput = document.querySelector("#bodyInput");
const signatureInput = document.querySelector("#signatureInput");
const statusText = document.querySelector("#statusText");
const backBtn = document.querySelector("#backBtn");
const newDraftFromLibraryBtn = document.querySelector("#newDraftFromLibraryBtn");
const newDraftBtn = document.querySelector("#newDraftBtn");
const duplicateDraftBtn = document.querySelector("#duplicateDraftBtn");
const renameDraftBtn = document.querySelector("#renameDraftBtn");
const deleteDraftBtn = document.querySelector("#deleteDraftBtn");
const exportPngBtn = document.querySelector("#exportPngBtn");
const exportPdfBtn = document.querySelector("#exportPdfBtn");
const pageRangeInput = document.querySelector("#pageRangeInput");
const exportScaleSelect = document.querySelector("#exportScaleSelect");
const previewPages = document.querySelector("#previewPages");
const fontScaleInput = document.querySelector("#fontScaleInput");
const lineHeightScaleInput = document.querySelector("#lineHeightScaleInput");
const paddingScaleInput = document.querySelector("#paddingScaleInput");
const surfaceAlphaInput = document.querySelector("#surfaceAlphaInput");
const accentColorInput = document.querySelector("#accentColorInput");
const alignSelect = document.querySelector("#alignSelect");
const aiSuggestBtn = document.querySelector("#aiSuggestBtn");
const aiOutput = document.querySelector("#aiOutput");

let projectState;
let selectedTemplateId = templates[0].id;
let draft = cloneDraft(defaultDraft);
let selectedCategory = CATEGORY_ALL;

function cloneDraft(value) {
  return JSON.parse(JSON.stringify(value));
}

function hydrateActiveDraft() {
  const activeDraft = getActiveDraft(projectState);
  selectedTemplateId = getTemplate(activeDraft.templateId).id;
  draft = normalizeDraft(activeDraft.draft);
}

function persistActiveDraft(now = new Date().toISOString()) {
  projectState = updateActiveDraft(projectState, {
    templateId: selectedTemplateId,
    draft,
  }, now);
  saveProjectState(localStorage, projectState);
}

function loadState() {
  projectState = loadProjectState(localStorage, STORAGE_KEY, templates[0].id, defaultDraft);
  hydrateActiveDraft();
}

function getTemplate(templateId = selectedTemplateId) {
  return templates.find((template) => template.id === templateId) || templates[0];
}

function renderTemplateThumbnail(template) {
  const thumb = document.createElement("div");
  thumb.className = "template-thumb";
  thumb.dataset.template = template.decoration.kind;
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
  const categories = getLibraryCategories(templates, projectState.favoriteTemplateIds);
  categories.forEach(({ name, count }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = name === selectedCategory ? "category-button active" : "category-button";
    button.textContent = `${name} ${count}`;
    button.addEventListener("click", () => {
      selectedCategory = name;
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
    node.textContent = String(new Set(templates.map((template) => template.category)).size);
  });
}

function renderLibrary() {
  templateGrid.innerHTML = "";
  const visibleTemplates = getVisibleTemplates(templates, selectedCategory, projectState.favoriteTemplateIds);
  if (!visibleTemplates.length) {
    const empty = document.createElement("p");
    empty.className = "template-empty";
    empty.textContent = selectedCategory === CATEGORY_FAVORITES ? "收藏模板后会出现在这里。" : "当前分类暂无模板。";
    templateGrid.append(empty);
    return;
  }
  visibleTemplates.forEach((template) => {
    const card = document.createElement("article");
    card.className = "template-card";
    card.dataset.templateId = template.id;
    card.tabIndex = 0;
    card.append(renderTemplateThumbnail(template));

    const content = document.createElement("div");
    content.className = "template-card-copy";
    const cardHead = document.createElement("div");
    cardHead.className = "template-card-head";
    const title = document.createElement("h2");
    title.textContent = template.name;
    const category = document.createElement("span");
    category.className = "template-category";
    category.textContent = template.category;
    const favoriteBtn = document.createElement("button");
    favoriteBtn.type = "button";
    favoriteBtn.className = projectState.favoriteTemplateIds.includes(template.id)
      ? "favorite-button active"
      : "favorite-button";
    favoriteBtn.setAttribute("aria-label", `收藏 ${template.name}`);
    favoriteBtn.textContent = "★";
    favoriteBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      projectState = toggleFavoriteTemplate(projectState, template.id);
      saveProjectState(localStorage, projectState);
      renderCategories();
      renderLibrary();
    });
    const description = document.createElement("p");
    description.textContent = template.description;
    cardHead.append(category, favoriteBtn);
    content.append(cardHead, title, description);
    card.append(content);

    card.addEventListener("click", () => openEditor(template.id));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openEditor(template.id);
      }
    });
    templateGrid.append(card);
  });
}

function renderDrafts() {
  draftsStrip.innerHTML = "";
  getRecentDrafts(projectState, 6).forEach((draftRecord) => {
    const template = getTemplate(draftRecord.templateId);
    const card = document.createElement("button");
    card.type = "button";
    card.className = draftRecord.id === projectState.activeDraftId ? "draft-card active" : "draft-card";
    const date = new Date(draftRecord.updatedAt);
    const templateName = document.createElement("span");
    templateName.textContent = template.name;
    const draftName = document.createElement("strong");
    draftName.textContent = draftRecord.name;
    const updatedAt = document.createElement("small");
    updatedAt.textContent = Number.isNaN(date.getTime()) ? "刚刚更新" : date.toLocaleDateString("zh-CN");
    card.append(templateName, draftName, updatedAt);
    card.addEventListener("click", () => openDraft(draftRecord.id));
    draftsStrip.append(card);
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
  const template = getTemplate();
  titleInput.value = normalized.title;
  bodyInput.value = normalized.body;
  signatureInput.value = normalized.signature;
  templateSelect.value = selectedTemplateId;
  fontScaleInput.value = normalized.controls.fontScale ?? 1;
  lineHeightScaleInput.value = normalized.controls.lineHeightScale ?? 1;
  paddingScaleInput.value = normalized.controls.paddingScale ?? 1;
  surfaceAlphaInput.value = normalized.controls.surfaceAlpha ?? 1;
  accentColorInput.value = normalized.controls.accent || template.accent;
  alignSelect.value = normalized.controls.align || template.align;
}

function updateDraftFromInputs() {
  draft = {
    title: titleInput.value,
    body: bodyInput.value,
    signature: signatureInput.value,
    controls: {
      fontScale: Number(fontScaleInput.value),
      lineHeightScale: Number(lineHeightScaleInput.value),
      paddingScale: Number(paddingScaleInput.value),
      accent: accentColorInput.value,
      surfaceAlpha: Number(surfaceAlphaInput.value),
      align: alignSelect.value,
    },
  };
}

function applyPreviewTheme(phoneScreen, previewCard, paginated) {
  const { template } = paginated;
  phoneScreen.style.setProperty("--preview-bg", template.bg);
  previewCard.style.setProperty("--preview-surface", template.surface);
  previewCard.style.setProperty("--preview-text", template.text);
  previewCard.style.setProperty("--preview-muted", template.muted);
  previewCard.style.setProperty("--preview-accent", template.accent);
  previewCard.style.setProperty("--preview-surface-alpha", paginated.surfaceAlpha ?? 1);
  previewCard.dataset.template = template.decoration.kind;
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
  const spaceHint = document.createElement("p");
  spaceHint.className = page.remainingRatio > 0.24 ? "preview-space-hint is-roomy" : "preview-space-hint";
  spaceHint.textContent = page.remainingRatio > 0.24
    ? `本页剩余约 ${Math.round(page.remainingRatio * 100)}% 空间`
    : "本页内容接近满版";

  const phoneFrame = document.createElement("div");
  phoneFrame.className = "phone-frame";
  const phoneScreen = document.createElement("div");
  phoneScreen.className = "phone-screen";
  const previewCard = document.createElement("div");
  previewCard.className = "preview-card";
  applyPreviewTheme(phoneScreen, previewCard, paginated);

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
  shell.append(label, phoneFrame, spaceHint);
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
  persistActiveDraft();
  renderDrafts();
}

function openEditor(templateId = selectedTemplateId) {
  selectedTemplateId = templateId;
  libraryView.hidden = true;
  editorView.hidden = false;
  templateSelect.value = selectedTemplateId;
  setInputs();
  renderPreview();
}

function openDraft(draftId) {
  persistActiveDraft();
  projectState = { ...projectState, activeDraftId: draftId };
  hydrateActiveDraft();
  saveProjectState(localStorage, projectState);
  libraryView.hidden = true;
  editorView.hidden = false;
  setInputs();
  renderPreview();
}

function openLibrary() {
  persistActiveDraft();
  renderCategories();
  renderLibrary();
  renderDrafts();
  editorView.hidden = true;
  libraryView.hidden = false;
}

function createDraft(templateId = selectedTemplateId) {
  updateDraftFromInputs();
  persistActiveDraft();
  projectState = createNewDraft(projectState, templateId, defaultDraft);
  hydrateActiveDraft();
  saveProjectState(localStorage, projectState);
  setInputs();
  renderPreview();
  libraryView.hidden = true;
  editorView.hidden = false;
}

function duplicateCurrentDraft() {
  updateDraftFromInputs();
  persistActiveDraft();
  projectState = duplicateDraft(projectState);
  hydrateActiveDraft();
  saveProjectState(localStorage, projectState);
  setInputs();
  renderPreview();
}

function renameCurrentDraft() {
  const activeDraft = getActiveDraft(projectState);
  const name = window.prompt("作品名称", activeDraft.name);
  if (name === null) return;
  projectState = renameDraft(projectState, activeDraft.id, name);
  saveProjectState(localStorage, projectState);
  renderDrafts();
  statusText.textContent = "作品名称已更新。";
}

function deleteCurrentDraft() {
  const activeDraft = getActiveDraft(projectState);
  const confirmed = window.confirm(`删除作品「${activeDraft.name}」？`);
  if (!confirmed) return;
  if (projectState.drafts.length <= 1) {
    projectState = updateActiveDraft(projectState, {
      name: defaultDraft.title,
      templateId: templates[0].id,
      draft: defaultDraft,
    });
    hydrateActiveDraft();
    saveProjectState(localStorage, projectState);
    setInputs();
    renderPreview();
    statusText.textContent = "当前作品已重置。";
    return;
  }
  projectState = deleteDraft(projectState, activeDraft.id);
  hydrateActiveDraft();
  saveProjectState(localStorage, projectState);
  setInputs();
  renderPreview();
  statusText.textContent = "作品已删除。";
}

function createPaginatedModel() {
  const measureCanvas = document.createElement("canvas");
  return paginateRenderModel(measureCanvas.getContext("2d"), buildRenderModel(selectedTemplateId, draft));
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function dataUrlToBytes(dataUrl) {
  const base64 = dataUrl.split(",")[1] || "";
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}

function getExportScale() {
  return Math.max(1, Math.min(3, Number(exportScaleSelect.value) || 2));
}

function getSelectedPages(paginated) {
  const pages = parsePageRange(pageRangeInput.value, paginated.pages.length);
  if (!pages.length) {
    statusText.textContent = "页码范围为空，请输入如 1-3,5。";
    return [];
  }
  return pages.map((pageNumber) => paginated.pages[pageNumber - 1]);
}

function createCanvasForPage(paginated, page, scale = 1) {
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE.width * scale;
  canvas.height = OUTPUT_SIZE.height * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  drawRenderPage(ctx, paginated, page);
  return canvas;
}

function createCanvases() {
  const paginated = createPaginatedModel();
  const selectedPages = getSelectedPages(paginated);
  const scale = getExportScale();
  return {
    paginated,
    scale,
    canvases: selectedPages.map((page) => ({
      page,
      canvas: createCanvasForPage(paginated, page, scale),
    })),
  };
}

function exportPng() {
  updateDraftFromInputs();
  const { canvases, scale } = createCanvases();
  if (!canvases.length) return;
  const files = canvases.map(({ page, canvas }) => {
    const dataUrl = canvas.toDataURL("image/png");
    return {
      name: buildExportFilename(selectedTemplateId, page.pageNumber, "png"),
      bytes: dataUrlToBytes(dataUrl),
    };
  });
  downloadBlob(createZipBlob(files), `redbook-template-${selectedTemplateId}-${scale}x.zip`);
  statusText.textContent = `PNG ZIP 已导出 ${canvases.length} 页，倍率 ${scale}x。`;
}

function exportPdf() {
  updateDraftFromInputs();
  const { canvases, scale } = createCanvases();
  if (!canvases.length) return;
  const dataUrls = canvases.map(({ canvas }) => canvas.toDataURL("image/jpeg", 0.96));
  downloadBlob(createPdfBlob(dataUrls, {
    width: OUTPUT_SIZE.width * scale,
    height: OUTPUT_SIZE.height * scale,
  }), `redbook-template-${selectedTemplateId}-${scale}x.pdf`);
  statusText.textContent = `PDF 已导出 ${canvases.length} 页，倍率 ${scale}x。`;
}

function renderAiSuggestions() {
  updateDraftFromInputs();
  const suggestions = buildAiSuggestions(draft, templates);
  aiOutput.innerHTML = "";

  const titleRow = document.createElement("div");
  titleRow.className = "ai-suggestion-row";
  const titleCopy = document.createElement("p");
  const titleLabel = document.createElement("strong");
  titleLabel.textContent = "润色标题";
  const polishedTitle = document.createElement("span");
  polishedTitle.textContent = suggestions.polishedTitle;
  titleCopy.append(titleLabel, polishedTitle);
  const useTitleBtn = document.createElement("button");
  useTitleBtn.type = "button";
  useTitleBtn.className = "text-button";
  useTitleBtn.textContent = "套用";
  useTitleBtn.addEventListener("click", () => {
    titleInput.value = suggestions.polishedTitle;
    updateDraftFromInputs();
    persistActiveDraft();
    renderPreview();
  });
  titleRow.append(titleCopy, useTitleBtn);

  const cover = document.createElement("p");
  cover.className = "ai-note";
  cover.textContent = `封面标题：${suggestions.coverTitle}`;

  const sectionList = document.createElement("div");
  sectionList.className = "ai-section-list";
  suggestions.sections.forEach((section) => {
    const item = document.createElement("p");
    item.textContent = `${section.title}：${section.summary}`;
    sectionList.append(item);
  });

  const templateList = document.createElement("div");
  templateList.className = "ai-template-list";
  suggestions.recommendations.slice(0, 3).forEach(({ template, reason }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ai-template-button";
    const templateName = document.createElement("strong");
    templateName.textContent = template.name;
    const reasonText = document.createElement("span");
    reasonText.textContent = reason;
    button.append(templateName, reasonText);
    button.addEventListener("click", () => {
      selectedTemplateId = template.id;
      templateSelect.value = selectedTemplateId;
      setInputs();
      updateDraftFromInputs();
      persistActiveDraft();
      renderPreview();
    });
    templateList.append(button);
  });

  aiOutput.append(titleRow, cover, sectionList, templateList);
  statusText.textContent = "AI 建议已生成。";
}

function bindEvents() {
  templateSelect.addEventListener("change", () => {
    selectedTemplateId = templateSelect.value;
    updateDraftFromInputs();
    persistActiveDraft();
    renderPreview();
  });

  [
    titleInput,
    bodyInput,
    signatureInput,
    fontScaleInput,
    lineHeightScaleInput,
    paddingScaleInput,
    surfaceAlphaInput,
    accentColorInput,
    alignSelect,
  ].forEach((input) => {
    input.addEventListener("input", () => {
      updateDraftFromInputs();
      persistActiveDraft();
      renderPreview();
    });
  });

  backBtn.addEventListener("click", openLibrary);
  newDraftFromLibraryBtn.addEventListener("click", () => createDraft());
  newDraftBtn.addEventListener("click", () => createDraft());
  duplicateDraftBtn.addEventListener("click", duplicateCurrentDraft);
  renameDraftBtn.addEventListener("click", renameCurrentDraft);
  deleteDraftBtn.addEventListener("click", deleteCurrentDraft);
  exportPngBtn.addEventListener("click", exportPng);
  exportPdfBtn.addEventListener("click", exportPdf);
  aiSuggestBtn.addEventListener("click", renderAiSuggestions);
}

loadState();
renderTemplateSelect();
renderLibraryStats();
renderCategories();
renderLibrary();
renderDrafts();
setInputs();
renderPreview();
openLibrary();
bindEvents();
