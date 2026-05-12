import api from "../../../lib/api";

export async function uploadClip({ formData, onUploadProgress }) {
  const { data } = await api.post(
    "/clips",

    formData,

    {
      headers: {
        "Content-Type": "multipart/form-data",
      },

      onUploadProgress,
    },
  );

  return data;
}
