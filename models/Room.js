import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { withTenant } from "./withTenant.js";

const Room = sequelize.define(
  "Room",
  withTenant({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    roomNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    floorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "floors", key: "id" },
      onDelete: "CASCADE",
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: { min: 1 },
    },
    currentOccupancy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    status: {
      type: DataTypes.ENUM("available", "full", "maintenance"),
      defaultValue: "available",
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
    tableName: "rooms",
    indexes: [
      { unique: true, fields: ["tenant_id", "room_number", "floor_id"] }
    ],
    hooks: {
      beforeDestroy: async (room, options) => {
        const suffix = `_del_${Date.now().toString().slice(-6)}`;
        if (room.roomNumber) {
          room.roomNumber = room.roomNumber.slice(0, 20 - suffix.length) + suffix;
        }
        await room.save({ transaction: options.transaction, hooks: false });
      }
    }
  }
);

export default Room;
