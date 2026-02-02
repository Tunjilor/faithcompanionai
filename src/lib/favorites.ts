export type FavoriteVerse = {
  dayKey: string;
  translation: string;
  reference: string;
  text: string;
};

const KEY = "faith_favorites_v1";

export function loadFavorites(): FavoriteVerse[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveFavorite(v: FavoriteVerse) {
  if (typeof window === "undefined") return;
  const all = loadFavorites();
  const exists = all.some(
    (x) => x.dayKey === v.dayKey && x.translation === v.translation
  );
  const next = exists ? all : [v, ...all];
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function removeFavorite(dayKey: string, translation: string) {
  if (typeof window === "undefined") return;
  const all = loadFavorites();
  const next = all.filter((x) => !(x.dayKey === dayKey && x.translation === translation));
  localStorage.setItem(KEY, JSON.stringify(next));
}
