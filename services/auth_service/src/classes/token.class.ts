import { pgPool } from "../config/postgres";
import { FETCH_TOKEN_ROW_FROM_TOKEN_TABLE } from "../queries";
import { ApiError } from "../utils/ApiError";

class TokenManager {
  async verifyAuthToken(hashed_token: string, user_id: string) {
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
    const tokenData = tokenRow.rows[0];

    console.log();
  }
}

export const tokenManager = new TokenManager();
