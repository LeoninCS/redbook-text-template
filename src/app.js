import {
  OUTPUT_SIZE,
  buildRenderModel,
  drawRenderPage,
  getTemplates,
  normalizeDraft,
  paginateRenderModel,
} from "./renderer.js";
import {
  buildExportSummary,
  buildExportFilename,
  createPdfBlob,
  createZipBlob,
} from "./exporter.js";
import { buildAiSuggestions } from "./assistant.js";
import {
  createNewDraft,
  deleteDraft,
  deleteWork,
  duplicateDraft,
  getActiveDraft,
  loadWorkAsDraft,
  loadProjectState,
  renameDraft,
  saveProjectState,
  saveWork,
  toggleFavoriteTemplate,
  updateActiveDraft,
} from "./project-store.js";
import {
  CATEGORY_ALL,
  CATEGORY_FAVORITES,
  getLibraryCategories,
  getRecentDrafts,
  getRecentWorks,
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
    toneMode: "auto",
  },
};

const templates = getTemplates();

const libraryView = document.querySelector("#libraryView");
const editorView = document.querySelector("#editorView");
const templateGrid = document.querySelector("#templateGrid");
const categoryFilter = document.querySelector("#categoryFilter");
const draftsStrip = document.querySelector("#draftsStrip");
const worksGrid = document.querySelector("#worksGrid");
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
const saveWorkBtn = document.querySelector("#saveWorkBtn");
const deleteDraftBtn = document.querySelector("#deleteDraftBtn");
const exportPngBtn = document.querySelector("#exportPngBtn");
const exportPdfBtn = document.querySelector("#exportPdfBtn");
const pageRangeInput = document.querySelector("#pageRangeInput");
const exportScaleSelect = document.querySelector("#exportScaleSelect");
const exportSummary = document.querySelector("#exportSummary");
const previewPages = document.querySelector("#previewPages");
const fontScaleInput = document.querySelector("#fontScaleInput");
const lineHeightScaleInput = document.querySelector("#lineHeightScaleInput");
const paddingScaleInput = document.querySelector("#paddingScaleInput");
const surfaceAlphaInput = document.querySelector("#surfaceAlphaInput");
const accentColorInput = document.querySelector("#accentColorInput");
const alignSelect = document.querySelector("#alignSelect");
const toneModeSelect = document.querySelector("#toneModeSelect");
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

function renderCanvasThumbnail(paginated, page = paginated.pages[0]) {
  const canvas = createCanvasForPage(paginated, page, 1);
  canvas.className = "template-thumb-canvas";
  canvas.setAttribute("aria-hidden", "true");
  return canvas;
}

function renderTemplateThumbnail(template) {
  const print = document.createElement("div");
  print.className = "template-print";

  const thumbnailDraft = {
    title: template.name,
    body: `## ${template.category}模板\n- 文字层次清晰\n- 手机阅读舒服\n\n> ${template.description}`,
    signature: "布洛克琴",
    controls: {
      fontScale: 0.92,
      lineHeightScale: 0.96,
      paddingScale: 0.9,
      accent: "",
      surfaceAlpha: 1,
      align: "",
      toneMode: "auto",
    },
  };
  const measureCanvas = document.createElement("canvas");
  const thumbnailModel = buildRenderModel(template.id, thumbnailDraft);
  const thumbnailPage = paginateRenderModel(measureCanvas.getContext("2d"), thumbnailModel);

  const thumb = document.createElement("div");
  thumb.className = "template-thumb";
  thumb.append(renderCanvasThumbnail(thumbnailPage));

  const title = document.createElement("strong");
  title.className = "template-title";
  title.textContent = template.name;

  print.append(thumb, title);
  return print;
}

function renderWorkThumbnail(work) {
  const measureCanvas = document.createElement("canvas");
  const workModel = buildRenderModel(work.templateId, work.draft);
  const workPage = paginateRenderModel(measureCanvas.getContext("2d"), workModel);

  const thumb = document.createElement("div");
  thumb.className = "template-thumb work-thumb";
  thumb.append(renderCanvasThumbnail(workPage));
  return thumb;
}

function renderCategories() {
  categoryFilter.innerHTML = "";
  const categories = getLibraryCategories(templates, projectState.favoriteTemplateIds);
  categories.forEach(({ name }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = name === selectedCategory ? "category-button active" : "category-button";
    button.textContent = name;
    button.addEventListener("click", () => {
      selectedCategory = name;
      renderCategories();
      renderLibrary();
    });
    categoryFilter.append(button);
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
    card.append(favoriteBtn);

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
    const card = document.createElement("button");
    card.type = "button";
    card.className = draftRecord.id === projectState.activeDraftId ? "draft-card active" : "draft-card";
    const draftName = document.createElement("strong");
    draftName.textContent = draftRecord.name;
    card.append(draftName);
    card.addEventListener("click", () => openDraft(draftRecord.id));
    draftsStrip.append(card);
  });
}

