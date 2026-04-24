import { pgPool } from "../config/postgres";
import {
  FETCH_TOKEN_ROW_FROM_TOKEN_TABLE,
  UPDATE_TOKEN_TABLE_TO_VERIFIED,
} from "../queries";
import { DBToken } from "../types/token.type";
import { ApiError } from "../utils/ApiError";
import bcrypt from "bcrypt";

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
  }
}

export const tokenManager = new TokenManager();
