CREATE DATABASE IF NOT EXISTS travel_app;
USE travel_app;

----------------------------------------------------
-- DROP TABLES (איפוס מסד נתונים)
----------------------------------------------------

DROP TABLE IF EXISTS media CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS places CASCADE;
DROP TABLE IF EXISTS credentials CASCADE;
DROP TABLE IF EXISTS users CASCADE;

----------------------------------------------------
-- USERS
----------------------------------------------------
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    user_type VARCHAR(20) NOT NULL
        CHECK (user_type IN ('regular', 'business', 'admin'))
);

----------------------------------------------------
-- CREDENTIALS
----------------------------------------------------
CREATE TABLE credentials (
    user_id INT PRIMARY KEY
        REFERENCES users(user_id) ON DELETE CASCADE,
    password_hash VARCHAR(255) NOT NULL
);

----------------------------------------------------
-- PAYMENT METHODS (כרטיס שמור למשתמש - פעם אחת בלבד)
----------------------------------------------------
CREATE TABLE payment_methods (
    payment_method_id SERIAL PRIMARY KEY,

    user_id INT NOT NULL UNIQUE
        REFERENCES users(user_id) ON DELETE CASCADE,

    card_holder_name VARCHAR(100) NOT NULL,
    card_last4 CHAR(4) NOT NULL,
    expiry_month INT NOT NULL,
    expiry_year INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

----------------------------------------------------
-- PLACES
----------------------------------------------------
CREATE TABLE places (
    place_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    is_approved BOOLEAN DEFAULT FALSE
);

----------------------------------------------------
-- EVENTS
----------------------------------------------------
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,

    business_id INT NOT NULL
        REFERENCES users(user_id) ON DELETE CASCADE,

    place_id INT NOT NULL
        REFERENCES places(place_id) ON DELETE CASCADE,

    title VARCHAR(100) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,

    start_date TIMESTAMP,
    end_date TIMESTAMP,

    is_active BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

----------------------------------------------------
-- PAYMENTS (דמה - ללא סליקה אמיתית)
----------------------------------------------------
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,

    event_id INT NOT NULL
        REFERENCES events(event_id) ON DELETE CASCADE,

    payment_method_id INT
        REFERENCES payment_methods(payment_method_id),

    amount DECIMAL(10,2) NOT NULL,

    payment_status VARCHAR(20) NOT NULL
        CHECK (payment_status IN ('pending', 'completed', 'failed')),

    paid_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

----------------------------------------------------
-- FAVORITES
----------------------------------------------------
CREATE TABLE favorites (
    favorite_id SERIAL PRIMARY KEY,

    user_id INT NOT NULL
        REFERENCES users(user_id) ON DELETE CASCADE,

    place_id INT NOT NULL
        REFERENCES places(place_id) ON DELETE CASCADE,

    UNIQUE(user_id, place_id)
);

----------------------------------------------------
-- REVIEWS
----------------------------------------------------
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,

    user_id INT NOT NULL
        REFERENCES users(user_id) ON DELETE CASCADE,

    place_id INT NOT NULL
        REFERENCES places(place_id) ON DELETE CASCADE,

    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

----------------------------------------------------
-- MEDIA
----------------------------------------------------
CREATE TABLE media (
    media_id SERIAL PRIMARY KEY,

    place_id INT
        REFERENCES places(place_id) ON DELETE CASCADE,

    user_id INT
        REFERENCES users(user_id) ON DELETE SET NULL,

    media_type VARCHAR(20) NOT NULL
        CHECK (media_type IN ('image', 'video', 'audio')),

    media_url VARCHAR(255) NOT NULL,

    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);