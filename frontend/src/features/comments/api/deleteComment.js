import api, { unwrapApiData } from "../../../lib/api";

export async function deleteComment(commentId) {
  const response = await api.delete(`/clips/comments/${commentId}`);

  return unwrapApiData(response);
}
