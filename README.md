# Cloudflare Workers OpenAPI 3.1

This is a Cloudflare Worker with OpenAPI 3.1 using [chanfana](https://github.com/cloudflare/chanfana) and [Hono](https://github.com/honojs/hono).

This is an example project made to be used as a quick start into building OpenAPI compliant Workers that generates the
`openapi.json` schema automatically from code and validates the incoming request to the defined parameters or request body.

## Get started

1. Sign up for [Cloudflare Workers](https://workers.dev). The free tier is more than enough for most use cases.
2. Clone this project and install dependencies with `npm install`
3. Run `wrangler login` to login to your Cloudflare account in wrangler
4. Run `wrangler deploy` to publish the API to Cloudflare Workers

## Project structure

1. Your main router is defined in `src/index.ts`.
2. Each endpoint has its own file in `src/endpoints/`.
3. For more information read the [chanfana documentation](https://chanfana.pages.dev/) and [Hono documentation](https://hono.dev/docs).

## Development

1. Run `wrangler dev` to start a local instance of the API.
2. Open `http://localhost:8787/` in your browser to see the Swagger interface where you can try the endpoints.
3. Changes made in the `src/` folder will automatically trigger the server to reload, you only need to refresh the Swagger interface.

## Database boostrap
1. Run `npx wrangler d1 migrations create __YOUR_DATABASE_NAME__ create_user_table` to generate empty migration script.
2. Run `prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/001_create_user_table.sql` to boostrap database.
3. Run `npm run migration:local` or `npm run migration:remote` for applying.

## Database migrations
1. After making changes to `./prisma/schema.prisma`, run `npx wrangler d1 migrations create __YOUR_DATABASE_NAME__ create_post_table` to generage new migration revision.
2. Run `prisma migrate diff --from-local-d1 --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/xxx_msg.sql` to run migrations.
3. Run `npm run migration:local` or `npm run migration:remote` for applying.