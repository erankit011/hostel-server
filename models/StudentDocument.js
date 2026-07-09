import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { withTenant } from "./withTenant.js";

const StudentDocument = sequelize.define(
  "StudentDocument",
  withTenant({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "students", key: "id" },
      onDelete: "CASCADE",
    },
    documentType: {
      type: DataTypes.STRING(100),
      allowNull: false, // e.g. "aadhar", "marksheet", "id_proof"
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }),
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    tableName: "student_documents",
  }
);

export default StudentDocument;
