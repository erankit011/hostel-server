import express from "express";
import * as roomAllocationController from "../controllers/roomAllocation.controller.js";
import { identifyUser, checkRole } from "../middlewares/security/index.js";
import { 
  allocateRoomValidator, 
  updateAllocationValidator, 
  shiftRoomValidator 
} from "../middlewares/validators/roomAllocation.validator.js";

const router = express.Router();

router.use(identifyUser);
router.use(checkRole("system_admin", "hostel_admin"));

router.get("/search", roomAllocationController.getAll); 
router.get("/history", roomAllocationController.getHistory);

router.post("/", allocateRoomValidator, roomAllocationController.allocate);
router.get("/", roomAllocationController.getAll);
router.get("/:id", roomAllocationController.getOne);
router.patch("/:id", updateAllocationValidator, roomAllocationController.update);

router.patch("/:id/shift", shiftRoomValidator, roomAllocationController.shift);
router.patch("/:id/vacate", roomAllocationController.vacate);

export default router;