function renderWorks() {
  const works = getRecentWorks(projectState, 8);
  const section = worksGrid.closest(".works-section");
  worksGrid.innerHTML = "";
  if (section) section.hidden = works.length === 0;

  works.forEach((work) => {
    const card = document.createElement("article");
    card.className = "work-card";

    const openButton = document.createElement("button");
    openButton.type = "button";
    openButton.className = "work-open-button";
    openButton.append(renderWorkThumbnail(work));
    openButton.addEventListener("click", () => openWork(work.id));

    const meta = document.createElement("div");
    meta.className = "work-meta";
    const name = document.createElement("strong");
    name.textContent = work.name;
    const templateName = document.createElement("span");
    templateName.textContent = getTemplate(work.templateId).name;
    meta.append(name, templateName);
    openButton.append(meta);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "work-delete-button";
    deleteButton.setAttribute("aria-label", `删除作品 ${work.name}`);
    deleteButton.textContent = "×";
    deleteButton.addEventListener("click", () => deleteSavedWork(work.id));

    card.append(openButton, deleteButton);
    worksGrid.append(card);
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
  toneModeSelect.value = normalized.controls.toneMode || "auto";
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
      toneMode: toneModeSelect.value,
    },
  };
}

function renderPreviewCanvas(paginated, page) {
  const canvas = createCanvasForPage(paginated, page, 1);
  canvas.className = "preview-canvas";
  canvas.setAttribute("aria-label", `实际输出预览第 ${page.pageNumber} 页`);
  return canvas;
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
  phoneScreen.append(renderPreviewCanvas(paginated, page));
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
  renderExportSummary(paginated);
}

function renderExportSummary(paginated = createPaginatedModel()) {
  const summary = buildExportSummary(pageRangeInput.value, paginated.pages.length, getExportScale(), OUTPUT_SIZE);
  exportSummary.className = summary.isValid ? "export-summary" : "export-summary is-warning";
  exportSummary.innerHTML = "";

  const message = document.createElement("strong");
  message.textContent = summary.message;
  const detail = document.createElement("span");
  detail.textContent = summary.isValid
    ? `页码：${summary.pages.join(", ")}`
    : `总页数：${summary.pageCount}`;
  exportSummary.append(message, detail);
  return summary;
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

function openWork(workId) {
  persistActiveDraft();
  projectState = loadWorkAsDraft(projectState, workId);
  hydrateActiveDraft();
  saveProjectState(localStorage, projectState);
  libraryView.hidden = true;
  editorView.hidden = false;
  setInputs();
  renderPreview();
  statusText.textContent = "作品已打开为草稿。";
}

function openLibrary() {
  persistActiveDraft();
  renderCategories();
  renderLibrary();
  renderDrafts();
  renderWorks();
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

function saveCurrentWork() {
  updateDraftFromInputs();
  persistActiveDraft();
  projectState = saveWork(projectState, selectedTemplateId, draft);
  saveProjectState(localStorage, projectState);
  renderWorks();
  statusText.textContent = "作品已保存。";
}

function deleteSavedWork(workId) {
  const work = (projectState.works || []).find((item) => item.id === workId);
  const confirmed = window.confirm(`删除作品「${work?.name || "未命名作品"}」？`);
  if (!confirmed) return;
  projectState = deleteWork(projectState, workId);
  saveProjectState(localStorage, projectState);
  renderWorks();
  statusText.textContent = "作品已删除。";
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
  const summary = renderExportSummary(paginated);
  const pages = summary.pages;
  if (!pages.length) {
    statusText.textContent = summary.message;
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
    toneModeSelect,
  ].forEach((input) => {
    input.addEventListener("input", () => {
      updateDraftFromInputs();
      persistActiveDraft();
      renderPreview();
    });
  });

  pageRangeInput.addEventListener("input", () => {
    renderExportSummary();
  });

  exportScaleSelect.addEventListener("change", () => {
    renderExportSummary();
  });

  backBtn.addEventListener("click", openLibrary);
  newDraftFromLibraryBtn.addEventListener("click", () => createDraft());
  newDraftBtn.addEventListener("click", () => createDraft());
  duplicateDraftBtn.addEventListener("click", duplicateCurrentDraft);
  renameDraftBtn.addEventListener("click", renameCurrentDraft);
  saveWorkBtn.addEventListener("click", saveCurrentWork);
  deleteDraftBtn.addEventListener("click", deleteCurrentDraft);
  exportPngBtn.addEventListener("click", exportPng);
  exportPdfBtn.addEventListener("click", exportPdf);
  aiSuggestBtn.addEventListener("click", renderAiSuggestions);
}

loadState();
renderTemplateSelect();
renderCategories();
renderLibrary();
renderDrafts();
renderWorks();
setInputs();
renderPreview();
openLibrary();
bindEvents();
