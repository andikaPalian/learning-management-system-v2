import { PrismaClient } from "@prisma/client";
import { AppError } from "../../utils/errorHandler.js";

const prisma = new PrismaClient();

export const draftSubmission = async (courseId, assigmentId, userId, {content, attachment}) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: userId,
                role: "STUDENT"
            }
        });
        if (!user) {
            throw new AppError("User not found", 404);
        }

        const assigment = await prisma.assigment.findFirst({
            where: {
                id: assigmentId,
                courseId: courseId
            },
            include: {
                course: {
                    include: {
                        enrollments: true
                    }
                }
            }
        });
        if (!assigment) {
            throw new AppError("Assigment not found", 404);
        }

        if (assigment.course.enrollments.some(enrollment => enrollment.userId !== userId)) {
            throw new AppError("Unauthorized: Only enrolled students can submit assignments", 403);
        }

        const data = {
            content,
            attachment,
            status: "DRAFT",
            assigment: {
                connect: {
                    id: assigmentId
                }
            },
            user: {
                connect: {
                    id: userId
                }
            }
        }

        const submission = await prisma.submission.findFirst({
            where: {
                assigmentId: assigmentId,
                userId: userId
            }
        });

        const draft = submission ? await prisma.submission.update({
            where: {
                id: submission.id
            },
            data
        }) : await prisma.submission.create({
            data
        });

        // const submission = await prisma.submission.create({
        //     data: {
        //         content,
        //         attachment,
        //         status: "SUBMITTED",
        //         student: {
        //             connect: {
        //                 id: userId
        //             }
        //         },
        //         assigment: {
        //             connect: {
        //                 id: assigmentId
        //             }
        //         }
        //     }
        // });
    
        return draft;
    } catch (error) {
        throw new AppError(`Failed to submit assignment: ${error.message}`, 500);
    }
};

export const submitSubmission = async (courseId, assigmentId, submissionId, userId) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: userId,
                role: "STUDENT"
            }
        });
        if (!user) {
            throw new AppError("User not found", 404);
        }

        const assigment = await prisma.assigment.findFirst({
            where: {
                id: assigmentId,
                courseId: courseId
            },
            include: {
                course: {
                    include: {
                        enrollments: true
                    }
                }
            }
        });
        if (!assigment) {
            throw new AppError("Assigment not found", 404);
        }

        const submission = await prisma.submission.findFirst({
            where: {
                id: submissionId,
                assigment: {
                    id: assigmentId,
                    courseId: courseId
                }
            }
        });
        if (!submission) {
            throw new AppError("No draft found. Please save before submitting", 404);
        }

        if (!assigment.course.enrollments.some(enrollment => enrollment.userId !== userId) && submission.userId !== userId) {
            throw new AppError("Unauthorized: Only enrolled students and the submitter can submit assignments", 403);
        }

        const now = new Date();
        const status = assigment.dueDate < now ? "LATE" : "SUBMITTED";

        const submitted = await prisma.submission.update({
            where: {
                id: submissionId
            },
            data: {
                status: status
            }
        });

        return submitted;
    } catch (error) {
        throw new AppError(`Failed to submit assignment: ${error.message}`, 500);
    }
};

export const getSubmissionById = async (courseId, assigmentId, submissionId, userId) => {
    try {
        const assigment = await prisma.assigment.findFirst({
            where: {
                id: assigmentId,
                courseId: courseId
            },
            include: {
                course: {
                    include: {
                        enrollments: true
                    }
                }
            }
        });
        if (!assigment) {
            throw new AppError("Assigment not found", 404);
        }

        const submission = await prisma.submission.findFirst({
            where: {
                id: submissionId,
                assigment: {
                    id: assigmentId,
                    courseId: courseId
                }
            },
            // select: {
            //     id: true,
            //     status: true,
            //     user: {
            //         select: {
            //             avatar: true,
            //             username: true
            //         }
            //     },
            //     content: true,
            //     attachment: true
            // }
        });
        if (!submission) {
            throw new AppError("Submission not found", 404);
        }

        // const instructor = await prisma.user.findFirst({
        //     where: {
        //         id: instructorId,
        //         role: "INSTRUCTOR"
        //     }
        // });
        // if (!instructor) {
        //     throw new AppError("Instructor not found", 404);
        // }

        // if (assigment.course.instructorId !== instructorId) {
        //     throw new AppError("Unauthorized: Only the instructor can access this submission", 403);
        // }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            throw new AppError("User not found", 404);
        }

        if (user.role === "INSTRUCTOR" && assigment.course.instructorId !== userId) {
            throw new AppError("Unauthorized: Only the instructor can access this submission", 403);
        } else if (user.role === "STUDENT" && submission.userId !== userId && !assigment.course.enrollments.some(enrollment => enrollment.userId !== userId)) {
            throw new AppError("Unauthorized: Only enrolled students and the submitter can access this submission", 403);
        }

        // if (assigment.course.enrollments.some(enrollment => enrollment.userId !== userId) && submission.userId !== userId) {
        //     throw new AppError("Unauthorized: Only enrolled students and the submitter can submit assignments", 403)
        // }

        return submission;
    } catch (error) {
        throw new AppError(`Failed to get submission: ${error.message}`, 500);
    }
};

