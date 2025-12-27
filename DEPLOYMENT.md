# Deployment Guide

This guide covers deploying the application using Kamal to staging and production environments.

## Prerequisites

- Docker installed and configured
- Access to the deployment server (138.201.175.197)
- Database server accessible from the deployment server
- Required secret values (DATABASE_URL, RAILS_MASTER_KEY, etc.)

## Setting Up Secrets

Kamal uses secret files to manage sensitive environment variables. These files are **NOT** committed to version control.

### Step 1: Create Common Secrets

Copy the example file and fill in the values:

```bash
cp .kamal/secrets-common.example .kamal/secrets-common
```

Edit `.kamal/secrets-common` and provide values for:

- `DATABASE_URL` - PostgreSQL connection string (format: `postgresql://username:password@hostname:port/database_name`)
- `BASE_URL` - Application base URL
- `HOST` - Primary hostname
- `HOSTS` - Comma-separated list of allowed hosts
- `RAILS_MASTER_KEY` - From `config/master.key`
- `KAMAL_REGISTRY_USERNAME` - Docker registry username
- `KAMAL_REGISTRY_PASSWORD` - Docker registry password

### Step 2: Create Environment-Specific Secrets

For production:

```bash
cp .kamal/secrets-production.example .kamal/secrets-production
```

Edit `.kamal/secrets-production` and provide the production-specific values, especially:

- `DATABASE_URL` - **CRITICAL**: Must point to your production PostgreSQL database server
  - Example: `postgresql://prod_user:secure_pass@your-db-host.com:5432/code_production`
  - If using a cloud provider, get this from your database service
  - If self-hosted, ensure PostgreSQL is running and accessible from 138.201.175.197

For staging:

```bash
cp .kamal/secrets-production.example .kamal/secrets-staging
```

Edit `.kamal/secrets-staging` for staging-specific values.

### Step 3: Verify Database Connectivity

Before deploying, ensure your database is accessible:

```bash
# Test PostgreSQL connection from the deployment server
# SSH to 138.201.175.197 and run:
psql "postgresql://username:password@hostname:port/database_name"
```

## Deploying

### Deploy to Both Staging and Production

```bash
bin/deploy
```

This will:
1. Push git changes
2. Build the Docker image
3. Deploy to staging
4. Deploy to production

### Deploy to Single Environment

For staging only:

```bash
kamal deploy -d staging
```

For production only:

```bash
kamal deploy -d production
```

## Common Issues

### Database Connection Refused

**Error**: `connection to server at "X.X.X.X", port 5432 failed: Connection refused`

**Root Cause**: The `DATABASE_URL` environment variable is not set or points to an inaccessible database.

**Solution**:
1. Verify `.kamal/secrets-production` (or `-staging`) exists and contains a valid `DATABASE_URL`
2. Ensure the database server is running and accepts TCP/IP connections
3. Check firewall rules allow connections from 138.201.175.197 to your database server
4. Test the connection string manually before deploying

### Missing Environment Variables

If you see errors about missing environment variables, ensure:
- The variable is defined in the appropriate `.kamal/secrets-*` file
- The variable is listed under `env.secret` in `config/deploy.production.yml` or `config/deploy.staging.yml`

## Useful Commands

```bash
# View application logs
kamal logs -d production

# Open Rails console
kamal console -d production

# Open database console
kamal db -d production

# Restart the application
kamal restart -d production

# SSH into the server
kamal shell -d production

# Release deployment lock
kamal lock release -d production
```

## Security Notes

- **NEVER** commit `.kamal/secrets-*` files to version control
- Keep `DATABASE_URL` and `RAILS_MASTER_KEY` secure
- Use strong passwords for database connections
- Rotate credentials regularly
- Ensure `.gitignore` includes `/.kamal/*` (except `.kamal/.keep`)

## Related Files

- `config/deploy.production.yml` - Production deployment configuration
- `config/deploy.staging.yml` - Staging deployment configuration
- `config/database.yml` - Database configuration
- `.env.production` - Non-secret production environment variables (committed to repo)
- `.kamal/secrets-*` - Secret environment variables (NOT committed)