import app from "../src";
import { htokener } from "./helpers/auth";
import { createCate, createContent, createUser } from "./helpers/data";
import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { randomUUID } from "crypto";
import { Content } from "schema/generated/zod";
import { withPrismaFromW } from "services/prisma";
import { describe, it, expect } from "vitest";

const baseUrl: string = "https://a.com/api/v1/contents";

describe("content", async () => {
  describe("create", () => {
    it("admin: enable to create a new content", async () => {
      const ctx = createExecutionContext();
      // Prepare data
      const p = withPrismaFromW(env);
      const user = await p.user.create({ data: createUser() });
      const category = await p.category.create({ data: createCate() });
      // Post it
      const res = await app.fetch(
        new Request(baseUrl, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            ...(await htokener.m2m()),
          },
          body: JSON.stringify(createContent(user.id, category.id)),
        }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);

      const d: Content = await res.json();
      expect(d.title).toStrictEqual("Content title");
      expect(res.status).toBe(201);
    });
    it("user: enable to create their own content and publishable", async () => {
      const ctx = createExecutionContext();
      // Prepare data
      const p = withPrismaFromW(env);
      const user = await p.user.create({ data: createUser() });
      const category = await p.category.create({ data: createCate() });
      const res = await app.fetch(
        new Request(baseUrl, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            ...(await htokener.user(user.id)),
          },
          body: JSON.stringify(createContent(user.id, category.id)),
        }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);

      const d: Content = await res.json();
      expect(d.title).toStrictEqual("Content title");
      expect(res.status).toBe(201);
    });
    it("user: unable to create their content with different user id", async () => {
      const ctx = createExecutionContext();
      // Prepare data
      const p = withPrismaFromW(env);
      const user = await p.user.create({ data: createUser() });
      const category = await p.category.create({ data: createCate() });
      const res = await app.fetch(
        new Request(baseUrl, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            ...(await htokener.user(user.id)),
          },
          body: JSON.stringify(createContent(randomUUID(), category.id)),
        }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);

      expect(res.status).toBe(403);
    });
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
