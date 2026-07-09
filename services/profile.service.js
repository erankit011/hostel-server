import { AppError } from "../utils/AppError.js";
import { userRepository } from "../repositories/user.repository.js";

export class ProfileService {
  async getProfile(userId, tenantId) {
    const user = await userRepository.findById(userId, tenantId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async updateProfile(userId, tenantId, data) {
    const safeData = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    };

    return await userRepository.update(userId, tenantId, safeData);
  }

  async updateAvatar(userId, tenantId, imageUrl) {
    if (!imageUrl) {
      throw new AppError("Image URL is required", 400);
    }
    return await userRepository.update(userId, tenantId, { profileImage: imageUrl });
  }

  async deleteAvatar(userId, tenantId) {
    return await userRepository.update(userId, tenantId, { profileImage: null });
  }
}

export const profileService = new ProfileService();
