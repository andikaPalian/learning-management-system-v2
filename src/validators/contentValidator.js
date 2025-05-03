import {z} from "zod";

export const contentSchema = z.object({
    title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string"
    }).min(1, {
        message: "Title must be at least 1 character long"
    }).max(100, {
        message: "Title must be less than 100 characters long"
    }),
    type: z.enum(["VIDEO", "DOCUMENT", "QUIZ", "ASSIGNMENT", "PRESENTATION", "TEXT", "AUDIO", "LINK"], {
        required_error: "Content type is required",
        invalid_type_error: "Content type must be one of these values: VIDEO, DOCUMENT, QUIZ, ASSIGNMENT, PRESENTATION, TEXT, AUDIO, LINK"
    }),
    contentData: z.string({
        required_error: "Content data is required",
        invalid_type_error: "Content data must be a string"
    }).optional(),
    duration: z.preprocess(
        // Mengkonversi nilai ke number atau null
        (val) => {
            if (val === "" || val === null || val === undefined) return null;
            const num = Number(val);
            return isNaN(num) ? null : num;
        },
        z.number().int().positive().nullable().optional()
    )
});

// Schema untuk update content
export const updateContentSchema = contentSchema.partial();

// Validasi khusus untuk tipe boolean
// Dapat digunakan jika ingin validasi yang lebih spesifik per tipe
export const validateContentType = (req, res, next) => {
    const { type } = req.body;
    
    // Skip validation if no type is provided (e.g., partial updates)
    if (!type) {
        return next();
    }
    
    try {
        switch (type) {
            case "TEXT":
                if (!req.body.contentData) {
                    return res.status(400).json({
                        message: "Content data is required for TEXT type"
                    });
                }
                break;
                
            case "VIDEO":
            case "AUDIO":
                if (!req.file && !req.body.contentData) {
                    return res.status(400).json({
                        message: `File is required for ${type} type`
                    });
                }
                
                if (!req.body.duration) {
                    return res.status(400).json({
                        message: `Duration is required for ${type} type`
                    });
                }
                break;
                
            case "DOCUMENT":
                if (!req.file && !req.body.contentData) {
                    return res.status(400).json({
                        message: "File is required for DOCUMENT type"
                    });
                }
                break;
                
            case "QUIZ":
            case "ASSIGNMENT":
            case "PRESENTATION":
                if (!req.body.contentData) {
                    return res.status(400).json({
                        message: `Content data is required for ${type} type`
                    });
                }
                break;
                
            case "LINK":
                if (!req.body.contentData) {
                    return res.status(400).json({
                        message: "URL is required for LINK type"
                    });
                }
                
                // Simple URL validation
                try {
                    new URL(req.body.contentData);
                } catch (e) {
                    return res.status(400).json({
                        message: "Invalid URL format for LINK type"
                    });
                }
                break;
                
            default:
                return res.status(400).json({
                    message: `Invalid content type: ${type}`
                });
        }
        
        next();
    } catch (error) {
        next(error);
    }
};