import app from "../src";
import { htokener } from "./helpers/auth";
import {
  createCate,
  createContent,
  createDb,
  createUser,
} from "./helpers/data";
import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { ContentPermission } from "const";
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
      expect(d.title).contain("Content title");
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
      expect(d.title).contain("Content title");
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
    it("user: has right to create and but can't publish new content", async () => {
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
            ...(await htokener.user(user.id, [ContentPermission.write])),
          },
          // Everything is fine until he don't have permisison to do anything with status active
          body: JSON.stringify(
            createContent(randomUUID(), category.id, { status: "ACTIVE" }),
          ),
        }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);

      expect(res.status).toBe(403);
    });
    it("user: unable to create content with invalid input data", async () => {
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
          // ACTIVE<E>
          body: JSON.stringify(
            createContent(randomUUID(), category.id, { status: "ACTIVEE" }),
          ),
        }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);

      expect(res.status).toBe(400);
      expect(await res.text()).contain("invalid_enum_value");
    });
    it("all: unable to create a content for unknown user", async () => {
      const ctx = createExecutionContext();
      // Prepare data
      const p = withPrismaFromW(env);
      // const user = await p.user.create({ data: createUser() });
      const category = await p.category.create({ data: createCate() });
      const userId = randomUUID();
      const res = await app.fetch(
        new Request(baseUrl, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            ...(await htokener.user(userId)),
          },
          body: JSON.stringify(
            createContent(userId, category.id, { status: "ACTIVE" }),
          ),
        }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);

      expect(res.status).toBe(400);
      expect(await res.text()).contain(
        "Foreign key constraint failed on the field",
      );
    });
    it("all: unable to create a content for unknown cate", async () => {
      const ctx = createExecutionContext();
      // Prepare data
      const p = withPrismaFromW(env);
      const user = await p.user.create({ data: createUser() });
      // const category = await p.category.create({ data: createCate() });
      const cateId = randomUUID();
      const res = await app.fetch(
        new Request(baseUrl, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            ...(await htokener.user(user.id)),
          },
          body: JSON.stringify(
            createContent(user.id, cateId, { status: "ACTIVE" }),
          ),
        }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);

      expect(res.status).toBe(400);
      expect(await res.text()).contain(
        "Foreign key constraint failed on the field",
      );
    });
  });

  describe("list", () => {
    it("admin: enable to return empty content of all statuses", async () => {
      const ctx = createExecutionContext();
      await createDb(withPrismaFromW(env));
      const res = await app.fetch(
        new Request(baseUrl, {
          headers: {
            "Content-Type": "application/json",
            ...(await htokener.m2m()),
          },
        }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);
      expect(res.status).toBe(200);

      const d: Array<object> = await res.json();
      expect(d.length).toStrictEqual(2);
    });
    it("user: enable to view its own content of all statuses", async () => {
      const ctx = createExecutionContext();
      const { userA } = await createDb(withPrismaFromW(env));
      const res = await app.fetch(
        new Request(baseUrl, {
          headers: {
            "Content-Type": "application/json",
            ...(await htokener.user(userA.id)),
          },
        }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);
      expect(res.status).toBe(200);

      const d: Array<object> = await res.json();
      expect(d.length).toStrictEqual(2);
    });
    it("user: enable only to its own inactive content", async () => {
      const ctx = createExecutionContext();
      const { userA } = await createDb(withPrismaFromW(env));
      const res = await app.fetch(
        new Request(baseUrl + "?status=INACTIVE", {
          headers: {
            "Content-Type": "application/json",
            ...(await htokener.user(userA.id)),
          },
        }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);
      expect(res.status).toBe(200);

      const d: Array<object> = await res.json();
      expect(d.length).toStrictEqual(1);
    });
  });

  describe("select", () => {
    it("admin: enable to view a content of all statuses", async () => {
      const ctx = createExecutionContext();
      const { content1Inactive } = await createDb(withPrismaFromW(env));
      const res = await app.fetch(
        new Request(baseUrl + "/" + content1Inactive.id, {
          headers: {
            "Content-Type": "application/json",
            ...(await htokener.m2m()),
          },
        }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);
      expect(res.status).toBe(200);

      const d: Content = await res.json();
      expect(d.status).toStrictEqual("INACTIVE");
    });
    it("user: enable to view its own content of all statuses", async () => {
      const ctx = createExecutionContext();
      const { content1Inactive, userA } = await createDb(withPrismaFromW(env));
      const res = await app.fetch(
        new Request(baseUrl + "/" + content1Inactive.id, {
          headers: {
            "Content-Type": "application/json",
            ...(await htokener.user(userA.id)),
          },
        }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);
      expect(res.status).toBe(200);

      const d: Content = await res.json();
      expect(d.status).toStrictEqual("INACTIVE");
    });
    it("user: unable to view others's content if it's not published", async () => {
      const ctx = createExecutionContext();
      const { content2Inactive, userA } = await createDb(withPrismaFromW(env));
      const res = await app.fetch(
        new Request(baseUrl + "/" + content2Inactive.id, {
          headers: {
            "Content-Type": "application/json",
            ...(await htokener.user(userA.id)),
          },
        }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);
      expect(res.status).toBe(404);
    });
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
