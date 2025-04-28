import express from 'express';
import { auth, hasRole } from '../../middlewares/auth.js';
import { createModuleController, deleteModuleController, getModuleByIdController, listModulesController, publishModuleController, updateModuleController } from '../../controllers/course/module.controller.js';
import { validateBody } from '../../middlewares/zodValidators.js';
import { moduleSchema, moduleUpdateSchema } from '../../validators/moduleValidator.js';

const moduleRouter = express.Router();

moduleRouter.post("/create/:courseId", auth, hasRole(["INSTRUCTOR"]), validateBody(moduleSchema), createModuleController);
moduleRouter.patch("/update/:courseId/:moduleId", auth, hasRole(["INSTRUCTOR"]), validateBody(moduleUpdateSchema), updateModuleController);
moduleRouter.delete("/delete/:courseId/:moduleId", auth, hasRole(["INSTRUCTOR"]), deleteModuleController);
moduleRouter.get("/list/:courseId", listModulesController);
moduleRouter.get("/:courseId/:moduleid", getModuleByIdController);
moduleRouter.post("/publish/:courseId/:moduleId", auth, hasRole(["ADMIN"]), publishModuleController);

export default moduleRouter;