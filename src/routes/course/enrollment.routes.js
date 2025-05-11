import express from 'express';
import { auth, hasRole } from '../../middlewares/auth.js';
import { acceptEnrollmentController, getAllEnrollmentsController, joinCourseController, kickOutUserFromCourseController, leaveCourseController, rejectEnrollmentController } from '../../controllers/course/enrollment.controller.js';

const enrollmentRouter = express.Router();

enrollmentRouter.post("/enroll/:courseId", auth, hasRole(["STUDENT"]), joinCourseController);
enrollmentRouter.post("/leave/:courseId", auth, hasRole(["STUDENT"]), leaveCourseController);
enrollmentRouter.patch("/approve/:enrollmentId", auth, hasRole(["INSTRUCTOR"]), acceptEnrollmentController);
enrollmentRouter.patch("/reject/:enrollmentId", auth, hasRole(["INSTRUCTOR"]), rejectEnrollmentController);
enrollmentRouter.delete("/kick/:userId/:courseId", auth, hasRole(["INSTRUCTOR"]), kickOutUserFromCourseController);
enrollmentRouter.get("/:userId/:courseId", auth, hasRole(["INSTRUCTOR"]), getAllEnrollmentsController);

export default enrollmentRouter;