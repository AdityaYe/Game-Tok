const { z } = require("zod");

const optionalNumberFromForm = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) {
    return undefined;
  }

  return Number(value);
}, z.number().optional());

const createClipSchema = z.object({
  body: z.object({
    gameName: z
      .string()
      .min(1)
      .max(100),

    igdbId: optionalNumberFromForm,

    gameAppId: optionalNumberFromForm,

    gameSlug: z
      .string()
      .max(160)
      .optional(),

    gameCover: z
      .string()
      .url()
      .or(z.literal(""))
      .optional(),

    genre: z
      .string()
      .max(80)
      .optional(),

    rating: optionalNumberFromForm,

    gameUrl: z
      .string()
      .url()
      .or(z.literal(""))
      .optional(),

    caption: z
      .string()
      .max(300)
      .optional(),

    description: z
      .string()
      .max(300)
      .optional(),

    tags: z
      .union([
        z.array(z.string()),
        z.string().transform((value) => {
          if (!value) {
            return [];
          }

          try {
            const parsed = JSON.parse(value);

            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return value
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean);
          }
        }),
      ])
      .optional(),
  }),
});

const commentSchema = z.object({
  params: z.object({
    clipId: z.string().min(1),
  }),

  body: z.object({
    text: z
      .string()
      .min(1)
      .max(300),
  }),
});

module.exports = {
  createClipSchema,
  commentSchema,
};
