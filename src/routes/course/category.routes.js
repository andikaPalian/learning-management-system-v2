import express from 'express';
import { auth, hasRole } from '../../middlewares/auth.js';
import { createCategoryController, createChildCategoryController, deleteCategoryController, deleteCategoryWithChildrenController, getCategoryDetailsController, getCategoryTreeController, listCategoriesController, updateCategoryController, updateChildCategoryController } from '../../controllers/course/category.controller.js';
import { validateBody } from '../../middlewares/zodValidators.js';
import { categorySchema, updateCategorySchema } from '../../validators/categoryValidator.js';

const categoryRouter = express.Router();

categoryRouter.post("/create", auth, hasRole(["ADMIN"]), validateBody(categorySchema), createCategoryController);
categoryRouter.post("/create-c hild/:parentId", auth, hasRole(["ADMIN"]), validateBody(categorySchema), createChildCategoryController);
categoryRouter.get("/list", listCategoriesController);
categoryRouter.get("/tree", getCategoryTreeController);
categoryRouter.get("/:slug", getCategoryDetailsController);
categoryRouter.patch("/update/:categoryId", auth, hasRole(["ADMIN"]), validateBody(updateCategorySchema), updateCategoryController);
categoryRouter.patch("/update-child/:categoryId/:childId", auth, hasRole(["ADMIN"]), validateBody(updateCategorySchema), updateChildCategoryController);
categoryRouter.delete("/delete/:categoryId", auth, hasRole(["ADMIN"]), deleteCategoryController);
categoryRouter.delete("/delete-with-children/:categoryId", auth, hasRole(["ADMIN"]), deleteCategoryWithChildrenController);

export default categoryRouter;