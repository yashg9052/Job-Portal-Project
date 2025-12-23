import express from "express";
import AuthRoute from "./src/routes/Auth.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import RecruiterRoute from "./src/routes/Recruiter.route.js";
import session from "express-session";
import *  as authmiddlewares from "./src/middlewares/auth.middleware.js";
import requestIp from "request-ip";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
  })
);
app.use(requestIp.mw());
app.use("/auth", AuthRoute);
// Public auth routes should be registered first
app.use("/auth", AuthRoute);
// Apply authentication middleware for protected routes
app.use(authmiddlewares.authMiddleware);
app.use("/recruiter", RecruiterRoute);

export default app;
