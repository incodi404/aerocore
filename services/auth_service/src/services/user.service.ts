import { pgPool } from "../config/postgres";
import { UserRegister } from "../dto/user.dto";
import { User } from "../types/user.type";
import { ApiError } from "../utils/ApiError";
import { generateSHA256 } from "../utils/generateSHA256";
import { generateSnowflakeId } from "../utils/generateSnowflakeId";
import bcrypt from "bcrypt";

class UserAuth {
  // verification tokenization
  async tokenizingVerification(data: {
    userId: string;
    purpose: "Register" | "Password Reset";
    expiresInMinute: number;
  }) {
    const { userId, purpose, expiresInMinute } = data;

    // generating SHA256 token
    const token: string = generateSHA256(userId);
    if (token.trim() === "") {
      throw new ApiError(500, "Generating token has been failed");
    }

    // token => hashed token (in case if attacker gain access the db, he couldn't steal the token)
    const hashedToken: string = await bcrypt.hash(token, 12);

    // db object
    const tokenInDb = [
      userId,
      hashedToken,
      false,
      purpose,
      new Date(),
      new Date(Date.now() + expiresInMinute * 60 * 1000), // min * sec(60) * ms(1000)
    ];

    // saving to db
    const newToken = await pgPool.query(
      `
      INSERT INTO token 
      ("userId", token, "isUsed", purpose, "createdAt", "expiresAt") 
      VALUES 
      ($1, $2, $3, $4, $5, $6)
      RETURNING id
      `,
      tokenInDb,
    );
    const newTokenData = newToken.rows.length > 0 ? newToken.rows[0] : null;
    if (!newTokenData) {
      throw new ApiError(500, "Saving token has been failed");
    }
  }

  // register user
  async create(data: UserRegister): Promise<User> {
    const { email, name, password } = data;

    // checking if the user exists based on the email id
    const existingUser = await pgPool.query(
      `SELECT * FROM "user" WHERE email=$1`,
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
      "user" ("userId", name, email, password, "isBlocked", "isActive", "createdAt") 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, name, "userId"
      `,
      userDataForDb,
    );
    const newUnverifiedUserData =
      newUnverifiedUser.rows.length > 0 ? newUnverifiedUser.rows[0] : null;
    if (!newUnverifiedUserData) {
      throw new ApiError(500, "User creation has been failed");
    }

    // generating SHA256 token for further process of verification
    try {
      await this.tokenizingVerification({
        purpose: "Register",
        userId: uniqueUserId,
        expiresInMinute: 10,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApiError(error.statusCode, error.message);
      } else {
        throw new ApiError(500, "Internal Server Error");
      }
    }

    console.log("Successfull till now");

    return {
      email: email,
      id: newUnverifiedUserData?.id,
      name: name,
      userId: uniqueUserId,
    };
  }
}

// singleton
export const userAuth = new UserAuth();
