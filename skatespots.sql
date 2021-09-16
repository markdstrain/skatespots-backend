\echo 'Delete and recreate skate-spot db?'
\prompt 'Return for yes or control-C to cancel >' foo

DROP DATABASE skatespots;
CREATE DATABASE skatespots;
\connect skatespots

\i skatespots-schema.sql
\i skatespots-seed.sql