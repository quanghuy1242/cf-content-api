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

const tagBase = z
  .string()
  .max(10, { message: "Tag item should only contain less than 10 chars" })
  .array()
  .max(10, { message: "Only 10 tags are accepted" });

export const tagFromStr = z
  .string()
  .transform((str, ctx): z.arrayOutputType<z.ZodString> => {
    const arr = str.trim().split(",");
    const result = tagBase.safeParse(arr);
    if (!result.success) {
      result.error.errors.forEach((i) => ctx.addIssue(i));
      return z.NEVER;
    }
    return arr;
  });

export const tagFromArr = tagBase.transform((strs) => {
  return strs.filter((t) => t !== "").join(",");
});
