import { Transaction } from "sequelize";
import { RolePartialAttributes } from "../../model/role.model";
import { DataBase } from "../../../../../database";
import { getFechaPeruDate } from "../../../../functions/globalVariables";

const updateRoleById = async ({
  role,
  rolId,
  updatedBy,
  transaction,
}: {
  role: RolePartialAttributes;
  rolId: number;
  updatedBy?: number;
  transaction?: Transaction;
}) => {
  try {
    const { name, description } = role;

    return await DataBase.instance.role.update(
      { name, description, updated_by: updatedBy, updated_date: getFechaPeruDate() },
      {
        where: {
          id: rolId,
          is_system: 0,
        },
        transaction,
      }
    );
  } catch (error) {
    throw error;
  }
};

export { updateRoleById };
