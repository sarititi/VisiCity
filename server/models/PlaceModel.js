import pool from '../config/db.js';

export const createPlace = async (name, description, category, latitude, longitude) => {
    const [result] = await pool.query(
        `INSERT INTO places (name, description, category, latitude, longitude, is_approved)
         VALUES (?, ?, ?, ?, ?, FALSE)`,
        [name, description, category, latitude, longitude]
    );
    return { place_id: result.insertId, name, description, category, latitude, longitude, is_approved: false };
};