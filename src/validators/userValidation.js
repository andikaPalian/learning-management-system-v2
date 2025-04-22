import { z } from "zod";

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const userSchema = z.object({
  firstName: z
    .string({
      message: "First name must be a string",
    })
    .min(1, {
      message: "First name must be at least 1 character long",
    })
    .max(20, {
      message: "First name must be less than 20 characters long",
    }),
  lastName: z
    .string({
      message: "Last name must be a string",
    })
    .min(1, {
      message: "Last name must be at least 1 character long",
    })
    .max(20, {
      message: "Last name must be less than 20 characters long",
    }),
  username: z
    .string({
      message: "Username must be a string",
    })
    .min(1, {
      message: "Username must be at least 1 character long",
    })
    .max(20, {
      message: "Username must be less than 20 characters long",
    }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  bio: z
    .string({
      message: "Bio must be a string",
    })
    .max(100, {
      message: "Bio must be less than 100 characters long",
    }),
  phone: z.string().regex(phoneRegex, {
    message: "Invalid phone number",
  }),
});
