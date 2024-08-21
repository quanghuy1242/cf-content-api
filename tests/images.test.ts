import app from "../src";
import { htokener } from "./helpers/auth";
import { createDb, createImage, createUser } from "./helpers/data";
import {
  createExecutionContext,
  env,
  waitOnExecutionContext,
} from "cloudflare:test";
import { Image } from "schema/generated/zod";
import { withPrismaFromW } from "services/prisma";
import { describe, expect, it } from "vitest";

const baseUrl: string = "http://a.com/api/v1/images";

describe("image", () => {
  describe("create", () => {
    it("user: enabled to create their own image", async () => {
      const ctx = createExecutionContext();
      const p = withPrismaFromW(env);
      const user = await p.user.create({ data: createUser() });
      const res = await app.fetch(
        new Request(baseUrl, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            ...(await htokener.user(user.id)),
          },
          body: JSON.stringify(createImage({}, user.id)),
        }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);

      const d: { uploadUrl: string; image: Image } = await res.json();
      expect(res.status).toBe(201);
      expect(d.uploadUrl).contain( // Already mocked by miniflare
        `r2.cloudflarestorage.com${d.image.fullPath}`,
      );
      expect(d.image.status).toStrictEqual("PENDING");
    });
    it("user: unable to create other images", async () => {
      const ctx = createExecutionContext();
      const p = withPrismaFromW(env);
      const user = await p.user.create({ data: createUser() });
      const res = await app.fetch(
        new Request(baseUrl, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            ...(await htokener.user()),
          },
          body: JSON.stringify(createImage({}, user.id)),
        }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);
      expect(res.status).toBe(401);
    });
    it("admin: can't create other images", async () => {
      const ctx = createExecutionContext();
      const p = withPrismaFromW(env);
      const user = await p.user.create({ data: createUser() });
      const res = await app.fetch(
        new Request(baseUrl, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            ...(await htokener.admin()),
          },
          body: JSON.stringify(createImage({}, user.id)),
        }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);
      expect(res.status).toBe(401);
    });
  });
  describe("get", () => {
    it("user: enabled to get their own image", async () => {
      const ctx = createExecutionContext();
      const p = withPrismaFromW(env);
      const { image1, userA } = await createDb(p);
      const res = await app.fetch(
        new Request(baseUrl + `/${image1.id}`, {
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
    });
    it("user: unnabled to get other images", async () => {
      const ctx = createExecutionContext();
      const p = withPrismaFromW(env);
      const { image1, userB } = await createDb(p);
      const res = await app.fetch(
        new Request(baseUrl + `/${image1.id}`, {
          headers: {
            "Content-Type": "application/json",
            ...(await htokener.user(userB.id)),
          },
        }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);
      expect(res.status).toBe(404);
    });
    it("admin: unnabled to get other images", async () => {
      const ctx = createExecutionContext();
      const p = withPrismaFromW(env);
      const { image1 } = await createDb(p);
      const res = await app.fetch(
        new Request(baseUrl + `/${image1.id}`, {
          headers: {
            "Content-Type": "application/json",
            ...(await htokener.admin()),
          },
        }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);
      expect(res.status).toBe(404);
    });
  });
  describe("search", () => {
    it("user: enabled to filter their all images", async () => {
      const ctx = createExecutionContext();
      const p = withPrismaFromW(env);
      const { userA } = await createDb(p);
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
      expect(((await res.json()) as object[]).length).toStrictEqual(2);
    });
  });
});
