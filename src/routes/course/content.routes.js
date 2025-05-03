import express from 'express';
import { auth, hasRole } from '../../middlewares/auth.js';
import { createContentController, deleteContentController, getContentByIdController, listContentController, publishContentController, updateContentController } from '../../controllers/course/content.controller.js';
import { validateBody } from '../../middlewares/zodValidators.js';
import { contentSchema, updateContentSchema, validateContentType } from '../../validators/contentValidator.js';
import { upload } from '../../middlewares/multer.js';

const contentRouter = express.Router();

contentRouter.post("/create/:moduleId", auth, hasRole(["INSTRUCTOR"]), upload.single("file"), validateBody(contentSchema), validateContentType, createContentController);
contentRouter.patch("/update/:moduleId/:contentId", auth, hasRole(["INSTRUCTOR"]), upload.single("file"), validateBody(updateContentSchema), validateContentType, updateContentController);
contentRouter.delete("/delete/:moduleId/:contentId", auth, hasRole(["INSTRUCTOR"]), deleteContentController);
contentRouter.get("/list/:moduleId", listContentController);
contentRouter.get("/get/:moduleId/:contentId", getContentByIdController);
contentRouter.post("/publish/:moduleId/:contentId", auth, hasRole(["ADMIN"]), publishContentController);

export default contentRouter;