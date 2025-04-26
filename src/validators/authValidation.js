import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, {
      message: "First name is required",
    })
    .max(20, {
      message: "First name must be less than 20 characters",
    }),
  lastName: z
    .string()
    .min(1, {
      message: "Last name is required",
    })
    .max(20, {
      message: "Last name must be less than 20 characters",
    }),
  username: z
    .string()
    .min(1, {
      message: "Username is required",
    })
    .max(20, {
      message: "Username must be less than 20 characters",
    }),
  gender: z.enum(["MALE", "FEMALE"], {
    message: "Gender must be either MALE or FEMALE",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().regex(passwordRegex, {
    message:
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
  }),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Invalid email address",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .regex(passwordRegex, {
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
});
