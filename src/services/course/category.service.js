import { PrismaClient } from "@prisma/client";
import slugify from "slugify";
import { AppError } from "../../utils/errorHandler.js";


const prisma = new PrismaClient();

export const createCategory = async (adminId, {name, description, parentId}) => {
    try {
        const admin = await prisma.user.findUnique({
            where: {
                id: adminId,
                role: "ADMIN"
            }
        });
        if (!admin) {
            throw new AppError("Unauthorized: Only admin can create category", 403);
        }

        const slugCategory = slugify(name, {lower: true, strict: true});

        const existingCategory = await prisma.category.findFirst({
            where: {
                OR: [
                    {name: name},
                    {slug: slugCategory}
                ]
            }
        });
        if (existingCategory) {
            throw new AppError("Category with same name or slug already exists", 400);
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug: slugCategory,
                description,
                parentId
            }
        });

        return {
            category: {
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description,
                parentId: category.parentId
            }
        };
    } catch (error) {
        throw new AppError(`Failed to create category: ${error.message}`, 500);
    }
}

export const createChildCategory = async (adminId, parentId, {name, description}) => {
    try {
        const admin = await prisma.user.findUnique({
            where: {
                id: adminId,
                role: "ADMIN"
            }
        });
        if (!admin) {
            throw new AppError("Unauthorized: Only admin can update category", 403);
        }

        const category = await prisma.category.findUnique({
            where: {
                id: parentId
            },
            include: {
                children: true
            }
        });
        if (!category) {
            throw new AppError("Parent category not found", 404);
        }

        const slugChildCategory = slugify(name, {lower: true, strict: true});

        const existingChildCategory = await prisma.category.findFirst({
            where: {
                OR: [
                    {name: name},
                    {slug: slugChildCategory}
                ],
                parentId: parentId
            }
        });
        if (existingChildCategory) {
            throw new AppError("Child category with same name or slug already exists", 400);
        }

        await prisma.category.create({
            data: {
                name,
                slug: slugChildCategory,
                description,
                parentId: parentId
            }
        });

        return {
            category: {
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description,
                parentId: category.parentId,
                children: category.children.map(child => ({
                    id: child.id,
                    name: child.name,
                    slug: child.slug,
                    description: child.description
                }))
            }
        };
    } catch (error) {
        throw new AppError(`Failed to create child category: ${error.message}`, 500);
    }
};

export const assignCategoriesToCourse = async (courseId, instructorId, categoryId) => {
    try {
        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            },
            include: {
                instructor: true
            }
        });
        if (!course) {
            throw new AppError("Course not found", 404);
        }

        if (course.instructorId !== instructorId) {
            throw new AppError("Unauthorized: Only the instructor can assign categories to the course", 403);
        }

        if (!["INSTRUCTOR", "ADMIN"].includes(course.instructor.role)) {
            throw new AppError("Unauthorized: Only instructors and admins can assign categories to the course", 403);
        }

        // Validasi category
        const validCategories = await prisma.category.findMany({
            where: {
                id: {
                    in: categoryId
                }
            }
        });
        if (validCategories.length !== categoryId.length) {
            throw new AppError("Some of the categories are not valid", 400);
        }

        await prisma.$transaction([
            prisma.categoriesOnCourse.deleteMany({
                where: {
                    courseId: courseId
                }
            }),
            prisma.categoriesOnCourse.createMany({
                data: categoryId.map(id => ({
                    courseId,
                    categoryId: id
                })),
                skipDuplicates: true
            })
        ]);
    } catch (error) {
        throw new AppError(`Failed to assign categories to course: ${error.message}`, 500);
    }
};

