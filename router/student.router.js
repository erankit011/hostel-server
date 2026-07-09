import express from "express";
import * as studentController from "../controllers/student.controller.js";
import { identifyUser, checkRole } from "../middlewares/security/index.js";
import { 
  createStudentValidator, 
  updateStudentValidator, 
  updateStudentStatusValidator, 
  addDocumentValidator 
} from "../middlewares/validators/student.validator.js";

const router = express.Router();

router.use(identifyUser);
router.use(checkRole("system_admin", "hostel_admin"));

// Specific routes
router.get("/search", studentController.getAll); 
router.get("/active", studentController.getActiveStudents);
router.get("/left", studentController.getLeftStudents);

// CRUD
router.post("/", createStudentValidator, studentController.create);
router.get("/", studentController.getAll);
router.get("/:id", studentController.getOne);
router.patch("/:id", updateStudentValidator, studentController.update);
router.delete("/:id", studentController.deleteStudent);
router.patch("/:id/status", updateStudentStatusValidator, studentController.updateStatus);

// Documents
router.post("/:studentId/documents", addDocumentValidator, studentController.addDocument);
router.get("/:studentId/documents", studentController.getDocuments);

// Allocations related to student
router.get("/:studentId/room", studentController.getStudentRoom);
router.get("/:studentId/allocation-history", studentController.getAllocationHistory);

export default router;
