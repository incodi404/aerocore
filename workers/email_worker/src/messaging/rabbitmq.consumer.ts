import { getChannel } from "../config/amqp.config";
import { logger } from "../config/logger.config";
import { emailSender } from "../email/sendEmail.email";

class Consumer {
  async consumeFromQueue(queue: string) {
    try {
      const channel = getChannel();

      // connecting with channel
      channel?.assertQueue(queue, {
        durable: true,
        arguments: {
          "x-queue-type": "quorum",
        },
      });

      // consuming
      channel?.consume(
        queue,
        async function (data) {
          console.log(
            `[INFO] Got a new data from Queue: ${queue} at ${new Date().toLocaleString("en-IN")}`,
          );
          logger.info(
            `[INFO] Got a new data from Queue:${queue} at ${new Date().toLocaleString("en-IN")}`,
          );

          // sharing the data to email sender funtion
          await emailSender.sendEmail(data, channel);
        },
        { noAck: false },
      );
    } catch (error) {
      console.log("[ERROR] Error encountered in consumer :: ", error);
      logger.error({
        message: "[ERROR] Error encountered in consumer",
        error: error,
      });
    }
  }
}

export const consumer = new Consumer();
