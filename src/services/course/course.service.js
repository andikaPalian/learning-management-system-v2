import { PrismaClient } from "@prisma/client";
import { AppError } from "../../utils/errorHandler.js";
import slugify from "slugify";
import {v2 as cloudinary} from "cloudinary";
import fs from "fs/promises";
import { skip } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export const createCourse = async (instructorId, {title, description, level, price, duration, isPublished, isApproved}, file) => {
    try {
        const instructor = await prisma.user.findUnique({
            where: {
                id: instructorId
            },
            select: {
                id: true,
                role: true
            }
        });
        if (!instructor || !["INSTRUCTOR", "ADMIN"].includes(instructor.role)) {
            throw new AppError("User is not an instructor or admin", 403);
        }

        if (!title || !description || !level || !price || !duration) {
            throw new AppError("All fields are required", 400);
        }
        
        const slug = slugify(title, {lower: true, strict: true});

        // Pastikan slug unik
        let existingSlug = await prisma.course.findUnique({
            where: {
                slug
            }
        });
        if (existingSlug) {
            slug = `${slug}-${Date.now()}`;
        }

        let thumbnail;
        let thumbnailPublicId;

        if (file?.path) {
            try {
                const result = await cloudinary.uploader.upload(file.path, {
                    use_filename: true,
                    unique_filename: false,
                });
    
                thumbnail = result.secure_url;
                thumbnailPublicId = result.public_id;
    
                await fs.unlink(file.path);
            } catch (error) {
                throw new AppError("Failed to upload thumbnail", 500);
            }
        }

        const course = await prisma.course.create({
            data: {
                title,
                description,
                thumbnail: thumbnail,
                thumbnailPublicId: thumbnailPublicId,
                level,
                price,
                duration,
                instructorId,
                isPublished,
                isApproved,
                slug
            },
            include: {
                instructor: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                }
            }
        });

        return {
            course: {
                id: course.id,
                title: course.title,
                slug: course.slug,
                description: course.description,
                thumbnail: course.thumbnail,
                level: course.level,
                price: course.price,
                duration: course.duration,
                isPublished: course.isPublished,
                isApproved: course.isApproved,
                createdAt: course.createdAt,
                updatedAt: course.updatedAt,
                instructor: {
                    id: course.instructor.id,
                    username: course.instructor.username,
                    firstName: course.instructor.firstName,
                    lastName: course.instructor.lastName,
                    avatar: course.instructor.avatar
                }
            }
        }
    } catch (error) {
        throw new AppError(`Failed to create course: ${error.message}`, 500);
    }
};

export const listCourses = async ({search = "", page = 1, limit = 10}) => {
    try {
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const courses = await prisma.course.findMany({
            where: {
                title: {
                    contains: search,
                    mode: "insensitive"
                }
            },
            skip,
            take: limitNum,
            orderBy: {
                createdAt: "desc"
            },
            include: {
                instructor: {
                    select: {
                        firstName: true,
                        lastName: true,
                        username: true,
                        avatar: true
                    }
                },
                categories: {
                    select: {
                        category: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                modules: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        order: true
                    }
                },
                enrollments: true
            }
        });

        const total = await prisma.course.count({
            where: {
                title: {
                    contains: search,
                    mode: "insensitive"
                }
            }
        });

        return {
            courses: {
                courses,
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalItems: total
            }
        };
    } catch (error) {
        throw new AppError(`Failed to list courses: ${error.message}`, 500)
    }
};

export const getCourseById = async (courseId) => {
    try {
        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            },
            include: {
                instructor: {
                    select: {
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                },
                categories: {
                    select: {
                        category: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                modules: {
                    select: {
                            id: true,
                            title: true,
                            description: true,
                            order: true
                    }
                },
                enrollments: true
            }
        });
        if (!course) {
            throw new AppError("Course not found", 404);
        }

        return course;
    } catch (error) {
        throw new AppError(`Failed to get course: ${error.message}`, 500);
    }
};

