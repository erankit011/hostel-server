import { AppError } from "../utils/AppError.js";
import { roomRepository } from "../repositories/room.repository.js";
import { floorRepository } from "../repositories/floor.repository.js";
import { Floor, RoomAllocation, Student } from "../models/index.js";
import { Op } from "sequelize";
import sequelize from "../config/db.js";

export class RoomService {
  async create(data, tenantId) {
    const floor = await floorRepository.findById(data.floorId, tenantId);
    if (!floor) {
      throw new AppError("Floor not found", 404);
    }

    const existing = await roomRepository.findOne(tenantId, { roomNumber: data.roomNumber });
    if (existing) {
      throw new AppError(`Room ${data.roomNumber} already exists`, 400);
    }

    return await roomRepository.create({ ...data, tenantId });
  }

  async getAll(tenantId, query = {}) {
    const { floor, status, search } = query;
    const filters = {};

    if (floor) filters.floorId = floor;
    if (status) filters.status = status;
    
    return await roomRepository.findAll(tenantId, filters, {
      where: search ? { roomNumber: { [Op.iLike]: `%${search}%` } } : undefined,
      include: [
        { model: Floor, as: "floor", attributes: ["floorNumber", "name"] },
      ],
      order: [["roomNumber", "ASC"]],
    });
  }

  async getOne(id, tenantId) {
    const room = await roomRepository.findById(id, tenantId, {
      include: [
        { model: Floor, as: "floor", attributes: ["floorNumber", "name"] },
        { 
          model: RoomAllocation, 
          as: "allocations",
          where: { status: "active" },
          required: false,
          include: [{ model: Student, as: "student", attributes: ["id", "firstName", "lastName", "enrollmentNo"] }]
        }
      ],
    });
    return room;
  }

  async update(id, tenantId, data) {
    const room = await roomRepository.findById(id, tenantId);

    if (data.roomNumber && data.roomNumber !== room.roomNumber) {
      const existing = await roomRepository.findOne(tenantId, { roomNumber: data.roomNumber });
      if (existing) {
        throw new AppError(`Room ${data.roomNumber} already exists`, 400);
      }
    }

    if (data.capacity && data.capacity < room.currentOccupancy) {
        throw new AppError("Capacity cannot be less than current occupancy", 400);
    }

    return await roomRepository.update(room.id, tenantId, data);
  }

  async updateStatus(id, tenantId, status) {
      const room = await roomRepository.findById(id, tenantId);
      
      const validStatuses = ["available", "full", "maintenance"];
      if(!validStatuses.includes(status)) {
          throw new AppError("Invalid status", 400);
      }

      return await roomRepository.update(room.id, tenantId, { status });
  }

  async delete(id, tenantId) {
    const room = await roomRepository.findById(id, tenantId, {
      include: [{ model: RoomAllocation, as: "allocations" }],
    });

    if (room.allocations && room.allocations.length > 0) {
      throw new AppError("Cannot delete room with allocation history.", 400);
    }

    await roomRepository.delete(room.id, tenantId);
    return { message: "Room deleted successfully" };
  }

  async getOccupancy(tenantId) {
      const totalRooms = await roomRepository.count(tenantId);
      const totalCapacity = await roomRepository.sum(tenantId, 'capacity') || 0;
      const currentOccupancy = await roomRepository.sum(tenantId, 'currentOccupancy') || 0;
      const availableBeds = totalCapacity - currentOccupancy;

      return { totalRooms, totalCapacity, currentOccupancy, availableBeds };
  }

  async getAvailability(tenantId) {
      const available = await roomRepository.count(tenantId, { status: 'available' });
      const full = await roomRepository.count(tenantId, { status: 'full' });
      const maintenance = await roomRepository.count(tenantId, { status: 'maintenance' });
      
      return { available, full, maintenance };
  }

  async getVacantRooms(tenantId) {
      return await roomRepository.findAll(tenantId, {
          status: 'available',
          currentOccupancy: { [Op.lt]: sequelize.col('capacity') }
      }, {
          include: [{ model: Floor, as: "floor", attributes: ["floorNumber", "name"] }],
      });
  }

  async getOccupiedRooms(tenantId) {
      return await roomRepository.findAll(tenantId, { status: 'full' }, {
          include: [{ model: Floor, as: "floor", attributes: ["floorNumber", "name"] }],
      });
  }
}

export const roomService = new RoomService();
