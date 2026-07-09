import { AppError } from "../utils/AppError.js";
import { userRepository } from "../repositories/user.repository.js";
import { BcryptHelper } from "../utils/bcrypt.js";

export class HostelAdminService {

  // ============== CREATE HOSTEL ADMIN ==============
  async create(data, tenantId) {
    const existing = await userRepository.findOne(tenantId, { email: data.email });
    if (existing) {
      throw new AppError("Email already registered", 400);
    }

    const hashedPassword = await BcryptHelper.hashPassword(data.password);

    const admin = await userRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || null,
      password: hashedPassword,
      role: "hostel_admin",
      status: "active",
      tenantId,
    });

    const response = admin.get({ plain: true });
    delete response.password;
    return response;
  }

  // ============== GET ALL HOSTEL ADMINS (Search + Filter) ==============
  async getAll(tenantId, query = {}) {
    const { search, status, page = 1, limit = 10 } = query;
    const filters = { role: "hostel_admin" };
    if (status) {
      filters.status = status;
    }

    return await userRepository.search(tenantId, search, ["firstName", "lastName", "email"], {
      filters,
      page,
      limit,
    });
  }

  // ============== GET ONE HOSTEL ADMIN ==============
  async getOne(id, tenantId) {
    const admin = await userRepository.findOne(tenantId, { id, role: "hostel_admin" });
    if (!admin) {
      throw new AppError("Hostel Admin not found", 404);
    }
    return admin;
  }

  // ============== UPDATE HOSTEL ADMIN ==============
  async update(id, tenantId, updateData) {
    const admin = await this.getOne(id, tenantId);

    const safeData = { ...updateData };
    delete safeData.id;
    delete safeData.password;
    delete safeData.role;
    delete safeData.email;

    return await userRepository.update(admin.id, tenantId, safeData);
  }

  // ============== BLOCK HOSTEL ADMIN ==============
  async block(id, tenantId) {
    const admin = await this.getOne(id, tenantId);
    if (admin.status === "blocked") {
      throw new AppError("Admin is already blocked", 400);
    }
    return await userRepository.update(admin.id, tenantId, { status: "blocked" });
  }

  // ============== UNBLOCK HOSTEL ADMIN ==============
  async unblock(id, tenantId) {
    const admin = await this.getOne(id, tenantId);
    if (admin.status !== "blocked") {
      throw new AppError("Admin is not blocked", 400);
    }
    return await userRepository.update(admin.id, tenantId, { status: "active" });
  }

  // ============== DELETE HOSTEL ADMIN ==============
  async delete(id, tenantId) {
    const admin = await this.getOne(id, tenantId);
    await userRepository.delete(admin.id, tenantId);
    return { message: "Hostel Admin deleted successfully" };
  }

  // ============== STATISTICS ==============
  async getStatistics(tenantId) {
    const totalAdmins = await userRepository.count(tenantId, { role: "hostel_admin" });
    const activeAdmins = await userRepository.count(tenantId, { role: "hostel_admin", status: "active" });
    const blockedAdmins = await userRepository.count(tenantId, { role: "hostel_admin", status: "blocked" });

    return { totalAdmins, activeAdmins, blockedAdmins };
  }
}

export const hostelAdminService = new HostelAdminService();
