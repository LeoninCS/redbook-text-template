import assert from "node:assert/strict";
import test from "node:test";

import {
  CATEGORY_ALL,
  CATEGORY_FAVORITES,
  getLibraryCategories,
  getRecentDrafts,
  getRecentWorks,
  getVisibleTemplates,
} from "../src/project-view.js";

const templates = [
  { id: "clean-list", category: "专业" },
  { id: "daily-note", category: "手帐" },
  { id: "cyber-neon", category: "炫酷" },
  { id: "blueprint", category: "专业" },
];

test("builds library categories with favorites", () => {
  const categories = getLibraryCategories(templates, ["daily-note", "cyber-neon"]);

  assert.deepEqual(categories, [
    { name: CATEGORY_ALL, count: 4 },
    { name: CATEGORY_FAVORITES, count: 2 },
    { name: "专业", count: 2 },
    { name: "炫酷", count: 1 },
    { name: "手帐", count: 1 },
  ]);
});

test("filters visible templates by category and favorites", () => {
  assert.deepEqual(
    getVisibleTemplates(templates, "专业", []),
    [templates[0], templates[3]],
  );
  assert.deepEqual(
    getVisibleTemplates(templates, CATEGORY_FAVORITES, ["cyber-neon"]),
    [templates[2]],
  );
  assert.deepEqual(getVisibleTemplates(templates, CATEGORY_ALL, []), templates);
});

test("sorts recent drafts by updated time", () => {
  const state = {
    drafts: [
      { id: "a", name: "A", updatedAt: "2026-06-01T00:00:00.000Z" },
      { id: "b", name: "B", updatedAt: "2026-06-02T00:00:00.000Z" },
      { id: "c", name: "C", updatedAt: "2026-05-31T00:00:00.000Z" },
    ],
  };

  assert.deepEqual(getRecentDrafts(state, 2).map((draft) => draft.id), ["b", "a"]);
});

test("sorts recent works by updated time", () => {
  const state = {
    works: [
      { id: "w1", name: "作品 1", updatedAt: "2026-06-01T00:00:00.000Z" },
      { id: "w2", name: "作品 2", updatedAt: "2026-06-03T00:00:00.000Z" },
      { id: "w3", name: "作品 3", updatedAt: "2026-06-02T00:00:00.000Z" },
    ],
  };

  assert.deepEqual(getRecentWorks(state, 2).map((work) => work.id), ["w2", "w3"]);
});
