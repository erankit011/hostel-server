import { AppError } from "../utils/AppError.js";
import { roomAllocationRepository } from "../repositories/roomAllocation.repository.js";
import { studentRepository } from "../repositories/student.repository.js";
import { roomRepository } from "../repositories/room.repository.js";
import { Room, Student, Floor } from "../models/index.js";
import { Op } from "sequelize";

export class RoomAllocationService {
  async allocate(data, tenantId) {
    const student = await studentRepository.findById(data.studentId, tenantId);
    if (student.status !== "active") throw new AppError("Student is not active", 400);

    const existingAllocation = await roomAllocationRepository.findOne(tenantId, { studentId: data.studentId, status: "active" });
    if (existingAllocation) {
        throw new AppError("Student already has an active room allocation", 400);
    }

    const room = await roomRepository.findById(data.roomId, tenantId);
    if (room.status !== "available") throw new AppError("Room is not available", 400);
    if (room.currentOccupancy >= room.capacity) {
        throw new AppError("Room has reached its maximum capacity", 400);
    }

    const allocation = await roomAllocationRepository.create({
        studentId: data.studentId,
        roomId: data.roomId,
        status: "active",
        remarks: data.remarks,
        tenantId
    });

    const newOccupancy = room.currentOccupancy + 1;
    let newStatus = room.status;
    if (newOccupancy >= room.capacity) {
        newStatus = "full";
    }

    await roomRepository.update(room.id, tenantId, { 
        currentOccupancy: newOccupancy,
        status: newStatus 
    });

    return allocation;
  }

  async getAll(tenantId, query = {}) {
      const { search, status } = query;
      const filters = {};
      if (status) filters.status = status;

      const include = [
          { model: Student, as: "student", attributes: ["id", "firstName", "lastName", "enrollmentNo"] },
          { model: Room, as: "room", attributes: ["id", "roomNumber"], include: [{ model: Floor, as: "floor", attributes: ["floorNumber"] }] }
      ];

      if (search) {
          include[0].where = {
              [Op.or]: [
                  { firstName: { [Op.iLike]: `%${search}%` } },
                  { lastName: { [Op.iLike]: `%${search}%` } },
                  { enrollmentNo: { [Op.iLike]: `%${search}%` } },
              ]
          };
      }

      return await roomAllocationRepository.findAll(tenantId, filters, {
          include,
          order: [["allocatedAt", "DESC"]]
      });
  }

  async getOne(id, tenantId) {
      return await roomAllocationRepository.findById(id, tenantId, {
          include: [
              { model: Student, as: "student" },
              { model: Room, as: "room", include: [{ model: Floor, as: "floor" }] }
          ]
      });
  }

  async update(id, tenantId, data) {
      const allocation = await roomAllocationRepository.findById(id, tenantId);

      const safeData = { ...data };
      delete safeData.studentId;
      delete safeData.roomId;
      delete safeData.status;

      return await roomAllocationRepository.update(allocation.id, tenantId, safeData);
  }

  async shift(id, tenantId, newRoomId) {
      const allocation = await roomAllocationRepository.findById(id, tenantId, {
          include: [{ model: Room, as: "room" }]
      });
      if (allocation.status !== "active") throw new AppError("Can only shift active allocations", 400);

      const newRoom = await roomRepository.findById(newRoomId, tenantId);
      if (newRoom.status !== "available") throw new AppError("New room is not available", 400);
      if (newRoom.currentOccupancy >= newRoom.capacity) {
          throw new AppError("New room has reached its maximum capacity", 400);
      }

      if (allocation.roomId === newRoomId) {
          throw new AppError("Student is already in this room", 400);
      }

      const oldRoom = allocation.room;

      await roomAllocationRepository.update(allocation.id, tenantId, { 
          status: "shifted", 
          vacatedAt: new Date(),
          remarks: `Shifted to room ${newRoom.roomNumber}`
      });

      await roomRepository.update(oldRoom.id, tenantId, {
          currentOccupancy: Math.max(0, oldRoom.currentOccupancy - 1),
          status: oldRoom.status === "full" ? "available" : oldRoom.status
      });

      const newAllocation = await roomAllocationRepository.create({
          studentId: allocation.studentId,
          roomId: newRoomId,
          status: "active",
          remarks: `Shifted from room ${oldRoom.roomNumber}`,
          tenantId
      });

      const newOccupancy = newRoom.currentOccupancy + 1;
      await roomRepository.update(newRoom.id, tenantId, {
          currentOccupancy: newOccupancy,
          status: newOccupancy >= newRoom.capacity ? "full" : newRoom.status
      });

      return newAllocation;
  }

  async vacate(id, tenantId) {
      const allocation = await roomAllocationRepository.findById(id, tenantId, {
          include: [{ model: Room, as: "room" }]
      });
      if (allocation.status !== "active") throw new AppError("Can only vacate active allocations", 400);

      await roomAllocationRepository.update(allocation.id, tenantId, {
          status: "vacated",
          vacatedAt: new Date()
      });

      const room = allocation.room;
      await roomRepository.update(room.id, tenantId, {
          currentOccupancy: Math.max(0, room.currentOccupancy - 1),
          status: room.status === "full" ? "available" : room.status
      });

      return allocation;
  }
}

export const roomAllocationService = new RoomAllocationService();
