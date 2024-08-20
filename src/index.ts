import categories from "apis/categories";
import contents from "apis/contents";
import health from "apis/health";
import images from "apis/images";
import users from "apis/users";
import { exceptionHander } from "exceptions";
import { Hono } from "hono";

// Start a Hono app
const app = new Hono();

// Configure middlewares
app.onError(exceptionHander);

// Configure routers
app.route("/api/v1", contents);
app.route("/api/v1", users);
app.route("/api/v1", categories);
app.route("/api/v1", images);
app.route("", health);

// Export the Hono app
export default app;
