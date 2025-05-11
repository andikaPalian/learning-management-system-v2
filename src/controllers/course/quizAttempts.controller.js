import { startQuizAttempts, completeQuizAttempts, getQuizAttempts, getAllUserAttempts, getAllAttempts } from "../../services/course/quizAttempts.service.js";

export const startQuizAttemptsController = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const {quizId} = req.params;

        const newAttempt = await startQuizAttempts(quizId, userId);

        return res.status(201).json({
            message: "Attempt started successfully",
            newAttempt
        });
    } catch (error) {
        next(error);
    }
};

export const completeAttemptsController = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const {quizId} = req.params;

        const completeAttempts = await completeQuizAttempts(quizId, userId);

        return res.status(200).json({
            message: "Attempt completed successfully",
            completeAttempts
        });
    } catch (error) {
        next(error);
    }
};

export const getQuizAttemptsController = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const {quizId} = req.params;

        const quizAttempts = await getQuizAttempts(quizId, userId);

        return res.status(200).json({
            message: "Quiz attempts fetched successfully",
            quizAttempts
        });
    } catch (error) {
        next(error);
    }
};

export const getAllUserAttemptsController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {quizId, userId} = req.params;

        const userAttempts = await getAllUserAttempts(quizId, userId, instructorId);

        return res.status(200).json(userAttempts);
    } catch (error) {
        next(error);
    }
};

export const getAllAttemptsController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {quizId} = req.params;

        const attempts = await getAllAttempts(quizId, instructorId);

        return res.status(200).json(attempts);
    } catch (error) {
        next(error);
    }
};