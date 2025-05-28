import { draftSubmission, submitSubmission, getAllSubmissions, getSubmissionById, returnSubmission, gradingSubmission } from "../../services/course/submission.service.js";

export const draftSubmissionController = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const {courseId, assigmentId} = req.params;

        const newSubmission = await draftSubmission(courseId, assigmentId, userId, req.body);

        return res.status(201).json({
            message: "Submission created successfully",
            newSubmission
        });
    } catch (error) {
        next(error);
    }
};

export const submitSubmissionController = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const {courseId, assigmentId, submissionId} = req.params;

        const submittedSubmission = await submitSubmission(courseId, assigmentId, submissionId, userId);

        return res.status(200).json({
            message: "Submission submitted successfully",
            submittedSubmission
        });
    } catch (error) {
        next(error);
    }
};

export const getSubmissionByIdController = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const {courseId, assigmentId, submissionId} = req.params;

        const submission = await getSubmissionById(courseId, assigmentId, submissionId, userId);

        return res.status(200).json(submission);
    } catch (error) {
        next(error);
    }
};

export const getAllSubmissionsController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {courseId, assigmentId} = req.params;

        const submissions = await getAllSubmissions(courseId, assigmentId, instructorId, req.query);

        return res.status(200).json(submissions);
    } catch (error) {
        next(error);
    }
};

export const gradingSubmissionController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {courseId, assigmentId, submissionId} = req.params;

        await gradingSubmission(courseId, assigmentId, submissionId, instructorId, req.body);
    
        return res.status(200).json({
            message: "Submission graded successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const returnSubmissionController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {courseId, assigmentId, submissionId} = req.params;

        const returnedSubmission = await returnSubmission(courseId, assigmentId, submissionId, instructorId, req.body);

        return res.status(200).json({
            message: "Submission returned successfully",
            returnedSubmission
        });
    } catch (error) {
        next(error);
    }
};