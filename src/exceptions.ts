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
  console.debug(err);
  if (err instanceof AuthException) {
    return c.json({ message: err.message }, err.status);
  }
  if (err instanceof errors.JOSEError) {
    return c.json({ message: `Authentication error: ${err.message}` }, 401);
  }
  if (err instanceof DbConstraintException) {
    return c.json(
      { message: `Db constraints error: ${err.message}` },
      err.status,
    );
  }
  if (err instanceof HTTPException) {
    return c.json({ message: err.message }, err.status);
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return c.json(
      {
        message: `Bad request due to db: ${err.message} with code ${err.code}`,
      },
      400,
    );
  }
  // Unexpected exceptions are fine to log
  console.error(err);
  return c.json({ message: "Unknown error!" }, 500);
};
