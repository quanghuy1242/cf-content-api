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

describe("category.rounter", async () => {
  const authHeader = {
    Authorization: `Bearer ${await tokener({ gty: M2M_TOKEN_TYPE })}`,
  };
  describe("create & select category", () => {
    it("should create a new category & return it", async () => {
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
  });

  describe("search categories", () => {
    it("should return empty categories", async () => {
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
  });
});
