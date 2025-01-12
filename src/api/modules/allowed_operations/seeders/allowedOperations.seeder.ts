import { QueryInterface } from "sequelize";
import { AllowedOperationsAttributes } from "../models/allowed_operations.model";
import { getFechaPeruDate } from "../../../functions/globalVariables";

async function seedAllowOperationData(
  queryInterface: QueryInterface
): Promise<void> {
  const allowedOperationData: AllowedOperationsAttributes[] = [
    {
      id: 1,
      route: "/user/create",
      verb: "POST",
      name: "Register a user",
      description: "Register a user",
      module_id: 1,
      created_date: getFechaPeruDate(),
    },
    {
      id: 2,
      route: "/user/disable/*",
      verb: "PUT",
      name: "Deactivate a user",
      description: "Deactivate a user",
      module_id: 1,
      created_date: getFechaPeruDate(),
    },
    {
      id: 3,
      route: "/user/find/*",
      verb: "GET",
      name: "Get information from a user",
      description: "Get information from a user",
      module_id: 1,
      created_date: getFechaPeruDate(),
    },
    {
      id: 4,
      route: "/user/list",
      verb: "GET",
      name: "List all users",
      description: "List all users",
      module_id: 1,
      created_date: getFechaPeruDate(),
    },
    {
      id: 5,
      route: "/user/update/*",
      verb: "PUT",
      name: "Update user data",
      description: "Update user data",
      module_id: 1,
      created_date: getFechaPeruDate(),
    },
    {
      id: 6,
      route: "/user/user-account",
      verb: "GET",
      name: "Get your own user account",
      description: "Get your own user account",
      module_id: 1,
      created_date: getFechaPeruDate(),
    },
    {
      id: 7,
      route: "/role_module/list/operations/role/*",
      verb: "GET",
      name: "ListModuleRoleBy",
      description: "ListModuleRoleBy",
      module_id: 3,
      created_date: getFechaPeruDate(),
    },
    {
      id: 8,
      route: "/role/list",
      verb: "GET",
      name: "ListRole",
      description: "ListRole",
      module_id: 4,
      created_date: getFechaPeruDate(),
    },
    {
      id: 9,
      route: "/role/create",
      verb: "POST",
      name: "CreateRole",
      description: "CreateRole",
      module_id: 4,
      created_date: getFechaPeruDate(),
    },
    {
      id: 10,
      route: "/role/update/*",
      verb: "PUT",
      name: "UpdateRoleByid",
      description: "UpdateRoleByid",
      module_id: 4,
      created_date: getFechaPeruDate(),
    },
    {
      id: 11,
      route: "/role/disable/*",
      verb: "PUT",
      name: "EnableDisableRole",
      description: "EnableDisableRole",
      module_id: 4,
      created_date: getFechaPeruDate(),
    },
    {
      id: 12,
      route: "/role_module/list/my-modules",
      verb: "GET",
      name: "ListMyModules",
      description: "ListMyModules",
      module_id: 3,
      created_date: getFechaPeruDate(),
    }
  ];

  await queryInterface.bulkInsert("allowed_operations", allowedOperationData);
}

export default seedAllowOperationData;
