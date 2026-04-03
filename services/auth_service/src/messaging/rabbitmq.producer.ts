import ampq from "amqplib";
import { getRabbitMqChannel } from "../config/amqp.config";
import { ApiError } from "../utils/ApiError";
import { logger } from "../config/logger";

class Publisher {
  async publishToQueue<T>(queue: string, data: T) {
    try {
      const channel = getRabbitMqChannel();

      // initializing channel
      await channel.assertQueue(queue, {
        durable: true, // keep this queue saveed even if RabbitMQ restarts
        arguments: {
          "x-queue-type": "quorum", // safer for production
        },
      });

      // send data to queue
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApiError(error.statusCode, error.message, error.stack);
      } else {
        logger.error({
          message: `ERROR :: ${new Date().toLocaleString()} :: Publishing data to queue has been failed`,
          stack: JSON.stringify(error),
          type: "error",
        });
        throw new ApiError(500, "Intenral Server Error");
      }
    }
  }
}

export const producer = new Publisher();