export const listCategories = async ({search = "", page = 1, limit = 10}) => {
    try {
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const categories = await prisma.category.findMany({
            where: {
                AND: [
                    {parentId: null},
                    {
                        name: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                ]
            },
            skip,
            take: limitNum,
            orderBy: {
                createdAt: "desc"
            }
        });

        const total = await prisma.category.count({
            where: {
                AND: [
                    {parentId: null},
                    {
                        name: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        });

        return {
            categories: {
                categories: categories.map(category => ({
                    id: category.id,
                    name: category.name,
                    slug: category.slug
                })),
                currenPage: pageNum,
                totalPage: Math.ceil(total / limitNum),
                totalItems: total
            }
        };
    } catch (error) {
        throw new AppError(`Failed to list categories: ${error.message}`, 500);
    }
};

export const getCategoryTree = async () => {
    try {
        const category = await prisma.category.findMany({
            where: {
                parentId: null
            },
            select: {
                id: true,
                name: true,
                slug: true,
                children: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            }
        });

        return category;
    } catch (error) {
        throw new AppError(`Failed to get category tree: ${error.message}`, 500);
    }
};

export const getCategoryDetails = async (slug) => {
    try {
        const category = await prisma.category.findUnique({
            where: {
                slug: slug
            },
            include: {
                courses: {
                    include: {
                        course: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                                thumbnail: true,
                                price: true,
                            }
                        }
                    }
                }
            }
        });

        return category;
    } catch (error) {
        throw new AppError(`Failed to get category details: ${error.message}`, 500);
    }
};

export const updateCategory = async (categoryId, adminid, data) => {
    try {
        const admin = await prisma.user.findUnique({
            where: {
                id: adminid,
                role: "ADMIN"
            }
        });
        if (!admin) {
            throw new AppError("Unauthorized: Only admin can update category", 403);
        }

        // if (user.role !== "ADMIN") {
        //     throw new AppError("Unautorized: Only admin can update category", 403);
        // }

        const existingCategory = await prisma.category.findUnique({
            where: {
                id: categoryId
            }
        });
        if (!existingCategory) {
            throw new AppError("Category not found", 404);
        }

        if (data.name) {
            const newSlug = slugify(data.name, {lower: true, strict: true});

            const existingSlug = await prisma.category.findFirst({
                where: {
                    slug: newSlug,
                    NOT: {
                        id: categoryId
                    }
                }
            });
            if (existingSlug) {
                data.slug = `${newSlug}-${Date.now()}`;
            } else {
                data.slug = newSlug;
            }
        }

        await prisma.category.update({
            where: {
                id: categoryId
            },
            data: {
                ...data
            }
        });
    } catch (error) {
        throw new AppError(`Failed to update category: ${error.message}`, 500);
    }
};

export const updateChildCategory = async (categoryId, childId, adminId, data) => {
    try {
        const admin = await prisma.user.findUnique({
            where: {
                id: adminId,
                role: "ADMIN"
            }
        });
        if (!admin) {
            throw new AppError("Unauthorized: Only admin can update category", 403);
        }

        const existingCategory = await prisma.category.findUnique({
            where: {
                id: categoryId
            }
        });
        if (!existingCategory) {
            throw new AppError("Category not found", 404);
        }

        const childCategory = await prisma.category.findUnique({
            where: {
                id: childId,
                parentId: categoryId
            }
        });
        if (!childCategory) {
            throw new AppError("Child category not found", 404);
        }

        if (data.name) {
            const newChildSlug = slugify(data.name, {lower: true, strict: true});

            const existingSlugChildCategory = await prisma.category.findFirst({
                where: {
                    slug: newChildSlug,
                    NOT: {
                        id: childId
                    }
                }
            });
            if (existingSlugChildCategory) {
                data.slug = `${newChildSlug}-${Date.now()}`;
            } else {
                data.slug = newChildSlug;
            }
        }

        await prisma.category.updateMany({
            where: {
                id: childId,
                parentId: categoryId
            },
            data: {
                ...data
            }
        });
    } catch (error) {
        throw new AppError(`Failed to update child category: ${error.message}`, 500);
    }
};

export const deleteCategory = async (categoryId, adminId) => {
    try {
        const admin = await prisma.user.findUnique({
            where: {
                id: adminId,
                role: "ADMIN"
            }
        });
        if (!admin) {
            throw new AppError("Unauthorized: Only admin can delete category", 403);
        }

        const children = await prisma.category.findMany({
            where: {
                parentId: categoryId
            }
        });
        if (children.length > 0) {
            throw new AppError("Cannot delete category with child categories", 400);
        }

        await prisma.categoriesOnCourse.deleteMany({
            where: {
                categoryId: categoryId
            }
        });
        await prisma.category.delete({
            where: {
                id: categoryId
            }
        });
    } catch (error) {
        throw new AppError(`Failed to delete category: ${error.message}`, 500);
    }
};

export const deleteCategoryWithChildren = async (categoryId, adminId) => {
    try {
        const admin = await prisma.user.findUnique({
            where: {
                id: adminId,
                role: "ADMIN"
            }
        });
        if (!admin) {
            throw new AppError("Unauthorized: Only admin can delete category", 403);
        }

        const category = await prisma.category.findUnique({
            where: {
                id: categoryId
            }
        });
        if (!category) {
            throw new AppError("Category not found", 404);
        }

        const children = await prisma.category.findMany({
            where: {
                parentId: categoryId
            }
        });

        // hapus semua kategori anak
        for (const child of children) {
            await deleteCategoryWithChildren(child.id, adminId);
        }

        // Hapus relasi many-to-many dengan course
        await prisma.categoriesOnCourse.deleteMany({
            where: {
                categoryId: categoryId
            }
        });

        // Hapus kategori utama
        await prisma.category.delete({
            where: {
                id: categoryId
            }
        });
    } catch (error) {
        throw new AppError(`Failed to delete category with children: ${error.message}`, 500);
    }
};