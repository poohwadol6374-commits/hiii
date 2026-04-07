import { NextResponse } from "next/server";

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export function successResponse<T>(
  data: T,
  status = 200,
  meta?: Record<string, unknown>
): NextResponse<ApiSuccessResponse<T>> {
  const body: ApiSuccessResponse<T> = { success: true, data };
  if (meta) body.meta = meta;
  return NextResponse.json(body, { status });
}

export function errorResponse(
  code: string,
  message: string,
  status = 400,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: { code, message, ...(details !== undefined && { details }) },
    },
    { status }
  );
}

export function validationError(
  message: string,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return errorResponse("VALIDATION_ERROR", message, 422, details);
}

export function unauthorizedError(
  message = "Unauthorized"
): NextResponse<ApiErrorResponse> {
  return errorResponse("UNAUTHORIZED", message, 401);
}

export function forbiddenError(
  message = "Forbidden"
): NextResponse<ApiErrorResponse> {
  return errorResponse("FORBIDDEN", message, 403);
}

export function notFoundError(
  message = "Not found"
): NextResponse<ApiErrorResponse> {
  return errorResponse("NOT_FOUND", message, 404);
}

export function internalError(
  message = "Internal server error"
): NextResponse<ApiErrorResponse> {
  return errorResponse("INTERNAL_ERROR", message, 500);
}

export function rateLimitError(
  message = "Too many requests"
): NextResponse<ApiErrorResponse> {
  return errorResponse("RATE_LIMIT_EXCEEDED", message, 429);
}
