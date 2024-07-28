import { arrFromStr, objFromJson, objToJson, strFromArr } from "utils/zod";
import { z } from "zod";

const Meta = z.object({
  twitterCard: z.enum(["abc", "def"]),
});
const MetaFromJson = objFromJson.pipe(Meta);
const MetaToJson = Meta.transform(objToJson);

export const MetaSchema = z.union([MetaFromJson, MetaToJson]);
export const TagSchema = z.union([strFromArr, arrFromStr]);
export const StatusEnum = z.enum(["ACTIVE", "PENDING", "INACTIVE"])
