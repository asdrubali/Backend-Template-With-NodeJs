
import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface RoleOperationsAttributes {
  role_id: number;
  operation_id: number;
}

export interface RoleOperationsPartialAttributes
  extends Partial<RoleOperationsAttributes> {}

export interface RoleOperationsModel
  extends Model<RoleOperationsAttributes>,
    RoleOperationsAttributes {}
export class RoleOperations extends Model<RoleOperationsModel, RoleOperationsAttributes> {}

export type RoleOperationsStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): RoleOperationsModel;
};

export function RoleOperationsFactory(sequelize: Sequelize): RoleOperationsStatic {
  return <RoleOperationsStatic>sequelize.define(
    "role_operations",
    {
      role_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      operation_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      
    },
    {
      tableName: "role_operations",
      timestamps: false,
    }
  );
}


