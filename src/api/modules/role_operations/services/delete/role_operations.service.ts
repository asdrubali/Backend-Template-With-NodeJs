import { Op, Transaction } from "sequelize";
import { DataBase } from "../../../../../database";

export const destroyRoleOperations = async ({
  roleId,
  operationIds,
  transaction,
}: {
  roleId: number;
  operationIds: number[];
  transaction?: Transaction;
}) => {
  try {
    return await DataBase.instance.roleOperations.destroy({
      where: {
        operation_id: {
          [Op.in]: operationIds,
        },
        role_id: roleId,
      },
      transaction,
    });
  } catch (error) {
    throw error;
  }
};
