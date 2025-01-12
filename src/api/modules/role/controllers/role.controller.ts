import { NextFunction, Request, Response } from "express";
import { IToken } from "../../../interfaces/IToken.interface";
import { getRolesList } from "../services/find/role.service";
import { createRole } from "../services/create/role.services";
import { updateRoleById } from "../services/update/role.service";
import { disableOrEnabledRolById } from "../services/delete/role.service";
import { successResponse } from "../../../functions/apiResponses";
import { errorControl } from "../../../functions/errorControl";
import { getFechaPeruDate } from "../../../functions/globalVariables";

export const listRolesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const queryParams = req.query;
    const page = Number(queryParams.page) || undefined;
    const limit = Number(queryParams.limit) || undefined;

    const resp = await getRolesList({ page, limit });
    let message = "List of roles successfully obtained";

    if (resp.rows.length === 0) {
      message = "No roles found";
    }

    res.status(200).json(successResponse(resp, 200, message));
  } catch (err: any) {
    errorControl(err, next);
  }
};

export const createRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as IToken;
    const { name, description } = req.body;
    const createdBy = user.userId;

    const role = await createRole({
      role: {
        id: 0,
        status: true,
        created_date: getFechaPeruDate(),
        name: name,
        description: description,
      },
      createdBy,
    });

    res
      .status(200)
      .json(successResponse(role, 200, "Role created successfully"));
  } catch (err: any) {
    errorControl(err, next);
  }
};

export const updateRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as IToken;

    const { id } = req.params;
    const { name, description } = req.body;

    const result = await updateRoleById({
      role: {
        name,
        description,
        updated_by: user.userId,
      },
      rolId: +id,
      updatedBy: user.userId,
    });
    let message = "Updated successfully";

    if (result[0] == 0) {
      message = "Cannot update system variables";
      res.status(200).json(successResponse(result, 200, message));
    }
    res.status(200).json(successResponse(result, 200, message));
  } catch (err: any) {
    errorControl(err, next);
  }
};

export const disableEnabledRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as IToken;

    const { id } = req.params;

    const result = await disableOrEnabledRolById({
      rolId: Number(id),
      updatedBy: user.userId,
    });

    res.status(200).json(successResponse(result, 200, 'Successful Process'));
  } catch (err: any) {
    errorControl(err, next);
  }
};
