import { Hono } from "hono";

const health = new Hono<HonoApp>().basePath("/health");

health.get("", (c) => c.text("Ok"));

export default health;
