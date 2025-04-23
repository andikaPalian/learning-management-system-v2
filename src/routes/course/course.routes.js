import express from "express";
import { validateBody } from "../../middlewares/zodValidators.js";
import { courseSchema } from "../../validators/courseValidator.js";
import { auth, hasRole } from "../../middlewares/auth.js";
import { approveCourseController, createCourseController, deleteCourseController, getCourseByIdController, listCourseController, publishCourseController, updateCourseController } from "../../controllers/course/course.controller.js";
import { upload } from "../../middlewares/multer.js";

const courseRouter = express.Router();

courseRouter.post("/create", auth, hasRole(["ADMIN", "INSTRUCTOR"]), upload.single("thumbnail"), validateBody(courseSchema), createCourseController);
courseRouter.get("/", listCourseController);
courseRouter.get("/:courseId", getCourseByIdController);
courseRouter.patch("/:courseId/update", validateBody(courseSchema), auth, hasRole(["ADMIN", "INSTRUCTOR"]), updateCourseController);
courseRouter.delete("/:courseId", auth, hasRole(["ADMIN", "INSTRUCTOR"]), deleteCourseController);
courseRouter.post("/:courseId/approve", auth, hasRole(["ADMIN"]), approveCourseController);
courseRouter.post("/:courseId/publish", auth, hasRole(["ADMIN", "INSTRUCTOR"]), publishCourseController);

export default courseRouter;