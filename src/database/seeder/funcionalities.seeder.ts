import { QueryInterface } from "sequelize";
import { FunctionalitiesAttributes } from "../../api/modules/functionalities/models/functionalities.model";

async function seedFunctionalityData(
  queryInterface: QueryInterface
): Promise<void> {
  const funtionalitiesData: FunctionalitiesAttributes[] = [
    {
      id: 1,
      module_id: 1,
      name: "users module",
      description: undefined,
      path: "users-module",
      icon: "i-Add-User",
      position: 1,
      status: true,
    },

  ];

  await queryInterface.bulkInsert("functionalities", funtionalitiesData);
}

export default seedFunctionalityData;
