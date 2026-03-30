import { Request, Response } from "express";
import { asynchandler } from "../utils/asynchandler";
import { UserRegister } from "../dto/user.dto";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../types/user.type";
import { userAuth } from "../services/user.service";

const userRegister = asynchandler(async (req: Request, res: Response) => {
  const data: UserRegister = req.body;

  const userData = await userAuth.create(data);
  console.log("User data: ", userData);
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

export { userRegister };
