import { FindAttributeOptions, Transaction, WhereOptions,Order } from "sequelize";
import { DataBase } from "../../../../../database";
import { RoleAttributes } from "../../model/role.model";
import { IListOptions } from '../../../../interfaces/IListOptions.interface'

 const getRolesList = async (
  options?: IListOptions<RoleAttributes>
) => {
  try {
    let { where, page, limit, order } = options || {};

    let queryOptions: any = {
      where,
      attributes: {
        exclude: ["created_by", "updated_by", "updated_date"],
      }, 
      order,
    };

    if (limit && !page) {
      page = 1;
    }

    if (limit && page) {
      queryOptions.offset = (page - 1) * limit;
      queryOptions.limit = limit;
    }

    const { count, rows } = await DataBase.instance.role.findAndCountAll(
      queryOptions
    );

    return { page, count, rows, limit };
  } catch (err) {
    throw err;
  }
};
const getAllRoles = async ({
  where,
  attributes,
}: {
  where?: WhereOptions<RoleAttributes>;
  attributes?: FindAttributeOptions;
}) => {
  try {
    return await DataBase.instance.role.findAll({ where, attributes });
  } catch (error) {
    throw error;
  }
};

export { getAllRoles,getRolesList };
