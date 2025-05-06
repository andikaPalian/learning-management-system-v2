import { PrismaClient } from "@prisma/client";
import { AppError } from "../../utils/errorHandler.js";

const prisma = new PrismaClient();

// Helper function to validate question data
function validateQuestionData(questionType, options, correctAnswer) {
    // Validate based on option type
    switch (questionType) {
        case "MULTIPLE_CHOICE":
        case "SINGLE_CHOICE":
            // Options must be an array for multiple/single choice questions
            if (!Array.isArray(options) || options.length < 2) {
                throw new AppError("Multiple/single choice question must have at least 2 options", 400);
            }

            // Validate correct Answer for multiple choice
            if (questionType === "SINGLE_CHOICE" && (typeof correctAnswer !== 'string' || !options.some(option => option.id === correctAnswer))) {
                throw new AppError("Correct answer must match one of the option IDs", 400);
            }

            if (questionType === "MULTIPLE_CHOICE") {
                if (!Array.isArray(correctAnswer) || correctAnswer.length === 0) {
                    throw new AppError("Multiple choice question must have at least 1 correct answer", 400);
                }

                // All correct answers must be valid option IDs
                const optionsIds = options.map(option => option.id.toString());
                const invalidAnswers = correctAnswer.filter(answer => !optionsIds.includes(answer.toString()));
                if (invalidAnswers.length > 0) {
                    throw new AppError("Some correct answer do not match any option ID", 400);
                }
            }
            break;
        case "TRUE_FALSE":
            // For true false, correct answer must be a boolean
            if (correctAnswer !== "true" && correctAnswer !== "false") {
                throw new AppError("Correct answwer for TRUE/FAlSE options must be true or false", 400);
            }
            break;
        case "SHORT_ANSWER":
        case "ESSAY":
            // For open-ended questions, options should be null
            if (options && options.length > 0) {
                throw new AppError(`${questionType} questions should not have options`, 400);
            }

            // Correct answer is optional for ESSAY (since they may be graded manually)
            if (questionType === "SHORT_ANSWER" && (!correctAnswer || typeof correctAnswer !== "string")) {
                throw new AppError("SHORT_ANSWER questions must have a correct answer string", 400);
            }
            break;
        default:
            throw new AppError(`Invalid question type: ${questionType}`, 400);
    }
}

// Helper function to format options based on question type
function formateOptions(questionType, options) {
    switch (questionType) {
        case "MULTIPLE_CHOICE":
        case "SINGLE_CHOICE":
            // Ensure each option has an Id and text properties
            return options.map((option, index) => ({
                id: option.id || index + 1,
                text: option.text
            }));
        case "TRUE_FALSE":
            // Standard true/false options
            return [
                {id: 1, text: "true"},
                {id: 2, text: "false"}
            ];
        case "SHORT_ANSWER":
        case "ESSAY":
            return null;
        default:
            return null;
    }
}

// Helper function to format correct answer based on question type
function formatCorrectAnswer(questionType, correctAnswer) {
    switch (questionType) {
        case "MULTIPLE_CHOICE":
            // Convert array to JSON string if needed
            return Array.isArray(correctAnswer) ? JSON.stringify(correctAnswer) : correctAnswer;
        case "SINGLE_CHOICE":
        case "TRUE_FALSE":
        case "SHORT_ANSWER":
            // Sinmple string answer
            return correctAnswer.toString();
        case "ESSAY":
            // For Essay, could be rubric or expected keywords or null
            return correctAnswer || "";
        default:
            return correctAnswer;
    }
}

export const createQuestion = async (instructorId, quizId, {questionText, questionType, options, correctAnswer, points}) => {
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

        const quiz = await prisma.quiz.findUnique({
            where: {
                id: quizId
            }
        });
        if (!quiz) {
            throw new AppError("Quiz not found", 404);
        }

        const lasrQuestion = await prisma.question.findFirst({
            where: {
                quizId: quizId
            },
            orderBy: {
                createdAt: "desc"
            },
            select: {
                order: true
            }
        });

        const newOrder = lasrQuestion ? lasrQuestion.order + 1 : 1;

        // Validate and format based on question type
        validateQuestionData(questionType, options, correctAnswer);

        // Format options and correctAnswer based on question Type
        const formattedOptions = formateOptions(questionType, options);
        const formattedCOrrectAnswer = formatCorrectAnswer(questionType, correctAnswer);

        const newQuestion = await prisma.question.create({
            data: {
                quizId: quizId,
                questionText,
                questiontype: questionType,
                options: formattedOptions,
                correctAnswer: formattedCOrrectAnswer,
                points,
                order: newOrder
            }
        });

        return newQuestion;
    } catch (error) {
        throw new AppError(`Failed to create question: ${error.message}`, 500);
    }
};

