import app from "../src";
import { withPrismaFromW } from "../src/services/prisma";
import { tokener } from "./helpers/auth";
import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { M2M_TOKEN_TYPE } from "const";
import { randomUUID } from "crypto";
import { User } from "schema/generated/zod";
import { describe, it, expect } from "vitest";

const baseUrl: string = "http://a.com/api/v1/users";

describe("user", async () => {
  const authHeader = {
    Authorization: `Bearer ${await tokener({ gty: M2M_TOKEN_TYPE })}`,
  };
  describe("create", () => {
    it("admin: enable create a new user & return it", async () => {
      // Insert it first
      const ctx = createExecutionContext();
      const res = await app.fetch(
        new Request(baseUrl, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            ...authHeader,
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

      const d: User = await res.json();
      expect(d.name).toStrictEqual("Huy Quang Nguyen");
      expect(await withPrismaFromW(env).user.count()).toBe(1);
    });
    it("user: unable to create new users", async () => {});
  });

  describe("update", () => {
    it("all: unable to updaet any users", async () => {});
  });

  describe("select", () => {
    it("admin: enable return an existing user", async () => {
      const ctx = createExecutionContext();
      const data = {
        id: randomUUID(),
        name: "Huy Quang Nguyen",
        emailAddress: "huy@quanghuy.dev",
      };
      await withPrismaFromW(env).user.create({ data });
      const res = await app.fetch(
        new Request(baseUrl + "/" + data.id, { headers: authHeader }),
        env,
        ctx,
      );
      await waitOnExecutionContext(ctx);
      expect(res.status).toBe(200);
      expect(await res.json()).toStrictEqual(data);
    });
    it("user: unable to view any user", async () => {});
  });
});
