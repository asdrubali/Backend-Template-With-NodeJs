import { AllowedOperationsStatic } from "../../api/modules/allowed_operations/models/allowed_operations.model";
import { FunctionalitiesStatic } from "../../api/modules/functionalities/models/functionalities.model";
import { ModuleStatic } from "../../api/modules/module/models/module.model";

export const moduleHasManyOperations = ({
  module,
  allowed_operations,
}: {
  module: ModuleStatic;
  allowed_operations: AllowedOperationsStatic;
}): void => {
  module.hasMany(allowed_operations, {
    foreignKey: "module_id",
    sourceKey: "id",
  });
  allowed_operations.belongsTo(module, {
    foreignKey: "module_id",
    targetKey: "id",
  });
};

export const moduleHasManyFunctionalities = ({
  module,
  functionalities,
}: {
  module: ModuleStatic;
  functionalities: FunctionalitiesStatic;
}): void => {
  module.hasMany(functionalities, {
    foreignKey: "module_id",
    sourceKey: "id",
  });
  functionalities.belongsTo(module, {
    foreignKey: "module_id",
    targetKey: "id",
  });
};
