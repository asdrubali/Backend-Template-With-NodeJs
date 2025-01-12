import { ApiResponse } from "../interfaces/ApiResponse.interface";

function successResponse<T>(
  data: T,
  code: number,
  message?: string
): ApiResponse<T> {
  return {
    status: true,
    message: message,
    code: code,
    result: data,
  };
}

function errorResponse(
  message: string,
  code: number,
  errorDetail?: string | any[]
): ApiResponse<null> {
  return {
    status: false,
    message: message,
    code: code,
    errors: errorDetail || message,
  };
}

export { successResponse, errorResponse };
