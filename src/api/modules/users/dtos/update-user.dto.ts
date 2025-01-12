import { IgnoreProperties, OverrideProperties } from "../../../../types";
import { IAddRemove } from "../../../interfaces/IAddRemove";
import { CreateUserDto } from "./create-user.dto";

interface IUpdateUserNoPassword
  extends IgnoreProperties<Partial<CreateUserDto>, "password"> {}

export interface UpdateUserDto
  extends OverrideProperties<
    IUpdateUserNoPassword,
    {
      roles?: IAddRemove;
      campus_id?: number;
    }
  > {}
