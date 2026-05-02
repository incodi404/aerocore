import { PoolClient } from "pg";
import { pgPool } from "./postgres";
import { ApiError } from "../utils/ApiError";
import { logger } from "./logger";

export const transanction = async <T>(
  callBack: (client: PoolClient) => Promise<T>,
): Promise<T> => {
  const client = await pgPool.connect();

  // start trans
  try {
    await client.query("BEGIN"); // start
    const result = await callBack(client); // transanctions
    await client.query("COMMIT");

    return result;
  } catch (error) {
    await client.query("ROLLBACK"); // undo everything
    if (error instanceof ApiError) {
      throw error;
    } else {
      logger.error({
        type: "error",
        message: "Transanction has been failed",
        error: error,
      });
      throw new ApiError(500, "Internal Server Error");
    }
  } finally {
    client.release(); // release the client
  }
};
