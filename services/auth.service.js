import { AppError } from "../utils/AppError.js";
import { userRepository } from "../repositories/user.repository.js";
import { BcryptHelper } from "../utils/bcrypt.js";
import { JwtHelper } from "../utils/jwt.js";
import crypto from "crypto";

export class AuthService {

  // ============== LOGIN ==============
  async login(email, password) {
    const user = await userRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    if (user.status !== "active") {
      throw new AppError(
        `Account is ${user.status}. Please contact administrator.`,
        403
      );
    }

    const isMatch = await BcryptHelper.comparePassword(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    await user.update({ lastLoginAt: new Date() });

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };

    const token = JwtHelper.generateToken(payload);

    const userResponse = user.get({ plain: true });
    delete userResponse.password;

    return { token, user: userResponse };
  }

  // ============== REFRESH TOKEN ==============
  async refreshToken(oldToken) {
    // Purane token se user data nikalo (expired bhi ho sakta hai)
    const decoded = JwtHelper.decodeToken(oldToken);
    if (!decoded || !decoded.id) {
      throw new AppError("Invalid token", 401);
    }

    // Verify user still exists and is active
    const user = await userRepository.findByIdGlobal(decoded.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    if (user.status !== "active") {
      throw new AppError(`Account is ${user.status}`, 403);
    }

    // Naya token generate karo
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };

    const newToken = JwtHelper.generateToken(payload);
    return { token: newToken };
  }

  // ============== CHANGE PASSWORD ==============
  async changePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.findByIdGlobalWithPassword(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Current password verify karo
    const isMatch = await BcryptHelper.comparePassword(
      currentPassword,
      user.password
    );
    if (!isMatch) {
      throw new AppError("Current password is incorrect", 401);
    }

    // New password same nahi hona chahiye
    const isSame = await BcryptHelper.comparePassword(
      newPassword,
      user.password
    );
    if (isSame) {
      throw new AppError(
        "New password cannot be same as current password",
        400
      );
    }

    // Hash and save new password
    const hashedPassword = await BcryptHelper.hashPassword(newPassword);
    await user.update({ password: hashedPassword });

    return { message: "Password changed successfully" };
  }

  // ============== FORGOT PASSWORD ==============
  async forgotPassword(email) {
    const user = await userRepository.findByEmailWithPassword(email); // we just need findOne globally, findByEmailWithPassword acts as global findOne
    if (!user) {
      // Security: same message even if user not found
      return {
        message: "If this email exists, a password reset link has been sent",
      };
    }

    // Generate a reset token (6 digit OTP style for simplicity)
    const resetToken = crypto.randomInt(100000, 999999).toString();
    const resetExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store in user metadata
    await user.update({
      metadata: {
        ...user.metadata,
        resetToken,
        resetExpiry,
      },
    });

    // NOTE: Email service integrate karoge tab yahan se email bhejoge
    console.log(`🔑 Password Reset OTP for ${email}: ${resetToken}`);

    return {
      message: "If this email exists, a password reset link has been sent",
      // Development mein OTP return karo taaki test kar sako
      ...(process.env.NODE_ENV === "development" && { resetToken }),
    };
  }

  // ============== RESET PASSWORD ==============
  async resetPassword(email, resetToken, newPassword) {
    const user = await userRepository.findByEmailWithPassword(email);
    if (!user) {
      throw new AppError("Invalid request", 400);
    }

    // Verify reset token
    const storedToken = user.metadata?.resetToken;
    const tokenExpiry = user.metadata?.resetExpiry;

    if (!storedToken || storedToken !== resetToken) {
      throw new AppError("Invalid or expired reset token", 400);
    }

    if (new Date() > new Date(tokenExpiry)) {
      throw new AppError("Reset token has expired", 400);
    }

    // Hash and save new password, clear reset token
    const hashedPassword = await BcryptHelper.hashPassword(newPassword);
    const updatedMetadata = { ...user.metadata };
    delete updatedMetadata.resetToken;
    delete updatedMetadata.resetExpiry;

    await user.update({
      password: hashedPassword,
      metadata: updatedMetadata,
    });

    return { message: "Password reset successfully" };
  }
}

export const authService = new AuthService();
