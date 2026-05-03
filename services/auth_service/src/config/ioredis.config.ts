import Redis from "ioredis";
import { logger } from "./logger";

export let redis: Redis;

export const connectRedis = () => {
  const host: string = process.env.REDIS_HOST || "";
  const port: string = process.env.REDIS_PORT || "";
  const password: string = process.env.REDIS_PASS || "";

  const url = `redis://:${password}@${host}:${port}`;

  try {
    const redisConn = new Redis(url);
    redis = redisConn;
  } catch (error) {
    logger;
  }
};
