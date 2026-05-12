import api from "../../../lib/api";

export async function deleteComment(commentId) {
  const { data } = await api.delete(`/clips/comments/${commentId}`);

  return data;
}
