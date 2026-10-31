export const giscusConfig = {
  repo: "ahron-gutierrez/art-appreciation-portfolio",
  repoId: "",
  category: "",
  categoryId: "",
  mapping: "pathname",
  reactionsEnabled: "1",
  inputPosition: "top",
  lang: "en",
};

export function isGiscusConfigured() {
  return Boolean(
    giscusConfig.repo.trim()
    && giscusConfig.repoId.trim()
    && giscusConfig.category.trim()
    && giscusConfig.categoryId.trim(),
  );
}

export function getGiscusTheme() {
  if (typeof window === "undefined" || window.location.protocol !== "https:") {
    return "light";
  }

  return new URL(
    `${import.meta.env.BASE_URL}giscus-theme.css`,
    window.location.origin,
  ).href;
}