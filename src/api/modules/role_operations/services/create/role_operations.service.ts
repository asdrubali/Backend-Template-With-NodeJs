import { QueryTypes, Transaction } from "sequelize";
import { DataBase } from "../../../../../database";

export const setNewOperationsByRol = async ({
  roleId,
  operationIds,
  transaction,
}: {
  roleId: number;
  operationIds: number[];
  transaction?: Transaction;
}) => {
  try {
    const query = `
            insert role_operations (role_id, operation_id)
            select :roleId, ao.id from allowed_operations ao
            where ao.id in (:operationIds) and ao.id not in (
                select ro.operation_id from role_operations ro
                where role_id = :roleId
            )
        `;

    return await DataBase.instance.sequelize.query(query, {
      type: QueryTypes.INSERT,
      replacements: {
        roleId,
        operationIds
      },
      transaction,
    });
    
  } catch (error) {
    throw error;
  }
};
