import { Prisma } from "@prisma/client";
import { z } from "zod";

export const tagQuery = z
  .union([
    z
      .string()
      .array()
      .transform((strs) => new Set(strs)),
    z.string().transform((str) => new Set([str])),
  ])
  .optional();

export const filterTag = (tag: Set<string> | undefined) => {
  return tag
    ? {
        // Because prisma don't support D1 json field
        // So here is some ugly workaround
        AND: Array.from(tag)
          .filter((t) => t !== "")
          .map(
            (t) =>
              ({
                OR: [
                  {
                    // If the tag at the start of the tag string
                    tags: {
                      startsWith: `${t},`,
                    },
                  },
                  {
                    // Sometime it starts with an ,
                    tags: {
                      startsWith: `,${t}`,
                    },
                  },
                  {
                    // If it's at the end of the string
                    tags: {
                      endsWith: `,${t}`,
                    },
                  },
                  {
                    // If it reaches here, maybe it's in the middle?
                    tags: {
                      contains: `,${t},`,
                    },
                  },
                  {
                    // Or finnally, it's alone?
                    tags: {
                      equals: `${t}`,
                    },
                  },
                ],
              }) as Prisma.ContentWhereInput,
          ),
      }
    : {};
};
