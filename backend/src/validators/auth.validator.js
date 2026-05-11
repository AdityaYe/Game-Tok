const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(3)
      .max(50),

    email: z
      .string()
      .email(),

    password: z
      .string()
      .min(6)
      .max(100),
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