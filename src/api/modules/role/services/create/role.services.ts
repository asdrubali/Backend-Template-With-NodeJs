import { Transaction } from "sequelize";
import { RoleAttributes } from "../../model/role.model";
import moment from "moment";
import { DataBase } from "../../../../../database";
import { getFechaPeruDate } from "../../../../functions/globalVariables";

const createRole = async ({
  role,
  createdBy,
  transaction,
}: {
  role: RoleAttributes;
  createdBy?: number;
  transaction?: Transaction;
}) => {
  try {
    const newRole: RoleAttributes = {
      ...role,
      status: true,
      created_by: createdBy,
      created_date: getFechaPeruDate(),
    };

    return await DataBase.instance.role.create(newRole, { transaction });
  } catch (error) {
    throw error;
  }
};

export { createRole };
