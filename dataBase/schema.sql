-- מחיקת טבלאות קיימות במידה וקיימות (לצורך איפוס נקי)
DROP TABLE IF EXISTS media CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS places CASCADE;
DROP TABLE IF EXISTS credentials CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. טבלת משתמשים (ללא שדה הסיסמה)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('regular', 'business', 'admin'))
);

-- 2. טבלת אישורים וסיסמאות (קשר של 1:1 עם טבלת משתמשים)
CREATE TABLE credentials (
    user_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    password_hash VARCHAR(255) NOT NULL
);

-- 3. טבלת מקומות
CREATE TABLE places (
    place_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 8), --for the map
    longitude DECIMAL(11, 8),
    is_approved BOOLEAN DEFAULT FALSE
);

-- 4. טבלת מקומות אהובים
CREATE TABLE favorites (
    favorite_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    place_id INT NOT NULL REFERENCES places(place_id) ON DELETE CASCADE
    UNIQUE(user_id, place_id)
);

-- 7. טבלת דירוגים וביקורות
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    place_id INT NOT NULL REFERENCES places(place_id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. טבלת אירועים והצעות
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    business_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    place_id INT NOT NULL REFERENCES places(place_id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
    amount_paid DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    start_date TIMESTAMP, -- מתי הפרסומת מתחילה להופיע
    end_date TIMESTAMP;   -- מתי הפרסומת יורדת מהאוויר (פגת תוקף)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. טבלת מדיה
CREATE TABLE media (
    media_id SERIAL PRIMARY KEY,
    place_id INT REFERENCES places(place_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video', 'audio')),
    media_url VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);