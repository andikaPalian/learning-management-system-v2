import { createQuestion, updateQuestion, deleteQuestion, listQuestion, getQuestionById } from "../../services/course/question.service.js";

export const createQuestionController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {quizId} = req.params;

        const newQuestion = await createQuestion(instructorId, quizId, req.body);

        return res.status(201).json({
            message: "Question created successfully",
            newQuestion
        });
    } catch (error) {
        next(error);
    }
};

export const updateQuestionController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {quizId, questionId} = req.params;

        const updatedQuestion = await updateQuestion(instructorId, quizId, questionId, req.body);

        return res.status(200).json({
            message: "Question updated successfully",
            updatedQuestion
        });
    } catch (error) {
        next(error);
    }
};

export const deleteQuestionController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {quizId, questionId} = req.params;

        await deleteQuestion(instructorId, quizId, questionId);

        return res.status(200).json({
            message: "Question deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const listQuestionController = async (req, res, next) => {
    try {
        const {quizId} = req.params;

        const questions = await listQuestion(quizId, req.query);

        return res.status(200).json(questions);
    } catch (error) {
        next(error);
    }
};

export const getQuestionByIdController = async (req, res, next) => {
    try {
        const {quizId, questionId} = req.params;

        const question = await getQuestionById(quizId, questionId);

        return res.status(200).json(question);
    } catch (error) {
        next(error);
    }
};