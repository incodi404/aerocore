import amqp from "amqplib";
import { logger } from "./logger.config";

let rabbitmqConnection: amqp.Connection | null = null;
let rabbitMqChannel: amqp.Channel | null = null;

const connectRabbitMq = async () => {
  let retryTime = 5;

  while (retryTime) {
    try {
      const amqpUrl = `amqp://${process?.env?.RABBITMQ_USER}:${process?.env?.RABBITMQ_PASSWD}@${process?.env?.AMQP_CONNECT_URL}:5672`;
      const connection = await amqp.connect(amqpUrl);

      rabbitmqConnection = connection;
      rabbitMqChannel = await connection.createChannel();

      logger.info("RabbitMQ is connected");
      console.log("[INFO] RabbitMQ is connected");
      break;
    } catch (error) {
      console.log(
        "[+] ERROR :: RabbitMQ connection has been failed :: ",
        error,
      );
      logger.error({
        message: "RabbitMQ connection has been failed",
        stack: error,
      });
      retryTime--;
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
};

const getChannel = (): amqp.Channel | null => {
  if (!rabbitMqChannel) {
    logger.error("Channel is not created");
    return null;
  }
  return rabbitMqChannel;
};

export { connectRabbitMq, rabbitMqChannel, getChannel };
