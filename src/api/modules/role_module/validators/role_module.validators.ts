import { body, param } from "express-validator";

export const moduleWithOperationsValidator = [
  param("roleId")
    .not()
    .isEmpty()
    .withMessage("The role ID is required")
    .bail()
    .isInt({ gt: 0 })
    .withMessage("The role ID must be a positive integer")
    .bail(),
];

export const setPermissionsForRoleValidator = [
  body("roleId")
    .not()
    .isEmpty()
    .withMessage("The role ID is required")
    .bail()
    .isInt({ gt: 0 })
    .withMessage("The role ID must be a positive integer")
    .bail(),
  body("modules.add")
    .optional()
    .isArray()
    .withMessage("Must be an array")
    .bail()
    .custom((value: any[], { req }) => {
      if (!value.every(Number.isInteger)) {
        throw new Error("All elements must be integers");
      }
      if (new Set(value).size !== value.length) {
        throw new Error("All numbers must be unique");
      }
      if (
        req.body.modules?.remove &&
        value.some((num) => req.body.modules.remove.includes(num))
      ) {
        throw new Error(
          'Values in "modules.add" and "modules.remove" must not overlap'
        );
      }
      return true;
    }),
  body("modules.remove")
    .optional()
    .isArray()
    .withMessage("Must be an array")
    .bail()
    .custom((value: any[], { req }) => {
      if (!value.every(Number.isInteger)) {
        throw new Error("All elements must be integers");
      }
      if (new Set(value).size !== value.length) {
        throw new Error("All numbers must be unique");
      }
      if (
        req.body.modules?.add &&
        value.some((num) => req.body.modules.add.includes(num))
      ) {
        throw new Error(
          'Values in "modules.remove" and "modules.add" must not overlap'
        );
      }
      return true;
    }),
  body("operations.add")
    .optional()
    .isArray()
    .withMessage("Must be an array")
    .bail()
    .custom((value: any[], { req }) => {
      if (!value.every(Number.isInteger)) {
        throw new Error("All elements must be integers");
      }
      if (new Set(value).size !== value.length) {
        throw new Error("All numbers must be unique");
      }
      if (
        req.body.operations?.remove &&
        value.some((num) => req.body.operations.remove.includes(num))
      ) {
        throw new Error(
          'Values in "operations.add" and "operations.remove" must not overlap'
        );
      }
      return true;
    }),
  body("operations.remove")
    .optional()
    .isArray()
    .withMessage("Must be an array")
    .bail()
    .custom((value: any[], { req }) => {
      if (!value.every(Number.isInteger)) {
        throw new Error("All elements must be integers");
      }
      if (new Set(value).size !== value.length) {
        throw new Error("All numbers must be unique");
      }
      if (
        req.body.operations?.add &&
        value.some((num) => req.body.operations.add.includes(num))
      ) {
        throw new Error(
          'Values in "operations.remove" and "operations.add" must not overlap'
        );
      }
      return true;
    }),
];
