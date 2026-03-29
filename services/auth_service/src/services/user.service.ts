import { pgPool } from "../config/postgres";
import { UserRegister } from "../dto/user.dto";
import { User } from "../types/user.type";
import { ApiError } from "../utils/ApiError";
import { generateSnowflakeId } from "../utils/generateSnowflakeId";
import bcrypt from "bcrypt";

export class CustomerAuth {
  // register user
  async create(data: UserRegister): Promise<User> {
    const { email, name, password } = data;

    // checking if the user exists based on the email id
    const existingUser = await pgPool.query(
      "SELECT id FROM user WHERE email=$1",
      [email],
    );
    if (existingUser.rows.length > 0) {
      throw new ApiError(401, "Email is aleady exists");
    }

    // snowflake id for unique userId
    const uniqueUserId = generateSnowflakeId();

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // data to be saved
    const userDataForDb = [
      uniqueUserId,
      name,
      email,
      hashedPassword,
      false,
      false,
      new Date(),
    ];

    // saving to db
    const newUnverifiedUser = await pgPool.query(
      `INSERT INTO 
      user (userId, name, email, password, isBlocked, isActive, createdAt) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, name, userId
      `,
      userDataForDb,
    );
    const newUnverifiedUserData =
      newUnverifiedUser.rows.length > 0 ? newUnverifiedUser.rows[0] : null;
    if (!newUnverifiedUserData) {
      throw new ApiError(500, "User creation has been failed");
    }

    // generating SHA256 token for further process of verification

    return {
      email: "",
      id: "",
      name: "",
      userId: "",
    };
  }
}
