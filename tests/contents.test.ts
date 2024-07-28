import app from "../src";
import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, beforeEach, vi, it, expect } from "vitest";

const baseUrl: string = "http://a.com/api/v1/contents";

describe("content.rounter", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("create & select content", () => {
    it("should create a new content & return it", async () => {
      const ctx = createExecutionContext();
      // const res = await app.fetch(
      //   new Request(baseUrl, {
      //     method: "post",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       title: "Content title",
      //       slug: "content-title",
      //       content: "This contains a long text",
      //       coverImage: "https://abc.com/abc.png",
      //       tags: ["abc", "def"],
      //       meta: {
      //         twitterCard: "abc",
      //       },
      //       status: "ACTIVE",
      //       userId: "",
      //       categoryId: "",
      //     }),
      //   }),
      //   env,
      //   ctx,
      // );
      await waitOnExecutionContext(ctx);
      // expect(await res.json()).toStrictEqual({});
      // expect(res.status).toBe(201);
    });
  });

  describe("search content", () => {
    it("should return empty content", async () => {
      const ctx = createExecutionContext();
      const res = await app.fetch(new Request(baseUrl), env, ctx);
      await waitOnExecutionContext(ctx);
      expect(res.status).toBe(200);
      expect(await res.json()).toStrictEqual([]);
    });
  });
});
