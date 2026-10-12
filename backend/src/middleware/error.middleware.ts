import type { NextFunction, Request, Response } from 'express';
import { getHttpEnv } from '../config/env.js';
import { AppError } from '../errors/app-error.js';
import { ErrorCodes } from '../errors/error-codes.js';
import { logger } from '../lib/logger.js';

interface ErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
  };
  requestId: string;
}

function isMalformedJson(err: unknown): boolean {
  return err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err;
}

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const requestId = req.requestId ?? 'unknown';
  const malformedJson = isMalformedJson(err);
  const appError = err instanceof AppError ? err : null;
  const statusCode = malformedJson ? 400 : (appError?.statusCode ?? 500);
  const code = malformedJson
    ? ErrorCodes.VALIDATION_ERROR
    : (appError?.code ?? ErrorCodes.INTERNAL_ERROR);

  const exposeMessage = appError !== null || malformedJson || getHttpEnv().nodeEnv !== 'production';
  const message = malformedJson
    ? 'Malformed JSON body'
    : exposeMessage && err instanceof Error
      ? err.message
      : 'Internal server error';

  logger.error('request failed', {
    requestId,
    code,
    statusCode,
    stack: err instanceof Error ? err.stack : undefined,
  });

  if (res.headersSent) {
    return;
  }

  const body: ErrorBody = {
    success: false,
    error: {
      code,
      message,
    },
    requestId,
  };

  res.status(statusCode).json(body);
}
