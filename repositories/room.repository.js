import { Room, Floor } from "../models/index.js";
import { BaseRepository } from "./base.repository.js";

class RoomRepository extends BaseRepository {
  constructor() {
    super(Room);
  }

  async getOneWithFloor(id, tenantId) {
    return await this.findById(id, tenantId, {
      include: [{ model: Floor, as: "floor" }]
    });
  }

  async getAllWithFloor(tenantId, search, filters = {}, page = 1, limit = 10) {
    return await this.search(tenantId, search, ["roomNumber"], {
      filters,
      page,
      limit,
      include: [{ model: Floor, as: "floor", attributes: ["floorNumber", "name"] }]
    });
  }
}

export const roomRepository = new RoomRepository();
