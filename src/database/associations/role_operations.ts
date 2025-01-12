import { AllowedOperationsStatic } from "../../api/modules/allowed_operations/models/allowed_operations.model";
import { RoleStatic } from "../../api/modules/role/model/role.model";
import { RoleOperationsStatic } from "../../api/modules/role_operations/models/role_operations.model";

export const RoleAndOperationsManyToMany = ({
  role,
  allowed_operations,
  role_operations,
}: {
  role: RoleStatic;
  allowed_operations: AllowedOperationsStatic;
  role_operations: RoleOperationsStatic;
}): void => {
  role.belongsToMany(allowed_operations, {
    through: {
      model: role_operations,
      unique: false,
    },
    foreignKey: { allowNull: false, name: "role_id" },
    otherKey: { allowNull: false, name: "operation_id" },
    as: "AllowedOperations",
  });

  allowed_operations.belongsToMany(role, {
    through: {
      model: role_operations,
      unique: false,
    },
    foreignKey: { allowNull: false, name: "operation_id" },
    otherKey: { allowNull: false, name: "role_id" },
    as: "Roles",
  });
};
