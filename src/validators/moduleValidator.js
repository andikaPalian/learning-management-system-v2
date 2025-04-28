import {z} from 'zod';

export const moduleSchema = z.object({
    title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string"
    }).min(1, {
        message: "Title must be at least 1 character long"
    }).max(50, {
        message: "Title must be less than 50 characters long"
    }),
    description: z.string({
        required_error: "Description is required",
        invalid_type_error: "Description must be a string"
    }).min(1, {
        message: "Description must be at least 1 character long"
    }).max(150, {
        message: "Description must be less than 150 characters long"
    })
});

export const moduleUpdateSchema = z.object({
    title: z.string({
        invalid_type_error: "Title must be a string"
    }).optional(),
    description: z.string({
        invalid_type_error: "Description must be a string"
    }).optional()
});