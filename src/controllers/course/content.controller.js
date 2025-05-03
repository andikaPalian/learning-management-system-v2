import { createContent, updateContent, deleteContent, listContent, getContentById, publishContent } from "../../services/course/content.service.js";

export const createContentController = async (req, res, next) => {
    try {
        console.log("REQ BODY:", req.body); // 🧪 DEBUG
        console.log("REQ FILE:", req.file); // 🧪 DEBUG
        const instructorId = req.user.userId;
        const {moduleId} = req.params;
        // const file = (req.file || []).find(f => f.fieldname === "file")

        const newContent = await createContent(instructorId, moduleId, req.body, req.file);

        return res.status(201).json({
            message: "Content created successfully",
            newContent
        });
    } catch (error) {
        next(error);
    }
};

export const updateContentController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {contentId, moduleId} = req.params;

        const updatedContent = await updateContent(instructorId, contentId, moduleId, req.body, req.file);

        return res.status(200).json({
            message: "Content updated successfully",
            updatedContent
        });
    } catch (error) {
        next(error);
    }
};

export const deleteContentController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {contentId, moduleId} = req.params;

        await deleteContent(instructorId, contentId, moduleId);

        return res.status(200).json({
            message: "Content deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const listContentController = async (req, res, next) => {
    try {
        const {moduleId} = req.params;

        const contents = await listContent(moduleId, req.query);

        return res.status(200).json(contents);
    } catch (error) {
        next(error);
    }
};

export const getContentByIdController = async (req, res, next) => {
    try {
        const {moduleId, contentId} = req.params;

        const content = await getContentById(moduleId, contentId);

        return res.status(200).json(content);
    } catch (error) {
        next(error);
    }
};

export const publishContentController = async (req, res, next) => {
    try {
        const adminId = req.user.userId;
        const {moduleId, contentId} = req.params;

        await publishContent(adminId, moduleId, contentId);

        return res.status(200).json({
            message: "Content published successfully"
        });
    } catch (error) {
        next(error);
    }
};