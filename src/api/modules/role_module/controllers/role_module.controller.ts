import { NextFunction, Request, Response } from "express";

import { errorControl } from "../../../functions/errorControl";

import {
  getModulesWithAllFunctionalitiesByRole,
  getModulesWithAllOperationsByRole,
} from "../services";

import { successResponse } from "../../../functions/apiResponses";

import { IToken } from "../../../interfaces/IToken.interface";

import { SetModulesAndOperationsDto } from "../dtos/set-modules-operations.dto";

import { setNewModulesByRol } from "../services/create/role_module.service";

import { destroyRoleModules } from "../services/delete/role_module.service";

import {
  destroyRoleOperations,
  setNewOperationsByRol,
} from "../../role_operations/services";

import { DataBase } from "../../../../database";


export const getModulesWithAllOperationsByRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roleId = req.params.roleId;
    const modules = await getModulesWithAllOperationsByRole(Number(roleId));

    res
      .status(200)
      .json(
        successResponse(modules, 200, "Operations retrieved successfully")
      );
  } catch (error) {
    errorControl(error, next);
  }
};


export const getMyModulesWithAllFunctionalitiesByRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const myRoles = (req.user as IToken).rolesId;

    const modules = await getModulesWithAllFunctionalitiesByRole(myRoles);

    res
      .status(200)
      .json(
        successResponse(
          modules,
          200,
          "Modules and functionalities retrieved successfully"
        )
      );
  } catch (error) {
    errorControl(error, next);
  }
};


export const setModulesOrOperationsForRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body as SetModulesAndOperationsDto;
    const transaction = await DataBase.instance.sequelize.transaction();
    let message;
    let status;

    try {
      const { roleId, modules, operations } = data;

      if (!(modules || operations)) {
        return res
          .status(200)
          .json(
            successResponse(
              data,
              200,
              "No changes found in permissions"
            )
          );
      }

      const addModules = modules?.add;
      if (addModules && addModules.length > 0) {
        await setNewModulesByRol({
          roleId,
          moduleIds: addModules,
          transaction,
        });
      }

      const removeModules = modules?.remove;
      if (removeModules && removeModules.length > 0) {
        await destroyRoleModules({
          roleId,
          moduleIds: removeModules,
          transaction,
        });
      }

      const addOperations = operations?.add;
      if (addOperations && addOperations.length > 0) {
        await setNewOperationsByRol({
          roleId,
          operationIds: addOperations,
          transaction,
        });
      }

      const removeOperations = operations?.remove;
      if (removeOperations && removeOperations.length > 0) {
        await destroyRoleOperations({
          roleId,
          operationIds: removeOperations,
          transaction,
        });
      }

      await transaction.commit();
      message = "Permissions saved successfully";
      status = 200;
    } catch (error) {
      await transaction.rollback();
      message = "An unexpected error occurred while saving permissions";
      status = 500;
    }

    return res.status(status).json(successResponse(data, status, message));
  } catch (error) {
    errorControl(error, next);
  }
};
