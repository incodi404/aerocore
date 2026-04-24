import { tokenManager } from "../classes/token.class";
import { pgPool } from "../config/postgres";
import { QUEUES } from "../config/rabbitmq.channels";
import { UserRegister } from "../dto/user.dto";
import { producer } from "../messaging/rabbitmq.producer";
import {
  CREATE_NEW_UNVERIFIED_USER,
  CREATE_NEW_VERIFICATION_TOKEN,
  FETCH_EXISTING_USER,
} from "../queries";
import { verifyAccountTemplate } from "../templates/verifyAccount.template";
import { EmailJobs } from "../types/rabbitmq.type";
import { JwtTokens } from "../types/token.type";
import { User } from "../types/user.type";
import { ApiError } from "../utils/ApiError";
import { generateSHA256 } from "../utils/generateSHA256";
import { generateSnowflakeId } from "../utils/generateSnowflakeId";
import bcrypt from "bcrypt";

class UserAuth {
  // verification tokenization
  async tokenizingVerification(data: {
    user_id: string;
    purpose: "Register" | "Password Reset";
    expiresInMinute: number;
  }): Promise<string> {
    const { user_id, purpose, expiresInMinute } = data;

    // generating SHA256 token
    const token: string = generateSHA256(user_id);
    if (token.trim() === "") {
      throw new ApiError(500, "Generating token has been failed");
    }

    // token => hashed token (in case if attacker gain access the db, he couldn't steal the token)
    const hashedToken: string = await bcrypt.hash(token, 12);

    // db object
    const tokenInDb = [
      user_id,
      hashedToken,
      false,
      purpose,
      new Date(),
      new Date(Date.now() + expiresInMinute * 60 * 1000), // min * sec(60) * ms(1000)
    ];

    // saving to db
    const newToken = await pgPool.query(
      CREATE_NEW_VERIFICATION_TOKEN,
      tokenInDb,
    );
    const newTokenData = newToken.rows.length > 0 ? newToken.rows[0] : null;
    if (!newTokenData) {
      throw new ApiError(500, "Saving token has been failed");
    }

    return token;
  }

  // register user
  async create(data: UserRegister): Promise<User> {
    const { email, name, password } = data;
    let token: string;

    // checking if the user exists based on the email id
    const existingUser = await pgPool.query(FETCH_EXISTING_USER, [email]);
    if (existingUser.rows.length > 0) {
      throw new ApiError(401, "Email is aleady exists");
    }

    // snowflake id for unique user_id
    const uniqueuser_id = generateSnowflakeId();

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // data to be saved
    const userDataForDb = [
      uniqueuser_id,
      name,
      email,
      hashedPassword,
      false,
      false,
      new Date(),
    ];

    // saving to db
    const newUnverifiedUser = await pgPool.query(
      CREATE_NEW_UNVERIFIED_USER,
      userDataForDb,
    );
    const newUnverifiedUserData =
      newUnverifiedUser.rows.length > 0 ? newUnverifiedUser.rows[0] : null;
    if (!newUnverifiedUserData) {
      throw new ApiError(500, "User creation has been failed");
    }

    // generating SHA256 token for further process of verification
    try {
      token = await this.tokenizingVerification({
        purpose: "Register",
        user_id: uniqueuser_id,
        expiresInMinute: 10,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApiError(error.statusCode, error.message);
      } else {
        throw new ApiError(500, "Internal Server Error");
      }
    }

    // send email
    try {
      await producer.publishToQueue<EmailJobs>(QUEUES.EMAIL, {
        from: "Aerocore <dipankarnn2123@gmail.com>",
        to: email,
        subject: "Verify Your Account",
        html: verifyAccountTemplate(name, `${token}/${uniqueuser_id}`, 10),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApiError(error.statusCode, error.message);
      } else {
        throw new ApiError(500, "Internal Server Error");
      }
    }

    return {
      email: email,
      id: newUnverifiedUserData?.id,
      name: name,
      user_id: uniqueuser_id,
    };
  }

  // verified account
  async tokenVerificationAndLogin(
    token: string,
    user_id: string,
  ): Promise<JwtTokens> {
    await tokenManager.verifyAuthToken(token, user_id);

    return { accessToken: "", refreshToken: "" };
  }
}

// singleton
export const userAuth = new UserAuth();
