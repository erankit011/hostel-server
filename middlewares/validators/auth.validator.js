import { 
  createValidator, 
  ensureEmail, 
  ensureString, 
  ensureOptionalString 
} from "./index.js";

export const loginValidator = createValidator((req) => {
  const { body } = req;
  ensureEmail(body.email, "email");
  ensureString(body.password, "password", { min: 6 });
});

export const forgotPasswordValidator = createValidator((req) => {
  const { body } = req;
  ensureEmail(body.email, "email");
});

export const resetPasswordValidator = createValidator((req) => {
  const { body } = req;
  ensureEmail(body.email, "email");
  ensureString(body.resetToken, "resetToken", { min: 6, max: 6 });
  ensureString(body.newPassword, "newPassword", { min: 8 });
});

export const changePasswordValidator = createValidator((req) => {
  const { body } = req;
  ensureString(body.currentPassword, "currentPassword", { min: 6 });
  ensureString(body.newPassword, "newPassword", { min: 8 });
});

export const updateProfileValidator = createValidator((req) => {
  const { body } = req;
  ensureOptionalString(body.firstName, "firstName", { min: 2 });
  ensureOptionalString(body.lastName, "lastName", { min: 2 });
  ensureOptionalString(body.phone, "phone", { min: 10, max: 15 });
});

export const avatarUploadValidator = createValidator((req) => {
  const { body } = req;
  ensureString(body.imageUrl, "imageUrl");
});
