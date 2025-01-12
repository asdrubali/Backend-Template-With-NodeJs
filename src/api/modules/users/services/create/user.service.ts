import { Optional, Transaction } from "sequelize";
import { DataBase } from "../../../../../database";
import {
  UserAttributes,
  UserCreationAttributes,
  UserModel,
} from "../../models/user.model";
import { CreateUserDto } from "../../dtos";
import { encrypt } from "../../../../../security/criptoService";
import { USER_DEFAULT_VALUES } from "../../constants/defaultValues";
import { sendMailAxios } from "../../../../../utils/generate.mail";
import { template_create_admin } from "../../../../templates/templates";
import config from "../../../../../config/environments/index";
import {
  setRolesForUser,
} from "../../../user_role/services/create/user_role.service";
import { NullishPropertiesOf } from "sequelize/types/utils";
import { getFechaPeruDate } from "../../../../functions/globalVariables";

export const createUserAndSendMailService = async ({
  createUserDto,
  createdBy,
  transaction,
}: {
  createUserDto: CreateUserDto;
  createdBy: number;
  transaction: Transaction;
}) => {
  try {

    const { password, salt, ...user_details }: UserAttributes =
      await createUser({
        createUserDto,
        createdBy,
        transaction,
      });

    let company_logo = "";
    let company_name = "TEST";
    let company_p = "#ac2c34";
    let company_s = "#ac2c34";

    
    // await sendMailAxios({
      //   title:
      //     "Hello " +
      //     user_details.name +
      //     ", your password id:  " +
      //     createUserDto.password,
    //   to: user_details.email!,
    //   template: template_create_admin({
      //     names: user_details.name + " " + user_details.paternal_lastname,
    //     redirect_buttom: config.PROY_FEURL + "/api/signin",
    //     logo: company_logo,
    //     company_name,
    //     p_color: company_p,
    //     s_color: company_s,
    //   }),
    // });
    
    return user_details;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const createUser = async ({
  createUserDto,
  createdBy,
  transaction,
}: {
  createUserDto: CreateUserDto;
  createdBy?: number;
  transaction?: Transaction;
}) => {
  const {
    roles,
    date_of_birth,
    document_type,
    document_number,
    ...basicData
  } = createUserDto;

  try {
    const { hash: encryptedPassword, salt } = await encrypt(basicData.password);

    const user: Optional<
      UserAttributes,
      NullishPropertiesOf<UserAttributes>
    > = {
      ...basicData,
      password: encryptedPassword,
      document_type,
      document_number,
      salt,
      date_of_birth: date_of_birth ? date_of_birth : null,
      created_date: getFechaPeruDate(),
      created_by: createdBy,
      status: true,
      login_status: USER_DEFAULT_VALUES.LOGIN_STATUS,
      failed_attempts: USER_DEFAULT_VALUES.FAILED_ATTEMPTS,
      id: 0,
      is_deleted: false,
    };

    let newUser = (
      await DataBase.instance.user.create(user, {
        transaction,
      })
    ).toJSON();

    if (roles && roles.length > 0) {
      await setRolesForUser({
        userId: newUser.id,
        roleIds: roles,
        transaction,
      });
    }



    return newUser;
  } catch (error) {
    throw error;
  }
};

export { createUser };
