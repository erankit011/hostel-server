import { User } from "../models/index.js";
import { BaseRepository } from "./base.repository.js";
import { AppError } from "../utils/AppError.js";

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  // Find user globally (for login where tenant might not be known before email is entered)
  async findByEmailWithPassword(email, tenantId = null) {
    const where = { email };
    if (tenantId) where.tenantId = tenantId;
    return await this.model.scope("withPassword").findOne({ where });
  }

  // Find user by ID globally (for JWT refresh or similar global auth mechanisms)
  async findByIdGlobalWithPassword(id) {
    return await this.model.scope("withPassword").findByPk(id);
  }

  async findByIdGlobal(id) {
    const user = await this.model.findByPk(id);
    if (!user) throw new AppError("User not found", 404);
    return user;
  }
}

export const userRepository = new UserRepository();
