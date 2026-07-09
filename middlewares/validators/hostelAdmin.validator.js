import { 
  createValidator, 
  ensureString, 
  ensureEmail, 
  ensureOptionalString, 
  ensureEnum
} from "./index.js";

export const createHostelAdminValidator = createValidator((req) => {
  const { body } = req;
  ensureString(body.firstName, "firstName", { min: 2 });
  ensureString(body.lastName, "lastName", { min: 2 });
  ensureEmail(body.email, "email");
  ensureString(body.password, "password", { min: 8 });
  ensureOptionalString(body.phone, "phone", { min: 10, max: 15 });
});

export const updateHostelAdminValidator = createValidator((req) => {
  const { body } = req;
  ensureOptionalString(body.firstName, "firstName", { min: 2 });
  ensureOptionalString(body.lastName, "lastName", { min: 2 });
  ensureOptionalString(body.phone, "phone", { min: 10, max: 15 });
});
