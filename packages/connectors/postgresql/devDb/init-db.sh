#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    SELECT 'CREATE DATABASE postgresql_adapter_test'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'postgresql_adapter_test')\gexec
EOSQL
