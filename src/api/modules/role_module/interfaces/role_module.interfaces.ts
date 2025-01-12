import { OverrideProperties } from "../../../../types";

interface IOperations {
  id: number;
  name: string;
  method: string;
  is_in_use: boolean;
}

export interface IDbModulesWithOperations {
  module_id: number;
  module_name: string;
  module_status: boolean;
  is_in_use: boolean;
  operations: string;
}

export interface IModulesWithOperations
  extends OverrideProperties<
    IDbModulesWithOperations,
    {
      // operations: IOperations[];
      operations: any;
    }
  > {}

export interface ModuleFunctionality {
  module_id: number;
  module_name: string;
  module_base: string;
  module_icon: string;
  
  func_id: number;
  func_name: string;
  func_path: string;
  func_icon: string;
}
