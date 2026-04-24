import { Router } from "express";
import {
  userRegister,
  verifyTokenAndLogin,
} from "../controllers/user.controller";

const userRouter = Router();

// auth routes
userRouter.route("/user/auth/register").post(userRegister);
userRouter.route("/user/auth/verify/:token/:user_id").get(verifyTokenAndLogin);

export { userRouter };
