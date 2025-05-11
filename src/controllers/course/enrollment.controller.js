import { joinCourse, leaveCourse, acceptEnrollment, rejectEnrollment, kickOutUserFromCourse, getAllEnrollments } from "../../services/course/enrollment.service.js";

export const joinCourseController = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const {courseId} = req.params;

        await joinCourse(userId, courseId);

        return res.status(200).json({
            message: "Joined course successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const leaveCourseController = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const {courseId} = req.params;

        await leaveCourse(userId, courseId);

        return res.status(200).json({
            message: "Left course successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const acceptEnrollmentController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {enrollmentId} = req.params;

        await acceptEnrollment(instructorId, enrollmentId);

        return res.status(200).json({
            message: "Enrollment accepted successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const rejectEnrollmentController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {enrollmentId} = req.params;

        await rejectEnrollment(instructorId, enrollmentId);

        return res.status(200).json({
            message: "Enrollment rejected successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const kickOutUserFromCourseController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {userId, courseId} = req.params;

        await kickOutUserFromCourse(userId, courseId, instructorId);

        return res.status(200).json({
            message: "User kicked out successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const getAllEnrollmentsController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {userId, courseId} = req.params;

        const enrollments = await getAllEnrollments(userId, courseId, instructorId);

        return res.status(200).json(enrollments);
    } catch (error) {
        next(error);
    }
};