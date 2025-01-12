import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";
import { getFechaPeruDate } from "../../../functions/globalVariables";

export interface RoleAttributes {
  id: number;
  name: string;
  description: string | null;
  status: boolean;

  created_date: Date;
  is_system?: Boolean;
  key_code?: String | null;
  created_by?: number | null;
  updated_date?: Date | null;
  updated_by?: number | null;
}

export interface RolePartialAttributes extends Partial<RoleAttributes> {}

export interface RoleModel extends Model<RoleAttributes>, RoleAttributes {}

export class Role extends Model<RoleModel, RoleAttributes> {}

export type RoleStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): RoleModel;
};

export function RoleFactory(sequelize: Sequelize): RoleStatic {
  return <RoleStatic>sequelize.define(
    "role",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      key_code: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_system: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_date: {
        type: DataTypes.DATE,
        defaultValue: getFechaPeruDate(),
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      updated_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      initialAutoIncrement: "1",
      tableName: "role",
      timestamps: false,
    }
  );
}
