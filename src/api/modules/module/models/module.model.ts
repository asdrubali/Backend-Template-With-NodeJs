import { BuildOptions, DataTypes, Model, Optional, Sequelize } from "sequelize";
import { getFechaPeruDate } from "../../../functions/globalVariables";

export interface ModuleAttributes {
  id: number;

  name: string;
  base: string;
  icon: string;
  position: number;
  description: string | null;

  status: boolean;
  created_date?: Date;
}

export interface ModulePartialAttributes extends Partial<ModuleAttributes> {}

export interface ModuleModel
  extends Model<ModuleAttributes>,
    ModuleAttributes {}

export interface ModuleCreationAttributes
  extends Optional<ModuleAttributes, "id" | "description" | "status"> {}

export class Module extends Model<ModuleCreationAttributes, ModuleAttributes> {}

export type ModuleStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): ModuleModel;
};

export function ModuleFactory(sequelize: Sequelize): ModuleStatic {
  return <ModuleStatic>sequelize.define(
    "module",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      base: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      icon: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      created_date: {
        type: DataTypes.DATE,
        defaultValue: getFechaPeruDate(),
        allowNull: false,
      },
    },
    {
      initialAutoIncrement: "1",
      tableName: "module",
      timestamps: false,
    }
  );
}
