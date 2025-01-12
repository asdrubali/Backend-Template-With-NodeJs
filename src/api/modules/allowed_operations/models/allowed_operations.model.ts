import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";
import { getFechaPeruDate } from "../../../functions/globalVariables";

export interface AllowedOperationsAttributes {
  id: number;
  route: string;
  verb: string;
  name: string;
  description: string;
  module_id: null | number;
  created_date: Date;
}

export interface AllowedOperationsPartialAttributes
  extends Partial<AllowedOperationsAttributes> {}

export interface AllowedOperationsModel
  extends Model<AllowedOperationsAttributes>,
    AllowedOperationsAttributes {}
export class AllowedOperations extends Model<
  AllowedOperationsModel,
  AllowedOperationsAttributes
> {}

export type AllowedOperationsStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): AllowedOperationsModel;
};

export function AllowedOperationsFactory(
  sequelize: Sequelize
): AllowedOperationsStatic {
  return <AllowedOperationsStatic>sequelize.define(
    "allowed_operations",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },

      route: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
      },
      verb: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      module_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },

      created_date: {
        type: DataTypes.DATE,
        defaultValue: getFechaPeruDate(),
        allowNull: false,
      },
    },
    {
      initialAutoIncrement: "1",
      tableName: "allowed_operations",
      timestamps: false,
    }
  );
}
