import express from "express";
import { loginUser, logoutUser, registerUser } from "../../controllers/auth/auth.controller.js";
import { auth } from "../../middlewares/auth.js";
import { validateBody } from "../../middlewares/zodValidators.js";
import { loginSchema, registerSchema } from "../../validators/authValidation.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), registerUser);
authRouter.post("/login", validateBody(loginSchema), loginUser);
authRouter.post("/logout", auth, logoutUser);

export default authRouter;