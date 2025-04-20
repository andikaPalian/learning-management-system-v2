import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { AppError } from "../../utils/errorHandler.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/generateTokens.js";

const prisma = new PrismaClient();
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export const register = async ({firstName, lastName, username, gender, email, password}) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (existingUser) {
        throw new AppError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            firstName,
            lastName,
            username,
            gender,
            email,
            password: hashedPassword,
            role: "STUDENT"
        }
    });

    return {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
    };
};

export const login = async ({email, password}) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (!user) {
        throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError("Invalid credentials", 401);
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await storeRefreshToken(user.id, refreshToken);

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role
        }
    }
};

const storeRefreshToken = async (userId, token) => {
    await prisma.refreshToken.create({
        data: {
            token,
            userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    });
};

export const logout = async (userId) => {
    await prisma.refreshToken.deleteMany({
        where: {
            userId: userId
        }
    });
};