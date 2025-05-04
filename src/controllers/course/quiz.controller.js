import { createQuiz, updateQuiz, deleteQuiz, listQuiz, getQuizById } from "../../services/course/quiz.service.js";

export const createQuizController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {contentId} = req.params;

        const newQuiz = await createQuiz(contentId, instructorId, req.body);

        return res.status(201).json({
            message: "Quiz created successfully",
            newQuiz
        });
    } catch (error) {
        next(error);
    }
};

export const updateQuizController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {contentId, quizId} = req.params;

        const updatedQuiz = await updateQuiz(contentId, quizId, instructorId, req.body);

        return res.status(200).json({
            message: "Quiz updated successfully",
            updatedQuiz
        });
    } catch (error) {
        next(error);
    }
};

export const deletequizController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {contentId, quizId} = req.params;

        await deleteQuiz(contentId, quizId, instructorId);

        return res.status(200).json({
            message: "Quiz deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const listQuizController = async (req, res, next) => {
    try {
        const {contentId} = req.params;

        const quizzes = await listQuiz(contentId, req.query);

        return res.status(200).json(quizzes);
    } catch (error) {
        next(error);
    }
};

export const getQuizByIdController = async (req, res, next) => {
    try {
        const {contentId, quizId} = req.params;

        const quiz = await getQuizById(contentId, quizId);

        return res.status(200).json(quiz);
    } catch (error) {
        next(error);
    }
};