import app from "../src";
import { tokener } from "./helpers/auth";
import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { M2M_TOKEN_TYPE } from "const";
import { Category } from "schema/generated/zod";
import { describe, it, expect } from "vitest";

const baseUrl: string = "http://a.com/api/v1/categories";

describe("category", async () => {
  const authHeader = {
    Authorization: `Bearer ${await tokener({ gty: M2M_TOKEN_TYPE })}`,
  };
  describe("create", () => {
    it("admin: enable create a new category", async () => {
      const ctx = createExecutionContext();
      const res = await app.fetch(
        new Request(baseUrl, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            ...authHeader,
          },
          body: JSON.stringify({
            name: "ML/AI",
            description: "Merchean Learning & Artifical Inteligient",
            status: "ACTIVE",
          }),
        }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);

      const d: Category = await res.json();
      expect(d.name).toStrictEqual("ML/AI");
      expect(res.status).toBe(201);
    });
    it("admin: unable to create a new invalid cate", async () => {});
    it("user: unable to create a new cate", async () => {});
  });

  describe("search", () => {
    it("all: enable to list all active cate", async () => {
      const ctx = createExecutionContext();
      const res = await app.fetch(
        new Request(baseUrl, { headers: authHeader }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);
      expect(res.status).toBe(200);
      expect(await res.json()).toStrictEqual([]);
    });
    it("user: only admin enable to view inactive/pending cate", async () => {});
  });

  describe("select", () => {
    it("all: enable to retrive a active cate", async () => {});
    it("user: only admin enable to view inactive/pending cate", async () => {});
  });

  describe("update", () => {
    it("admin: enable to update existing cate", async () => {});
    it("admin: unable to update cate with invalid data", async () => {});
    it("user: has no right to update a cate", async () => {});
  });
});
