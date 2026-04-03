import amqp from "amqplib";
import { logger } from "./logger";
import { ApiError } from "../utils/ApiError";

export let rabbitmqConnection: amqp.Connection | null = null;
let rabbitMqChannel: amqp.Channel | null = null;

export const connectRabbitMq = async () => {
  try {
    const rabbitmqUrl = `${process?.env?.RABBITMQ_USER}:${process?.env?.RABBITMQ_PASSWD}@${process?.env?.AMQP_CONNECT_URL}`;
    const connection = await amqp.connect(
      `amqp://${rabbitmqUrl || "localhost"}`,
    );

    rabbitmqConnection = connection;
    rabbitMqChannel = await connection.createChannel();

    console.log("[+] RabbitMQ is connected");
    logger.info("RabbitMQ is connected");
  } catch (error) {
    console.log("[+] ERROR :: RabbitMQ connection has been failed :: ", error);
    logger.error("RabbitMQ connection has been failed");
  }
};

export const getRabbitMqChannel = (): amqp.Channel => {
  if (!rabbitMqChannel) {
    throw new ApiError(500, "RabbitMQ is not created");
  }

  return rabbitMqChannel;
};