export const getAllSubmissions = async (courseId, assigmentId, instructorId, {page = 1, limit = 10}) => {
    try {
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const instructor = await prisma.user.findFirst({
            where: {
                id: instructorId,
                role: "INSTRUCTOR"
            }
        });
        if (!instructor) {
            throw new AppError("Instructor not found", 404);
        }

        const assigment = await prisma.assigment.findFirst({
            where: {
                id: assigmentId,
                courseId: courseId
            },
            include: {
                course: true
            }
        });
        if (!assigment) {
            throw new AppError("Assigment not found", 404);
        }

        if (assigment.course.instructorId !== instructorId) {
            throw new AppError("Unauthorized: Only the instructor can access this submission", 403);
        }

        const submissions = await prisma.submission.findMany({
            where: {
                assigment: {
                    id: assigmentId,
                    courseId: courseId
                }
            },
            select: {
                id: true,
                status: true,
                user: {
                    select: {
                        avatar: true,
                        username: true
                    }
                },
                content: true,
                attachment: true
            },
            skip,
            take: limitNum
        });

        const total = await prisma.submission.count({
            where: {
                assigment: {
                    id: assigmentId,
                    courseId: courseId
                }
            }
        });

        return {
            submissions: submissions,
            totalSubmissions: total,
            cuurentPage: pageNum,
            totalPages: Math.ceil(total / limitNum)
        };
    } catch (error) {
        throw new AppError(`Failed to get submissions: ${error.message}`, 500);
    }
};

export const gradingSubmission = async (courseId, assigmentId, submissionId, instructorId, {grade, feedback}) => {
    try {
        const instructor = await prisma.user.findFirst({
            where: {
                id: instructorId,
                role: "INSTRUCTOR"
            }
        });
        if (!instructor) {
            throw new AppError("Instructor not found", 404);
        }

        const assigment = await prisma.assigment.findFirst({
            where: {
                id: assigmentId,
                courseId: courseId
            },
            include: {
                course: true
            }
        });
        if (!assigment) {
            throw new AppError("Assigment not found", 404);
        }

        if (assigment.course.instructorId !== instructorId) {
            throw new AppError("Unauthorized: Only the instructor can access this submission", 403);
        }

        await prisma.submission.update({
            where: {
                id: submissionId
            },
            data: {
                status: "GRADED",
                grade: grade,
                feedback: feedback ?? null
            }
        });
    } catch (error) {
        throw new AppError(`Failed to grade submission: ${error.message}`, 500);
    }
};

export const returnSubmission = async (courseId, assigmentId, submissionId, instructorId, {feedback}) => {
    try {
        const instructor = await prisma.user.findFirst({
            where: {
                id: instructorId,
                role: "INSTRUCTOR"
            }
        });
        if (!instructor) {
            throw new AppError("Instructor not found", 404);
        }

        const assigment = await prisma.assigment.findFirst({
            where: {
                id: assigmentId,
                courseId: courseId
            },
            include: {
                course: true
            }
        });
        if (!assigment) {
            throw new AppError("Assigment not found", 404);
        }

        if (assigment.course.instructorId !== instructorId) {
            throw new AppError("Unauthorized: Only the instructor can access this submission", 403);
        }

        const returnedSubmission = await prisma.submission.update({
            where: {
                id: submissionId
            },
            data: {
                status: "RETURNED",
                feedback: feedback ?? null
            }
        });

        return returnedSubmission;
    } catch (error) {
        throw new AppError(`Failed to return submission: ${error.message}`, 500);
    }
};