import { userProfile, editProfile } from "../../services/user/user.service.js";

export const getUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const user = await userProfile(userId);
        if (user.id !== userId) {
            return res.status(403).json({
                message: "Unauthorized: only the user can access their profile"
            });
        }

        return res.status(200).json({
            message: "User profile retrieved successfully",
            user
        });
    } catch (error) {
        next(error);
    }
};

export const editUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const updatedUser = await editProfile(userId, req.body, req.file);

        if (user.id !== userId) {
            return res.status(403).json({
                message: "Unauthorized: only the user can edit their profile"
            });
        }

        return res.status(200).json({
            message: "User profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        next(error);
    }
}