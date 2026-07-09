import { catchAsync } from "../utils/catchAsync.js";
import { roomService } from "../services/room.service.js";

export const create = catchAsync(async (req, res) => {
  const room = await roomService.create(req.body, req.user.tenantId);
  res.status(201).json({ success: true, message: "Room created", data: room });
});

export const getAll = catchAsync(async (req, res) => {
  const rooms = await roomService.getAll(req.user.tenantId, req.query);
  res.status(200).json({ success: true, results: rooms.length, data: rooms });
});

export const getOne = catchAsync(async (req, res) => {
  const room = await roomService.getOne(req.params.id, req.user.tenantId);
  res.status(200).json({ success: true, data: room });
});

export const update = catchAsync(async (req, res) => {
  const room = await roomService.update(req.params.id, req.user.tenantId, req.body);
  res.status(200).json({ success: true, message: "Room updated", data: room });
});

export const updateStatus = catchAsync(async (req, res) => {
    const room = await roomService.updateStatus(req.params.id, req.user.tenantId, req.body.status);
    res.status(200).json({ success: true, message: "Room status updated", data: room });
});

export const deleteRoom = catchAsync(async (req, res) => {
  const result = await roomService.delete(req.params.id, req.user.tenantId);
  res.status(200).json({ success: true, ...result });
});

export const getOccupancy = catchAsync(async (req, res) => {
    const stats = await roomService.getOccupancy(req.user.tenantId);
    res.status(200).json({ success: true, data: stats });
});

export const getAvailability = catchAsync(async (req, res) => {
    const summary = await roomService.getAvailability(req.user.tenantId);
    res.status(200).json({ success: true, data: summary });
});

export const getVacantRooms = catchAsync(async (req, res) => {
    const rooms = await roomService.getVacantRooms(req.user.tenantId);
    res.status(200).json({ success: true, results: rooms.length, data: rooms });
});

export const getOccupiedRooms = catchAsync(async (req, res) => {
    const rooms = await roomService.getOccupiedRooms(req.user.tenantId);
    res.status(200).json({ success: true, results: rooms.length, data: rooms });
});
