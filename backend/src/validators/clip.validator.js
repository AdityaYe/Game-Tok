const { z } = require("zod");

const createClipSchema = z.object({
  body: z.object({
    gameName: z
      .string()
      .min(1)
      .max(100),

    description: z
      .string()
      .max(300)
      .optional(),

    tags: z
      .array(z.string())
      .optional(),
  }),
});

const commentSchema = z.object({
  body: z.object({
    clipId: z.string(),

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