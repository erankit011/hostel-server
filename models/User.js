import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { withTenant } from "./withTenant.js";

const User = sequelize.define(
  "User",
  withTenant({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    role: {
      type: DataTypes.ENUM("system_admin", "hostel_admin"),
      allowNull: false,
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "blocked", "pending"),
      defaultValue: "active",
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }), 
  {
    timestamps: true,
    paranoid: true, 
    underscored: true,
    tableName: "users",
    defaultScope: {
      attributes: { exclude: ['password'] }
    },
    scopes: {
      withPassword: { attributes: {} }
    },
    hooks: {
      beforeDestroy: async (user, options) => {
        const suffix = `_deleted_${Date.now()}`;
        if (user.email) {
          user.email = user.email.slice(0, 255 - suffix.length) + suffix;
        }
        await user.save({ transaction: options.transaction, hooks: false });
      }
    }
  }
);

export default User;
