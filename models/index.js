import sequelize from "../config/db.js";
import Tenant from "./Tenant.js";
import User from "./User.js";
import Floor from "./Floor.js";
import Room from "./Room.js";
import Student from "./Student.js";
import StudentDocument from "./StudentDocument.js";
import RoomAllocation from "./RoomAllocation.js";

// ============== ASSOCIATIONS ==============

// Tenant <-> User
Tenant.hasMany(User, { foreignKey: "tenantId" });
User.belongsTo(Tenant, { foreignKey: "tenantId" });

// Tenant <-> Floor
Tenant.hasMany(Floor, { foreignKey: "tenantId", as: "floors" });
Floor.belongsTo(Tenant, { foreignKey: "tenantId", as: "organization" });

// Tenant <-> Room
Tenant.hasMany(Room, { foreignKey: "tenantId", as: "rooms" });
Room.belongsTo(Tenant, { foreignKey: "tenantId", as: "organization" });

// Tenant <-> Student
Tenant.hasMany(Student, { foreignKey: "tenantId", as: "students" });
Student.belongsTo(Tenant, { foreignKey: "tenantId", as: "organization" });

// Tenant <-> StudentDocument
Tenant.hasMany(StudentDocument, { foreignKey: "tenantId", as: "studentDocuments" });
StudentDocument.belongsTo(Tenant, { foreignKey: "tenantId", as: "organization" });

// Tenant <-> RoomAllocation
Tenant.hasMany(RoomAllocation, { foreignKey: "tenantId", as: "roomAllocations" });
RoomAllocation.belongsTo(Tenant, { foreignKey: "tenantId", as: "organization" });

// Floor <-> Room
Floor.hasMany(Room, { foreignKey: "floorId", as: "rooms" });
Room.belongsTo(Floor, { foreignKey: "floorId", as: "floor" });

// Student <-> StudentDocument
Student.hasMany(StudentDocument, { foreignKey: "studentId", as: "documents" });
StudentDocument.belongsTo(Student, { foreignKey: "studentId", as: "student" });

// Student <-> RoomAllocation
Student.hasMany(RoomAllocation, { foreignKey: "studentId", as: "allocations" });
RoomAllocation.belongsTo(Student, { foreignKey: "studentId", as: "student" });

// Room <-> RoomAllocation
Room.hasMany(RoomAllocation, { foreignKey: "roomId", as: "allocations" });
RoomAllocation.belongsTo(Room, { foreignKey: "roomId", as: "room" });

// ============== EXPORTS ==============
export {
  sequelize,
  Tenant,
  User,
  Floor,
  Room,
  Student,
  StudentDocument,
  RoomAllocation,
};
