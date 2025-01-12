import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface UserRoleAttributes {
  user_id: number;
  role_id: number;
}

export interface UserRolePartialAttributes
  extends Partial<UserRoleAttributes> {}

export interface UserRoleModel
  extends Model<UserRoleAttributes>,
    UserRoleAttributes {}

export class UserRole extends Model<UserRoleModel, UserRoleAttributes> {}

export type UserRoleStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserRoleModel;
};

export function UserRoleFactory(sequelize: Sequelize): UserRoleStatic {
  return <UserRoleStatic>sequelize.define(
    "user_role",
    {
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      role_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      tableName: "user_role",
      timestamps: false,
    }
  );
}