export const updateCourse = async (courseId, instructorId, data, file) => {
    try {        
        const existingCourse = await prisma.course.findUnique({
            where: {
                id: courseId
            }
        });
        if (!existingCourse) {
            throw new AppError("Course not found", 404)
        }

        if (existingCourse.instructorId !== instructorId) {
            throw new AppError("Unauthorized: Only the instructor can update the course", 403);
        }

        if (data.title) {
            const newSlug = slugify(data.title, {lower: true, strict: true});

            const existingSlug = await prisma.course.findFirst({
                where: {
                    slug: newSlug,
                    NOT: {
                        id: courseId // Beda ID -> Bukan course yang sedang diedit
                    }
                }
            });

            if (existingSlug) {
                // Buat slug unik
                data.slug = `${newSlug}-${Date.now()}`
            } else {
                data.slug = newSlug
            }
        }

        let thumbnail = existingCourse.thumbnail;
        let thumbnailPublicId = existingCourse.thumbnailPublicId;

        if (file?.path) {
            try {
                if (existingCourse.thumbnailPublicId) {
                    await cloudinary.uploader.destroy(existingCourse.thumbnailPublicId);
                }

                const result = await cloudinary.uploader.upload(file.path, {
                    use_filename: true,
                    unique_filename: true
                });

                thumbnail = result.secure_url;
                thumbnailPublicId = result.public_id;

                await fs.unlink(file.path);
            } catch (error) {
                throw new AppError("Failed to upload thumbnail", 500);
            }
        }

        const updateData = {
            ...data,
            thumbnail,
            thumbnailPublicId
        }

        const updatedCourse = await prisma.course.update({
            where: {
                id: courseId
            },
            data: updateData,
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                thumbnail: true,
                level: true,
                price: true,
                duration: true,
                isPublished: true,
                isApproved: true,
                createdAt: true,
                updatedAt: true,
                instructor: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                }
            }
        });

        return updatedCourse;
    } catch (error) {
        throw new AppError(`Failed to update course: ${error.message}`, 500);
    }
};

export const deleteCourse = async (courseId, instructorId) => {
    try {
        const existingCourse = await prisma.course.findUnique({
            where: {
                id: courseId
            }
        });
        if (!existingCourse) {
            throw new AppError("Course not found", 404);
        }

        if (existingCourse.instructorId !== instructorId) {
            throw new AppError("Unauthorized: Only the instructor can delete the course", 403);
        }

        if (existingCourse.thumbnailPublicId) {
            await cloudinary.uploader.destroy(existingCourse.thumbnailPublicId);
        }

        await prisma.course.delete({
            where: {
                id: courseId
            }
        });
    } catch (error) {
        throw new AppError(`Failed to delete course: ${error.message}`, 500);
    }
};

export const approveCourse = async (courseId, adminId) => {
    try {
        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            }
        });
        if (!course) {
            throw new AppError("Course not found", 404);
        }

        const admin = await prisma.user.findUnique({
            where: {
                id: adminId,
                role: "ADMIN"
            }
        });
        if (!admin) {
            throw new AppError("Unauthorized: Only admin can approve the course", 403);
        }

        if (course.isApproved) {
            throw new AppError("Course is already approved", 400);
        }

        await prisma.course.update({
            where: {
                id: courseId
            },
            data: {
                isApproved: true
            }
        });
    } catch (error) {
        throw new AppError(`Failed to approve course: ${error.message}`, 500);
    }
};

export const publishCourse = async (courseId, instructorId) => {
    try {
        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            }
        });
        if (!course) {
            throw new AppError("Course not found", 404);
        }

        if (course.instructorId !== instructorId) {
            throw new AppError("Unauthorized: Only the instructor can publish the course", 403);
        }

        if (!course.isApproved) {
            throw new AppError("Course is not approved", 400);
        }

        if (course.isPublished) {
            throw new AppError("Course is already published", 400);
        }

        await prisma.course.update({
            where: {
                id: courseId
            },
            data: {
                isPublished: true,
                publishedAt: new Date()
            }
        });
    } catch (error) {
        throw new AppError(`Failed to publish course: ${error.message}`, 500);
    }
};