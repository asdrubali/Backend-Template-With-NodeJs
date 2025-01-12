import { QueryTypes, Transaction } from "sequelize";
import { DataBase } from "../../../../../database";

export const setRolesForUser = async ({
  userId,
  roleIds,
  transaction,
}: {
  userId: number;
  roleIds: number[];
  transaction?: Transaction;
}) => {
  try {
    const query = `
        insert user_role (user_id, role_id)
        select :userId, r.id from role r
        where r.id in (:roleIds) and r.id not in (
            select ur.role_id from user_role ur
            where ur.user_id = :userId
        )
    `;

    return await DataBase.instance.sequelize.query(query, {
      type: QueryTypes.INSERT,
      replacements: {
        userId,
        roleIds,
      },
      transaction,
    });
  } catch (error) {
    throw error;
  }
};
