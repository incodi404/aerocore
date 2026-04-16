import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
});

export const fetchData = () => {
  console.log("User: ", process?.env?.GMAIL_USER);
  console.log("Pass: ", process?.env?.APP_PASSWORD);
};
