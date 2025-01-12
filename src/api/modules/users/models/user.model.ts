import { BuildOptions, DataTypes, Model, Optional, Sequelize } from "sequelize";
import { LoginStatusTypes } from "../types/loginStatus.type";
import { USER_DEFAULT_VALUES } from "../constants/defaultValues";
import { createDummyObject } from "../../../../utils/object";
import { GenderTypes } from "../types/gender.type";
import { getFechaPeruDate } from "../../../functions/globalVariables";

export interface UserAttributes {
  id: number;
  name: string;
  paternal_lastname: string;
  maternal_lastname?: string;
  document_type?: string;
  document_number?: string;
  date_of_birth?: Date | null;

  username?: string;
  email: string;
  password: string;
  salt: string;

  phone?: string;
  address?: string;

  // Foraneas
  // office_id: number | null;
  // area_id: number | null;
  // program_id: number | null;

  // notifications: boolean;
  status: boolean;

  gender?: GenderTypes;

  // Estado del login
  login_status: LoginStatusTypes;
  failed_attempts: number;
  last_lock_date?: Date | null;
  last_unlock_date?: Date | null;
  lockout_minutes?: number | null;

  // Device Id
  device_id?: string;

  // Codigos adicionales
  recovery_code?: string | null;

  is_deleted: boolean;
  created_date: Date;
  created_by?: number | null;
  updated_date?: Date | null;
  updated_by?: number | null;
}

export interface UserPartialAttributes extends Partial<UserAttributes> {}

export const objDummyUserPartialAttributes =
  createDummyObject<UserPartialAttributes>();

export interface UserModel extends Model<UserAttributes>, UserAttributes {}

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | "id"
    | "date_of_birth"
    | "last_lock_date"
    | "last_unlock_date"
    | "lockout_minutes"
    | "status"
  > {}

export class User extends Model<UserCreationAttributes, UserModel> {}

export type UserStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserModel;
};

export function UserFactory(sequelize: Sequelize): UserStatic {
  return <UserStatic>sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      paternal_lastname: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      maternal_lastname: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      username: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
     
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      document_type: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "DNI",
      },
      document_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },

      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      gender: {
        type: DataTypes.ENUM("MALE", "FEMALE", "NON_BINARY"),
        allowNull: false,
        defaultValue: "NON_BINARY",
      },

      login_status: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: USER_DEFAULT_VALUES.LOGIN_STATUS,
      },

      failed_attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: USER_DEFAULT_VALUES.FAILED_ATTEMPTS,
      },

      last_lock_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      last_unlock_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      lockout_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      device_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      recovery_code: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      tableName: "user",
      timestamps: false,
    }
  );
}
