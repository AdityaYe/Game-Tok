import api, { unwrapApiData } from "../../../lib/api";

export async function uploadClip({ formData, onUploadProgress }) {
  const response = await api.post(
    "/clips",

    formData,

    {
      headers: {
        "Content-Type": "multipart/form-data",
      },

      onUploadProgress,
    },
  );

  return unwrapApiData(response);
}
