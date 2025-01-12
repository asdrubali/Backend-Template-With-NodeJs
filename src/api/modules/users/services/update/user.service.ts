import moment from "moment";
import bcrypt from "bcrypt";
import { Transaction, WhereOptions } from "sequelize";
import { DataBase } from "../../../../../database";
import { encrypt } from "../../../../../security/criptoService";
import { UserPartialAttributes, UserAttributes } from "../../models/user.model";
import { UpdateUserDto } from "../../dtos/update-user.dto";
import {
  destroyUserRole,
} from "../../../user_role/services/delete/user_role.service";
import {
  setRolesForUser,
} from "../../../user_role/services/create/user_role.service";
import { getFechaPeruDate } from "../../../../functions/globalVariables";

export const updateUserPassword = async ({
  password,
  userId,
  updatedBy,
  transaction,
}: {
  password: string;
  userId: number;
  updatedBy?: number;
  transaction?: Transaction;
}) => {
  try {
    const { hash: encryptedPassword, salt } = await encrypt(password);

    return await DataBase.instance.user.update(
      {
        password: encryptedPassword,
        salt,
        updated_by: updatedBy,
        updated_date: getFechaPeruDate(),
      },
      {
        where: {
          id: userId,
        },
        transaction,
      }
    );
  } catch (error) {
    throw error;
  }
};

export const basicUpdateUserById = async ({
  userId,
  user,
  updatedBy,
  transaction,
}: {
  userId: number;
  user: UserPartialAttributes;
  updatedBy?: number | null;
  transaction?: Transaction;
}) => {
  const { id, ...data } = user;

  try {
    return await DataBase.instance.user.update(
      {
        ...data,
        updated_date: getFechaPeruDate(),
        updated_by: updatedBy,
      },
      {
        where: {
          id: userId,
        },
        transaction,
      }
    );
  } catch (error) {
    throw error;
  }
};

export const updateUserById = async ({
  userId,
  updateUserDto,
  updatedBy,
  transaction,
}: {
  userId: number;
  updateUserDto: UpdateUserDto;
  updatedBy?: number | null;
  transaction?: Transaction;
}) => {
  const { roles, ...data } = updateUserDto;
  try {
    let userUpdate = await basicUpdateUserById({
      user: data,
      userId,
      updatedBy,
      transaction,
    });

    if (roles) {
      const { add, remove } = roles;

      // If there is to remove
      if (remove && remove.length > 0) {
        await destroyUserRole({
          userId,
          roleIds: remove,
          transaction,
        });
      }

      // If you want to incorporate new ones
      if (add && add.length > 0) {
        await setRolesForUser({ userId, roleIds: add, transaction });
      }
    }

    return userUpdate;
  } catch (error) {
    throw error;
  }
};
