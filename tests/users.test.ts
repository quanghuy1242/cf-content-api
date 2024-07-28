import app from "../src";
import { withPrismaFromW } from "../src/services/prisma";
import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { randomUUID } from "crypto";
import { describe, beforeEach, vi, it, expect } from "vitest";

const baseUrl: string = "http://a.com/api/v1";

describe("user.rounter", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("create & select user", () => {
    it("should create a new user & return it", async () => {
      // Insert it first
      const ctx = createExecutionContext();
      const res = await app.fetch(
        new Request(baseUrl + "/users", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: randomUUID(),
            name: "Huy Quang Nguyen",
            emailAddress: "huy@quanghuy.dev",
          }),
        }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);
      expect(res.status).toBe(201);
      expect((await res.json()).name).toStrictEqual("Huy Quang Nguyen");
      expect(await withPrismaFromW(env).user.count()).toBe(1);
    });

    it("should return an existing user", async () => {
      const ctx = createExecutionContext();
      const data = {
        id: randomUUID(),
        name: "Huy Quang Nguyen",
        emailAddress: "huy@quanghuy.dev",
      };
      await withPrismaFromW(env).user.create({ data });
      const res = await app.fetch(
        new Request(baseUrl + "/users/" + data.id),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);
      expect(res.status).toBe(200);
      expect(await res.json()).toStrictEqual(data);
    });
  });
});
