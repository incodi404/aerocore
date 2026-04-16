import { Channel, ConsumeMessage } from "amqplib";
import { EmailJobs } from "../types/email.types";
import { fetchData, transporter } from "../config/email.config";
import { logger } from "../config/logger.config";

class EmailSender {
  async sendEmail(msg: ConsumeMessage | null, channel: Channel) {
    try {
      if (!msg) return;

      // parsing data
      const parsedData: EmailJobs = JSON.parse(msg?.content?.toString());

      // sending email
      await transporter.sendMail({
        from: parsedData?.from,
        to: parsedData?.to,
        subject: parsedData?.subject,
        html: parsedData?.html,
      });

      // ack
      channel.ack(msg);

      console.log(
        `[INFO] Email has been sent to ${parsedData?.to} on ${new Date().toLocaleString("en-IN")}`,
      );
      logger.info(
        `[INFO] Email has been sent to ${parsedData?.to} on ${new Date().toLocaleString("en-IN")}`,
      );
    } catch (error) {
      console.log("[ERROR] Failed to send email :: ", error);
      logger.error({
        message: "[ERROR] Failed to send email",
        error: error,
      });
    }
  }
}

export const emailSender = new EmailSender();
