import { Prisma } from "@prisma/client";
import { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { errors } from "jose";

type HTTPExceptionOptions = {
  res?: Response;
  message?: string;
  cause?: unknown;
};

export class AuthException extends HTTPException {
  constructor(options: HTTPExceptionOptions) {
    super(401, options);
  }
}

export class AuthForbidException extends HTTPException {
  constructor(options: HTTPExceptionOptions) {
    super(403, options);
  }
}

export class DbConstraintException extends HTTPException {
  constructor(options: HTTPExceptionOptions) {
    super(404, options);
  }
}

export const exceptionHander: ErrorHandler = (err, c) => {
  console.error(err);
  if (err instanceof AuthException) {
    return c.text(err.message, err.status);
  }
  if (err instanceof errors.JOSEError) {
    return c.text(`Authentication error: ${err.message}`, 401);
  }
  if (err instanceof DbConstraintException) {
    return c.text(`Db constraints error: ${err.message}`, err.status);
  }
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return c.text(
      `Bad request due to db: ${err.message} with code ${err.code}`,
      400,
    );
  }
  return c.text("Unknown error!", 500);
};
