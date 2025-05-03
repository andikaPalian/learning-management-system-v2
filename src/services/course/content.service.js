import { PrismaClient } from "@prisma/client";
import { AppError } from "../../utils/errorHandler.js";
import {v2 as cloudinary} from "cloudinary";
import fs from "fs/promises";

const prisma = new PrismaClient();

export const createContent = async (instructorId, moduleId, {title, type, contentData, duration}, file) => {
    try {
        const instructor = await prisma.user.findUnique({
            where: {
                id: instructorId,
                role: "INSTRUCTOR"
            }
        });
        if (!instructor) {
            throw new AppError("Instructor not found", 404);
        }

        const module = await prisma.module.findUnique({
            where: {
                id: moduleId
            },
            include: {
                course: true
            }
        });
        if (!module) {
            throw new AppError("Module not found", 404);
        }

        if (module.course.instructorId !== instructorId) {
            throw new AppError("Unauthorized: You are not the instructor of this module", 403);
        }

        const lastContent = await prisma.content.findFirst({
            where: {
                moduleId: moduleId
            },
            orderBy: {
                order: "desc"
            },
            select: {
                order: true
            }
        });

        const newOrder = lastContent ? lastContent.order + 1 : 1;

        const parsedDuration = duration === null || duration === undefined || duration === "" ? null : Number.isInteger(duration) ? duration : parseInt(duration, 10);

        let finalContentData;
        let contentDataPublicId;

        if (type === "TEXT") {
            if (!contentData) {
                throw new AppError("Content data is required for text content", 400)
            }
            finalContentData = contentData;
        } else if (["VIDEO", "AUDIO", "DOCUMENT"].includes(type)) {
            // Require duration for the video or audio content/time-based media
            if ((type === "VIDEO" || type === "AUDIO") && (!duration || isNaN(Number(duration)))) {
                throw new AppError("Duration is required for video or audio content", 400);
            }

            if (!file || !file.path) {
                throw new AppError(`File is required for ${type} content type`, 400);
            }

            // process file upload
            const result = await cloudinary.uploader.upload(file.path, {
                resource_type: type.toLowerCase(),
                use_filename: true,
                unique_filename: true
            });

            finalContentData = result.secure_url;
            contentDataPublicId = result.public_id;

            await fs.unlink(file.path);
        } else if (["QUIZ", "ASSIGNMENT", "PRESENTATION", "LINK"].includes(type)) {
            if (!contentData) {
                throw new AppError(`Content data is required for ${type} content type`, 400);
            }
            finalContentData = typeof contentData === "object" ? JSON.stringify(contentData) : contentData;
        } else {
            throw new AppError(`Invalid content type: ${type}`, 400)
        }

        // if (file && file.path) {
        //     const result = await cloudinary.uploader.upload(file.path, {
        //         use_filename: true,
        //         unique_filename: true
        //     });

        //     finalContentData = result.secure_url;
        //     contentDataPublicId = result.public_id;

        //     await fs.unlink(file.path);
        // } else {
        //     if (!contentData) {
        //         throw new AppError("Content data is required if no file is uploaded", 400);
        //     }

        //     finalContentData = typeof contentData === "object" ? JSON.stringify(contentData) : contentData;
        // }

        const newContent = await prisma.content.create({
            data: {
                title,
                type,
                contentData: finalContentData,
                contentDataPublicId: contentDataPublicId || null,
                duration: parsedDuration,
                order: newOrder,
                moduleId: moduleId,
                authorId: instructorId,
                isPublished: false
            }
        });

        return newContent;
    } catch (error) {
        throw new AppError(`Failed to create content: ${error.message}`, 500);
    }
};

export const updateContent = async (instructorId, contentId, moduleId, data, file) => {
    try {
        const instructor = await prisma.user.findUnique({
            where: {
                id: instructorId,
                role: "INSTRUCTOR"
            }
        });
        if (!instructor) {
            throw new AppError("Instructor not found", 404);
        }

        const module = await prisma.module.findUnique({
            where: {
                id: moduleId
            },
            include: {
                course: true
            }
        });
        if (!module) {
            throw new AppError("Module not found", 404);
        }

        if (module.course.instructorId !== instructorId) {
            throw new AppError("Unauthorized: You are not the instructor of this module", 403);
        }

        const content = await prisma.content.findUnique({
            where: {
                id: contentId
            }
        });
        if (!content) {
            throw new AppError("Content not found", 404);
        }

        if (content.moduleId !== moduleId) {
            throw new AppError("Unauthorized: This content does not belong to this module", 403);
        }

        // Jika ada perubahan pada urutan/order, pastikan urutan baru tidak sama dengan content lain
        if (data.order && data.order !== content.order) {
            const targetOrderContent = data.order;
            const currentOrderContent = content.order;

            // Update order content lain
            if (targetOrderContent > currentOrderContent) {
                // Kalau content lain dipindahkan ke urutan yang lebih tinggi/besar
                await prisma.content.updateMany({
                    where: {
                        moduleId: moduleId,
                        order: {
                            gte: currentOrderContent,
                            lte: targetOrderContent
                        }
                    },
                    data: {
                        order: {
                            decrement: 1
                        }
                    }
                });
            } else {
                // Kalau content lain dipindahkan ke urutan yang lebih rendah/kecil
                await prisma.content.updateMany({
                    where: {
                        moduleId: moduleId,
                        order: {
                            gte: targetOrderContent,
                            lte: currentOrderContent
                        }
                    },
                    data: {
                        order: {
                            increment: 1
                        }
                    }
                });
            }
        }

        let contentData = content.contentData;
        let contentDataPublicId = content.contentDataPublicId;

        if (file?.path) {
            if (content.contentDataPublicId) {
                await cloudinary.uploader.destroy(content.contentDataPublicId)
            }

            const result = await cloudinary.uploader.upload(file.path, {
                use_filename: true,
                unique_filename: true
            });

            contentData = result.secure_url;
            contentDataPublicId = result.public_id;

            await fs.unlink(file.path);
        } else if (typeof contentData === "string") {
            contentData = contentData

            if (content.contentDataPublicId) {
                await cloudinary.uploader.destroy(content.contentDataPublicId);
                contentDataPublicId = null;
            }
        }

        const updateDataContent = {
            ...data,
            contentData,
            contentDataPublicId
        };

        const updatedContent = await prisma.content.update({
            where: {
                id: contentId
            },
            data: updateDataContent,
            select: {
                id: true,
                title: true,
                type: true,
                contentData: true,
                duration: true,
                order: true,
                moduleId: true
            }
        });

        return updatedContent;
    } catch (error) {
        throw new AppError(`Failed to update content: ${error.message}`, 500);
    }
};

