import { 
  createValidator, 
  ensureString, 
  ensureOptionalString,
  ensureNumber
} from "./index.js";

export const createFloorValidator = createValidator((req) => {
  const { body } = req;
  ensureString(body.floorNumber, "floorNumber", { min: 1, max: 10 });
  ensureString(body.name, "name", { min: 2, max: 50 });
});

export const updateFloorValidator = createValidator((req) => {
  const { body } = req;
  ensureOptionalString(body.floorNumber, "floorNumber", { min: 1, max: 10 });
  ensureOptionalString(body.name, "name", { min: 2, max: 50 });
});
