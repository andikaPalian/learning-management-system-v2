import { PrismaClient } from "@prisma/client";
import { AppError } from "../../utils/errorHandler.js";

const prisma = new PrismaClient();

export const createQuiz = async (contentId, instructorId, {timeLimit, passingScore, maxAttempts}) => {
    try {
        const content = await prisma.content.findUnique({
            where: {
                id: contentId
            }
        });
        if (!content) {
            throw new AppError("Content not found", 404);
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

        if (passingScore > 100 || passingScore < 0) {
            throw new AppError("Passing score must be between 0 and 100", 400);
        }

        if (maxAttempts < 1) {
            throw new AppError("Max attempts must be greater than 0", 400);
        }

        const newQuiz = await prisma.quiz.create({
            data: {
                contentId: contentId,
                timeLimit,
                passingScore,
                maxAttempts
            }
        });

        return newQuiz;
    } catch (error) {
        throw new AppError(`Failed to create quiz: ${error.message}`, 500);
    }
};

export const updateQuiz = async (contentId, quizId, instructorId, data) => {
    try {
        const content = await prisma.content.findUnique({
            where: {
                id: contentId
            }
        });
        if (!content) {
            throw new AppError("Content not found", 404);
        }

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

        if (quiz.contentId !== contentId) {
            throw new AppError("This quiz does not belong to this content", 400);
        }

        const quizData = {
            timeLimit: data.timeLimit,
            passingScore: data.passingScore,
            maxAttempts: data.maxAttempts
        };

        const updatdeQuiz = await prisma.quiz.update({
            where: {
                id: quizId
            },
            data: {
                ...quizData
            }
        });

        return updatdeQuiz;
    } catch (error) {
        throw new AppError(`Failed to update quiz: ${error.message}`, 500);
    }
};


export const deleteQuiz = async (contentId, quizId, instructorId) => {
    try {
        const content = await prisma.content.findUnique({
            where: {
                id: contentId
            }
        });
        if (!content) {
            throw new AppError("Content not found", 404);
        }

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

        if (quiz.contentId !== contentId) {
            throw new AppError("This quiz does not belong to this content", 400);
        }

        await prisma.quiz.delete({
            where: {
                id: quizId
            }
        });
    } catch (error) {
        throw new AppError(`Failed to delete quiz: ${error.message}`, 500);
    }
};

export const listQuiz = async (contentId, {page = 1, limit = 10}) => {
    try {
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const content = await prisma.content.findUnique({
            where: {
                id: contentId
            }
        });
        if (!content) {
            throw new AppError("Content not found", 404);
        }

        const quizzes = await prisma.quiz.findMany({
            where: {
                contentId: contentId
            },
            skip,
            take: limitNum,
            orderBy: {
                timeLimit: "asc"
            },
            include: {
                content: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });

        const total = await prisma.quiz.count({
            where: {
                contentId: contentId
            }
        });

        return {
            quizzes: {
                quizzes,
                totalItems: total,
                curentPage: pageNum,
                totalPages: Math.ceil(total / limitNum)
            }
        };
    } catch (error) {
        throw new AppError(`Failed to list quizzes: ${error.message}`, 500);
    }
};

export const getQuizById = async (contentId, quizId) => {
    try {
        const content = await prisma.content.findUnique({
            where: {
                id: contentId
            }
        });
        if (!content) {
            throw new AppError("Content not found", 404);
        }

        const quiz = await prisma.quiz.findUnique({
            where: {
                id: quizId
            },
            select: {
                id: true,
                timeLimit: true,
                passingScore: true,
                maxAttempts: true,
                content: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });
        if (!quiz) {
            throw new AppError("Quiz not found", 404);
        }

        if (quiz.content.id !== contentId) {
            throw new AppError("This quiz does not belong to this content", 400);
        }

        return quiz;
    } catch (error) {
        throw new AppError(`Failed to get quiz: ${error.message}`, 500);
    }
};