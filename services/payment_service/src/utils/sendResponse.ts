import { Response } from "express";
import { ApiResponse } from "./ApiResponse";

export function sendResponse<T>(
    res: Response,
    status: number,
    message: string,
    data?: T
) {
    return res.status(status).json(new ApiResponse(true, message, data))
}