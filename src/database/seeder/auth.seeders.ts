import { QueryInterface } from "sequelize";
import { UserAttributes } from "../../api/modules/users/models/user.model";
import { RoleAttributes } from "../../api/modules/role/model/role.model";
import { UserRoleAttributes } from "../../api/modules/user_role/models/user_role.model";
import { getFechaPeruDate } from "../../api/functions/globalVariables";

async function seedUserData(queryInterface: QueryInterface): Promise<void> {
  const companyData: UserAttributes[] = [
    {
      id: 1,
      name: "admin",
      paternal_lastname: "admin",
      maternal_lastname: "admin",
      username: "admin",
      document_type: "DNI",
      document_number: "11111111",
      date_of_birth: new Date("2024-01-26"),
      email: "admin@admin.com",
      password: "$2b$10$8KD3DAxK0EPbQ7I9c43Uw.szDvX4SyVo0DivzlmirGFYCr2bESsVa", // gwovzgs8ce4
      salt: "$2b$10$8KD3DAxK0EPbQ7I9c43Uw.",
      created_date: getFechaPeruDate(),
      status: true,
      gender: "MALE",
      login_status: "H",
      failed_attempts: 0,
      is_deleted: false,
    },
  ];

  await queryInterface.bulkInsert("user", companyData);
}

async function seedRoleData(queryInterface: QueryInterface): Promise<void> {
  const rolData: RoleAttributes[] = [
    {
      id: 1,
      name: "Super Admin",
      description: "Super Admin",
      status: true,
      created_date: getFechaPeruDate(),
    },
  ];

  await queryInterface.bulkInsert("role", rolData);
}

async function seedUserRoleData(queryInterface: QueryInterface): Promise<void> {
  const userRoleData: UserRoleAttributes[] = [{ user_id: 1, role_id: 1 }];

  await queryInterface.bulkInsert("user_role", userRoleData);
}


export { seedUserData, seedRoleData, seedUserRoleData };
