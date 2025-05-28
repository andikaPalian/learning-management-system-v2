import { z } from "zod";

export const submissionSchema = z.object({
  content: z
    .string({
      required_error: "Content is required",
      invalid_type_error: "Content must be a string",
    })
    .min(1, {
      message: "Content must be at least 1 character long",
    })
    .max(1000, {
      message: "Content must be less than 1000 characters long",
    }),
  attachment: z
    .array(z.string().url({ message: "Each attachment must be a valid URL" }))
    .optional()
    .nullable(),
});

export const gradingSubmissionSchema = z.object({
  grade: z.number({
    invalid_type_error: "Grade must be a number",
  }),
  feedback: z.string({
    invalid_type_error: "Feedback must be a string",
  }),
});

export const returnSubmissionSchema = z.object({
  feedback: z.string({
    invalid_type_error: "Feedback must be a string",
  }),
});
