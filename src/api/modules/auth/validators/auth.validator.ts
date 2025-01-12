import { body } from "express-validator";
import { allValidator } from "../../../../middlewares/error-validator";
import { DataBase } from "../../../../database";
import { RegexPassword } from "../../../functions/globalVariables";

const emailValidator = body("email")
  .not()
  .isEmpty()
  .withMessage("Email cannot be empty")
  .bail()
  .isEmail()
  .withMessage("A valid email is required")
  .bail()
  .isString()
  .withMessage("The email must be a text string")
  .bail();

const recoveryCodeValidator = body("verificationCode")
  .not()
  .isEmpty()
  .withMessage("Verification code is required")
  .bail()
  .isString()
  .withMessage("The verification code must be a text string")
  .bail()
  .isLength({ min: 4, max: 4 })
  .withMessage("The verification code must be 4 digits")
  .bail();

const passwordValidator = body("password")
  .not()
  .isEmpty()
  .withMessage("Password cannot be empty")
  .bail()
  .isString()
  .withMessage("A text string is required for the password")
  .matches(RegexPassword)
  .withMessage(
    "The password must contain at least one special character, one number, one capital letter and be at least 8 characters long."
  )
  .bail();

const passwordValidatorv2 = body("password")
  .not()
  .isEmpty()
  .withMessage("Password cannot be empty")
  .bail()
  .isString()
  .withMessage("A text string is required for the password")
  .bail();

export const signInValidator = [emailValidator, passwordValidatorv2];

export const sendCodeForRecoveryValidator = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email cannot be empty")
    .bail()
    .isEmail()
    .withMessage("A valid email is required")
    .bail()
    .isString()
    .withMessage("The email must be a text string")
    .custom(async (value: string) => {
      const existsEmail = await DataBase.instance.user.findOne({
        where: {
          email: value,
          is_deleted: false,
        },
      });

      if (existsEmail) {
        return true;
      }
      throw new Error("The email entered does not exist");
    })
    .bail(),
];

export const verifyRecoveryCodeValidator = [
  emailValidator,
  recoveryCodeValidator,
];

export const recoveryUserAccountValidator = [
  emailValidator,
  passwordValidator,
  recoveryCodeValidator,
];
