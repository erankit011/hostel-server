import express from "express";
import * as roomController from "../controllers/room.controller.js";
import { identifyUser, checkRole } from "../middlewares/security/index.js";
import { createRoomValidator, updateRoomValidator, updateRoomStatusValidator } from "../middlewares/validators/room.validator.js";

const router = express.Router();

router.use(identifyUser);
router.use(checkRole("system_admin", "hostel_admin"));

// Specific routes must come before dynamic /:id routes
router.get("/search", roomController.getAll); 
router.get("/occupancy", roomController.getOccupancy);
router.get("/availability", roomController.getAvailability);
router.get("/vacant", roomController.getVacantRooms);
router.get("/occupied", roomController.getOccupiedRooms);

router.post("/", createRoomValidator, roomController.create);
router.get("/", roomController.getAll);
router.get("/:id", roomController.getOne);
router.patch("/:id", updateRoomValidator, roomController.update);
router.patch("/:id/status", updateRoomStatusValidator, roomController.updateStatus);
router.delete("/:id", roomController.deleteRoom);

export default router;
