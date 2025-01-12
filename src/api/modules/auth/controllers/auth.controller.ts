import { NextFunction, Request, Response } from "express";
import { SignInDto } from "../dtos/signInDto";
import { validateSignIn } from "../services/auth.service";
import {
  errorResponse,
  successResponse,
} from "../../../functions/apiResponses";
import {
  createToken,
} from "../../token/services/create/token.service";
import { getRoleIdsByUserId } from "../../user_role/services/find/user_role.service";
import { generateJWT } from "../../../../helpers/generate-jwt";
import { closeAllSessions } from "../../token/services/update/token.service";
import { errorControl } from "../../../functions/errorControl";
import { IToken } from "../../../interfaces/IToken.interface";
import { basicUpdateUserById, findOneUser } from "../../users/services";
import { getRandomInt } from "../../../../utils/numbers";
import { sendMailAxios } from "../../../../utils/generate.mail";
import { template_create_user } from "../../../templates/templates";
import { encrypt, verify } from "../../../../security/criptoService";
import { LoginStatus } from "../../users/constants/loginStatus";
import { UserPartialAttributes } from "../../users/models/user.model";
import { DataBase } from "../../../../database";
import { getFechaPeruDate } from "../../../functions/globalVariables";

export const signInController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.body as SignInDto;

  try {
    const loginValidations = await validateSignIn(auth);

    if (!loginValidations.success) {
      return res
        .status(loginValidations.statusCode)
        .json(
          errorResponse(loginValidations.message, loginValidations.statusCode)
        );
    }

    if (!loginValidations.data) {
      return res
        .status(500)
        .json(
          errorResponse(
            "There was a problem verifying the existence of the user",
            500
          )
        );
    }

    const user = loginValidations.data;

   // Open sessions are closed
    await closeAllSessions({ user_id: user.id });

    // Roles are obtained
    const roles = await getRoleIdsByUserId(user.id);

    // The token is generated in the DB
    const token = await createToken({ user_id: user.id });

    // The JWT is generated
    const payload = {
      _key: token.uuid,
      _userId: user.id,
      _roles: roles
    };

    const jwt = await generateJWT(payload);

    return res
      .status(200)
      .json(successResponse(jwt, 200, "Session started successfully"));
  } catch (err: any) {
    errorControl(err, next);
  }
};

export const signOutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user as IToken;

    const finish = await closeAllSessions({
      user_id: userId,
    });

    // delete the device Id
    try {
      await DataBase.instance.user.update(
        {
          device_id: "",
        },
        {
          where: {
            id: userId,
          },
        }
      );
    } catch (error) {}

    return res
      .status(200)
      .json(successResponse(finish, 200, "Session ended successfully"));
  } catch (error) {
    errorControl(error, next);
  }
};

export const sendCodeForRecoveryPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const user = await findOneUser({
      where: {
        email,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json(errorResponse("Error requesting recovery code", 400));
    }

    const fullName =
      user.name + " " + user.paternal_lastname + " " + user.maternal_lastname;
    const code = getRandomInt(1001, 9999).toString();

    // The code is set
    const resp = await basicUpdateUserById({
      userId: user.id,
      user: {
        recovery_code: code,
      },
    });

    let company_logo = "";
    let company_name = "TEST";
    let company_p = "#ac2c34";
    let company_s = "#ac2c34";

    // The mail is sent
    // await sendMailAxios({
    //   title: `[${company_name}] Verification code`,
    //   to: email!,
    //   template: template_create_user({
    //     names: user.name + " " + user.paternal_lastname,
    //     code,
    //     logo: company_logo,
    //     company_name,
    //   }),
    // });

    return res
      .status(200)
      .json(successResponse(email, 200, "Code sent to your email!"));
  } catch (error) {
    errorControl(error, next);
  }
};

export const verifyRecoveryCodeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await findOneUser({
      where: {
        email,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json(
          errorResponse(
            "An error occurred while trying to validate the information",
            404
          )
        );
    }

    if (user.recovery_code != verificationCode) {
      return res
        .status(400)
        .json(
          errorResponse(
            "The code provided does not match the one sent",
            404
          )
        );
    }

    return res
      .status(200)
      .json(
        successResponse(
          { email, verificationCode },
          200,
          "Code validated successfully"
        )
      );
  } catch (error) {
    errorControl(error, next);
  }
};

export const recoveryUserAccountController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password: newPassword, verificationCode } = req.body;
    const user = await findOneUser({
      where: {
        email,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json(
          errorResponse(
            "An error occurred while trying to validate the information",
            404
          )
        );
    }

    const encryptedData = await encrypt(newPassword);

    // Re-validates
    if (user.recovery_code != verificationCode) {
      return res
        .status(400)
        .json(
          errorResponse(
            "The code provided does not match the one sent",
            400
          )
        );
    }

    const isSamePassword = await verify(newPassword, user.salt, user.password);

    if (isSamePassword) {
      return res
        .status(400)
        .json(
          errorResponse("It is not possible to register the same password", 400)
        );
    }

    let message;
    let resp;
    if (user.login_status == LoginStatus.BI) {
      const dataForRecover: UserPartialAttributes = {
        password: encryptedData.hash,
        salt: encryptedData.salt,
        last_unlock_date: getFechaPeruDate(),
        status: true,
        login_status: LoginStatus.H,
        failed_attempts: 0,
        lockout_minutes: null,
        last_lock_date: null,
        recovery_code: null,
      };

      resp = await basicUpdateUserById({
        user: dataForRecover,
        userId: user.id,
      });

      message = "Account restored successfully";
    } else {
      const dataForUpdate: UserPartialAttributes = {
        password: encryptedData.hash,
        salt: encryptedData.salt,
      };

      resp = await basicUpdateUserById({
        user: dataForUpdate,
        userId: user.id,
      });

      message = "Password updated successfully";
    }

    res.status(200).json(successResponse(resp, 200, message));
  } catch (err: any) {
    errorControl(err, next);
  }
};
