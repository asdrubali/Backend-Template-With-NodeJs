import { body, param } from "express-validator";

export const createRoleDtoValidator = [
  body("name")
    .not()
    .isEmpty()
    .withMessage("The name cannot be empty")
    .bail()
    .isString()
    .withMessage("The name must be a string")
    .bail()
    .isLength({ min: 3 })
    .withMessage("The name must have at least 3 characters")
    .bail(),
  body("description")
    .optional({ values: "null" })
    .isString()
    .withMessage("The description must be a string")
    .bail(),
];

const paramRoleIdValidator = param("id")
  .not()
  .isEmpty()
  .withMessage("The role ID is required")
  .bail()
  .isInt({ gt: 0 })
  .withMessage("The role ID must be a positive integer")
  .bail();

export const updateRoleDtoValidator = [
  paramRoleIdValidator,
  body("name")
    .optional({ values: "null" })
    .not()
    .isEmpty()
    .withMessage("The name cannot be empty")
    .bail()
    .isString()
    .withMessage("The name must be a string")
    .bail()
    .isLength({ min: 3 })
    .withMessage("The name must have at least 3 characters")
    .bail(),
  body("description")
    .optional({ values: "null" })
    .isString()
    .withMessage("The description must be a string")
    .bail(),
];

export const disableRoleValidator = [paramRoleIdValidator];
