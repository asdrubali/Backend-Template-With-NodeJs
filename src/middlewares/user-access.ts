import { NextFunction, Request, Response } from "express";
import { IToken } from "../api/interfaces/IToken.interface";
import { errorResponse } from "../api/functions/apiResponses";
import { DataBase } from "../database";
import { Model, Op, QueryTypes } from "sequelize";
import { AllowedOperations } from "../api/modules/allowed_operations/models/allowed_operations.model";
import { Role } from "../api/modules/role/model/role.model";
import { RoleOperations } from "../api/modules/role_operations/models/role_operations.model";

function routeToRegExp(route: string) {
  // If the path ends with '/', it is removed
  const cleanedRoute = route.endsWith("/") ? route.slice(0, -1) : route;

  return new RegExp("^" + cleanedRoute.split("*").join("[^/]+") + "$");
}

export async function verifyAccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req?.user as IToken;
  const rol = user.rolesId;

  const originalRoute = req.originalUrl;
  let currentRoute = originalRoute.split("?")[0].replace("/api", "");

  // Make sure there is no trailing '/'
  currentRoute =
    currentRoute.endsWith("/") && currentRoute !== "/"
      ? currentRoute.slice(0, -1)
      : currentRoute;

  const currentMethod = req.method.toUpperCase();

  currentRoute = currentRoute.toLowerCase();

// verify that this route exists for the role
  const query = `
        SELECT ao.route
        FROM role_operations ro
        LEFT JOIN allowed_operations ao ON ro.operation_id = ao.id
        WHERE ro.role_id IN (:rol) AND :currentRoute LIKE CONCAT(REPLACE(ao.route, '*', ''), '%');
    `;
  const rows = await DataBase.instance.sequelize.query(query, {
    type: QueryTypes.SELECT,
    replacements: { rol, currentRoute },
  });

  const hasAccess = rows.length;

  if (hasAccess === 0) {
    return res
      .status(403)
      .json(
        errorResponse(
          "You do not have permissions to perform the following operation",
          403
        )
      );
  }

  next();
}




