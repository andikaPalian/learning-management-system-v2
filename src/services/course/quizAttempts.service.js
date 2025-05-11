import { PrismaClient } from "@prisma/client";
import { AppError } from "../../utils/errorHandler.js";

const prisma = new PrismaClient();

export const startQuizAttempts = async (quizId, userId) => {
    try {
        const quiz = await prisma.quiz.findUnique({
            where: {
                id: quizId
            },
            include: {
                content: {
                    include: {
                        module: {
                            select: {
                                courseId: true
                            }
                        }
                    }
                }
            }
        });
        if (!quiz) {
            throw new AppError("Quiz not found", 404);
        }

        const courseId = quiz.content.module.courseId;

        const enrollment = await prisma.enrollment.findFirst({
            where: {
                userId: userId,
                courseId: courseId,
                status: "ACTIVE"
            }
        });
        if (!enrollment) {
            throw new AppError("You are not enrolled in this course", 403);
        }

        const expiresAt = quiz.timeLimit ? new Date(Date.now() + quiz.timeLimit * 60000) : null;

        const attemptCount = await prisma.quizAttempt.count({
            where: {
                quizId: quizId,
                userId: userId
            }
        });

        if (attemptCount >= quiz.maxAttempts) {
            throw new AppError("Maximum attempts reached", 404);
        }

        // if (attemptCount > quiz.maxAttempts) {
        //     await prisma.quizAttempt.update({
        //         where: {
        //             quizId: quizId,
        //             userId: userId
        //         },
        //         data: {
        //             status: "COMPLETED"
        //         }
        //     })
        // }

        const attempt = await prisma.quizAttempt.create({
            data: {
                quizId: quizId,
                userId: userId,
                status: "IN_PROGRESS",
                expiresAt: expiresAt
            }
        });

        return attempt;
    } catch (error) {
        throw new AppError(`Failed to start quiz attempts ${error.message}`, 500);
    }
};

export const completeQuizAttempts = async (quizId, userId) => {
    try {
        const quiz = await prisma.quiz.findUnique({
            where: {
                id: quizId
            },
            include: {
                content: {
                    include: {
                        module: {
                            select: {
                                courseId: true
                            }
                        }
                    }
                }
            }
        });
        if (!quiz) {
            throw new AppError("Quiz not found", 404);
        }

        const courseId = quiz.content.module.courseId;

        const enrollment = await prisma.enrollment.findFirst({
            where: {
                userId: userId,
                courseId: courseId,
                status: "ACTIVE"
            }
        });
        if (!enrollment) {
            throw new AppError("You are not enrolled in this course", 403);
        }

        const attempts = await prisma.quizAttempt.findFirst({
            where: {
                quizId: quizId,
                userId: userId,
                status: "IN_PROGRESS"
            }
        });
        if (!attempts) {
            throw new AppError("Attempts not found", 404);
        }

        if (attempts.userId !== userId) {
            throw new AppError("Unauthorized: only the user can edit their profile", 403);
        }

        if (attempts.status !== "IN_PROGRESS") {
            throw new AppError("Quiz is not in progress", 400);
        }

        // Cek jika expired
        if (attempts.expiresAt && new Date() > attempts.expiresAt) {
            throw new AppError("Quiz has expired", 400);
        }

        const completeAttempts = await prisma.quizAttempt.update({
            where: {
                id: attempts.id
            },
            data: {
                status: "COMPLETED",
                completedAt: new Date()
            }
        });

        return completeAttempts;
    } catch (error) {
        
    }
}

export const getQuizAttempts = async (quizId, userId) => {
    try {
        const quiz = await prisma.quiz.findUnique({
            where: {
                id: quizId
            },
            include: {
                content: {
                    include: {
                        module: {
                            select: {
                                courseId: true
                            }
                        }
                    }
                }
            }
        });
        if (!quiz) {
            throw new AppError("Quiz not found", 404);
        }

        const courseId = quiz.content.module.courseId;

        const enrollment = await prisma.enrollment.findFirst({
            where: {
                courseId: courseId,
                userId: userId,
                status: "ACTIVE"
            }
        });
        if (!enrollment) {
            throw new AppError("You are not enrolled in this course", 403);
        }

        const attempts = await prisma.quizAttempt.findMany({
            where: {
                quizId: quizId,
                userId: userId
            },
            include: {
                user: {
                    select: {
                        avatar: true,
                        username: true
                    }
                }
            }
        });

        // Tandai attempts yang expired
        const now = new Date();
        for (const attempt of attempts) {
            if (attempt.status === "IN_PROGRESS" && attempt.expiresAt && now > new Date(attempt.expiresAt)) {
                await prisma.quizAttempt.update({
                    where: {
                        id: attempt.id
                    },
                    data: {
                        status: "EXPIRED"
                    }
                });
                // Update lokal agar dikembalikan ke client
                attempt.status = "EXPIRED";
            }
        }
        
        return attempts;
    } catch (error) {
        throw new AppError(`Failed to get quiz attempts ${error.message}`, 500);
    }
};

export const getAllUserAttempts = async (quizId, userId, instructorId) => {
    try {
        const quiz = await prisma.quiz.findUnique({
            where: {
                id: quizId
            }
        });
        if (!quiz) {
            throw new AppError("Quiz not found", 404);
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            throw new AppError("User not found", 404);
        }

        const instructor = await prisma.user.findUnique({
            where: {
                id: instructorId,
                role: "INSTRUCTOR"
            }
        });
        if (!instructor) {
            throw new AppError("Intructor not found", 404);
        }

        const attempts = await prisma.quizAttempt.findMany({
            where: {
                quizId: quizId,
                userId: userId
            },
            select: {
                user: {
                    select: {
                        avatar: true,
                        username: true
                    }
                },
                status: true,
                startedAt: true,
                completedAt: true
            }
        });

        return attempts;
    } catch (error) {
        throw new AppError(`Failed to get quiz attempts ${error.message}`, 500);
    }
};

export const getAllAttempts = async (quizId, instructorId) => {
    try {
        const quiz = await prisma.quiz.findUnique({
            where: {
                id: quizId
            }
        });
        if (!quiz) {
            throw new AppError("Quiz not found", 404);
        }

        const instructor = await prisma.user.findUnique({
            where: {
                id: instructorId,
                role: "INSTRUCTOR"
            }
        });
        if (!instructor) {
            throw new AppError("Instructor not found", 404);
        }

        const attempts = await prisma.quizAttempt.findMany({
            where: {
                quizId: quizId
            },
            include: {
                user: {
                    select: {
                        avatar: true,
                        username: true
                    }
                }
            }
        });

        return attempts;
    } catch (error) {
        throw new AppError(`Failed to get quiz attempts ${error.message}`, 500);
    }
};