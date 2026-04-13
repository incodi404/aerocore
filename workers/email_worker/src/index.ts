import dotenv from "dotenv";
import { logger } from "./config/logger.config";
import { consumer } from "./messaging/rabbitmq.consumer";
import { QUEUES } from "./config/rabbitmq.queues";
import { connectRabbitMq } from "./config/amqp.config";
dotenv.config({ path: "./env" });

async function main() {
  console.log("[INFO] Email worker is on...");

  // consumer
  try {
    await connectRabbitMq();
    console.log("[INFO] Waiting for message. To exit press CTRL+C.");

    // AUTH Email
    await consumer.consumeFromQueue(QUEUES.AUTH_EMAIL);
  } catch (error) {
    console.log("[ERROR] Error in starting consumer :: ", error);
    logger.error({
      message: `[ERROR] Error in starting consumer (${new Date().toLocaleString("en-IN")})`,
      error: error,
    });
    process.exit(1);
  }
}

main();
