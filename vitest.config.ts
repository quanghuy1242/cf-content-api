import {
  defineWorkersConfig,
  readD1Migrations,
} from "@cloudflare/vitest-pool-workers/config";
import path from "node:path";

export default defineWorkersConfig(async () => {
  // Read all migrations in the `migrations` directory
  const migrationsPath = path.join(__dirname, "migrations");
  const migrations = await readD1Migrations(migrationsPath);
  return {
    test: {
      include: ["./tests/**/*.test.ts"],
      // include: ["tests/contents.test.ts"],
      setupFiles: [
        "./tests/apply-migrations.ts",
        "./tests/apply-fetch-mock.ts",
      ],
      poolOptions: {
        workers: {
          singleWorker: true,
          wrangler: { configPath: "./wrangler.toml" },
          miniflare: {
            bindings: {
              TEST_MIGRATIONS: migrations,
            },
          },
        },
      },
    },
    resolve: {
      alias: {
        apis: "/src/apis",
        const: "/src/const",
        middlewares: "/src/middlewares",
        schema: "/src/schema",
        utils: "/src/utils",
        exceptions: "/src/exceptions",
        services: "/src/services",
      },
    },
  };
});
