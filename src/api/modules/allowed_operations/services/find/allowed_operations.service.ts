import { QueryTypes } from "sequelize";
import { RespRoutes } from "../../interfaces/allowed_operations.interface";
import { DataBase } from "../../../../../database";

export const getUserRolesAndRoutes = async (userId: number) => {
  try {
    const query = `
      WITH operations AS (
          SELECT r.id, ao.route, ao.verb
          FROM user_role ur
          INNER JOIN role r ON ur.role_id = r.id
          INNER JOIN role_operations ro ON r.id = ro.role_id
          INNER JOIN allowed_operations ao ON ro.operation_id = ao.id
          WHERE ur.user_id = ? AND r.status = true
      ),
      distinct_operations AS (
          SELECT DISTINCT id, route, verb
          FROM operations
      )
      SELECT 
          COALESCE(JSON_ARRAYAGG(id), '[]') AS roles,
          COALESCE(JSON_ARRAYAGG(JSON_OBJECT('route', route, 'verb', verb)), '[]') AS routes
      FROM distinct_operations;
    `;

    const respRoles = (await DataBase.instance.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: [userId],
    })) as RespRoutes[];

    return respRoles;
  } catch (error) {
    throw error;
  }
};
