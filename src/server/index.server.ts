import express, {
  Router,
  Application,
  Response,
  Request,
  NextFunction,
} from "express";

import passport from "passport";
import morgan from "morgan";
import cors from "cors";

import { Server as SocketIO } from "socket.io";
import http from "http";

import passportMiddleware, {
  CustomPassportError,
} from "../middlewares/passport";

import {
  protectedRouter as protectedRouterAuth,
  unprotectedRouter as unprotectedRouterAuth,
} from "../api/modules/auth/routes/auth.route";

import { router as UserRoutes } from "../api/modules/users/routes/user.routes";
import { router as RoleModuleRoutes } from "../api/modules/role_module/routes/role_module.routes";
import { router as RoleRoutes } from "../api/modules/role/routes/role.routes";
import { handleAuthError } from "../middlewares/passport-auth";


export default class Server {
  public _app: Application;
  private _port: number;
  private _router: Router;
  private _http: any;
  public _socket;

  constructor(port: number) {
    this._app = express();
    this._router = Router();
    this._port = port;
    this._http = http.createServer(this._app);
    this._socket = new SocketIO(this._http, {
      cors: {
        origin: "*",
      },
    });

    this.middlewares();
    this.routes();
    this.errors();
  }

  static init(port: number): Server {
    return new Server(port);
  }

  routes(): void {
    this._app.use("/api", this._router);

    // Public
    this._router.use("/", unprotectedRouterAuth);

    this._router.get("/version", (req: Request, res: Response) => {
      res.json({ version: "1" });
    });

    // this._router.get('/render-image/:image', renderImage)
    // this._router.get('/render-video/:video', renderVideo)
    // this._router.get('/render-pdf/:pdf', renderPdf)
    // this._router.get('/render-audio/:audio', renderAudio)

    // Requires Token
    this._router.use(
      passport.authenticate("jwt", { session: false }),
      handleAuthError
    );

    // Routes
    this._router.use("/", protectedRouterAuth);
    this._router.use("/user", UserRoutes);
    this._router.use("/role_module", RoleModuleRoutes);
    this._router.use("/role", RoleRoutes);
    
  }

  middlewares(): void {
    this._app.use(cors({ credentials: true }));
    // this._app.use(cors())
    this._app.use(morgan("dev"));
    this._app.use(express.json({ limit: "350mb" }));
    this._app.use(
      express.urlencoded({
        limit: "350mb",
        extended: true,
        parameterLimit: 350000,
      })
    );

    this._router.use(passport.initialize());
    passport.use(passportMiddleware);
  }

  errors(): void {
    this._router.use((req: Request, res: Response, next: NextFunction) => {
      const err = new Error(`Not Found - ${req.originalUrl}`);
      res.status(404);
      next(err);
    });
    this._router.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        console.log(err.stack);
        res.status(err.status || 500).json({
          status: err.status,
          message: err.message,
          stack: err.stack,
        });
      }
    );
  }

  start(callback: () => void): void {
    this._http.listen(this._port, callback);
  }
}
