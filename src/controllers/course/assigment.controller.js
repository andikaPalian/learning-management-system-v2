import { createAssigment, getAllAssigments, getAssigmentById, updateAssigment, deleteAssigment, publishAssigment } from "../../services/course/assigment.service.js";

export const createAssigmentController = async (req, res, next) => {
    try {
        const creatorId = req.user.userId;
        const {courseId} = req.params;
        
        const assigment = await createAssigment(courseId, creatorId, req.body);
        
        return res.status(201).json({
            message: "Assigment created successfully",
            assigment
        });
    } catch (error) {
        next(error);
    }
};

export const getAllAssigmentsController = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const {courseId} = req.params;

        const assigments = await getAllAssigments(courseId, userId);

        return res.status(200).json(assigments);
    } catch (error) {
        next(error);
    }
};

export const getAssigmentByIdController = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const {assigmentId, courseId} = req.params;

        const assigment = await getAssigmentById(assigmentId, courseId, userId);

        return res.status(200).json(assigment);
    } catch (error) {
        next(error);
    }
};

export const updateAssigmentController = async (req, res, next) => {
    try {
        const creatorId = req.user.userId;
        const {assigmentId, courseId} = req.params;

        const updatedAssigment = await updateAssigment(assigmentId, courseId, creatorId, req.body);

        return res.status(200).json({
            message: "Assigment updated successfully",
            updatedAssigment
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAssigmentController = async (req, res, next) => {
    try {
        const creatorId = req.user.userId;
        const {assigmentId, courseId} = req.params;

        await deleteAssigment(assigmentId, courseId, creatorId);

        return res.status(200).json({
            message: "Assigment deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const publishAssigmentController = async (req, res, next) => {
    try {
        const adminId = req.user.userId;
        const {assigmentId, courseId} = req.params;

        await publishAssigment(assigmentId, courseId, adminId);

        return res.status(200).json({
            message: "Assigment published successfully"
        });
    } catch (error) {
        next(error);
    }
};