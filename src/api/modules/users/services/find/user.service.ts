import {
  FindAttributeOptions,
  QueryTypes,
  Transaction,
  WhereOptions,
} from "sequelize";
import { UserAttributes } from "../../models/user.model";
import { DataBase } from "../../../../../database";
import { IDbUserAccount, IUserAccount } from "../../interfaces/user-account";
import {
  IDBUserInformation,
  IUserInformation,
} from "../../interfaces/user-query-list";


const getUsersList = async ({
  page,
  limit,
  search,
  order,
  column
}: {
  page: any;
  limit: any;
  search: string;
  order: string;
  column: string;
}) => {
  try {
    const offset = (page - 1) * limit;
    const limitPage = limit ? `LIMIT ${offset}, ${limit}` : "";


    let orderColumn;
    const userFields = [
      'id',
      'name',
      'paternal_lastname',
      'date_of_birth',
      'username',
      'email',
      'status',
      'created_date',
      'document_type',
      'document_number',
      'gender',
      'phone',
    ];
    const roleFields = [
      'id',
      'name',
    ];
    const businessUnitFields = [
      'id',
      'name',
    ];

    if (userFields.includes(column)) {
      orderColumn = `u.${column}`;
    } else if (roleFields.includes(column)) {
      orderColumn = `rol.${column}`;
    } else {
      orderColumn = 'u.created_date'
    }

    search = search?.trim();
    const searchCondition = search
      ? `AND (
          u.id LIKE :search
          OR ( :search is null or :search = '' OR lower(concat(u.name, '', u.paternal_lastname)) like concat('%',lower(:search), '%') )
        )`
      : "";


      const countQuery = `
      SELECT COUNT(DISTINCT u.id) AS total
      FROM \`user\` u
      LEFT JOIN user_role usr ON usr.user_id = u.id
      LEFT JOIN role rol ON usr.role_id = rol.id
      WHERE 1 = 1 AND u.is_deleted = 0 ${searchCondition}
    `;

    const rowsCount: any = await DataBase.instance.sequelize.query(countQuery, {
      type: QueryTypes.SELECT,
      replacements: {
        search: search ? `%${search.toLowerCase()}%` : null,
      },
    });

      const totalCount = rowsCount[0].total;


    const query = `
      SELECT 
          u.id, 
          u.name, 
          u.paternal_lastname AS lastname,
          u.date_of_birth, 
          u.username, 
          u.email,
          u.status, 
          u.created_date,
          u.document_type, 
          u.document_number, 
          u.gender, 
          u.phone,
          COALESCE(
              (
                  SELECT JSON_ARRAYAGG(JSON_OBJECT('id', role_data.role_id, 'name', role_data.role_name))
                  FROM (
                      SELECT DISTINCT usr.role_id, rol.name AS role_name
                      FROM user_role usr
                      LEFT JOIN role rol ON usr.role_id = rol.id
                      WHERE usr.user_id = u.id
                  ) AS role_data
              ), '[]'
          ) AS roles
      FROM user u
      LEFT JOIN user_role usr ON usr.user_id = u.id
      LEFT JOIN role rol ON usr.role_id = rol.id
      WHERE 1 = 1 
        AND u.is_deleted = 0  
        ${searchCondition}
      GROUP BY
          u.id,
          u.name,
          u.paternal_lastname,
          u.date_of_birth,
          u.username,
          u.email,
          u.status,
          u.created_date,
          u.document_type,
          u.document_number,
          u.gender,
          u.phone
      ORDER BY ${orderColumn} ${order}
      ${limitPage};
    `;

    
    

    const rows = await DataBase.instance.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: {
        search: search ? `%${search.toLowerCase()}%` : null,
      },
    });

    let countData = 0;


    if (search.length > 1) {
      const countD = (await DataBase.instance.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
          search: search ? `%${search.toLowerCase()}%` : null,
        },
      })) as any[];

      countData = countD?.[0]?.total || 0;

      console.log('camm')
    } else {
      countData = await DataBase.instance.user.count({
        where: {
          is_deleted: false,
        },
      });
    }

    const limitFinal = limit ? limit : countData;

    console.log(countData);

    const limitForQuery =
      Math.min(limitFinal, countData) > 0
        ? Math.max(limitFinal, countData)
        : limit;

    const totalPages = Math.ceil(countData / limitForQuery) || 1;
    const pageFinal = page !== null && !isNaN(page) ? page : 1;

   // Format the elements inside the rows array
    const formattedRows = rows.map((row: any) => {
      let rolesArr = [];
      try {
        rolesArr = JSON.parse(`${row.roles}`);
      } catch (error) {
        rolesArr = [];
      }

      return { ...row, roles: rolesArr };
    });

    return {
      totalPages,
      page: pageFinal,
      limit: limitFinal,
      countFind: totalCount,
      count: rows.length || 0,
      data: formattedRows,
    };
  } catch (error) {
    throw error;
  }
};

