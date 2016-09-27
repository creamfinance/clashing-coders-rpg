DROP SCHEMA public cascade;
CREATE SCHEMA public;

CREATE TABLE users(id serial primary key, username varchar(255) unique, name varchar(255), email varchar(255), password varchar(20), checked_in boolean default false);
CREATE TABLE level_metadata(level_id integer, user_id integer, primary key (level_id, user_id), finished timestamp, times_failed integer default 0);
