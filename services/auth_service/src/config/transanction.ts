import { PoolClient } from "pg";
import { pgPool } from "./postgres";

export const transanction = async <T>(
  callBack: (client: PoolClient) => Promise<T>,
): Promise<T> => {
  const client = await pgPool.connect();

  // start trans
  try {
    await client.query("BEGINS"); // start
    const result = callBack(client); // transanctions
    await client.query("COMMIT");

    return result;
  } catch (error) {
    await client.query("ROLLBACK"); // undo everything
    throw error;
  } finally {
    client.release(); // release the client
  }
};
