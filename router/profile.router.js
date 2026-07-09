import express from "express";
import * as profileController from "../controllers/profile.controller.js";
import { identifyUser } from "../middlewares/security/index.js";
import { updateProfileValidator, avatarUploadValidator } from "../middlewares/validators/auth.validator.js";

const router = express.Router();

router.use(identifyUser);

router.get("/", profileController.getProfile);
router.patch("/", updateProfileValidator, profileController.updateProfile);
router.patch("/avatar", avatarUploadValidator, profileController.uploadAvatar);
router.delete("/avatar", profileController.deleteAvatar);

export default router;
