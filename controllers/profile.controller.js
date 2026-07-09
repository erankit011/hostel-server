import { catchAsync } from "../utils/catchAsync.js";
import { profileService } from "../services/profile.service.js";

// GET /api/v1/profile
export const getProfile = catchAsync(async (req, res) => {
  const profile = await profileService.getProfile(req.user.id, req.user.tenantId);
  res.status(200).json({ success: true, data: profile });
});

// PATCH /api/v1/profile
export const updateProfile = catchAsync(async (req, res) => {
  const profile = await profileService.updateProfile(req.user.id, req.user.tenantId, req.body);
  res.status(200).json({ success: true, message: "Profile updated", data: profile });
});

// PATCH /api/v1/profile/avatar
export const uploadAvatar = catchAsync(async (req, res) => {
  const { imageUrl } = req.body;
  const profile = await profileService.updateAvatar(req.user.id, req.user.tenantId, imageUrl);
  res.status(200).json({ success: true, message: "Avatar updated", data: profile });
});

// DELETE /api/v1/profile/avatar
export const deleteAvatar = catchAsync(async (req, res) => {
  const profile = await profileService.deleteAvatar(req.user.id, req.user.tenantId);
  res.status(200).json({ success: true, message: "Avatar removed", data: profile });
});
