import { catchAsync } from "../utils/catchAsync.js";
import { authService } from "../services/auth.service.js";
import {
  getTokenCookieClearOptions,
  getTokenCookieName,
  getTokenCookieOptions,
} from "../utils/cookie.js";

// POST /api/v1/auth/login
export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { token, user } = await authService.login(email, password);

  res.cookie(getTokenCookieName(), token, getTokenCookieOptions());

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user,
  });
});

// POST /api/v1/auth/logout
export const logout = catchAsync(async (req, res) => {
  res.cookie(getTokenCookieName(), "", getTokenCookieClearOptions());

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

// POST /api/v1/auth/refresh-token
export const refreshToken = catchAsync(async (req, res) => {
  const oldToken =
    req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!oldToken) {
    return res.status(401).json({ success: false, message: "Token required" });
  }

  const { token } = await authService.refreshToken(oldToken);

  res.cookie(getTokenCookieName(), token, getTokenCookieOptions());

  res.status(200).json({
    success: true,
    message: "Token refreshed",
    token,
  });
});

// POST /api/v1/auth/forgot-password
export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);

  res.status(200).json({
    success: true,
    ...result,
  });
});

// POST /api/v1/auth/reset-password
export const resetPassword = catchAsync(async (req, res) => {
  const { email, resetToken, newPassword } = req.body;
  const result = await authService.resetPassword(email, resetToken, newPassword);

  res.status(200).json({
    success: true,
    ...result,
  });
});

// PATCH /api/v1/auth/change-password
export const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await authService.changePassword(
    req.user.id,
    currentPassword,
    newPassword
  );

  res.status(200).json({
    success: true,
    ...result,
  });
});
