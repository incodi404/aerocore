import { ConsumeMessage } from "amqplib";
import { EmailJobs } from "../types/email.types";

class EmailSender {
  async sendEmail(data: ConsumeMessage | null) {
    if (!data) return;

    const parsedData: EmailJobs = JSON.parse(data?.content?.toString());
    console.log("Data from queue: ", JSON.parse(data?.content?.toString()));
  }
}

export const emailSender = new EmailSender();
