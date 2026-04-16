import { Router } from "express";
import { userRegister, verifyToken } from "../controllers/user.controller";

const userRouter = Router();

// auth routes
userRouter.route("/user/auth/register").post(userRegister);
userRouter.route("/user/auth/verify/:hashed_token/:user_id").get(verifyToken);

export { userRouter };
