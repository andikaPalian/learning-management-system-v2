import express from 'express';
import { auth, hasRole } from '../../middlewares/auth.js';
import { validateBody } from '../../middlewares/zodValidators.js';
import { questionSchema, updateQuestionSchema } from '../../validators/questionValidator.js';
import { createQuestionController, deleteQuestionController, getQuestionByIdController, listQuestionController, updateQuestionController } from '../../controllers/course/question.controller.js';

const questionRouter = express.Router();

questionRouter.post("/create/:quizId", auth, hasRole(["INSTRUCTOR"]), validateBody(questionSchema), createQuestionController);
questionRouter.patch("/update/:quizId/:questionId", auth, hasRole(["INSTRUCTOR"]), validateBody(updateQuestionSchema), updateQuestionController);
questionRouter.delete("/delete/:quizId/:questionId", auth, hasRole(["INSTRUCTOR"]), deleteQuestionController);
questionRouter.get("/list/:quizId", listQuestionController);
questionRouter.get("/get/:quizId/:questionId", getQuestionByIdController);

export default questionRouter;