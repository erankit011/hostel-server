import { Floor } from "../models/index.js";
import { BaseRepository } from "./base.repository.js";

class FloorRepository extends BaseRepository {
  constructor() {
    super(Floor);
  }
}

export const floorRepository = new FloorRepository();