const findOneUser = async ({
  where,
  attributes,
  transaction,
}: {
  where?: WhereOptions<UserAttributes>;
  attributes?: FindAttributeOptions;
  transaction?: Transaction;
}): Promise<UserAttributes | null> => {
  const user = await DataBase.instance.user.findOne({
    where,
    attributes,
    transaction,
  });

  if (!user) {
    return null;
  }

  return user.get({ plain: true });
};

const getAccountById = async (userId: number): Promise<IUserAccount> => {
  try {
    const query = `
      SELECT 
          u.id, 
          u.username, 
          u.email, 
          u.name, 
          u.paternal_lastname,
          u.document_number, 
          u.gender, 
          COALESCE(
              JSON_ARRAYAGG(JSON_OBJECT('id', ur.role_id, 'name', r.name)),
              '[]'
          ) AS roles
      FROM user u
      LEFT JOIN user_role ur
          ON u.id = ur.user_id
      LEFT JOIN role r
          ON ur.role_id = r.id
      WHERE u.id = ?
      GROUP BY u.id;
    `;


    // TODO

    const accountResp = (await DataBase.instance.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: [userId],
    })) as IDbUserAccount[];

    const accountDB = accountResp[0];
    const account: IUserAccount = {
      ...accountDB,
      roles: JSON.parse(accountDB.roles)
    };

    return account;
  } catch (error) {
    throw error;
  }
};

const findUserInformationById = async (userId: number) => {
  try {
    const query = `
      SELECT  
          u.id, 
          u.username, 
          u.email, 
          u.name, 
          u.paternal_lastname, 
          u.status,
          u.phone, 
          u.document_number, 
          u.document_type,
          u.gender,
          COALESCE(
              (
                  SELECT JSON_ARRAYAGG(JSON_OBJECT('id', role_id, 'name', role_name))
                  FROM (
                      SELECT DISTINCT ur.role_id AS role_id, r.name AS role_name
                      FROM user_role ur
                      JOIN role r ON ur.role_id = r.id
                      WHERE ur.user_id = u.id
                  ) AS unique_roles
              ),
              '[]'
          ) AS roles
      FROM user u
      LEFT JOIN user_role ur
          ON u.id = ur.user_id
      LEFT JOIN role r
          ON ur.role_id = r.id
      WHERE u.id = ?
      GROUP BY 
          u.id,
          u.username,
          u.email,
          u.name,
          u.paternal_lastname,
          u.status,
          u.phone,
          u.document_number,
          u.document_type,
          u.gender
    `;

    const resp = (await DataBase.instance.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: [userId],
    })) as IDBUserInformation[];

    if (resp.length == 0) {
      return null;
    }

    const dbUser = resp[0];

    const id_rol = JSON.parse(dbUser.roles);

    const fid_rol = id_rol[0].id;

    const userInformation: IUserInformation = {
      ...dbUser,
      status: !!dbUser.status,
      roles: fid_rol === null ? JSON.parse("[]") : JSON.parse(dbUser.roles)
    };

    return userInformation;
  } catch (error) {
    throw error;
  }
};

export { getUsersList, findOneUser, getAccountById, findUserInformationById };
