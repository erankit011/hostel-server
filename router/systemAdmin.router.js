import express from "express";
import * as hostelAdminController from "../controllers/hostelAdmin.controller.js";
import { identifyUser, checkRole } from "../middlewares/security/index.js";
import { createHostelAdminValidator, updateHostelAdminValidator } from "../middlewares/validators/hostelAdmin.validator.js";

const router = express.Router();

router.use(identifyUser);
router.use(checkRole("system_admin"));

router.post("/hostel-admins", createHostelAdminValidator, hostelAdminController.create);
router.get("/hostel-admins", hostelAdminController.getAll);
router.get("/hostel-admins/:id", hostelAdminController.getOne);
router.patch("/hostel-admins/:id", updateHostelAdminValidator, hostelAdminController.update);
router.patch("/hostel-admins/:id/block", hostelAdminController.block);
router.patch("/hostel-admins/:id/unblock", hostelAdminController.unblock);
router.delete("/hostel-admins/:id", hostelAdminController.deleteAdmin);
router.get("/statistics", hostelAdminController.getStatistics);

export default router;
