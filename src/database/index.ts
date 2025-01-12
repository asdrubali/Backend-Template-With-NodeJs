import { Sequelize } from "sequelize";
import config from "../config/environments";
import {
  UserFactory,
  UserStatic,
} from "../api/modules/users/models/user.model";
import {
  TokenFactory,
  TokenStatic,
} from "../api/modules/token/models/token.model";
import { RoleFactory, RoleStatic } from '../api/modules/role/model/role.model';
import {
  UserRoleFactory,
  UserRoleStatic,
} from "../api/modules/user_role/models/user_role.model";
import { userHasManyTokens } from "./associations/user";
import { UserAndRoleManyToMany } from "./associations/user_role";

import {
  ModuleFactory,
  ModuleStatic,
} from "../api/modules/module/models/module.model";
import {
  RoleModuleFactory,
  RoleModuleStatic,
} from "../api/modules/role_module/models/role_module.model";

// cambio prueba
import {
  AllowedOperationsFactory
} from "../api/modules/allowed_operations/models/allowed_operations.model";
import {
  RoleOperationsFactory,
  RoleOperationsStatic,
} from "../api/modules/role_operations/models/role_operations.model";
import { RoleAndModuleManyToMany } from "./associations/role_module";
import {
  moduleHasManyFunctionalities,
  moduleHasManyOperations,
} from "./associations/module";

import seedModuleData from "./seeder/module.seeder";
import seedAllowOperationData from "../api/modules/allowed_operations/seeders/allowedOperations.seeder";
import seedRoleAllowedOperationData from "./seeder/role_operations.seeder";
import {
  seedRoleData,
  seedUserData,
  seedUserRoleData
} from "./seeder/auth.seeders";

import seedRoleModuleData from "./seeder/role_module.seeder";
import {
  FunctionalitiesFactory,
  FunctionalitiesStatic,
} from "../api/modules/functionalities/models/functionalities.model";
import seedFunctionalityData from "./seeder/funcionalities.seeder";
import { RoleAndOperationsManyToMany } from "./associations/role_operations";
import { AllowedOperationsStatic } from '../api/modules/allowed_operations/models/allowed_operations.model';


export class DataBase {
  private static _instance: DataBase;
  public sequelize: Sequelize;
  private _config = config;

  public user: UserStatic;
  public token: TokenStatic;
  public role: RoleStatic;
  public userRole: UserRoleStatic;
  public module: ModuleStatic;
  public roleModule: RoleModuleStatic;
  public allowedOperations: AllowedOperationsStatic;
  public roleOperations: RoleOperationsStatic;
  public functionalities: FunctionalitiesStatic;
  
  constructor() {
    this.sequelize = new Sequelize(
      this._config.PROY_BD!,
      this._config.PROY_BD_USER!,
      this._config.PROY_BD_PASS,
      {
        host: this._config.PROY_BD_HOST,
        port: Number(this._config.PROY_BD_PORT),
        logging: false,
        dialect: "mysql",
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
        },
      }
    );


    this.user = UserFactory(this.sequelize);
    this.token = TokenFactory(this.sequelize);
    this.role = RoleFactory(this.sequelize);
    this.userRole = UserRoleFactory(this.sequelize);
    this.module = ModuleFactory(this.sequelize);
    this.roleModule = RoleModuleFactory(this.sequelize);
    this.allowedOperations = AllowedOperationsFactory(this.sequelize);
    this.roleOperations = RoleOperationsFactory(this.sequelize);
    this.functionalities = FunctionalitiesFactory(this.sequelize);
    

    this.associations();
    this.connectDb();
  }

  public static get instance(): DataBase {
    return this._instance || (this._instance = new this());
  }

  private connectDb(): void {
    this.sequelize
      .authenticate()
      .then(async () => {

        await Promise.all([
          this.user.sync({ alter: true, logging: console.log }),
          this.token.sync({ alter: true, logging: console.log }),
          this.role.sync({ alter: true, logging: console.log }),
          this.userRole.sync({ alter: true, logging: console.log }),
          this.module.sync({ alter: true, logging: console.log }),
          this.roleModule.sync({ alter: true, logging: console.log }),
          this.allowedOperations.sync({ alter: true, logging: console.log }),
          this.roleOperations.sync({ alter: true, logging: console.log }),
          this.functionalities.sync({ alter: true, logging: console.log })
        ]);

        console.log("¡Run database!");

        const countUser = await this.user.count();
        const countRole = await this.role.count();
        const countUserRole = await this.userRole.count();
        const countModule = await this.module.count();
        const countAllowOperations = await this.allowedOperations.count();
        const countRoleOperation = await this.roleOperations.count();
        const countRoleModule = await this.roleModule.count();
        const countFunctionality = await this.functionalities.count();

        if (countUser === 0) {
          const queryInterface = this.sequelize.getQueryInterface();
          await seedUserData(queryInterface);
        }

        if (countRole === 0) {
          const queryInterface = this.sequelize.getQueryInterface();
          await seedRoleData(queryInterface);
        }

        if (countUserRole === 0) {
          const queryInterface = this.sequelize.getQueryInterface();
          await seedUserRoleData(queryInterface);
        }

        if (countModule === 0) {
          const queryInterface = this.sequelize.getQueryInterface();
          await seedModuleData(queryInterface);
        }

        if (countAllowOperations === 0) {
          const queryInterface = this.sequelize.getQueryInterface();
          await seedAllowOperationData(queryInterface);
        }

        if (countRoleOperation === 0) {
          const queryInterface = this.sequelize.getQueryInterface();
          await seedRoleAllowedOperationData(queryInterface);
        }

        if (countRoleModule === 0) {
          const queryInterface = this.sequelize.getQueryInterface();
          await seedRoleModuleData(queryInterface);
        }

        if (countFunctionality === 0) {
          const queryInterface = this.sequelize.getQueryInterface();
          await seedFunctionalityData(queryInterface);
        }

        console.log("¡Insert Database!");

      })

      .catch((err: any) => console.log(err));
  }

  private associations(): void {
    userHasManyTokens({ user: this.user, token: this.token });

    UserAndRoleManyToMany({
      user: this.user,
      role: this.role,
      userRole: this.userRole,
    });
    RoleAndModuleManyToMany({
      role: this.role,
      module: this.module,
      role_module: this.roleModule,
    });

    moduleHasManyOperations({
      module: this.module,
      allowed_operations: this.allowedOperations,
    });

    moduleHasManyFunctionalities({
      module: this.module,
      functionalities: this.functionalities,
    });

    RoleAndOperationsManyToMany({
      role: this.role,
      allowed_operations: this.allowedOperations,
      role_operations: this.roleOperations
    })

    console.log("¡Check Asociations!");
  }
}
