import { Op, Transaction } from "sequelize";
import { DataBase } from "../../../../../database";

export const destroyRoleModules = async ({
  roleId,
  moduleIds,
  transaction,
}: {
  roleId: number;
  moduleIds: number[];
  transaction?: Transaction;
}) => {
  try {
    return await DataBase.instance.roleModule.destroy({
      where: {
        module_id: {
          [Op.in]: moduleIds,
        },
        role_id: roleId,
      },
      transaction,
    });
  } catch (error) {
    throw error;
  }
};
