import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { logger } from "../config/logger";
import { ApiResponse } from "../utils/ApiResponse";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error =
    err instanceof ApiError
      ? err
      : new ApiError(
          err?.statusCode || 500,
          err?.message || "Internal Server Error",
          err?.stack
        );

  // logging error
  logger.error({
    message: error.message,
    statusCode: error.statusCode,
    stack: error.stack,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    params: req.params,
    query: req.query,
    timeStampUTC: new Date(), // UTC string for further operations in DB or code (optional)
    timeStampStr: new Date().toLocaleString("en-IN"), // readable timestamp
    type: "error" // to search error
  });

  return res
    .status(error.statusCode)
    .json(new ApiResponse(false, error.message));
};
