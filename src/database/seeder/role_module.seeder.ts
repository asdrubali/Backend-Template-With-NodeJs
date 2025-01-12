import { QueryInterface } from "sequelize";
import { RoleModuleAttributes } from "../../api/modules/role_module/models/role_module.model";

async function seedRoleModuleData(
  queryInterface: QueryInterface
): Promise<void> {
  const roleModuleData: RoleModuleAttributes[] = [
    {
      role_id: 1,
      module_id: 1,
    },
    {
      role_id: 1,
      module_id: 2,
    },
    {
      role_id: 1,
      module_id: 3,
    },
    {
      role_id: 1,
      module_id: 4,
    },
  ];

  await queryInterface.bulkInsert("role_module", roleModuleData);
}

export default seedRoleModuleData;
