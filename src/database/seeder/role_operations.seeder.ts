import { QueryInterface } from "sequelize";
import { RoleOperationsAttributes } from "../../api/modules/role_operations/models/role_operations.model";

async function seedRoleAllowedOperationData(
  queryInterface: QueryInterface
): Promise<void> {
  const roleAllowedOperationsData: RoleOperationsAttributes[] = [
    {
      role_id: 1,
      operation_id: 1,
    },
    {
      role_id: 1,
      operation_id: 2,
    },
    {
      role_id: 1,
      operation_id: 3,
    },
    {
      role_id: 1,
      operation_id: 4,
    },
    {
      role_id: 1,
      operation_id: 5,
    },
    {
      role_id: 1,
      operation_id: 6,
    },
    {
      role_id: 1,
      operation_id: 7,
    },
    {
      role_id: 1,
      operation_id: 8,
    },
    {
      role_id: 1,
      operation_id: 9,
    },
    {
      role_id: 1,
      operation_id: 10,
    },
    {
      role_id: 1,
      operation_id: 11,
    },
    {
      role_id: 1,
      operation_id: 12,
    },
  ];

  await queryInterface.bulkInsert("role_operations", roleAllowedOperationsData);
}

export default seedRoleAllowedOperationData;
