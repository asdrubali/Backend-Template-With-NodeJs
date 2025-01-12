import { Router } from "express";
import { verifyAccess } from "../../../../middlewares/user-access";

import { allValidator } from "../../../../middlewares/error-validator";
import { moduleWithOperationsValidator, setPermissionsForRoleValidator } from "../validators/role_module.validators";
import {
  getModulesWithAllOperationsByRoleController,
  getMyModulesWithAllFunctionalitiesByRoleController,
  setModulesOrOperationsForRoleController,
} from "../controllers/role_module.controller";


export const router: Router = Router();

router.get(
  "/list/operations/role/:roleId",
  verifyAccess,
  moduleWithOperationsValidator,
  allValidator,
  getModulesWithAllOperationsByRoleController
);

router.get(
  "/list/my-modules",
  verifyAccess,
  getMyModulesWithAllFunctionalitiesByRoleController
);

router.post(
  "/set/permissions/role",
  verifyAccess,
  setPermissionsForRoleValidator,
  allValidator,
  setModulesOrOperationsForRoleController
)
