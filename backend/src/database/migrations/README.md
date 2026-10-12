# Migrations

SQL migrations live in this directory. The application does not run them on startup.

## Naming

Use a three-digit prefix so files apply in order:

```text
001_create_users.sql
002_create_products.sql
003_create_orders.sql
```

Each file should contain plain SQL. The runner executes the file and records its name. Do not wrap the file in your own `START TRANSACTION` / `COMMIT`.

## Tracking table

`npm run db:migrate` creates an infrastructure table named `schema_migrations` when it runs. That table is not a business table. No application schema is included in this skeleton.

## Command

From the backend directory, with `.env` configured:

```text
npm run db:migrate
```

The command uses its own MySQL connection. The runtime connection pool used by the API keeps `multipleStatements` disabled.
