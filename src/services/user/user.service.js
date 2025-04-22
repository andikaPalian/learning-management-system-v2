import { PrismaClient } from "@prisma/client";
import { AppError } from "../../utils/errorHandler.js";
import {v2 as cloudinary} from "cloudinary";
import fs from "fs/promises";

const prisma = new PrismaClient();

export const userProfile = async (userId) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            email: true,
            username: true,
            role: true,
            firstName: true,
            lastName: true,
            avatar: true
        }
    });
    if (!user) {
        throw new AppError("user not found", 404);
    }

    return user;
}

export const editProfile = async (userId, data, file) => {
    const {firstName, lastName, username, email, bio, phone} = data;

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (!user) {
        throw new AppError("user not found", 404)
    }

    if (user.id !== userId) {
        throw new AppError("Unauthorized: only the user can edit their profile", 403);
    }

    if (user.username === username) {
        throw new AppError("username is same as before", 400);
    }

    if (user.email === email) {
        throw new AppError("email is same as before", 400);
    }

    let avatarUrl = user.avatar;
    let avatarPublicUrl = user.avatarPublicId;

    if (file?.path) {
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                use_filename: true,
                unique_filename: false,
            });
    
            avatarUrl = result.secure_url;
            avatarPublicUrl = result.public_id;
    
            await fs.unlink(file.path);
        } catch (error) {
            throw new AppError("Failed to upload avatar", 500);
        }
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            email,
            firstName,
            lastName,
            username,
            bio,
            phone,
            avatar: avatarUrl,
            avatarPublicId: avatarPublicUrl
        }
    });

    return updatedUser;
}