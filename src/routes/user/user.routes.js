import express from "express";
import { auth } from "../../middlewares/auth.js";
import { editUserProfile, getUserProfile } from "../../controllers/user/user.controller.js";
import { validateBody } from "../../middlewares/zodValidators.js";
import { userSchema } from "../../validators/userValidation.js";
import { upload } from "../../middlewares/multer.js";

const userRouter = express.Router();

userRouter.get("/profile", auth, getUserProfile);
userRouter.patch("/edit-profile", validateBody(userSchema), auth, upload.single("avatar"), editUserProfile);

export default userRouter;