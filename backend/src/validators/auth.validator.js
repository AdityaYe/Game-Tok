const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(3)
      .max(50)
      .optional(),

    name: z
      .string()
      .min(3)
      .max(50)
      .optional(),

    email: z
      .string()
      .email(),

    password: z
      .string()
      .min(6)
      .max(100),
  }).refine((data) => data.fullName || data.name, {
    message: "Name is required",
    path: ["fullName"],
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email(),

    password: z
      .string()
      .min(6),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
