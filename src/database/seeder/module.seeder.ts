import { QueryInterface } from "sequelize";
import { ModuleAttributes } from "../../api/modules/module/models/module.model";

async function seedModuleData(queryInterface: QueryInterface): Promise<void> {
  const moduleData: ModuleAttributes[] = [
    {
      id: 1,
      name: "Users",
      description: "Users Module",
      base: "Users",
      icon: "",
      status: true,
      position: 1,
    },
    {
      id: 2,
      name: "Super Config",
      description: "Configuration Module",
      base: "Users",
      icon: "",
      status: true,
      position: 2,
    },
    {
      id: 3,
      name: 'Modules',
      description: 'Module modules',
      base: "Module",
      icon: "",
      status: true,
      position: 3,
    },
    {
      id: 4,
      name: 'Role',
      description: 'Role module',
      base: "Role",
      icon: '',
      status: true,
      position: 4
    }
  ];

  await queryInterface.bulkInsert("module", moduleData);
}

export default seedModuleData;
