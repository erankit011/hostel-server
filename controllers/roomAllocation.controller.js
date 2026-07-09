import { catchAsync } from "../utils/catchAsync.js";
import { roomAllocationService } from "../services/roomAllocation.service.js";

export const allocate = catchAsync(async (req, res) => {
  const allocation = await roomAllocationService.allocate(req.body, req.user.tenantId);
  res.status(201).json({ success: true, message: "Room allocated successfully", data: allocation });
});

export const getAll = catchAsync(async (req, res) => {
  const allocations = await roomAllocationService.getAll(req.user.tenantId, req.query);
  res.status(200).json({ success: true, results: allocations.length, data: allocations });
});

export const getOne = catchAsync(async (req, res) => {
  const allocation = await roomAllocationService.getOne(req.params.id, req.user.tenantId);
  res.status(200).json({ success: true, data: allocation });
});

export const update = catchAsync(async (req, res) => {
  const allocation = await roomAllocationService.update(req.params.id, req.user.tenantId, req.body);
  res.status(200).json({ success: true, message: "Allocation updated", data: allocation });
});

export const shift = catchAsync(async (req, res) => {
  const allocation = await roomAllocationService.shift(req.params.id, req.user.tenantId, req.body.newRoomId);
  res.status(200).json({ success: true, message: "Student shifted successfully", data: allocation });
});

export const vacate = catchAsync(async (req, res) => {
  const allocation = await roomAllocationService.vacate(req.params.id, req.user.tenantId);
  res.status(200).json({ success: true, message: "Room vacated successfully", data: allocation });
});

export const getHistory = catchAsync(async (req, res) => {
  // Same as getAll but only non-active
  const history = await roomAllocationService.getAll(req.user.tenantId, { ...req.query, status: req.query.status || undefined });
  // This is a simple implementation. The service getAll supports status filter.
  res.status(200).json({ success: true, results: history.length, data: history });
});
