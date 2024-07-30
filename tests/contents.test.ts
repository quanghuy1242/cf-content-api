import app from "../src";
import { tokener } from "./helpers/auth";
import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { M2M_TOKEN_TYPE } from "const";
import { randomUUID } from "crypto";
import { Content } from "schema/generated/zod";
import { withPrismaFromW } from "services/prisma";
import { describe, it, expect } from "vitest";

const baseUrl: string = "https://a.com/api/v1/contents";

describe("content.rounter", async () => {
  const authHeader = {
    Authorization: `Bearer ${await tokener({ gty: M2M_TOKEN_TYPE })}`,
  };
  describe("create & select content", () => {
    it("should create a new content & return it", async () => {
      const ctx = createExecutionContext();
      const p = withPrismaFromW(env);
      const user = await p.user.create({
        data: {
          id: randomUUID(),
          name: "Huy Quang Nguyen",
          emailAddress: "huy@quanghuy.dev",
        },
      });
      const category = await p.category.create({
        data: {
          name: "ML/AI",
          description: "Merchean Learning & Artifical Inteligient",
          status: "ACTIVE",
        },
      });
      const res = await app.fetch(
        new Request(baseUrl, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            ...authHeader,
          },
          body: JSON.stringify({
            title: "Content title",
            slug: "content-title",
            content: "This contains a long text",
            coverImage: "https://abc.com/abc.png",
            tags: ["abc", "def"],
            meta: {
              twitterCard: "abc",
            },
            status: "ACTIVE",
            userId: user.id,
            categoryId: category.id,
          }),
        }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);

      const d: Content = await res.json();
      expect(d.title).toStrictEqual("Content title");
      expect(res.status).toBe(201);
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
