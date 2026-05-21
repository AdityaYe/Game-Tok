const { z } = require("zod");

const createClipSchema = z.object({
  body: z.object({
    gameName: z
      .string()
      .min(1)
      .max(100),

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
