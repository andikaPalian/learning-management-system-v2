import { PrismaClient } from "@prisma/client";
import { AppError } from "../../utils/errorHandler.js";

const prisma = new PrismaClient();

export const createAssigment = async (courseId, creatorId, {title, description, dueDate, pointPossible, instruction, attachment}) => {
    try {
        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            }
        });
        if (!course) {
            throw new AppError("Course not found", 404);
        }

        const creator = await prisma.user.findFirst({
            where: {
                id: creatorId,
                role: "INSTRUCTOR"
            }
        });
        if (!creator) {
            throw new AppError("Creator not found", 404);
        }

        if (course.instructorId !== creatorId) {
            throw new AppError("Unauthorized: Only the creator can create an assignment", 403);
        }

        const newAssigment = await prisma.assigment.create({
            data: {
                title,
                description,
                dueDate,
                pointPossible,
                instruction,
                attachment,
                courseId,
                creatorId
            }
        });

        return newAssigment;
    } catch (error) {
        throw new AppError(`Failed to create a submission: ${error.message}`, 500);
    }
}

export const getAllAssigments = async (courseId, userId) => {
    try {
        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            },
            include: {
                enrollments: true
            }
        });
        if (!course) {
            throw new AppError("Course not found", 404);
        }

        const user = await prisma.user.findFirst({
            where: {
                id: userId,
                role: "STUDENT"
            }
        });
        if (!user) {
            throw new AppError("User not found", 404);
        }

        if (course.enrollments.some(enrollment => enrollment.userId !== userId)) {
            throw new AppError("Unauthorized: Only enrolled students can view assignments", 403);
        }

        const assigment = await prisma.assigment.findMany({
            where: {
                courseId: courseId
            },
            select: {
                id: true,
                title: true,
                description: true,
                dueDate: true,
                pointPossible: true,
                instruction: true,
                attachment: true,
                creator: {
                    select: {
                        avatar: true,
                        username: true
                    }
                }
            }
        });

        const total = await prisma.assigment.count({
            where: {
                courseId: courseId
            }
        });

        return {
            assigment: assigment,
            totalAssigments: total
        };
    } catch (error) {
        throw new AppError(`Failed to get all assignments: ${error.message}`, 500);
    }
};

export const getAssigmentById = async (assigmentId, courseId, userId) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: userId,
                role: "STUDENT"
            }
        });
        if (!user) {
            throw new AppError("User not found", 404);
        }

        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            },
            include: {
                enrollments: true
            }
        });
        if (!course) {
            throw new AppError("Course not found", 404);
        }

        if (course.enrollments.some(enrollment => enrollment.userId !== userId)) {
            throw new AppError("Unauthorized: Only enrolled students can view assignments", 403);
        }

        const assigment = await prisma.assigment.findUnique({
            where: {
                id: assigmentId
            },
            include: {
                course: {
                    include: {
                        enrollments: true
                    }
                }
            }
        });
        if (!assigment) {
            throw new AppError("Assigment not found", 404);
        }

        if (assigment.course.enrollments.some(enrollment => enrollment.userId !== userId)) {
            throw new AppError("Unauthorized: Only enrolled students can view assignments", 403);
        }

        return assigment;
    } catch (error) {
        throw new AppError(`Failed to get assignment by id: ${error.message}`, 500);
    }
};

export const updateAssigment = async (assigmentId, courseId, creatorId, data) => {
    try {
        const creator = await prisma.user.findFirst({
            where: {
                id: creatorId,
                role: "INSTRUCTOR"
            }
        });
        if (!creator) {
            throw new AppError("Creator not found", 404);
        }

        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            }
        });
        if (!course) {
            throw new AppError("Course not found", 404);
        }

        const assigment = await prisma.assigment.findFirst({
            where: {
                id: assigmentId,
                creatorId: creatorId
            }
        });
        if (!assigment) {
            throw new AppError("Assigment not found", 404);
        }

        if (assigment.creatorId !== creatorId) {
            throw new AppError("Unauthorized: Only the creator can update an assignment", 403);
        }

        const updateDataAssigment = {
            title: data.title,
            description: data.description,
            dueDate: data.dueDate,
            pointPossible: data.pointPossible,
            instruction: data.instruction,
            attachment: data.attachment
        };

        const updatedAssigment = await prisma.assigment.update({
            where: {
                id: assigmentId
            },
            data: updateDataAssigment
        });

        return updatedAssigment;
    } catch (error) {
        throw new AppError(`Failed to update assignment: ${error.message}`, 500);
    }
};

export const deleteAssigment = async (assigmentId, courseId, creatorId) => {
    try {
        const creator = await prisma.user.findFirst({
            where: {
                id: creatorId,
                role: "INSTRUCTOR"
            }
        });
        if (!creator) {
            throw new AppError("Creator not found", 404);
        }

        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            }
        });
        if (!course) {
            throw new AppError("Course not found", 404);
        }

        const assigment = await prisma.assigment.findFirst({
            where: {
                id: assigmentId,
                creatorId: creatorId
            }
        });
        if (!assigment) {
            throw new AppError("Assigment not found", 404);
        }

        if (assigment.creatorId !== creatorId) {
            throw new AppError("Unauthorized: Only the creator can delete an assignment", 403);
        }

        await prisma.assigment.delete({
            where:{
                id: assigmentId
            }
        });
    } catch (error) {
        throw new AppError(`Failed to delete assignment: ${error.message}`, 500);
    }
};

export const publishAssigment = async (assigmentId, courseId, adminId) => {
    try {
        const admin = await prisma.user.findFirst({
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

        const assigment = await prisma.assigment.findFirst({
            where: {
                id: assigmentId,
                courseId: courseId
            }
        });
        if (!assigment) {
            throw new AppError("Assigment not found", 404);
        }

        if (assigment.isPublished) {
            throw new AppError("Assigment is already published", 400);
        }

        await prisma.assigment.update({
            where: {
                id: assigmentId
            },
            data: {
                isPublished: true
            }
        });
    } catch (error) {
        throw new AppError(`Failed to publish assignment: ${error.message}`, 500);
    }
};