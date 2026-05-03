import { pgPool } from "../config/postgres";
import {
  FETCH_TOKEN_ROW_FROM_TOKEN_TABLE,
  UPDATE_TOKEN_TABLE_TO_VERIFIED,
} from "../queries";
import { DBToken, JwtTokens } from "../types/token.type";
import { ApiError } from "../utils/ApiError";
import bcrypt from "bcrypt";
import jwt, { JsonWebTokenError, JwtPayload, SignOptions } from "jsonwebtoken";

class TokenManager {
  isExpired(expires_at: Date) {
    const inputTime = new Date(expires_at);
    const now = new Date();

    if (inputTime < now) {
      return true;
    } else {
      return false;
    }
  }

  async tokenVerification(token: string, hashed_token: string) {
    const isCorrect = await bcrypt.compare(token, hashed_token);
    return isCorrect;
  }

  async verifyAuthToken(token: string, user_id: string) {
    // fetching the doc
    const tokenRow = await pgPool.query(FETCH_TOKEN_ROW_FROM_TOKEN_TABLE, [
      user_id,
    ]);

    if (
      tokenRow.rowCount === 0 ||
      !Array.isArray(tokenRow.rows) ||
      tokenRow.rows.length <= 0
    ) {
      throw new ApiError(404, "User not found");
    }

    // getting data
    const tokenData: DBToken = tokenRow.rows[0];

    // checking expiry
    if (this.isExpired(tokenData.expires_at)) {
      throw new ApiError(400, "Token is expired");
    }

    // checking if the token used
    if (tokenData.is_used) {
      throw new ApiError(401, "Token has been used");
    }

    // token verification
    const isTokenValid = await this.tokenVerification(token, tokenData.token);
    if (!isTokenValid) {
      throw new ApiError(401, "Token is not valid");
    }

    // after successfull verification, invalid the token
    await pgPool.query(UPDATE_TOKEN_TABLE_TO_VERIFIED, [
      true,
      new Date(),
      user_id,
    ]);
  }

  generateJwtToken(
    data: object,
    secret: string,
    expiresIn: SignOptions["expiresIn"],
  ): string {
    try {
      const token: string = jwt.sign(data, secret, { expiresIn: expiresIn });
      return token;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new ApiError(401, error.message);
      } else if (error instanceof Error) {
        throw new ApiError(401, error.message, error.stack);
      } else {
        throw new ApiError(500, "Internal Server Error");
      }
    }
  }

  verifyJwtToken(token: string, secret: string): string | JwtPayload {
    try {
      const isVerified = jwt.verify(token, secret);
      return isVerified;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new ApiError(401, error.message);
      } else if (error instanceof Error) {
        throw new ApiError(401, error.message, error.stack);
      } else {
        throw new ApiError(500, "Internal Server Error");
      }
    }
  }

  generateAccessAndRefreshToken<T extends object>(
    data: T,
    accessTokenCred: { secret: string; expiresIn: SignOptions["expiresIn"] },
    refreshTokenCred: { secret: string; expiresIn: SignOptions["expiresIn"] },
  ): JwtTokens {
    const accessToken = this.generateJwtToken(
      data,
      accessTokenCred.secret,
      accessTokenCred.expiresIn,
    );

    const refreshToken = this.generateJwtToken(
      data,
      refreshTokenCred.secret,
      refreshTokenCred.expiresIn,
    );

    return { accessToken: accessToken, refreshToken: refreshToken };
  }
}

export const tokenManager = new TokenManager();
