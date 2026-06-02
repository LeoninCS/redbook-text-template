export const CATEGORY_ALL = "全部";
export const CATEGORY_FAVORITES = "收藏";
export const CATEGORY_WORKS = "作品库";

const PREFERRED_CATEGORY_ORDER = ["简约", "专业", "高科技", "炫酷", "复古", "手帐"];

export function getLibraryCategories(templates, favoriteTemplateIds = [], workCount = 0) {
  const counts = new Map();
  templates.forEach((template) => {
    counts.set(template.category, (counts.get(template.category) || 0) + 1);
  });
  const sortedCategories = [
    ...PREFERRED_CATEGORY_ORDER.filter((category) => counts.has(category)),
    ...[...counts.keys()].filter((category) => !PREFERRED_CATEGORY_ORDER.includes(category)),
  ];

  return [
    { name: CATEGORY_ALL, count: templates.length },
    { name: CATEGORY_FAVORITES, count: favoriteTemplateIds.length },
    { name: CATEGORY_WORKS, count: workCount },
    ...sortedCategories.map((name) => ({ name, count: counts.get(name) })),
  ];
}

export function getVisibleTemplates(templates, category, favoriteTemplateIds = []) {
  if (category === CATEGORY_ALL) return templates;
  if (category === CATEGORY_FAVORITES) {
    const favorites = new Set(favoriteTemplateIds);
    return templates.filter((template) => favorites.has(template.id));
  }
  return templates.filter((template) => template.category === category);
}

export function getRecentDrafts(state, limit = 6) {
  return [...(state?.drafts || [])]
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
    .slice(0, limit);
}

export function getRecentWorks(state, limit = 6) {
  return [...(state?.works || [])]
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
    .slice(0, limit);
}
