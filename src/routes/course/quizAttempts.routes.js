import express from 'express';
import { auth, hasRole } from '../../middlewares/auth.js';
import { completeAttemptsController, getAllAttemptsController, getAllUserAttemptsController, getQuizAttemptsController, startQuizAttemptsController } from '../../controllers/course/quizAttempts.controller.js';

const quizAttemptsRouter = express.Router();

quizAttemptsRouter.post("/start/:quizId", auth, hasRole(["STUDENT"]), startQuizAttemptsController);
quizAttemptsRouter.post("/end/:quizId", auth, hasRole(["STUDENT"]), completeAttemptsController);
quizAttemptsRouter.get("/:quizId", auth, hasRole(["STUDENT"]), getQuizAttemptsController);
quizAttemptsRouter.get("/:quizId/:userId", auth, hasRole(["INSTRUCTOR"]), getAllUserAttemptsController);
quizAttemptsRouter.get("/all/:quizId", auth, hasRole(["INSTRUCTOR"]), getAllAttemptsController);

export default quizAttemptsRouter;