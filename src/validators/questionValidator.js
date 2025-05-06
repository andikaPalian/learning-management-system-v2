import {z} from "zod";

export const questionSchema = z.object({
    questionText: z.string({
        invalid_type_error: "Question text must be a string",
        required_error: "Question text is required"
    }).min(1, {
        message: "Question text must be at least 1 character long"
    }),
    questionType: z.enum(["MULTIPLE_CHOICE", "SINGLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER", "ESSAY"], {
        invalid_type_error: "Question type must be one of these values: MULTIPLE_CHOICE, SINGLE_CHOICE, TRUE_FALSE, SHORT_ANSWER, ESSAY",
        required_error: "Question type is required"
    }),
    options: z.any().optional(),
    correctAnswer: z.any(),
    points: z.number().int().min(1, {
        message: "Points must be at least 1"
    }).default(1)
});

export const updateQuestionSchema = questionSchema.partial();