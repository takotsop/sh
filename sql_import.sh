#!/bin/sh

# Start DB
docker-compose up -d db
sleep 10

# Import SQL
docker exec -i secrethitler_db_1 psql -U secrets -W n3v3rw1nfr1ends -d secrethitler < schema.sql

exit
