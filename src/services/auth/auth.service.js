import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppError } from "../../utils/errorHandler.js";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

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
    if (isMatch) {
        const token = jwt.sign({
            id: user.id,
            role: user.role
        }, JWT_SECRET, {
            expiresIn: "1d"
        });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role
            }
        }
    } else {
        throw new AppError("Invalid credentials", 401);
    }
};