export const deleteContent = async (instructorId, contentId, moduleId) => {
    try {
        const instructor = await prisma.user.findUnique({
            where: {
                id: instructorId,
                role: "INSTRUCTOR"
            }
        });
        if (!instructor) {
            throw new AppError("Instructor not found", 404);
        }

        const module = await prisma.module.findUnique({
            where: {
                id: moduleId
            },
            include: {
                course: true
            }
        });
        if (!module) {
            throw new AppError("Module not found", 404);
        }

        if (module.course.instructorId !== instructorId) {
            throw new AppError("Unauthorized: You are not the instructor of this module", 403);
        }

        const content = await prisma.content.findUnique({
            where: {
                id: contentId
            }
        });
        if (!content) {
            throw new AppError("Content not found", 404);
        }

        if (content.moduleId !== moduleId) {
            throw new AppError("Unauthorized: This content does not belong to this module", 403);
        }

        await prisma.content.delete({
            where: {
                id: contentId,
                moduleId: moduleId
            }
        });

        // Geser semua content yang ada di bawah content yang dihapus
        await prisma.content.updateMany({
            where: {
                moduleId: moduleId,
                order: {
                    gt: content.order
                }
            },
            data: {
                order: {
                    decrement: 1
                }
            }
        });
    } catch (error) {
        throw new AppError(`Failed to delete content: ${error.message}`, 500);
    }
};

export const listContent = async (moduleId, {page = 1, limit = 10}) => {
    try {
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const module = await prisma.module.findUnique({
            where: {
                id: moduleId
            }
        });
        if (!module) {
            throw new AppError("Module not found", 404);
        }

        const contents = await prisma.content.findMany({
            where: {
                moduleId: moduleId
            },
            skip,
            take: limitNum,
            orderBy: {
                order: "asc"
            },
            select: {
                id: true,
                title: true,
                type: true,
                order: true,
                module: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });

        const total = await prisma.content.count({
            where: {
                moduleId: moduleId
            }
        });

        return {
            contents: {
                contents,
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totaltems: total
            }
        };
    } catch (error) {
        throw new AppError(`Failed to list contents: ${error.message}`, 500);
    }
};

export const getContentById = async (moduleId, contentId) => {
    try {
        const module = await prisma.module.findUnique({
            where: {
                id: moduleId
            }
        });
        if (!module) {
            throw new AppError("Module not found", 404);
        }

        const content = await prisma.content.findUnique({
            where: {
                id: contentId
            },
            select: {
                id: true,
                title: true,
                type: true,
                order: true,
                module: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });
        if (!content) {
            throw new AppError("Content not found", 404);
        }

        return content;
    } catch (error) {
        throw new AppError(`Failed to get content: ${error.message}`, 500);
    }
};

export const publishContent = async (adminId, moduleId, contentId) => {
    try {
        const admin = await prisma.user.findUnique({
            where: {
                id: adminId,
                role: "ADMIN"
            }
        });
        if (!admin) {
            throw new AppError("Admin not found", 500);
        }

        const module = await prisma.module.findUnique({
            where: {
                id: moduleId
            }
        });
        if (!module) {
            throw new AppError("Module not found", 404);
        }

        const content = await prisma.content.findUnique({
            where: {
                id: contentId
            }
        });
        if (!content) {
            throw new AppError("Content not found", 404);
        }

        if (content.isPublished) {
            throw new AppError("Content already published", 400);
        }

        await prisma.content.update({
            where: {
                id: contentId,
                moduleId: moduleId
            },
            data: {
                isPublished: true
            }
        });
    } catch (error) {
        throw new AppError(`Failed to publish content: ${error.message}`, 500);
    }
};