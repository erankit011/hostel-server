import { RoomAllocation } from "../models/index.js";
import { BaseRepository } from "./base.repository.js";

class RoomAllocationRepository extends BaseRepository {
  constructor() {
    super(RoomAllocation);
  }
}

export const roomAllocationRepository = new RoomAllocationRepository();
