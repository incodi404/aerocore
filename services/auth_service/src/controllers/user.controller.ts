import { Request, Response } from "express";
import { asynchandler } from "../utils/asynchandler";
import { UserRegister } from "../dto/user.dto";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../types/user.type";
import { userAuth } from "../services/user.service";
import { ApiError } from "../utils/ApiError";

const userRegister = asynchandler(async (req: Request, res: Response) => {
  const data: UserRegister = req.body;

  const userData = await userAuth.create(data);
  return res
    .status(201)
    .json(
      new ApiResponse<User>(
        true,
        "User has been registered successfully",
        userData,
      ),
    );
});

const verifyTokenAndLogin = asynchandler(
  async (req: Request, res: Response) => {
    const { token, user_id } = req.params;

    if (!token || Array.isArray(token)) {
      throw new ApiError(400, "Token is required");
    }

    if (!user_id || Array.isArray(user_id)) {
      throw new ApiError(400, "User ID is required");
    }

    const { accessToken, refreshToken } =
      await userAuth.tokenVerificationAndLogin(token, user_id);

    return res
      .status(200)
      .json(new ApiResponse(true, "Token has been verified"));
  },
);

export { userRegister, verifyTokenAndLogin };
