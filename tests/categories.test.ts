import app from "../src";
import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, beforeEach, vi, it, expect } from "vitest";

const baseUrl: string = "http://a.com/api/v1/categories";

describe("category.rounter", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("create & select category", () => {
    it("should create a new category & return it", async () => {
      const ctx = createExecutionContext();
      const res = await app.fetch(
        new Request(baseUrl, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
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
      expect((await res.json()).name).toStrictEqual("ML/AI");
      expect(res.status).toBe(201);
    });
  });

  describe("search categories", () => {
    it("should return empty categories", async () => {
      const ctx = createExecutionContext();
      const res = await app.fetch(new Request(baseUrl), env, ctx);
      await waitOnExecutionContext(ctx);
      expect(res.status).toBe(200);
      expect(await res.json()).toStrictEqual([]);
    });
  });
});
