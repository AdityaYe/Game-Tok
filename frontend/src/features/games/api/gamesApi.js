import api, { unwrapApiData } from "../../../lib/api";

export async function searchGames(query) {
  return unwrapApiData(await api.get(`/games/search?q=${encodeURIComponent(query)}`));
}
