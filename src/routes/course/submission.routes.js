import express from "express";
import { auth, hasRole } from "../../middlewares/auth.js";
import { validateBody } from "../../middlewares/zodValidators.js";
import { gradingSubmissionSchema, returnSubmissionSchema, submissionSchema } from "../../validators/submissionValidator.js";
import { draftSubmissionController, getAllSubmissionsController, getSubmissionByIdController, gradingSubmissionController, returnSubmissionController, submitSubmissionController } from "../../controllers/course/submission.controller.js";

const submissionRouter = express.Router();

submissionRouter.post("/draft/:courseId/:assigmentId", auth, hasRole(["STUDENT"]), validateBody(submissionSchema), draftSubmissionController);
submissionRouter.post("/submit/:courseId/:assigmentId/:submissionId", auth, hasRole(["STUDENT"]), submitSubmissionController);
submissionRouter.get("/:courseId/:assigmentId/:submissionId", auth, hasRole(["INSTRUCTOR", "STUDENT"]), getSubmissionByIdController);
submissionRouter.get("/list/:courseId/:assigmentId", auth, hasRole(["INSTRUCTOR"]), getAllSubmissionsController);
submissionRouter.put("/grading/:courseId/:assigmentId/:submissionId", auth, hasRole(["INSTRUCTOR"]),validateBody(gradingSubmissionSchema), gradingSubmissionController);
submissionRouter.put("/return/:courseId/:assigmentId/:submissionId", auth, hasRole(["INSTRUCTOR"]), validateBody(returnSubmissionSchema), returnSubmissionController);

export default submissionRouter;