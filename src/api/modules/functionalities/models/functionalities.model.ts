import { BuildOptions, DataTypes, Model, Optional, Sequelize } from "sequelize";
import { getFechaPeruDate } from "../../../functions/globalVariables";

export interface FunctionalitiesAttributes {
  id: number;
  module_id: number;
  name: string;
  path: string;
  icon: string;
  position: number;
  description?: string | null;

  status: boolean;
  created_date?: Date;
}

export interface FunctionalitiesPartialAttributes
  extends Partial<FunctionalitiesAttributes> {}

export interface FunctionalitiesModel
  extends Model<FunctionalitiesAttributes>,
    FunctionalitiesAttributes {}

export interface FunctionalitiesCreationAttributes
  extends Optional<
    FunctionalitiesAttributes,
    "id" | "description" | "status"
  > {}

export class Functionalities extends Model<
  FunctionalitiesCreationAttributes,
  FunctionalitiesAttributes
> {}

export type FunctionalitiesStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): FunctionalitiesModel;
};

export function FunctionalitiesFactory(
  sequelize: Sequelize
): FunctionalitiesStatic {
  return <FunctionalitiesStatic>sequelize.define(
    "functionalities",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      module_id: {
        type: DataTypes.BIGINT,
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
      path: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      icon: {
        type: DataTypes.STRING(255),
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
      tableName: "functionalities",
      timestamps: false,
    }
  );
}
