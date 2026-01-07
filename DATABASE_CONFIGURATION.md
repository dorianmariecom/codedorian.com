# Database Configuration for Kamal Deployment

## Overview

The application uses PostgreSQL managed as a Kamal accessory. The database runs in a Docker container on the same host as the application, allowing communication through Docker's internal network.

## Important Configuration Changes

### DATABASE_URL Format

The `DATABASE_URL` environment variable must use the Docker service name instead of the external IP address.

**Correct format for production:**
```
DATABASE_URL=postgresql://code_user:YOUR_PASSWORD@codedorian-db:5432/code_production
```

**Correct format for staging:**
```
DATABASE_URL=postgresql://code_user:YOUR_PASSWORD@codedorian-db:5432/code_staging
```

### Service Name

When Kamal deploys a PostgreSQL accessory named `db` for a service named `codedorian`, the Docker service name becomes `codedorian-db`.

### Secrets Configuration

You need to configure the following secrets in `.kamal/secrets.production` and `.kamal/secrets.staging`:

**`.kamal/secrets.production`:**
```bash
DATABASE_URL=postgresql://code_user:YOUR_STRONG_PASSWORD@codedorian-db:5432/code_production
POSTGRES_PASSWORD=YOUR_STRONG_PASSWORD
```

**`.kamal/secrets.staging`:**
```bash
DATABASE_URL=postgresql://code_user:YOUR_STRONG_PASSWORD@codedorian-db:5432/code_staging
POSTGRES_PASSWORD=YOUR_STRONG_PASSWORD
```

**Important Notes:**
- Use the same password for `POSTGRES_PASSWORD` and in the `DATABASE_URL`
- The hostname in `DATABASE_URL` should be `codedorian-db` (not the IP address)
- These files are gitignored and must be configured on each deployment machine
- The password should be a strong, randomly generated password

## Initial Setup

After configuring the PostgreSQL accessory, run:

```bash
# For production
kamal accessory boot db -d production

# For staging  
kamal accessory boot db -d staging
```

Then run database migrations:

```bash
# For production
kamal app exec -d production "bin/rails db:migrate"

# For staging
kamal app exec -d staging "bin/rails db:migrate"
```

## Verifying the Configuration

You can verify the database connection by:

1. Checking the PostgreSQL container is running:
```bash
ssh root@138.201.175.197
docker ps | grep postgres
```

2. Testing the connection from the application container:
```bash
kamal app exec -d production "bin/rails runner 'puts ActiveRecord::Base.connection.execute(\"SELECT 1\").to_a'"
```

## Migration from External PostgreSQL

If you're migrating from an external PostgreSQL instance:

1. Export your existing database:
```bash
pg_dump -h 138.201.175.197 -U code_user code_production > backup.sql
```

2. Boot the new PostgreSQL accessory
3. Import the data:
```bash
kamal accessory exec db -d production "psql -U code_user -d code_production" < backup.sql
```

4. Update the `DATABASE_URL` secret to use `codedorian-db` as the hostname
5. Redeploy the application