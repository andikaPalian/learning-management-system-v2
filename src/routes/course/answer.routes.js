import express from "express";
import { auth, hasRole } from "../../middlewares/auth.js";
import { getStudentAnswersController, submitAnswerController } from "../../controllers/course/answer.controller.js";

const answerRouter = express.Router();

answerRouter.post("/submit/:questionId/:attemptId", auth, hasRole(["STUDENT"]), submitAnswerController);
answerRouter.get("/list/:quizId/:userId", auth, hasRole(["INSTRUCTOR"]), getStudentAnswersController);

export default answerRouter;