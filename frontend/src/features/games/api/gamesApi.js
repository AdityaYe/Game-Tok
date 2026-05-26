import api, { unwrapApiData } from "../../../lib/api";

export async function searchGames(query, options = {}) {
  return unwrapApiData(
    await api.get(`/games/search?q=${encodeURIComponent(query)}`, {
      signal: options.signal,
    }),
  );
}
