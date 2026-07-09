import { catchAsync } from "../utils/catchAsync.js";
import { studentService } from "../services/student.service.js";

export const create = catchAsync(async (req, res) => {
  const student = await studentService.create(req.body, req.user.tenantId);
  res.status(201).json({ success: true, message: "Student created", data: student });
});

export const getAll = catchAsync(async (req, res) => {
  const students = await studentService.getAll(req.user.tenantId, req.query);
  res.status(200).json({ success: true, results: students.length, data: students });
});

export const getOne = catchAsync(async (req, res) => {
  const student = await studentService.getOne(req.params.id, req.user.tenantId);
  res.status(200).json({ success: true, data: student });
});

export const update = catchAsync(async (req, res) => {
  const student = await studentService.update(req.params.id, req.user.tenantId, req.body);
  res.status(200).json({ success: true, message: "Student updated", data: student });
});

export const deleteStudent = catchAsync(async (req, res) => {
  const result = await studentService.delete(req.params.id, req.user.tenantId);
  res.status(200).json({ success: true, ...result });
});

export const addDocument = catchAsync(async (req, res) => {
    const doc = await studentService.addDocument(req.params.studentId, req.user.tenantId, req.body);
    res.status(201).json({ success: true, message: "Document uploaded", data: doc });
});

export const getDocuments = catchAsync(async (req, res) => {
    const docs = await studentService.getDocuments(req.params.studentId, req.user.tenantId);
    res.status(200).json({ success: true, data: docs });
});

export const updateStatus = catchAsync(async (req, res) => {
    const student = await studentService.updateStatus(req.params.id, req.user.tenantId, req.body.status);
    res.status(200).json({ success: true, message: "Status updated", data: student });
});

export const getStudentRoom = catchAsync(async (req, res) => {
    const room = await studentService.getStudentRoom(req.params.studentId, req.user.tenantId);
    res.status(200).json({ success: true, data: room });
});

export const getAllocationHistory = catchAsync(async (req, res) => {
    const history = await studentService.getAllocationHistory(req.params.studentId, req.user.tenantId);
    res.status(200).json({ success: true, data: history });
});

export const getActiveStudents = catchAsync(async (req, res) => {
    const students = await studentService.getActiveStudents(req.user.tenantId);
    res.status(200).json({ success: true, results: students.length, data: students });
});

export const getLeftStudents = catchAsync(async (req, res) => {
    const students = await studentService.getLeftStudents(req.user.tenantId);
    res.status(200).json({ success: true, results: students.length, data: students });
});
