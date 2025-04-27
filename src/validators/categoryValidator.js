import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(1, {
      message: "Name must be at least 1 character long",
    })
    .max(100, {
      message: "Name must be less than 100 characters long",
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
});

export const updateCategorySchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name must be a string",
    })
    .optional(),
  description: z
    .string({
      invalid_type_error: "Description must be a string",
    })
    .optional(),
});
