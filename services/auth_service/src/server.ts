import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // MUST be first line

import { app } from "./app";
import { logger } from "./config/logger";
import { pgPool } from "./config/postgres";
import { connectRabbitMq, rabbitmqConnection } from "./config/amqp.config";

dotenv.config({
  path: "./.env",
});

const PORT = Number(process.env.PORT || 3000);

async function startServer() {
  try {
    // db
    await pgPool.query("SELECT 1");
    console.log(`[+] PostgreSQL is connected`);
    logger.info(`PostgreSQL is connected`);

    // server
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`[+] Server is listening at port ${PORT}`);
      logger.info(`Server is listening at port ${PORT}`);
    });
    // on server error
    server.on("error", (err) => {
      console.log("[-] ERROR :: Server running has been failed :: ", err);
      logger.error({
        message: err.message || "Server running has been failed",
        stack: err.stack,
        type: "error",
      });

      process.exit(1);
    });

    // rabbitmq
    await connectRabbitMq();
  } catch (error: any) {
    console.log("[-] ERROR :: PostgreSQL connection is failed :: ", error);
    logger.error({
      message: error.message || "PostgreSQL connection is failed",
      stack: error.stack,
      type: "error",
    });

    process.exit(1);
  }
}

startServer();
