import { catchAsync } from "../utils/catchAsync.js";
import { floorService } from "../services/floor.service.js";

export const create = catchAsync(async (req, res) => {
  const tenantId = req.user.tenantId;
  const floor = await floorService.create(req.body, tenantId);
  res.status(201).json({ success: true, message: "Floor created", data: floor });
});

export const getAll = catchAsync(async (req, res) => {
  const tenantId = req.user.tenantId;
  const floors = await floorService.getAll(tenantId);
  res.status(200).json({ success: true, results: floors.length, data: floors });
});

export const getOne = catchAsync(async (req, res) => {
  const tenantId = req.user.tenantId;
  const floor = await floorService.getOne(req.params.id, tenantId);
  res.status(200).json({ success: true, data: floor });
});

export const update = catchAsync(async (req, res) => {
  const tenantId = req.user.tenantId;
  const floor = await floorService.update(req.params.id, tenantId, req.body);
  res.status(200).json({ success: true, message: "Floor updated", data: floor });
});

export const deleteFloor = catchAsync(async (req, res) => {
  const tenantId = req.user.tenantId;
  const result = await floorService.delete(req.params.id, tenantId);
  res.status(200).json({ success: true, ...result });
});
