import { createModule, updateModule, deleteModule, listModules, getModuleById, publishModule } from "../../services/course/module.service.js";

export const createModuleController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {courseId} = req.params;

        const newModule = await createModule(instructorId, courseId, req.body);

        return res.status(201).json({
            message: "Module created successfully",
            newModule
        });
    } catch (error) {
        next(error);
    }
};

export const updateModuleController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {moduleId, courseId} = req.params;

        const updatedModule = await updateModule(instructorId, moduleId, courseId, req.body);

        return res.status(200).json({
            message: "Module updated successfully",
            updatedModule
        });
    } catch (error) {
        next(error);
    }
};

export const deleteModuleController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {moduleId, courseId} = req.params;

        await deleteModule(instructorId, moduleId, courseId);

        return res.status(200).json({
            message: "Module deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const listModulesController = async (req, res, next) => {
    try {
        const {courseId} = req.params;
        const modules = await listModules(courseId, req.query);

        return res.status(200).json(modules);
    } catch (error) {
        next(error);
    }
};

export const getModuleByIdController = async (req, res, next) => {
    try {
        const {courseId, moduleid} = req.params;

        const module = await getModuleById(courseId, moduleid);

        return res.status(200).json(module);
    } catch (error) {
        next(error);
    }
};

export const publishModuleController = async (req, res, next) => {
    try {
        const adminId = req.user.userId;
        const {moduleId, courseId} = req.params;

        await publishModule(adminId, moduleId, courseId);

        return res.status(200).json({
            message: "Module published successfully"
        });
    } catch (error) {
        next(error);
    }
};