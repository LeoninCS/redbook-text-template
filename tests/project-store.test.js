import assert from "node:assert/strict";
import test from "node:test";

import {
  createInitialProjectState,
  createNewDraft,
  deleteDraft,
  deleteWork,
  duplicateDraft,
  loadWorkAsDraft,
  migrateLegacyState,
  renameDraft,
  createWork,
  saveWork,
  updateActiveWork,
  toggleFavoriteTemplate,
  updateActiveDraft,
} from "../src/project-store.js";

const sampleDraft = {
  title: "标题",
  body: "正文",
  signature: "布洛克琴",
  controls: { fontScale: 1 },
};

test("creates an initial project state with one draft", () => {
  const state = createInitialProjectState("clean-list", sampleDraft, "2026-06-02T00:00:00.000Z");

  assert.equal(state.drafts.length, 1);
  assert.equal(state.activeDraftId, state.drafts[0].id);
  assert.equal(state.drafts[0].templateId, "clean-list");
  assert.equal(state.favoriteTemplateIds.length, 0);
  assert.deepEqual(state.works, []);
});

test("updates the active draft content and template", () => {
  const state = createInitialProjectState("clean-list", sampleDraft, "2026-06-02T00:00:00.000Z");
  const updated = updateActiveDraft(state, {
    templateId: "neon-pop",
    draft: { ...sampleDraft, title: "新标题" },
  }, "2026-06-02T01:00:00.000Z");

  assert.equal(updated.drafts[0].templateId, "neon-pop");
  assert.equal(updated.drafts[0].draft.title, "新标题");
  assert.equal(updated.drafts[0].updatedAt, "2026-06-02T01:00:00.000Z");
});

test("creates duplicates renames and deletes drafts", () => {
  const state = createInitialProjectState("clean-list", sampleDraft, "2026-06-02T00:00:00.000Z");
  const duplicated = duplicateDraft(state, "2026-06-02T01:00:00.000Z");
  const renamed = renameDraft(duplicated, duplicated.activeDraftId, "复盘卡片");
  const deleted = deleteDraft(renamed, duplicated.activeDraftId);

  assert.equal(duplicated.drafts.length, 2);
  assert.equal(renamed.drafts.find((draft) => draft.id === duplicated.activeDraftId).name, "复盘卡片");
  assert.equal(deleted.drafts.length, 1);
  assert.equal(deleted.activeDraftId, state.activeDraftId);
});

test("keeps one draft when deleting the final draft", () => {
  const state = createInitialProjectState("clean-list", sampleDraft, "2026-06-02T00:00:00.000Z");
  const deleted = deleteDraft(state, state.activeDraftId);

  assert.equal(deleted.drafts.length, 1);
  assert.equal(deleted.activeDraftId, state.activeDraftId);
});

test("creates a new active draft", () => {
  const state = createInitialProjectState("clean-list", sampleDraft, "2026-06-02T00:00:00.000Z");
  const created = createNewDraft(state, "grid-note", sampleDraft, "2026-06-02T02:00:00.000Z");

  assert.equal(created.drafts.length, 2);
  assert.equal(created.drafts.at(-1).templateId, "grid-note");
  assert.equal(created.activeDraftId, created.drafts.at(-1).id);
});

test("toggles favorite template ids", () => {
  const state = createInitialProjectState("clean-list", sampleDraft, "2026-06-02T00:00:00.000Z");
  const favorited = toggleFavoriteTemplate(state, "clean-list");
  const unfavorited = toggleFavoriteTemplate(favorited, "clean-list");

  assert.deepEqual(favorited.favoriteTemplateIds, ["clean-list"]);
  assert.deepEqual(unfavorited.favoriteTemplateIds, []);
});

test("saves deletes and opens works from the work library", () => {
  const state = createInitialProjectState("clean-list", sampleDraft, "2026-06-02T00:00:00.000Z");
  const saved = saveWork(state, "clean-list", sampleDraft, "2026-06-02T03:00:00.000Z");
  const opened = loadWorkAsDraft(saved, saved.works[0].id, "2026-06-02T04:00:00.000Z");
  const deleted = deleteWork(opened, saved.works[0].id);

  assert.equal(saved.works.length, 1);
  assert.equal(saved.works[0].id.startsWith("work-"), true);
  assert.equal(saved.works[0].draft.title, "标题");
  assert.equal(opened.drafts.length, 1);
  assert.equal(opened.activeWorkId, saved.works[0].id);
  assert.equal(deleted.works.length, 0);
  assert.equal(deleted.drafts.length, 1);
});

test("creates separate active works from the same template", () => {
  const state = createInitialProjectState("clean-list", sampleDraft, "2026-06-02T00:00:00.000Z");
  const first = createWork(state, "clean-list", sampleDraft, "2026-06-02T03:00:00.000Z");
  const second = createWork(first, "clean-list", {
    ...sampleDraft,
    title: "第二份",
  }, "2026-06-02T04:00:00.000Z");

  assert.equal(second.works.length, 2);
  assert.equal(second.works[0].templateId, "clean-list");
  assert.equal(second.works[1].templateId, "clean-list");
  assert.notEqual(second.works[0].id, second.works[1].id);
  assert.equal(second.activeWorkId, second.works[0].id);
});

test("updates the active work directly while editing", () => {
  const state = createInitialProjectState("clean-list", sampleDraft, "2026-06-02T00:00:00.000Z");
  const created = createWork(state, "clean-list", sampleDraft, "2026-06-02T03:00:00.000Z");
  const updated = updateActiveWork(created, {
    draft: {
      ...sampleDraft,
      title: "编辑后的作品",
    },
  }, "2026-06-02T04:00:00.000Z");

  assert.equal(updated.works[0].draft.title, "编辑后的作品");
  assert.equal(updated.works[0].name, "编辑后的作品");
  assert.equal(updated.works[0].updatedAt, "2026-06-02T04:00:00.000Z");
});

test("migrates legacy single draft state", () => {
  const migrated = migrateLegacyState({
    selectedTemplateId: "clean-list",
    draft: sampleDraft,
  }, "2026-06-02T00:00:00.000Z");

  assert.equal(migrated.drafts.length, 1);
  assert.equal(migrated.drafts[0].draft.title, "标题");
  assert.deepEqual(migrated.works, []);
});
