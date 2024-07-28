import type { json } from "schema/types/json";
import { z } from "zod";

export const objFromJson = z
  .string()
  .transform((str, ctx): z.infer<ReturnType<typeof json>> => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: "custom", message: "Invalid JSON" });
      return z.NEVER;
    }
  });

export const objToJson = (v: object) => {
  return JSON.stringify(v);
};

export const arrFromStr = z
  .string()
  .transform((str, ctx): z.arrayOutputType<z.ZodString> => {
    return str.split(",");
  });

export const strFromArr = z
  .string()
  .array()
  .transform((strs, ctx) => {
    return strs.join(",");
  });
