import { NextFunction, Request, Response } from "express";
import { IToken } from "../../../interfaces/IToken.interface";
import {
  findOneUser,
  findUserInformationById,
  getAccountById,
  getUsersList,
} from "../services/find/user.service";
import {
  updateUserById,
  updateUserPassword,
} from "../services/update/user.service";
import { createUserAndSendMailService } from "../services/create/user.service";
import sequelize from "sequelize";
import createError from "http-errors";
import {
  errorResponse,
  successResponse,
} from "../../../functions/apiResponses";
import { errorControl } from "../../../functions/errorControl";
import { CreateUserDto } from "../dtos";
import { generate } from "generate-password";
import { disableOrEnableUserById } from "../services";
import { verify } from "../../../../security/criptoService";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { DataBase } from "../../../../database";
import { UserAttributes } from "../models/user.model";
import { IListQueryParams } from "../../../interfaces/IListQuery.interface";
import { IUserQueryParams } from "../interfaces/IUserQueryParams";
import { getFechaPeruDate } from "../../../functions/globalVariables";

// Get user account
export const getUserAccountController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as IToken;

    const userAccount = await getAccountById(user.userId);

    return res
      .status(200)
      .json(
        successResponse(
          userAccount,
          200,
          "User account retrieved successfully"
        )
      );
  } catch (err: any) {
    errorControl(err, next);
  }
};

// Create a new user
export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transaction = await DataBase.instance.sequelize.transaction();
  try {
    const { userId } = req.user as IToken;

    const {
      roles,
      name,
      paternal_lastname,
      email,
      document_number,
      phone,
    } = req.body as CreateUserDto;

    const randomPassword = generate({
      length: 10,
      symbols: false,
      numbers: true,
      lowercase: true,
      uppercase: false,
    });

    const result = await createUserAndSendMailService({
      createUserDto: {
        roles,
        name,
        paternal_lastname,
        email,
        username: email,
        password: randomPassword,
        document_number,
        phone,
      },
      createdBy: userId,
      transaction,
    });


    await transaction.commit();

    res
      .status(200)
      .json(
        successResponse(
          result.id,
          200,
          "User created successfully. A confirmation email has been sent with login credentials."
        )
      );
  } catch (err: any) {
    await transaction.rollback();
    if (err instanceof sequelize.ValidationError) next(createError(400, err));
    console.log(err);

    next(createError(404, err));
  }
};

// Update user details
export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user as IToken;
    const { id } = req.params;
    const {
      roles,
      name,
      paternal_lastname,
      email,
      document_number,
      phone,
    } = req.body as UpdateUserDto;

    const transaction = await DataBase.instance.sequelize.transaction();
    let isSuccess;
    try {
      await updateUserById({
        userId: +id,
        updateUserDto: {
          name,
          paternal_lastname,
          roles,
          email,
          document_number,
          phone,
        },
        transaction,
        updatedBy: userId,
      });

      await transaction.commit();
      isSuccess = true;
    } catch (error) {
      console.log({ error });
      isSuccess = false;
      await transaction.rollback();
    }

    if (!isSuccess) {
      return res
        .status(500)
        .json(
          errorResponse(
            "An unexpected error occurred while updating the user's data. Please contact your administrator.",
            500
          )
        );
    }

    return res
      .status(200)
      .json(
        successResponse([], 200, "User data updated successfully")
      );
  } catch (err: any) {
    errorControl(err, next);
  }
};

// Disable or enable user
export const disableEnabledUserForAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user as IToken;
    const { id } = req.params;

    const result = await disableOrEnableUserById({
      userId: +id,
      updatedBy: userId,
    });

    res
      .status(200)
      .json(successResponse(result, 200, "User updated successfully"));
  } catch (err: any) {
    errorControl(err, next);
  }
};

// List users
export const listUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const queryParams = req.query;
    const page = Number(queryParams.page) || undefined;
    const limit = Number(queryParams.limit) || undefined;
    const { rolesId } = req.user as IToken;
    const search = (queryParams.search as string) || "";
    const order = (queryParams.order as string) || "DESC";
    const column = (queryParams.column as string) || "";

    const resp = await getUsersList({
      page,
      limit,
      search,
      order,
      column
    });


    let message = "Users retrieved successfully";

    if (resp.data.length === 0) {
      message = "No users found";
    }

    res.status(200).json(successResponse(resp, 200, message));
  } catch (err: any) {
    errorControl(err, next);
  }
};

// Update user's password
export const updateMyUserPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user as IToken;

    const user = await findOneUser({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json(errorResponse("User not found or unavailable", 400));
    }

    const { oldPassword, newPassword } = req.body;
    const isOldPassword = await verify(oldPassword, user.salt, user.password);

    if (!isOldPassword) {
      return res
        .status(400)
        .json(errorResponse("Incorrect initial password", 400));
    }

    const updated = await updateUserPassword({
      userId,
      updatedBy: userId,
      password: newPassword,
    });

    return res
      .status(200)
      .json(
        successResponse(updated, 200, "Password updated successfully")
      );
  } catch (err: any) {
    errorControl(err, next);
  }
};

// Get user information by ID
export const findUserInformationByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    const user = await findUserInformationById(Number(userId));

    if (!user) {
      return res
        .status(404)
        .json(errorResponse(`No user found with id ${userId}`, 404));
    }

    return res
      .status(200)
      .json(successResponse(user, 200, "User retrieved successfully"));
  } catch (err: any) {
    errorControl(err, next);
  }
};
