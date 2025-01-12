import { body, param } from "express-validator";
import { custom } from "joi";
import moment from "moment";
import { DataBase } from "../../../../database";
import { paramUserId } from "../../../validators/pagination.validator";

export const createUserDtoValidator = [
  body("name")
    .not()
    .isEmpty()
    .withMessage("Name cannot be empty")
    .bail()
    .isString()
    .withMessage("Name must be a string")
    .bail(),

  body("paternal_lastname")
    .not()
    .isEmpty()
    .withMessage("Paternal last name cannot be empty")
    .bail()
    .isString()
    .withMessage("Paternal last name must be a string")
    .bail(),

  body("document_type")
  .optional({ nullable: true})
    .isString()
    .withMessage("Document type must be a string")
    .bail(),

  body("document_number")
    .optional({ nullable: true})
    .isString()
    .withMessage("Document number must be a string")
    .bail(),

  body("principal_sede_id")
    .optional({ nullable: true})
    .isNumeric()
    .withMessage("Principal sede ID must be a number")
    .bail(),

  body("email")
    .not()
    .isEmpty()
    .withMessage("Email cannot be empty")
    .bail()
    .isEmail()
    .withMessage("A valid email is required")
    .bail()
    .isString()
    .withMessage("Email must be a string")
    .bail()
    .custom(async (value: string) => {
      const existsEmail = await DataBase.instance.user.findOne({
        where: {
          email: value,
          is_deleted: false,
        },
      });

      if (existsEmail) {
        throw new Error("The email entered already exists");
      }
      return true;
    })
    .bail(),

  body("roles")
    .not()
    .isEmpty()
    .withMessage("Roles are required")
    .bail()
    .isArray()
    .withMessage("Must be an array")
    .bail()
    .isLength({ min: 1 })
    .withMessage("At least one element is required")
    .bail()
    .custom((value: any[]) => {
      if (!value.every(Number.isInteger)) {
        throw new Error("All elements must be integers");
      }
      if (new Set(value).size !== value.length) {
        throw new Error("All numbers must be unique");
      }
      return true;
    })
    .bail(),

  body("phone")
    .optional({ nullable: true,})
    .isString()
    .withMessage("Phone must be a string")
    .bail()
    .custom(async (value: string) => {
      if (value && value.trim() !== "") {
        const existsPhone = await DataBase.instance.user.findOne({
          where: {
            phone: value,
          },
        });

        if (existsPhone) {
          throw new Error("The entered phone number already exists");
        }
      }
      return true;
    })
    .bail(),
];

export const updateUserDtoValidator = [
  paramUserId,
  body("name")
    .optional({ values: "undefined" })
    .not()
    .isEmpty()
    .withMessage("Name cannot be empty")
    .bail()
    .isString()
    .withMessage("Name must be a string")
    .bail(),

  body("document_type")
    .optional({ nullable: true})
    .isString()
    .withMessage("Document type must be a string")
    .bail().optional() ,

  body("principal_sede_id")
    .optional({ nullable: true})
    .isNumeric()
    .withMessage("Principal sede ID must be a number")
    .bail().optional() ,

  body("document_number")
    .optional({ nullable: true})
    .isString()
    .withMessage("Document number must be a string")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Document number must be at least 8 characters")
    .bail().optional() ,

  body("roles")
    .optional({ values: "undefined" })
    .not()
    .isEmpty()
    .withMessage("Roles cannot be empty")
    .bail()
    .isLength({ min: 1 })
    .withMessage("At least one element is required")
    .bail()
    .custom((value: any) => {
      if (!value.add.every(Number.isInteger) || !value.remove.every(Number.isInteger)) {
        throw new Error("All elements must be integers");
      }
      if (new Set(value.add).size !== value.add.length || new Set(value.remove).size !== value.remove.length ) {
        throw new Error("All numbers must be unique");
      }
      return true;
    })
    .bail(),

  body("paternal_lastname")
    .optional({ values: "undefined" })
    .not()
    .isEmpty()
    .withMessage("Paternal last name cannot be empty")
    .bail()
    .isString()
    .withMessage("Paternal last name must be a string")
    .bail(),

  body("roles")
    .optional({ values: "undefined" })
    .not()
    .isEmpty()
    .withMessage("Roles cannot be empty")
    .bail(),

  body("email")
    .optional({ values: "undefined" })
    .not()
    .isEmpty()
    .withMessage("Email cannot be empty")
    .bail()
    .isEmail()
    .withMessage("A valid email is required")
    .bail()
    .isString()
    .withMessage("Email must be a string")
    .bail()
    .custom(async (value: string) => {
      const existsEmail = await DataBase.instance.user.findOne({
        where: {
          email: value,
          is_deleted: false,
        },
      });

      if (existsEmail) {
        throw new Error("The email entered already exists");
      }
      return true;
    })
    .bail(),

  body("phone")
    .optional({ nullable: true })
    .isString()
    .withMessage("Phone must be a string")
    .bail()
    .custom(async (value: string) => {
      if (value && value.trim() !== "") {
        const existsPhone = await DataBase.instance.user.findOne({
          where: {
            phone: value,
            is_deleted: false,
          },
        });

        if (existsPhone) {
          throw new Error("The entered phone number already exists");
        }
      }
      return true;
    }),
];

export const changePasswordValidator = [
  body("oldPassword")
    .not()
    .isEmpty()
    .withMessage("Old password is required")
    .bail()
    .isString()
    .withMessage("Old password must be a string")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Old password must be at least 6 characters"),
  
  body("newPassword")
    .not()
    .isEmpty()
    .withMessage("New password is required")
    .bail()
    .isString()
    .withMessage("New password must be a string")
    .bail()
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters")
    .bail()
    .custom((value, { req }) => {
      if (value === req.body.oldPassword) {
        throw new Error(
          "The new password cannot be the same as the old password"
        );
      }
      return true;
    }),
];
