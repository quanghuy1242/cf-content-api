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

describe("content", async () => {
  const authHeader = {
    Authorization: `Bearer ${await tokener({ gty: M2M_TOKEN_TYPE })}`,
  };
  describe("create", () => {
    it("admin: enable to create a new content", async () => {
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
    it("user: enable to create their own content and publishable", async () => {});
    it("user: unable to create their content with different user id", async () => {});
    it("user: has right to create and publish new content", async () => {});
    it("user: unable to create content with invalid input data", async () => {});
    it("all: unable to create a content for unknown user", async () => {});
    it("all: unable to create a content for unknown cate", async () => {});
  });

  describe("list", () => {
    it("admin: enable to return empty content of all statuses", async () => {
      const ctx = createExecutionContext();
      const res = await app.fetch(new Request(baseUrl), env, ctx);
      await waitOnExecutionContext(ctx);
      expect(res.status).toBe(200);
      expect(await res.json()).toStrictEqual([]);
    });
    it("user: enable to view its own content of all statuses", async () => {});
    it("user: enable only to view published content", async () => {});
  });

  describe("select", () => {
    it("admin: enable to view a content of all statuses", async () => {});
    it("user: enable to view its own content of all statuses", async () => {});
    it("user: unable to view others's content if it's not published", async () => {});
  });

  describe("update", () => {
    it("admin: enable to update any content", async () => {});
    it("user: enable to update their own content", async () => {});
    it("user: unable to update others's content", async () => {});
    it("user: has right to publish its content", async () => {});
    it("user: unable to update with incorrect input", async () => {});
    it("all: unable to update a content to unknown user", async () => {});
    it("all: unable to update a content to unknown cate", async () => {});
  });
});
