import { 
  createValidator, 
  ensureString, 
  ensureOptionalString,
  ensureNumber,
  ensureUuid,
  ensureEnum
} from "./index.js";

export const createRoomValidator = createValidator((req) => {
  const { body } = req;
  ensureString(body.roomNumber, "roomNumber", { min: 1, max: 10 });
  ensureNumber(body.capacity, "capacity", { min: 1 });
  ensureUuid(body.floorId, "floorId");
});

export const updateRoomValidator = createValidator((req) => {
  const { body } = req;
  ensureOptionalString(body.roomNumber, "roomNumber", { min: 1, max: 10 });
  if (body.capacity !== undefined) {
    ensureNumber(body.capacity, "capacity", { min: 1 });
  }
});

export const updateRoomStatusValidator = createValidator((req) => {
  const { body } = req;
  ensureEnum(body.status, "status", ["available", "full", "maintenance"]);
});
