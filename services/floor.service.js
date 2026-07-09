import { AppError } from "../utils/AppError.js";
import { floorRepository } from "../repositories/floor.repository.js";
import { Room } from "../models/index.js";

export class FloorService {

  async create(data, tenantId) {
    const existing = await floorRepository.findOne(tenantId, { floorNumber: data.floorNumber });
    if (existing) {
      throw new AppError(`Floor ${data.floorNumber} already exists`, 400);
    }
    // inject tenantId into data
    return await floorRepository.create({ ...data, tenantId });
  }

  async getAll(tenantId) {
    return await floorRepository.findAll(tenantId, {}, {
      include: [{ model: Room, as: "rooms" }],
      order: [["floorNumber", "ASC"]],
    });
  }

  async getOne(id, tenantId) {
    return await floorRepository.findById(id, tenantId, {
      include: [{ model: Room, as: "rooms" }],
    });
  }

  async update(id, tenantId, data) {
    const floor = await floorRepository.findById(id, tenantId);

    if (data.floorNumber && data.floorNumber !== floor.floorNumber) {
      const existing = await floorRepository.findOne(tenantId, { floorNumber: data.floorNumber });
      if (existing) {
        throw new AppError(`Floor ${data.floorNumber} already exists`, 400);
      }
    }

    return await floorRepository.update(floor.id, tenantId, data);
  }

  async delete(id, tenantId) {
    const floor = await floorRepository.findById(id, tenantId, {
      include: [{ model: Room, as: "rooms" }],
    });

    if (floor.rooms && floor.rooms.length > 0) {
      throw new AppError("Cannot delete floor with existing rooms. Remove rooms first.", 400);
    }

    await floorRepository.delete(floor.id, tenantId);
    return { message: "Floor deleted successfully" };
  }
}

export const floorService = new FloorService();
