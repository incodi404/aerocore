import { Router } from "express";
import { userRegister } from "../controllers/user.controller";

const userRouter = Router();

// auth routes
userRouter.route("/user/auth/register").post(userRegister);

export { userRouter };