export const updateQuestion = async (instructorId, quizId, questionId, data) => {
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

        const quiz = await prisma.quiz.findUnique({
            where: {
                id: quizId
            }
        });
        if (!quiz) {
            throw new AppError("Quiz not found", 404);
        }

        const question = await prisma.question.findUnique({
            where: {
                id: questionId,
                quizId: quizId
            },
            include: {
                quiz: true
            }
        });
        if (!question) {
            throw new AppError("Question not found", 404);
        }

        if (question.quiz.id !== quizId) {
            throw new AppError("This question does not belong to this quiz", 400);
        }

        // Jika ada perubahan pada urutan/order, pastikan urutan baru tidak sama dengan question lain
        if (data.order && data.order !== question.order) {
            const targetOrder = data.order;
            const currentOrder = question.order;

            // Update order module lain
            if (targetOrder > currentOrder) {
                // Kalau question mau dipindahkan ke urutan yang lebih tinggi/besar
                await prisma.question.updateMany({
                    where: {
                        quizId: quizId,
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
                // Kalau question mau di pindahkan ke urutan yang lebih rendah/kecil
                await prisma.question.updateMany({
                    where: {
                        quizId: quizId,
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

        const finalQuestionType = data.questiontype ?? question.questiontype;
        const finalOptions = data.options ?? question.options;
        const finalCorrectAnswer = data.correctAnswer ?? question.correctAnswer;

        if (data.questionType || data.options || data.correctAnswer) {
            validateQuestionData(finalQuestionType, finalOptions, finalCorrectAnswer);

            data.options = formateOptions(finalQuestionType, finalOptions);
            data.correctAnswer = formatCorrectAnswer(finalQuestionType, finalCorrectAnswer)
        }

        const updateData = {
            questionText: data.questionText ?? question.questionText,
            questiontype: data.questiontype ?? question.questiontype,
            options: data.options ?? question.options,
            correctAnswer: data.correctAnswer ?? question.correctAnswer,
            points: data.points ?? question.points,
            order: data.order ?? question.order
        }

        const updatedQuestion = await prisma.question.update({
            where: {
                id: questionId
            },
            data: updateData
        });

        return updatedQuestion;
    } catch (error) {
        throw new AppError(`Failed to update question: ${error.message}`, 500);
    }
};

export const deleteQuestion = async (instructorId, quizId, questionId) => {
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

        const quiz = await prisma.quiz.findUnique({
            where: {
                id: quizId
            }
        });
        if (!quiz) {
            throw new AppError("Quiz not found", 404);
        }

        const question = await prisma.question.findUnique({
            where: {
                id: questionId
            },
            include: {
                quiz: true
            }
        });
        if (!question) {
            throw new AppError("Question not found", 404);
        }

        if (question.quiz.id !== quizId) {
            throw new AppError("This question does not belong to this quiz", 400);
        }

        await prisma.question.delete({
            where: {
                id: questionId
            }
        });

        // Geser semua question yang lebih besa dari urutan question yang dihapus
        await prisma.question.updateMany({
            where: {
                quizId: quizId,
                order: {
                    gt: question.order
                }
            },
            data: {
                order: {
                    decrement: 1
                }
            }
        });
    } catch (error) {
        throw new AppError(`Failed to delete question: ${error.message}`, 500);
    }
};

export const listQuestion = async (quizId, {page = 1, limit = 10}) => {
    try {
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const quiz = await prisma.quiz.findUnique({
            where: {
                id: quizId
            }
        });
        if (!quiz) {
            throw new AppError("Quiz not found", 404);
        }

        const questions = await prisma.question.findMany({
            where: {
                quizId: quizId
            },
            skip,
            take: limitNum,
            orderBy: {
                order: "asc"
            },
            select: {
                id: true,
                questionText: true,
                questiontype: true,
                options: true,
                // correctAnswer: true,
                points: true,
                order: true
            }
        });

        const total = await prisma.question.count({
            where: {
                quizId: quizId
            }
        });

        return {
            questions: {
                questions,
                totalItems: total,
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
            }
        };
    } catch (error) {
        throw new AppError(`Failed to list questions: ${error.message}`, 500);
    }
};

export const getQuestionById = async (quizId, questionId) => {
    try {
        const quiz = await prisma.quiz.findUnique({
            where: {
                id: quizId
            }
        });
        if (!quiz) {
            throw new AppError("Quiz not found", 404);
        }

        const question = await prisma.question.findUnique({
            where: {
                id: questionId,
                quizId: quizId
            },
            select: {
                id: true,
                questionText: true,
                questiontype: true,
                options: true,
                // correctAnswer: true,
                points: true,
                order: true
            }
        });
        if (!question) {
            throw new AppError("Question not found", 404);
        }

        return question;
    } catch (error) {
        throw new AppError(`Failed to get question: ${error.message}`, 500);
    }
};