const { z } = require("zod");

const followCreatorSchema = z.object({
  body: z.object({
    creatorId: z.string(),
  }),
});

const updateClipSchema = z.object({
  body: z.object({
    gameName: z
      .string()
      .min(1)
      .max(100)
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
      .array(z.string())
      .optional(),
  }),
});

module.exports = {
  followCreatorSchema,
  updateClipSchema,
};
