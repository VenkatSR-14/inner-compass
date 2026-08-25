-- ========================================================
-- Inner Compass Database & Schema Initialization Script
-- Location: App-Backend/scripts/init_db.sql
-- ========================================================

-- 1. Create Application Superuser (sraghavanvenkat)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'sraghavanvenkat') THEN
        CREATE ROLE sraghavanvenkat WITH LOGIN SUPERUSER PASSWORD 'Venk@t1998';
    ELSE
        ALTER ROLE sraghavanvenkat WITH PASSWORD 'Venk@t1998';
    END IF;
END $$;

-- 2. Create Service Schemas owned by sraghavanvenkat
CREATE SCHEMA IF NOT EXISTS user_schema AUTHORIZATION sraghavanvenkat;
CREATE SCHEMA IF NOT EXISTS content_schema AUTHORIZATION sraghavanvenkat;
CREATE SCHEMA IF NOT EXISTS messaging_schema AUTHORIZATION sraghavanvenkat;
CREATE SCHEMA IF NOT EXISTS ai_schema AUTHORIZATION sraghavanvenkat;
