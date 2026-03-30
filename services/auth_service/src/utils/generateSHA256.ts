import crypto from "crypto";

export function generateSHA256(data: string): string {
  const hashedData = crypto.createHash("sha256").update(data).digest("hex");
  return hashedData.toString();
}
