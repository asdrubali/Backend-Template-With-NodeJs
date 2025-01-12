import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import config from "../config/environments";
import { TokenAttributes } from "../api/modules/token/models/token.model";
import { findOneToken } from "../api/modules/token/services/find/token.service";
import moment from "moment";
import { updateLastRequest } from "../api/modules/token/services/update/token.service";
import { AllowedRoute, IToken } from "../api/interfaces/IToken.interface";
import { getUserRolesAndRoutes } from "../api/modules/allowed_operations/services/find/allowed_operations.service";
import { JwtPayload } from "../helpers/generate-jwt";


const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.SECRET_HIDDEN_KEY!,
};

export type CustomPassportErrorReason =
  | "TokenNotFound"
  | "TokenExpired"
  | "RolesNotFound"
  | "RolesOrRoutesNotFound"
  | "InternalError";

export interface CustomPassportError {
  message: string;
  reason: CustomPassportErrorReason;
  source: "Passport";
}

export default new Strategy(opts, async (payload: JwtPayload, done) => {
  const customError: CustomPassportError = {
    message: "Unknown error. Please contact your administrator",
    reason: "InternalError",
    source: "Passport",
  };

  try {
    const token: TokenAttributes | null = await findOneToken({
      where: {
        uuid: payload._key,
      },
    });

    if (!token) {
      customError.reason = "TokenNotFound";
      customError.message = "Token not found";
      return done(customError, false);
    }

    const momentNow = moment().utc();
    const momentExpiresAt = moment(token.expires_at);

    // Check if the token has expired
    if (momentNow.isAfter(momentExpiresAt) || token.status == false) {
      customError.reason = "TokenExpired";
      customError.message = "Session expired";
      return done(customError, false);
    }

    const respRoles = await getUserRolesAndRoutes(token.user_id);

    if (respRoles.length === 0) {
      customError.reason = "RolesNotFound";
      customError.message = "Insufficient permissions";
      return done(customError, false);
    }

    const rolesId = JSON.parse(respRoles[0].roles) as number[];
    // const allowedRoutes = JSON.parse(respRoles[0].routes) as AllowedRoute[];

    if (rolesId.length === 0) {
      customError.reason = "RolesOrRoutesNotFound";
      customError.message = "Insufficient permissions";
      return done(customError, false);
    }

    await updateLastRequest({ uuid: payload._key });

    const user: IToken = {
      userId: Number(token.user_id),
      rolesId
    };

    return done(null, user);
  } catch (error) {
    console.log(error);
    return done(customError, false);
  }
});
