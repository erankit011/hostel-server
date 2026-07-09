import { 
  createValidator, 
  ensureString, 
  ensureOptionalString,
  ensureUuid
} from "./index.js";

export const allocateRoomValidator = createValidator((req) => {
  const { body } = req;
  ensureUuid(body.studentId, "studentId");
  ensureUuid(body.roomId, "roomId");
  ensureOptionalString(body.remarks, "remarks");
});

export const updateAllocationValidator = createValidator((req) => {
  const { body } = req;
  ensureOptionalString(body.remarks, "remarks");
});

export const shiftRoomValidator = createValidator((req) => {
  const { body } = req;
  ensureUuid(body.newRoomId, "newRoomId");
});
