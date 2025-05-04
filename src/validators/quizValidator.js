import {z} from "zod";

export const quizSchema = z.object({
    timeLimit: z.number().int().min(5, {
        message: "Time limit must be at least 5 minutes"
    }).max(120, {
        message: "Time limit must be less than 120 minutes"
    }),
    passingScore: z.number().int().min(0, {
        message: "Passing socre must be at least 0"
    }).max(100, {
        message: "Passing socre must be less than 100"
    }),
    maxAttempts: z.number().int().min(1, {
        message: "Max attempts must be at least 1"
    }).max(10, {
        message: "Max atempts must be less than 10"
    })
});

export const updateQuizSchema = quizSchema.partial();