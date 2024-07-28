import { M2M_TOKEN_TYPE } from "const";
import { JWTPayload } from "jose";

export const isValidM2m = (
  payload: JWTPayload,
  clientId: string,
  aud: string,
) => {
  return (
    payload.gty === M2M_TOKEN_TYPE &&
    payload.sub === `${clientId}@clients` &&
    payload.aud === aud
  );
};
