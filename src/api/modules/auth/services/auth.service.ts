import moment from "moment";

import { LoginStatus } from "../../users/constants/loginStatus";
import {
  UserAttributes,
  UserPartialAttributes,
} from "../../users/models/user.model";
import { findOneUser } from "../../users/services/find/user.service";
import { SignInDto } from "../dtos/signInDto";
import { BasicSignInResponse } from "../interfaces/auth.interfaces";
import { USER_BLOCK_POLICY } from "../../users/constants/userBlockPolicy";
import { verify } from "../../../../security/criptoService";
import { basicUpdateUserById } from "../../users/services/update/user.service";
import { DataBase } from "../../../../database";
import { getFechaPeruDate } from "../../../functions/globalVariables";

export const validateSignIn = async (
  auth: SignInDto
): Promise<BasicSignInResponse<UserAttributes | null>> => {
  const { email, password, device_id } = auth;

  const resp: BasicSignInResponse<UserAttributes | null> = {
    statusCode: 500,
    message: "An unexpected error occurred, please contact your administrator.",
    success: false,
    data: null,
  };

  try {
    // The user is searched by email
    const user = await findOneUser({
      where: {
        email,
      },
    });

    if (!user) {
      resp.message = "User disabled or does not exist";
      resp.statusCode = 404;
      return resp;
    }

    const {
      id,
      status,
      login_status,
      failed_attempts,
      last_lock_date,
      lockout_minutes,
    } = user;

    if (device_id) {
      await DataBase.instance.user.update(
        {
          device_id: device_id,
        },
        {
          where: {
            id: id,
          },
        }
      );
    }

    // The status is checked
    if (!status) {
      resp.statusCode = 401;
      resp.message = "User disabled or does not exist";
      return resp;
    }

    // Login status is verified
    if (login_status === LoginStatus.BI) {
      resp.statusCode = 401;
      resp.message =
        "The user is blocked, go to the reset account section or change your password";
      return resp;
    }

    // Checks if the following properties are correctly implemented
    if (
      login_status === LoginStatus.BIT &&
      !(last_lock_date && lockout_minutes)
    ) {
      resp.statusCode = 500;
      return resp;
    }

    // It is verified if it is temporarily blocked and if its attempts are equal to or greater than the established maximum
    if (
      login_status === LoginStatus.BIT &&
      failed_attempts >= USER_BLOCK_POLICY.MAX_ATTEMPTS
    ) {
      const momentNow = moment().utc();
      const momentFinishLockDate = moment(last_lock_date).add(
        lockout_minutes,
        "minutes"
      );

      if (momentFinishLockDate.isSameOrAfter(momentNow)) {
        const millisecondsDifference = momentFinishLockDate.diff(momentNow);
        let message = generateTimeMessage(millisecondsDifference);

        resp.statusCode = 401;
        resp.message = message;
        return resp;
      }
    }

    // Prepare the object to be unlocked
    const unlock: UserPartialAttributes = {
      login_status: LoginStatus.H,
      failed_attempts: 0,
      last_lock_date: null,
      last_unlock_date: getFechaPeruDate(),
      lockout_minutes: null,
    };

    const isValidPassword = await verify(password, user.salt, user.password);

    // If the password is incorrect, the attempts are increased
    if (!isValidPassword) {
      let messagePassword = "Incorrect email or password";
      let statusCode = 400;

      let newFailedAttempts = failed_attempts + 1;

      const block: UserPartialAttributes = {
        failed_attempts: newFailedAttempts,
      };

      if (newFailedAttempts === USER_BLOCK_POLICY.MAX_ATTEMPTS) {
        messagePassword = "You do not have permissions, please log in again";

        // Se bloquea temporalmente
        block.last_lock_date = getFechaPeruDate();
        block.lockout_minutes = USER_BLOCK_POLICY.MIN_BLOCKED_MINUTES;
        block.login_status = LoginStatus.BIT;
      }

      await basicUpdateUserById({ userId: user.id, user: block });

      resp.message = messagePassword;
      resp.statusCode = statusCode;
      return resp;
    }

    if (isValidPassword && failed_attempts > 0) {

      // Unlocks
      await basicUpdateUserById({
        userId: user.id,
        user: unlock,
        updatedBy: null,
      });
    }

    resp.data = { ...user };
    resp.statusCode = 200;
    resp.message = "Valid authentication";
    resp.success = true;

    return resp;
  } catch (error) {
    throw error;
  }
};

const generateTimeMessage = (millisecondsDifference: number): string => {
  const duration = moment.duration(millisecondsDifference);
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  let message = "Please try again in ";

  if (minutes === 0 && seconds === 0) {
    message += "a second";
  } else if (minutes === 0) {
    if (seconds === 1) {
      message += "a second";
    } else {
      message += `${seconds} second`;
    }
  } else {
    if (minutes === 1) {
      message += "one minute";
    } else {
      message += `${minutes} minutos`;
    }

    if (seconds > 0) {
      if (seconds === 1) {
        message += " y a second";
      } else {
        message += ` y ${seconds} second`;
      }
    }
  }

  return message;
};
