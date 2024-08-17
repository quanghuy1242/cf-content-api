import { tagFromStr, objFromJson, objToJson, tagFromArr } from "utils/zod";
import { z } from "zod";

const Meta = z.object({
  twitterCard: z.enum(["abc", "def"]),
});
const MetaFromJson = objFromJson.pipe(Meta);
const MetaToJson = Meta.transform(objToJson);

export const MetaSchema = z.union([MetaFromJson, MetaToJson]);
export const TagSchema = z.union([tagFromArr, tagFromStr], {
  message: "Accept an array of tags!",
});
export const StatusEnum = z.enum(["ACTIVE", "PENDING", "INACTIVE"], {
  message: "Invalid string, ACTIVE, PENDING or INACTIVE are accepted",
});
