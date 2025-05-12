import { submitAnswer, getStudentAnswers } from "../../services/course/answer.service.js";

export const submitAnswerController = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const {questionId, attemptId} = req.params;

        const answer = await submitAnswer(questionId, attemptId, userId, req.body);

        return res.status(200).json({
            message: "Answer submitted successfully",
            answer
        });
    } catch (error) {
        next(error);
    }
};

export const getStudentAnswersController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {quizId, userId} = req.params;

        const anwers = await getStudentAnswers(quizId, userId, instructorId);
        
        return res.status(200).json(anwers);
    } catch (error) {
        next(error);
    }
};