import express from "express";
import * as floorController from "../controllers/floor.controller.js";
import { identifyUser, checkRole } from "../middlewares/security/index.js";
import { createFloorValidator, updateFloorValidator } from "../middlewares/validators/floor.validator.js";

const router = express.Router();

router.use(identifyUser);
router.use(checkRole("system_admin", "hostel_admin"));

router.post("/", createFloorValidator, floorController.create);
router.get("/", floorController.getAll);
router.get("/:id", floorController.getOne);
router.patch("/:id", updateFloorValidator, floorController.update);
router.delete("/:id", floorController.deleteFloor);

export default router;
