import { 
  createValidator, 
  ensureString, 
  ensureOptionalString,
  ensureEmail,
  ensureEnum,
  ensureDate
} from "./index.js";

export const createStudentValidator = createValidator((req) => {
  const { body } = req;
  ensureString(body.firstName, "firstName", { min: 2 });
  ensureString(body.lastName, "lastName", { min: 2 });
  ensureString(body.enrollmentNo, "enrollmentNo", { min: 2 });
  ensureEmail(body.email, "email");
  ensureString(body.phone, "phone", { min: 10, max: 15 });
  ensureEnum(body.gender, "gender", ["male", "female", "other"]);
  ensureDate(body.dateOfBirth, "dateOfBirth");
  ensureString(body.bloodGroup, "bloodGroup");
  ensureString(body.guardianName, "guardianName");
  ensureString(body.guardianPhone, "guardianPhone");
  ensureString(body.address, "address");
});

export const updateStudentValidator = createValidator((req) => {
  const { body } = req;
  ensureOptionalString(body.firstName, "firstName", { min: 2 });
  ensureOptionalString(body.lastName, "lastName", { min: 2 });
  ensureOptionalString(body.phone, "phone", { min: 10, max: 15 });
  // Add others if needed
});

export const updateStudentStatusValidator = createValidator((req) => {
  const { body } = req;
  ensureEnum(body.status, "status", ["active", "inactive", "left"]);
});

export const addDocumentValidator = createValidator((req) => {
  const { body } = req;
  ensureString(body.documentType, "documentType");
  ensureString(body.documentUrl, "documentUrl");
});
