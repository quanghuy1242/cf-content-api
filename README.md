# Cloudflare Content APIs

A set of APIs that powers blog & admin portal frontend.

## Prerequisite

1. NodeJS 20.16.0
2. Ubuntu LTS or Windows WSL2

## Tech stack

1. Backend framework: Hono/Typescript
2. Database: Cloudflare D1, Prisma
3. Authentication: Auth0
4. Monitoring: N/A (Cloudflare?)
5. Infrastructure: Cloudflare

## Getting started

```sh
npm install
npx wrangler d1 create contents-db
npn run migration:local
npm run dev
```

## Database boostrap

```sh
npx wrangler d1 migrations create __YOUR_DATABASE_NAME__ create_user_table
prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/001_create_user_table.sql
npm run migration:local # npm run migration:remote
```

## Database migrations

```sh
npx wrangler d1 migrations create __YOUR_DATABASE_NAME__ create_post_table
prisma migrate diff --from-local-d1 --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/xxx_msg.sql
npm run migration:local # npm run migration:remote
```
