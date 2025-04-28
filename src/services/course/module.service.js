import { PrismaClient } from "@prisma/client";
import { AppError } from "../../utils/errorHandler.js";

const prisma = new PrismaClient();

export const createModule = async (instructorId, courseId, {title, description}) => {
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

        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
                // instructorId: instructorId
            }
        });
        if (!course) {
            throw new AppError("Course not found", 404);
        }

        if (course.instructorId !== instructorId) {
            throw new AppError("Unauthorized: You are not the instructor of this course", 403);
        }

        const lastModule = await prisma.module.findFirst({
            where: {
                courseId: courseId
            },
            orderBy: {
                createdAt: "desc"
            },
            select: {
                order: true
            }
        });

        const newOrder = lastModule ? lastModule.order + 1 : 1;

        const newModule = await prisma.module.create({
            data: {
                title,
                description,
                order: newOrder,
                courseId: courseId
            }
        });

        return newModule;
    } catch (error) {
        throw new AppError(`Failed to create module: ${error.message}`, 500);
    }
};

export const updateModule = async (instructorId, moduleId, courseId, data) => {
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

        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            }
        });
        if (!course) {
            throw new AppError("Course not found", 404)
        }

        if (course.instructorId !== instructorId) {
            throw new AppError("Unauthorized: You are not the instructor of this course", 403);
        }

        const existingModule = await prisma.module.findUnique({
            where: {
                id: moduleId,
                courseId: courseId
            }
        });
        if (!existingModule) {
            throw new AppError("Module not found", 404);
        }

        // Jika ada perubahan pada urutan/order, pastikan urutan baru tidak sama dengan modul lain
        if (data.order && data.order !== existingModule.order) {
            const targetOrder = data.order;
            const currentOrder = existingModule.order;

            // Update order module lain
            if (targetOrder > currentOrder) {
                // Kalau module mau di pindahkan ke urutan yang lebih tinggi/besar
                await prisma.module.updateMany({
                    where: {
                        courseId: courseId,
                        order: {
                            gte: currentOrder,
                            lte: targetOrder
                        }
                    },
                    data: {
                        order: {
                            decrement: 1
                        }
                    }
                });
            } else {
                // Kalau module mau di pindahkan ke urutan yang lebih rendah/kecil
                await prisma.module.updateMany({
                    where: {
                        courseId: courseId,
                        order: {
                            gte: targetOrder,
                            lte: currentOrder
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

        // Update data module
        const updatedModule = await prisma.module.update({
            where: {
                id: moduleId,
                courseId: courseId
            },
            data: {
                ...data
            }
        });
        
        return updatedModule;
    } catch (error) {
        throw new AppError(`Failed to update module: ${error.message}`, 500);
    }
};

export const deleteModule = async (instructorId, moduleId, courseId) => {
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

        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            }
        });
        if (!course) {
            throw new AppError("Course not found", 404);
        }

        if (course.instructorId !== instructorId) {
            throw new AppError("Unauthorized: You are not the instructor of this course", 403);
        }

        const module = await prisma.module.findUnique({
            where: {
                id: moduleId,
                courseId: courseId
            }
        });
        if (!module) {
            throw new AppError("Module not found", 404);
        }

        await prisma.module.delete({
            where: {
                id: moduleId,
                courseId: courseId
            }
        });

        // Geser semua module yang lebih besar dari urutan module yang dihapus
        await prisma.module.updateMany({
            where: {
                courseId: courseId,
                order: {
                    gt: module.order
                }
            },
            data: {
                order: {
                    decrement: 1 // Kurangi 1
                }
            }
        });
    } catch (error) {
        throw new AppError(`Failed to delete module: ${error.message}`, 500);
    }
};

export const listModules = async (courseId, {page = 1, limit = 10}) => {
    try {
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            }
        });
        if (!course) {
            throw new AppError("Course not found", 404);
        }

        const modules = await prisma.module.findMany({
            where: {
                courseId: courseId
            },
            skip,
            take: limitNum,
            orderBy: {
                order: "asc"
            },
            select: {
                id: true,
                title: true,
                description: true,
                order: true,
                course: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });

        const total = await prisma.module.count({
            where: {
                courseId: courseId
            }
        });

        return {
            modules: {
                modules,
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalItems: total
            }
        }
    } catch (error) {
        throw new AppError(`Failed to list modules: ${error.message}`, 500);
    }
};

export const getModuleById = async (moduleId, courseId) => {
    try {
        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            }
        });
        if (!course) {
            throw new AppError("Course not found", 404);
        }

        const module = await prisma.module.findUnique({
            where: {
                id: moduleId,
                courseId: courseId
            },
            select: {
                id: true,
                title: true,
                description: true,
                order: true,
                course: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });
        if (!module) {
            throw new AppError("Module not found", 404);
        }

        return module;
    } catch (error) {
        throw new AppError(`Failed to get module: ${error.message}`, 500);
    }
};

export const publishModule = async (adminId, moduleId, courseId) => {
    try {
        const admin = await prisma.user.findUnique({
            where: {
                id: adminId,
                role: "ADMIN"
            }
        });
        if (!admin) {
            throw new AppError("Admin not found", 404);
        }

        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            }
        });
        if (!course) {
            throw new AppError("Course not found", 404);
        }

        const module = await prisma.module.findUnique({
            where: {
                id: moduleId,
                courseId: courseId
            }
        });
        if (!module) {
            throw new AppError("Module not found", 404);
        }

        if (module.isPublished) {
            throw new AppError("Module already published", 400);
        }

        await prisma.module.update({
            where: {
                id: moduleId,
                courseId: courseId
            },
            data: {
                isPublished: true
            }
        });
    } catch (error) {
        throw new AppError(`Failed to publish module: ${error.message}`, 500);
    }
};