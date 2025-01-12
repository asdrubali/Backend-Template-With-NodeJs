import { QueryTypes } from "sequelize";
import { DataBase } from "../../../../../database";
import {
  IDbModulesWithOperations,
  IModulesWithOperations,
  ModuleFunctionality,
} from "../../interfaces/role_module.interfaces";
import { uniqueArrayObjectsUsingProp } from "../../../../../utils/object";

export const getModulesWithAllOperationsByRole = async (
  roleId: number
): Promise<IModulesWithOperations[]> => {

  try {
    const query = `
        SELECT
            m.id AS module_id,
            m.name AS module_name,
            m.status AS module_status,
            IF(rm.role_id IS NULL, false, true) as 'is_in_use',
            COALESCE(
                if( count(ao.id) = 0, json_array(),
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                            'id', ao.id,
                            'name', ao.name,
                            'method', ao.verb,
                            'is_in_use', IF(r.id IS NULL, false, true)
                        )
                    )
                ),
                json_array()
            ) AS operations
        FROM module m
        LEFT JOIN allowed_operations ao ON m.id = ao.module_id
        LEFT JOIN role_operations ro ON ao.id = ro.operation_id AND ro.role_id = :roleId
        LEFT JOIN role_module rm ON m.id = rm.module_id AND rm.role_id = :roleId
        LEFT JOIN role r ON ro.role_id = r.id
        GROUP BY m.id, m.name;
    `;

    const resp = (await DataBase.instance.sequelize.query(query, {
      replacements: {
        roleId
      },
      type: QueryTypes.SELECT
    })) as IDbModulesWithOperations[];

    if (resp.length === 0) {
      return [];
    }

    let modules: IModulesWithOperations[] = resp.map(
      ({operations, is_in_use, module_status,...data}): IModulesWithOperations => {
        return {
          ...data,
          is_in_use: !!is_in_use,
          module_status: !!module_status,
          operations: operations,
        };
      }
    );
    

    return modules;
  } catch (error) {
    throw error;
  }
};

export const getModulesWithAllFunctionalitiesByRole = async (roleIds: number[]) => {
  try {

    const query = `
      WITH my_modules_functionalities AS (
        SELECT m.id module_id, m.name module_name,  m.base module_base, m.icon module_icon,
              f.id func_id, f.name, f.name func_name, f.path func_path, f.icon func_icon,
              m.position AS m_position,
              f.position AS f_position
        FROM module m
        LEFT JOIN functionalities f
            on f.module_id = m.id
        INNER JOIN role_module rm
            on rm.module_id = m.id
        INNER JOIN role r
            on rm.role_id = r.id
        WHERE rm.role_id in (1)
              and m.status = true
              and f.status = true
              and r.status = true
        ORDER BY m.position, f.position
      )
      SELECT *
      FROM my_modules_functionalities
      GROUP BY module_id, func_id
      ORDER BY m_position, f_position
    `;

    const resp = await DataBase.instance.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: {
        roleIds
      }
    }) as ModuleFunctionality[]

    if (resp.length === 0) {
      return [];
    }

    const unique = uniqueArrayObjectsUsingProp(resp, "module_id");

    const modules = unique.map( (m) => {
      const functionalities = resp.filter( r => r.module_id == m.module_id).map( f => ({
        id: f.func_id,
        name: f.func_name,
        path: f.func_path,
        icon: f.func_icon
      }))

      return {
        id: m.module_id,
        name: m.module_name,
        base: m.module_base,
        icon: m.module_icon,
        functionalities
      }
    });

    return modules;

  } catch (error) {
    throw error;
  }
}

