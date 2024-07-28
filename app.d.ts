interface HonoApp extends Env {
  Variables: {
    user: {
      payload: import("jose").JWTPayload;
      protectedHeader: import("jose").JWTHeaderParameters;
    };
  };
}
