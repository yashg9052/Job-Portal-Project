import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
const AuthRoute = Router();


AuthRoute.route("/user/register")
  .get(authController.getRegisterUser)
  .post(authController.postRegisterUser);
AuthRoute.route("/user/login")
  .get(authController.getLoginUser)
  .post(authController.postLoginUser);

AuthRoute.route("/user/logout")
  .get( authController.getLogoutUser);


export default AuthRoute;
