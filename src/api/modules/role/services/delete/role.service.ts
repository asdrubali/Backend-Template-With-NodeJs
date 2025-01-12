import { Transaction, literal } from "sequelize";
import { DataBase } from "../../../../../database";
import moment from "moment";

const disableOrEnabledRolById = async ({
  rolId,
  updatedBy,
  transaction,
}: {
  rolId: number;
  updatedBy?: number;
  transaction?: Transaction;
}) => {
  try {
    return await DataBase.instance.role.update(
      {
        status: literal("CASE WHEN status = true THEN false ELSE true END"),
        updated_date: moment().utc().toDate(),
        updated_by: updatedBy,
      },
      {
        where: {
          id: rolId,
        },
        transaction,
      }
    );

  } catch (error) {
    throw error;
  }
};

export {
  disableOrEnabledRolById
}
