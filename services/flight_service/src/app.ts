import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { logger } from "./config/logger";
import { errorHandler } from "./middlewares/errorHandler.middleware";

const app = express();

app.use(express.urlencoded({ limit: "50kb", extended: true }));
app.use(express.json({ limit: "50kb" }));
app.use(cookieParser());

// CORS config
app.use(cors());

// log every req
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(
    `URL: ${req.originalUrl} :: Method: ${
      req.method
    } :: Timestamp: ${new Date().toLocaleString("en-IN")}`,
  );
  next();
});

// heath check
app.get("/health", (req: Request, res: Response) => {
  res.send("Everything is okay!");
});

// error handling
app.use(errorHandler);

export { app };
