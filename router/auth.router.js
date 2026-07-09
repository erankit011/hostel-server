import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { identifyUser } from "../middlewares/security/index.js";
import { 
    loginValidator, 
    forgotPasswordValidator, 
    resetPasswordValidator, 
    changePasswordValidator 
} from "../middlewares/validators/auth.validator.js";

const router = express.Router();

router.post("/login", loginValidator, authController.login);
router.post("/logout", identifyUser, authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.post("/forgot-password", forgotPasswordValidator, authController.forgotPassword);
router.post("/reset-password", resetPasswordValidator, authController.resetPassword);

router.patch("/change-password", identifyUser, changePasswordValidator, authController.changePassword);

export default router;
