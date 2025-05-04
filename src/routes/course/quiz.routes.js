import express from "express";
import { auth, hasRole } from "../../middlewares/auth.js";
import { validateBody } from "../../middlewares/zodValidators.js";
import { quizSchema, updateQuizSchema } from "../../validators/quizValidator.js";
import { createQuizController, deletequizController, getQuizByIdController, listQuizController, updateQuizController } from "../../controllers/course/quiz.controller.js";

const quizRouter = express.Router();

quizRouter.post("/create/:contentId", auth, hasRole(["INSTRUCTOR"]), validateBody(quizSchema), createQuizController);
quizRouter.patch("/update/:contentId/:quizId", auth, hasRole(["INSTRUCTOR"]), validateBody(updateQuizSchema), updateQuizController);
quizRouter.delete("/delete/:contentId/:quizId", auth, hasRole(["INSTRUCTOR"]), deletequizController);
quizRouter.get("/list/:contentId", listQuizController);
quizRouter.get("/get/:contentId/:quizId", getQuizByIdController);

export default quizRouter;