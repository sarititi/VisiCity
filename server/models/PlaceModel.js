import pool from '../config/db.js';

// יצירת place רגיל
export const createPlace = async (userId, name, description, category, latitude, longitude) => {
    const [result] = await pool.query(
        `INSERT INTO places (created_by, name, description, category, latitude, longitude, is_approved)
         VALUES (?, ?, ?, ?, ?, ?, FALSE)`,
        [userId, name, description, category, latitude, longitude]
    );
    return { place_id: result.insertId, created_by: userId, name, description, category, latitude, longitude, is_approved: false };
};

// שליפת place יחיד לפי ID — כולל created_by
export const getPlaceById = async (placeId) => {
    const [rows] = await pool.query(
        `SELECT place_id, created_by, name, description, category, latitude, longitude, is_approved
         FROM places
         WHERE place_id = ?`,
        [placeId]
    );
    return rows[0] || null;
};

// עדכון place
export const updatePlace = async (placeId, name, description, category, latitude, longitude) => {
    const [result] = await pool.query(
        `UPDATE places
         SET name = ?, description = ?, category = ?, latitude = ?, longitude = ?
         WHERE place_id = ?`,
        [name, description, category, latitude, longitude, placeId]
    );
    return result.affectedRows > 0;
};

// מחיקת place
export const deletePlace = async (placeId) => {
    const [result] = await pool.query(
        `DELETE FROM places
         WHERE place_id = ?`,
        [placeId]
    );
    return result.affectedRows > 0;
};

// // יצירת place מקודם / פרסומת — רק business
// export const createPromotedPlace = async (userId, name, description, category, latitude, longitude) => {
//     const [result] = await pool.query(
//         `INSERT INTO places (created_by, name, description, category, latitude, longitude, is_approved, is_promoted)
//          VALUES (?, ?, ?, ?, ?, ?, FALSE, TRUE)`,
//         [userId, name, description, category, latitude, longitude]
//     );
//     return { place_id: result.insertId, created_by: userId, name, description, category, latitude, longitude, is_approved: false, is_promoted: true };
// };


export const fetchPlaces = async (conditions = [], params = [], limit, offset) => {
    const WHERE = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [[{ total }]] = await pool.query(
        `SELECT COUNT(*) AS total FROM places p ${WHERE}`,
        params
    );

    const [places] = await pool.query(
        `SELECT
            p.place_id,
            p.name,
            p.description,
            p.category,
            p.latitude,
            p.longitude,
            p.is_approved,
            u.username AS created_by_username,
            u.user_id  AS created_by_id
         FROM places p
         LEFT JOIN users u ON p.created_by = u.user_id
         ${WHERE}
         ORDER BY p.place_id DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
    );

    return { places, total };
};
