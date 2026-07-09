import { AppError } from "../utils/AppError.js";
import { studentRepository, studentDocumentRepository } from "../repositories/student.repository.js";
import { roomAllocationRepository } from "../repositories/roomAllocation.repository.js";
import { StudentDocument, RoomAllocation, Room } from "../models/index.js";
import { Op } from "sequelize";

export class StudentService {
  async create(data, tenantId) {
    const existing = await studentRepository.findOne(tenantId, { enrollmentNo: data.enrollmentNo });
    if (existing) {
      throw new AppError(`Student with enrollment ${data.enrollmentNo} already exists`, 400);
    }
    return await studentRepository.create({ ...data, tenantId });
  }

  async getAll(tenantId, query = {}) {
    const { status, gender, search, room } = query;
    const filters = {};

    if (status) filters.status = status;
    if (gender) filters.gender = gender;
    
    const allocationInclude = {
        model: RoomAllocation,
        as: "allocations",
        where: { status: "active" },
        required: !!room,
        include: []
    };

    if (room) {
        allocationInclude.include.push({ model: Room, as: "room", where: { roomNumber: room } });
    } else {
        allocationInclude.include.push({ model: Room, as: "room", attributes: ["roomNumber"] });
        allocationInclude.required = false;
    }

    return await studentRepository.findAll(tenantId, filters, {
      where: search ? {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
          { enrollmentNo: { [Op.iLike]: `%${search}%` } },
          { phone: { [Op.iLike]: `%${search}%` } },
        ]
      } : undefined,
      include: [allocationInclude],
      order: [["firstName", "ASC"]],
    });
  }

  async getOne(id, tenantId) {
    return await studentRepository.findById(id, tenantId, {
      include: [
          { model: StudentDocument, as: "documents" },
          { 
              model: RoomAllocation, 
              as: "allocations",
              include: [{ model: Room, as: "room", attributes: ["roomNumber", "floorId"] }]
          }
      ],
    });
  }

  async update(id, tenantId, data) {
    const student = await studentRepository.findById(id, tenantId);

    if (data.enrollmentNo && data.enrollmentNo !== student.enrollmentNo) {
      const existing = await studentRepository.findOne(tenantId, { enrollmentNo: data.enrollmentNo });
      if (existing) {
        throw new AppError(`Enrollment No ${data.enrollmentNo} already exists`, 400);
      }
    }

    return await studentRepository.update(student.id, tenantId, data);
  }

  async delete(id, tenantId) {
    const student = await studentRepository.findById(id, tenantId, {
        include: [{ model: RoomAllocation, as: "allocations" }]
    });

    const hasActiveAllocation = student.allocations && student.allocations.some(a => a.status === 'active');
    if(hasActiveAllocation) {
        throw new AppError("Cannot delete student with active room allocation. Vacate first.", 400);
    }

    await studentRepository.delete(student.id, tenantId);
    return { message: "Student deleted successfully" };
  }

  // Documents
  async addDocument(studentId, tenantId, data) {
      const student = await studentRepository.findById(studentId, tenantId);
      return await studentDocumentRepository.create({ ...data, studentId: student.id, tenantId });
  }

  async getDocuments(studentId, tenantId) {
      return await studentDocumentRepository.findAll(tenantId, { studentId });
  }

  // Status Update
  async updateStatus(id, tenantId, status) {
      const student = await studentRepository.findById(id, tenantId);

      const validStatuses = ["active", "inactive", "left"];
      if(!validStatuses.includes(status)) throw new AppError("Invalid status", 400);

      return await studentRepository.update(student.id, tenantId, { status });
  }

  // Specific queries
  async getStudentRoom(id, tenantId) {
      const allocation = await roomAllocationRepository.findOne(tenantId, { studentId: id, status: 'active' }, {
          include: [{ model: Room, as: 'room' }]
      });
      if(!allocation) throw new AppError("Student has no active room allocation", 404);
      return allocation.room;
  }

  async getAllocationHistory(id, tenantId) {
      return await roomAllocationRepository.findAll(tenantId, { studentId: id }, {
          include: [{ model: Room, as: 'room' }],
          order: [['allocatedAt', 'DESC']]
      });
  }

  async getActiveStudents(tenantId) {
      return await this.getAll(tenantId, { status: 'active' });
  }

  async getLeftStudents(tenantId) {
      return await this.getAll(tenantId, { status: 'left' });
  }
}

export const studentService = new StudentService();
