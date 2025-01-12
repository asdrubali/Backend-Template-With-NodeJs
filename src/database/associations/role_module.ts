import { ModuleStatic } from "../../api/modules/module/models/module.model";
import { RoleStatic } from "../../api/modules/role/model/role.model";
import { RoleModuleStatic } from "../../api/modules/role_module/models/role_module.model";

export const RoleAndModuleManyToMany = ({
  role,
  module,
  role_module,
}: {
  role: RoleStatic;
  module: ModuleStatic;
  role_module: RoleModuleStatic;
}): void => {
  role.belongsToMany(module, {
    through: {
      model: role_module,
      unique: false,
    },
    foreignKey: { allowNull: false, name: "role_id" },
    otherKey: { allowNull: false, name: "module_id" },
  });

  module.belongsToMany(role, {
    through: {
      model: role_module,
      unique: false,
    },
    foreignKey: { allowNull: false, name: "module_id" },
    otherKey: { allowNull: false, name: "role_id" },
  });
};
