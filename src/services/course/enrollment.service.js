import { PrismaClient } from "@prisma/client";
import { AppError } from "../../utils/errorHandler.js";

const prisma = new PrismaClient();

export const joinCourse = async (userId, courseId) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
                role: "STUDENT"
            },
            include: {
                enrollments: true
            }
        });
        if (!user) {
            throw new AppError("User not found", 404);
        }

        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            }
        });
        if (!course) {
            throw new AppError("Course not found", 404);
        }

        if (user.enrollments.some(enrollment => enrollment.courseId === course.id)) {
            throw new AppError("User is already enrolled in the course", 400);
        }

        await prisma.enrollment.create({
            data: {
                userId: userId,
                courseId: courseId,
                status: "PENDING"
            }
        });
    } catch (error) {
        throw new AppError(`Failed to join course: ${error.message}`, 500);
    }
};

export const leaveCourse = async (userId, courseId) => {
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

        const enrollment = await prisma.enrollment.findFirst({
            where: {
                userId: userId,
                courseId: courseId,
                status: "ACTIVE"
            }
        });
        if (!enrollment) {
            throw new AppError("User is not enrolled in the course", 400);
        }

        await prisma.enrollment.update({
            where: {
                id: enrollment.id
            },
            data: {
                status: "DROPPED"
            }
        });
    } catch (error) {
        throw new AppError(`Failed to leave course: ${error.message}`, 500);
    }
};

export const acceptEnrollment = async (instructorId, enrollmentId) => {
    try {
        const instructor = await prisma.user.findFirst({
            where: {
                id: instructorId,
                role: "INSTRUCTOR"
            }
        });
        if (!instructor) {
            throw new AppError("Instructor not found", 404);
        }

        const enrollment = await prisma.enrollment.findFirst({
            where: {
                id: enrollmentId,
                status: "PENDING"
            },
            include: {
                course: true
            }
        });
        if (!enrollment) {
            throw new AppError("Enrollment not found", 404);
        }

        if (enrollment.course.instructorId !== instructorId) {
            throw new AppError("Unauthorized: Only the instructor can accept the enrollment", 403);
        }

        await prisma.enrollment.update({
            where: {
                id: enrollmentId
            },
            data: {
                status: "ACTIVE"
            }
        });
    } catch (error) {
        throw new AppError(`Failed to accept enrollment: ${error.message}`, 500);
    }
};

export const rejectEnrollment = async (instructorId, enrollmentId) => {
    try {
        const instructor = await prisma.user.findFirst({
            where: {
                id: instructorId,
                role: "INSTRUCTOR"
            }
        });
        if (!instructor) {
            throw new AppError("Instructor not found", 404);
        }

        const enrollment = await prisma.enrollment.findFirst({
            where: {
                id: enrollmentId,
                status: "PENDING"
            },
            include: {
                course: true
            }
        });
        if (!enrollment) {
            throw new AppError("Enrollment not found", 404);
        }

        if (enrollment.course.instructorId !== instructorId) {
            throw new AppError("Unauthorized: Only the instructor can reject the enrollment", 403);
        }

        await prisma.enrollment.update({
            where: {
                id: enrollmentId
            },
            data: {
                status: "REJECTED"
            }
        });
    } catch (error) {
        throw new AppError(`Failed to reject enrollment: ${error.message}`, 500);
    }
};

export const kickOutUserFromCourse = async (userId, courseId, instructorId) => {
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

        const enrollment = await prisma.enrollment.findFirst({
            where: {
                userId: userId,
                courseId: courseId,
                status: "ACTIVE"
            },
            include: {
                course: true
            }
        });
        if (!enrollment) {
            throw new AppError("User is not enrolled in the course", 400);
        }

        if (enrollment.course.instructorId !== instructorId) {
            throw new AppError("Unauthorized: Only the instructor can kick out the user from the course", 403);
        }

        await prisma.enrollment.delete({
            where: {
                id: enrollment.id
            }
        });
    } catch (error) {
        throw new AppError(`Failed to kick out user from course: ${error.message}`, 500);
    }
};

export const getAllEnrollments = async (userId, courseId, instructorId) => {
    try {
        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
            }
        });
        if(!course) {
            throw new AppError("Course not found", 404);
        }

        if (course.instructorId !== instructorId) {
            throw new AppError("Unauthorized: Only the instructor can get all enrollments", 403);
        }

        const enrollments = await prisma.enrollment.findMany({
            where: {
                userId: userId,
                courseId: courseId,
                status: {
                    not: "DROPPED"
                }
            },
            select: {
                id: true,
                user: {
                    select: {
                        id: true,
                        avatar: true,
                        username: true
                    }
                },
                status: true,
                course: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                enrollmentDate: true,
                completionDate: true
            }
        });

        return enrollments;
    } catch (error) {
        throw new AppError(`Failed to get all enrollments: ${error.message}`, 500);
    }
};