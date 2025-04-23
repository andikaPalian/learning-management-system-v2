import { z } from "zod";

export const courseSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .min(1, {
      message: "Title must be at least 1 character long",
    })
    .max(100, {
      message: "Title must be less than 100 characters long",
    }),
  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a string",
    })
    .min(1, {
      message: "Description must be at least 1 character long",
    })
    .max(1000, {
      message: "Description must be less than 1000 characters long",
    }),
  level: z
    .string({
      required_error: "Level is required",
      invalid_type_error: "Level must be a string",
    })
    .min(1, {
      message: "Level must be at least 1 character long",
    })
    .max(100, {
      message: "Level must be less than 100 characters long",
    }),
  price: z.coerce
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive({
      message: "Price must be greater than 0",
    }),
  duration: z.coerce
    .number({
      required_error: "Duration is required",
      invalid_type_error: "Duration must be a number",
    })
    .positive({
      message: "Duration must be greater than 0",
    }),
});
