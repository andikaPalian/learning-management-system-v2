import { PrismaClient } from "@prisma/client";
import { AppError } from "../../utils/errorHandler.js";

const prisma = new PrismaClient();

const parseAnswer = (answer) => {
    try {
        return JSON.parse(answer);
    } catch (error) {
        return answer;
    }
};

const arrayEqualIgnoreOrder = (a, b) => {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    return a.sort().join(",") === b.sort().join(",");
};

export const submitAnswer = async (questionId, attemptId, userId, {answerText}) => {
    try {
        const question = await prisma.question.findUnique({
            where: {
                id: questionId
            }
        });
        if (!question) {
            throw new AppError("Question not found", 404);
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

        const attempt = await prisma.quizAttempt.findFirst({
            where: {
                id: attemptId,
                userId: userId
            },
            include: {
                quiz: true
            }
        });
        if (!attempt) {
            throw new AppError("Attempt not found", 404);
        }

        let isCorrect = null;
        let points = null;

        const answer = parseAnswer(answerText);
        const correctAnswer = parseAnswer(question.correctAnswer);

        switch (question.questiontype) {
            case "MULTIPLE_CHOICE":
                isCorrect = Array.isArray(answer) && arrayEqualIgnoreOrder(answer, correctAnswer);
                break;
            case "SINGLE_CHOICE":
            case "TRUE_FALSE":
                isCorrect = answer === correctAnswer;
                break;
            case "SHORT_ANSWER":
                isCorrect = answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
                break;
            case "ESSAY":
                isCorrect = null; // Manual grading
                break;
            default: 
            throw new AppError("Invalid question type", 400);
        }

        if (isCorrect === null) {
            points = isCorrect ? question.points : 0;
        }

        // if (question.correctAnswer !== answerText) {
        //     throw new AppError("Incorrect answer", 400);
        // }

        const savedAnswer = await prisma.answer.upsert({
            where: {
                attemptId_questionId: {
                    attemptId: attemptId,
                    questionId: questionId
                }
            },
            update: {
                answerText: answerText,
                isCorrect: isCorrect,
                points: points
            },
            create: {
                attemptId: attemptId,
                questionId: questionId,
                answerText: answerText,
                isCorrect: isCorrect,
                points: points
            }
        });

        return savedAnswer; 
    } catch (error) {
        throw new AppError(`Failed to submit answer: ${error.message}`, 500);
    }
};

export const getStudentAnswers = async (quizId, userId, instructorId) => {
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

        const user = await prisma.user.findFirst({
            where: {
                id: userId,
                role: "STUDENT"
            }
        });
        if (!user) {
            throw new AppError("User not found", 404);
        }

        const answers = await prisma.answer.findMany({
            where: {
                question: {
                    quizId: quizId
                },
                attempt: {
                    userId: userId
                }
            },
            select: {
                question: {
                    select: {
                        questiontype: true,
                        questionText: true
                    }
                },
                id: true,
                answerText: true,
                isCorrect: true,
                points: true
            }
        });

        return answers;
    } catch (error) {
        throw new AppError(`Failed to get student answers: ${error.message}`, 500);
    }
};