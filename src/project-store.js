export const PROJECT_STORAGE_KEY = "redbook-renderer-project-state";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function draftName(draft) {
  return String(draft?.title || "").trim() || "未命名作品";
}

function createId(prefix, now) {
  return `${prefix}-${String(now).replace(/[^0-9a-z]/gi, "").slice(0, 18)}-${Math.random().toString(36).slice(2, 8)}`;
}

function createDraftRecord(templateId, draft, now, name = draftName(draft)) {
  return {
    id: createId("draft", now),
    name,
    templateId,
    draft: clone(draft),
    createdAt: now,
    updatedAt: now,
  };
}

function createWorkRecord(templateId, draft, now, name = draftName(draft)) {
  return {
    id: createId("work", now),
    name,
    templateId,
    draft: clone(draft),
    createdAt: now,
    updatedAt: now,
  };
}

export function createInitialProjectState(templateId, draft, now = new Date().toISOString()) {
  const record = createDraftRecord(templateId, draft, now);
  return {
    version: 1,
    activeDraftId: record.id,
    drafts: [record],
    works: [],
    favoriteTemplateIds: [],
  };
}

function normalizeProjectState(state) {
  if (!state?.drafts?.length) return null;
  const activeDraftId = state.drafts.some((draft) => draft.id === state.activeDraftId)
    ? state.activeDraftId
    : state.drafts[0].id;
  return {
    version: 1,
    activeDraftId,
    drafts: state.drafts.map((draft) => ({
      ...draft,
      name: draft.name || draftName(draft.draft),
      draft: clone(draft.draft),
    })),
    works: (state.works || []).map((work) => ({
      ...work,
      name: work.name || draftName(work.draft),
      draft: clone(work.draft),
    })),
    favoriteTemplateIds: [...new Set(state.favoriteTemplateIds || [])],
  };
}

export function migrateLegacyState(legacyState, now = new Date().toISOString()) {
  return createInitialProjectState(
    legacyState?.selectedTemplateId || "clean-list",
    legacyState?.draft || {},
    now,
  );
}

export function getActiveDraft(state) {
  return state.drafts.find((draft) => draft.id === state.activeDraftId) || state.drafts[0];
}

export function updateActiveDraft(state, updates, now = new Date().toISOString()) {
  const activeDraft = getActiveDraft(state);
  return {
    ...state,
    drafts: state.drafts.map((draft) => draft.id === activeDraft.id
      ? {
        ...draft,
        name: updates.name ?? draft.name,
        templateId: updates.templateId ?? draft.templateId,
        draft: updates.draft ? clone(updates.draft) : draft.draft,
        updatedAt: now,
      }
      : draft),
  };
}

export function createNewDraft(state, templateId, draft, now = new Date().toISOString()) {
  const record = createDraftRecord(templateId, draft, now);
  return {
    ...state,
    activeDraftId: record.id,
    drafts: [...state.drafts, record],
  };
}

export function duplicateDraft(state, now = new Date().toISOString()) {
  const activeDraft = getActiveDraft(state);
  const record = createDraftRecord(activeDraft.templateId, activeDraft.draft, now, `${activeDraft.name} copy`);
  return {
    ...state,
    activeDraftId: record.id,
    drafts: [...state.drafts, record],
  };
}

export function renameDraft(state, draftId, name) {
  const cleanedName = String(name || "").trim() || "未命名作品";
  return {
    ...state,
    drafts: state.drafts.map((draft) => draft.id === draftId ? { ...draft, name: cleanedName } : draft),
  };
}

export function deleteDraft(state, draftId) {
  if (state.drafts.length <= 1) return state;
  const drafts = state.drafts.filter((draft) => draft.id !== draftId);
  return {
    ...state,
    activeDraftId: state.activeDraftId === draftId ? drafts[0].id : state.activeDraftId,
    drafts,
  };
}

export function saveWork(state, templateId, draft, now = new Date().toISOString()) {
  const record = createWorkRecord(templateId, draft, now);
  return {
    ...state,
    works: [record, ...(state.works || [])],
  };
}

export function loadWorkAsDraft(state, workId, now = new Date().toISOString()) {
  const work = (state.works || []).find((item) => item.id === workId);
  if (!work) return state;
  const record = createDraftRecord(work.templateId, work.draft, now, work.name);
  return {
    ...state,
    activeDraftId: record.id,
    drafts: [...state.drafts, record],
  };
}

export function deleteWork(state, workId) {
  return {
    ...state,
    works: (state.works || []).filter((work) => work.id !== workId),
  };
}

export function toggleFavoriteTemplate(state, templateId) {
  const favorites = new Set(state.favoriteTemplateIds || []);
  if (favorites.has(templateId)) favorites.delete(templateId);
  else favorites.add(templateId);
  return {
    ...state,
    favoriteTemplateIds: [...favorites],
  };
}

export function loadProjectState(storage, legacyKey, defaultTemplateId, defaultDraft) {
  try {
    const stored = normalizeProjectState(JSON.parse(storage.getItem(PROJECT_STORAGE_KEY) || "null"));
    if (stored) return stored;
    const legacy = JSON.parse(storage.getItem(legacyKey) || "null");
    if (legacy) return migrateLegacyState(legacy);
  } catch {
    return createInitialProjectState(defaultTemplateId, defaultDraft);
  }
  return createInitialProjectState(defaultTemplateId, defaultDraft);
}

export function saveProjectState(storage, state) {
  storage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(state));
}
