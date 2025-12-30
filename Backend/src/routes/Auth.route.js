import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
const AuthRoute = Router();
import { authMiddleware } from "../middlewares/auth.middleware.js";

AuthRoute.route("/user/register")
  .get(authController.getRegisterUser)
  .post(authController.postRegisterUser);
AuthRoute.route("/user/login")
  .get(authController.getLoginUser)
  .post(authController.postLoginUser);

AuthRoute.route("/user/logout")
  .get( authMiddleware,authController.getLogoutUser);

AuthRoute.route("/browse-jobs/:id").get(authMiddleware, authController.getJobDetails);

export default AuthRoute;
