import { createCategory, assignCategoriesToCourse, listCategories, getCategoryTree, getCategoryDetails, updateCategory, deleteCategory, deleteCategoryWithChildren, createChildCategory, updateChildCategory } from "../../services/course/category.service.js";

export const createCategoryController = async (req, res, next) => {
    try {
        const adminId = req.user.userId;
        const category = await createCategory(adminId, req.body);

        return res.status(201).json({
            message: "Category created successfully",
            category
        });
    } catch (error) {
        next(error);
    }
};

export const createChildCategoryController = async (req, res, next) => {
    try {
        const adminId = req.user.userId;
        const {parentId} = req.params;

        const childCategory = await createChildCategory(adminId, parentId, req.body);

        return res.status(200).json({
            message: "Child category created successfully",
            childCategory
        });
    } catch (error) {
        next(error);
    }
};

export const listCategoriesController = async (req, res, next) => {
    try {
        const categories = await listCategories(req.query);

        return res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

export const getCategoryTreeController = async (req, res, next) => {
    try {
        const categories = await getCategoryTree();

        return res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

export const getCategoryDetailsController = async (req, res, next) => {
    try {
        const {slug} = req.params;
        if (!slug) {
            return res.status(400).json({
                message: "Slug parameter is required"
            });
        }

        const category = await getCategoryDetails(slug);
        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        return res.status(200).json(category);
    } catch (error) {
        next(error);
    }
}

export const updateCategoryController = async (req, res, next) => {
    try {
        const adminId = req.user.userId;
        const {categoryId} = req.params;

        const updatedCategory = await updateCategory(categoryId, adminId, req.body);

        return res.status(200).json({
            message: "Category updated successfully",
            updatedCategory
        });
    } catch (error) {
        next(error);
    }
};

export const updateChildCategoryController = async (req, res, next) => {
    try {
        const adminId = req.user.userId;
        const {categoryId, childId} = req.params;

        await updateChildCategory(categoryId,
            childId, adminId, req.body
        );

        return res.status(200).json({
            message: "Child category updated successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCategoryController = async (req, res, next) => {
    try {
        const adminId = req.user.userId;
        const {categoryId} = req.params;

        await deleteCategory(categoryId, adminId);

        return res.status(200).json({
            message: "Category deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCategoryWithChildrenController = async (req, res, next) => {
    try {
        const adminId = req.user.userId;
        const {categoryId} = req.params;

        await deleteCategoryWithChildren(categoryId, adminId);

        return res.status(200).json({
            message: "Category and its children deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}

export const assignCategoriesToCourseController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {courseId} = req.params;
        const {categoryId} = req.body;

        if (categoryId.length === 0 || !Array.isArray(categoryId)) {
            return res.status(400).json({
                message: "Categories must be a non-empty array"

            });
        }

        await assignCategoriesToCourse(courseId, instructorId, categoryId);

        return res.status(200).json({
            message: "Categories assigned to course successfully"
        });
    } catch (error) {
        next(error);
    }
};