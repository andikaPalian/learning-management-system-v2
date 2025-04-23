import { createCourse, getCourseById, listCourses, updateCourse, deleteCourse, approveCourse, publishCourse } from "../../services/course/course.service.js";

export const createCourseController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;

        const course = await createCourse(instructorId, req.body, req.file);

        return res.status(201).json({
            message: "Course created successfully",
            course
        });
    } catch (error) {
        next(error);
    }
};

export const listCourseController = async (req, res, next) => {
    try {
        const courses = await listCourses();

        return res.status(200).json(courses);
    } catch (error) {
        next(error);
    }
};

export const getCourseByIdController = async (req, res, next) => {
    try {
        const {courseId} = req.params;

        const course = await getCourseById(courseId);

        return res.status(200).json(course);
    } catch (error) {
        next(error);
    }
}

export const updateCourseController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {courseId} = req.params;
        
        const updatedCourse = await updateCourse(instructorId, courseId, req.body, req.file);

        return res.status(200).json({
            message: "Course updated successfully",
            updatedCourse
        });
    } catch (error) {
        next(error);
    }
}

export const deleteCourseController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {courseId} = req.params;

        await deleteCourse(instructorId, courseId);

        return res.status(200).json({
            message: "Course deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}

export const approveCourseController = async (req, res, next) => {
    try {
        const adminId = req.user.userId;
        const {courseId} = req.params;

        await approveCourse(courseId, adminId);

        return res.status(200).json({
            message: "Course approved successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const publishCourseController = async (req, res, next) => {
    try {
        const instructorId = req.user.userId;
        const {courseId} = req.params;

        await publishCourse(instructorId, courseId);

        return res.status(200).json({
            message: "Course published successfully"
        });
    } catch (error) {
        next(error);
    }
};