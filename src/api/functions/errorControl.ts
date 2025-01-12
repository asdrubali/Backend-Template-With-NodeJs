import { NextFunction } from "express";
import createHttpError from "http-errors";
import { ValidationError } from "sequelize";

export const errorControl = (err: any, next: NextFunction) => {
  let status = 500;
  if (err.status === 404) {
    status = 404;
  } else if (err instanceof ValidationError) {
    status = 400;
  }
  let print = createHttpError(status, err);
  next(print);
};
