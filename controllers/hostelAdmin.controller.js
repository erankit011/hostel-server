import { catchAsync } from "../utils/catchAsync.js";
import { hostelAdminService } from "../services/hostelAdmin.service.js";

// POST /api/v1/system-admin/hostel-admins
export const create = catchAsync(async (req, res) => {
  const admin = await hostelAdminService.create(req.body, req.user.tenantId);
  res.status(201).json({ success: true, message: "Hostel Admin created", data: admin });
});

// GET /api/v1/system-admin/hostel-admins
export const getAll = catchAsync(async (req, res) => {
  const result = await hostelAdminService.getAll(req.user.tenantId, req.query);
  res.status(200).json({ success: true, ...result });
});

// GET /api/v1/system-admin/hostel-admins/:id
export const getOne = catchAsync(async (req, res) => {
  const admin = await hostelAdminService.getOne(req.params.id, req.user.tenantId);
  res.status(200).json({ success: true, data: admin });
});

// PATCH /api/v1/system-admin/hostel-admins/:id
export const update = catchAsync(async (req, res) => {
  const admin = await hostelAdminService.update(req.params.id, req.user.tenantId, req.body);
  res.status(200).json({ success: true, message: "Hostel Admin updated", data: admin });
});

// PATCH /api/v1/system-admin/hostel-admins/:id/block
export const block = catchAsync(async (req, res) => {
  const admin = await hostelAdminService.block(req.params.id, req.user.tenantId);
  res.status(200).json({ success: true, message: "Hostel Admin blocked", data: admin });
});

// PATCH /api/v1/system-admin/hostel-admins/:id/unblock
export const unblock = catchAsync(async (req, res) => {
  const admin = await hostelAdminService.unblock(req.params.id, req.user.tenantId);
  res.status(200).json({ success: true, message: "Hostel Admin unblocked", data: admin });
});

// DELETE /api/v1/system-admin/hostel-admins/:id
export const deleteAdmin = catchAsync(async (req, res) => {
  const result = await hostelAdminService.delete(req.params.id, req.user.tenantId);
  res.status(200).json({ success: true, ...result });
});

// GET /api/v1/system-admin/statistics
export const getStatistics = catchAsync(async (req, res) => {
  const stats = await hostelAdminService.getStatistics(req.user.tenantId);
  res.status(200).json({ success: true, data: stats });
});
