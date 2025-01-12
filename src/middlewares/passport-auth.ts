// authMiddleware.ts

import { Request, Response, NextFunction } from "express";
import { CustomPassportError } from "./passport";

export const handleAuthError = (
  err: CustomPassportError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err && err.source === "Passport") {
    switch (err.reason) {
      case "TokenNotFound":
      case "TokenExpired":
      case "RolesNotFound":
      case "RolesOrRoutesNotFound":
        return res.status(401).json(err);
      default:
        return res.status(500).json(err);
    }
  } else {
    next(err);
  }
};
