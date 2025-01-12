

import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface RoleModuleAttributes {
  role_id: number;
  module_id: number;
}

export interface RoleModulePartialAttributes
  extends Partial<RoleModuleAttributes> {}

export interface RoleModuleModel
  extends Model<RoleModuleAttributes>,
    RoleModuleAttributes {}
export class RoleModule extends Model<RoleModuleModel, RoleModuleAttributes> {}

export type RoleModuleStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): RoleModuleModel;
};

export function RoleModuleFactory(sequelize: Sequelize): RoleModuleStatic {
  return <RoleModuleStatic>sequelize.define(
    "role_module",
    {
      role_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      module_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      
    },
    {
      tableName: "role_module",
      timestamps: false,
    }
  );
}




