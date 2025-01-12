import { IgnoreProperties } from "../../../../types/ignore-properties";
import { OverrideProperties } from "../../../../types/override-properties";
import { UserAttributes, UserCreationAttributes } from "../models/user.model";

// To ignore some properties
interface UserOmit
  extends IgnoreProperties<
    UserCreationAttributes,
    | "id"
    | "salt"
    | "status"
    | "login_status"
    | "failed_attempts"
    | "last_lock_date"
    | "last_unlock_date"
    | "lockout_minutes"
    | "recovery_code"
    | "created_date"
    | "created_by"
    | "updated_date"
    | "updated_by"
  > {
    principal_sede_id?: number
  }

// In case we need to override some properties
export interface CreateUserDto
  extends OverrideProperties<
    UserOmit,
    {
      is_deleted?: boolean;
    }
  > {
  roles: number[];
}
