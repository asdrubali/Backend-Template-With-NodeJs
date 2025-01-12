import { IAddRemove } from "../../../interfaces/IAddRemove";

export interface SetModulesAndOperationsDto {
  roleId: number;
  modules?: IAddRemove;
  operations?: IAddRemove;
}

