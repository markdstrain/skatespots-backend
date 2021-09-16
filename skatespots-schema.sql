CREATE TABLE users (
    username VARCHAR(30) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
        CHECK (position('@' IN email) > 1),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    token TEXT DEFAULT NULL
);

CREATE TABLE spots (
    id SERIAL PRIMARY KEY,
    spot_name VARCHAR(30),
    spot_type TEXT,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    creator VARCHAR(30)
        REFERENCES users,
    created TIME (0) NOT NULL,
    ranking INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE spot_comments (
    id SERIAL PRIMARY KEY,
    spot INTEGER NOT NULL
        REFERENCES spots,
    comment_creator VARCHAR(30) NOT NULL
        REFERENCES users,
    comment TEXT,
    created TIME
);

CREATE TABLE spot_photos (
    id SERIAL PRIMARY KEY,
    photo_creator VARCHAR(30) NOT NULL
        REFERENCES users,
    spot INT NOT NULL       
        REFERENCES spots,
    photo BYTEA NOT NULL 
);

CREATE TABLE spot_ranking (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL
        REFERENCES users,
    spot INTEGER NOT NULL
        REFERENCES spots,
    ranking BOOLEAN 
);


