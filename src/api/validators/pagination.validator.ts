import { param, query } from "express-validator";

export const paramUserId = param("id")
  .not()
  .isEmpty()
  .withMessage("The ID field is required")
  .bail()
  .isInt({ min: 1 })
  .withMessage("The ID must be a positive integer greater than zero")
  .bail();

export const paginationValidator = [
  query("page")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("The page must be a positive integer")
    .bail(),

  query("limit")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("The limit must be a positive integer")
    .bail(),
];

export const IdValidator = [paramUserId];
