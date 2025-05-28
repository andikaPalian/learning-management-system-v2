import express from "express";
import { auth, hasRole } from "../../middlewares/auth.js";
import { validateBody } from "../../middlewares/zodValidators.js";
import { assignmentSchema, updateAssigmentSchema } from "../../validators/assigmentValidator.js";
import { createAssigmentController, deleteAssigmentController, getAllAssigmentsController, getAssigmentByIdController, publishAssigmentController, updateAssigmentController } from "../../controllers/course/assigment.controller.js";

const assigmentRouter = express.Router();

assigmentRouter.post("/create/:courseId", auth, hasRole(["INSTRUCTOR"]), validateBody(assignmentSchema), createAssigmentController);
assigmentRouter.get("/list/:courseId", auth, hasRole(["STUDENT"]), getAllAssigmentsController);
assigmentRouter.get("/get/:assigmentId/:courseId", auth, hasRole(["STUDENT"]), getAssigmentByIdController);
assigmentRouter.patch("/update/:assigmentId/:courseId", auth, hasRole(["INSTRUCTOR"]), validateBody(updateAssigmentSchema), updateAssigmentController);
assigmentRouter.delete("/delete/:assigmentId/:courseId", auth, hasRole(["INSTRUCTOR"]), deleteAssigmentController);
assigmentRouter.post("/publish/:assigmentId/:courseId", auth, hasRole(["ADMIN"]), publishAssigmentController);

export default assigmentRouter;