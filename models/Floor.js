import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { withTenant } from "./withTenant.js";

const Floor = sequelize.define(
  "Floor",
  withTenant({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    floorNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
  }),
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    tableName: "floors",
    indexes: [
      { unique: true, fields: ["tenant_id", "floor_number"] }
    ],
    hooks: {
      beforeDestroy: async (floor, options) => {
        if (floor.floorNumber !== null && floor.floorNumber !== undefined) {
          floor.floorNumber = -(Date.now() % 1000000000);
        }
        await floor.save({ transaction: options.transaction, hooks: false });
      }
    }
  }
);

export default Floor;
