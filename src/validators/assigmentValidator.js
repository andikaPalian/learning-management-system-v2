import { z } from "zod";

export const assignmentSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .min(1, {
      message: "Title must be at least 1 character long",
    })
    .max(50, {
      message: "Title must be less than 50 characters long",
    }),
  description: z
    .string({
      invalid_type_error: "Description must be a string",
    })
    .min(1, {
      message: "Description must be at least 1 character long",
    })
    .max(150, {
      message: "Description must be less than 150 characters long",
    }),
  dueDate: z
    .string({
      required_error: "Due date is required",
      invalid_type_error: "Due date must be a string",
    })
    .datetime({ message: "Due date must be a valid ISO datetime string" })
    .transform((val) => new Date(val))
    .refine((date) => date > new Date(), {
      message: "Due date must be in the future",
    }),
  pointPossible: z
    .number({
      required_error: "Point possible is required",
      invalid_type_error: "Point possible must be a number",
    })
    .min(0, {
      message: "Point possible must be at least 0",
    }),
  instruction: z
    .string({
      required_error: "Instruction is required",
      invalid_type_error: "Instruction must be a string",
    })
    .min(1, {
      message: "Instruction must be at least 1 character long",
    })
    .max(1000, {
      message: "Instruction must be less than 1000 characters long",
    }),
  attachment: z
    .array(
      z.string().url({
        message: "Each attachment must be a valid URL",
      })
    )
    .optional()
    .nullable(),
});

export const updateAssigmentSchema = assignmentSchema.partial();
