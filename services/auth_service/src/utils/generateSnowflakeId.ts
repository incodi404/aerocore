import { Snowflake } from "@sapphire/snowflake";

export function generateSnowflakeId(): string {
  const snowflake = new Snowflake(BigInt(process.env.SF_EPOCH || 1)); // typecasting to Bigint for 64 bit number
  const generatedNumber = snowflake.generate();
  return String(generateSnowflakeId);
}
