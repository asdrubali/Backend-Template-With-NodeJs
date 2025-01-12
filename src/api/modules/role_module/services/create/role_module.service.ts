import { QueryTypes, Transaction } from "sequelize";
import { DataBase } from "../../../../../database";

export const setNewModulesByRol = async ({
  roleId,
  moduleIds,
  transaction,
}: {
  roleId: number;
  moduleIds: number[];
  transaction?: Transaction;
}) => {
  try {
    const query = `
            insert role_module (role_id, module_id)
            select :roleId, m.id from module m
            where m.id in (:moduleIds) and m.id not in (
                select rm.module_id from role_module rm
                where rm.role_id = :roleId
            )
        `;

  return await DataBase.instance.sequelize.query(query, {
    type: QueryTypes.INSERT,
    replacements: {
      roleId,
      moduleIds
    },
    transaction,
  });
  } catch (error) {
    throw error;
  }
};
