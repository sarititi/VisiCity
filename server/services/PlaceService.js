import { createPlace, fetchPlaces, getPlaceById, updatePlace, deletePlace } from '../models/PlaceModel.js';

const MAX_LIMIT     = 50;
const DEFAULT_LIMIT = 50;

export const addPlace = async (userId, name, description, category, latitude, longitude) => {
    return await createPlace(userId, name, description, category, latitude, longitude);
};

export const getPlace = async (placeId) => {
    return await getPlaceById(placeId);
};

export const editPlace = async (placeId, name, description, category, latitude, longitude) => {
    return await updatePlace(placeId, name, description, category, latitude, longitude);
};

export const removePlace = async (placeId) => {
    return await deletePlace(placeId);
};

// export const addPromotedPlace = async (userId, name, description, category, latitude, longitude) => {
//     return await createPromotedPlace(userId, name, description, category, latitude, longitude);
// };


export const getPlaces = async ({ page = 1, limit = DEFAULT_LIMIT, search = '', category = '' } = {}) => {

    // --- pagination ---
    const safePage  = Math.max(1, parseInt(page)  || 1);
    const safeLimit = Math.min(MAX_LIMIT, Math.max(1, parseInt(limit) || DEFAULT_LIMIT));
    const offset    = (safePage - 1) * safeLimit;

    // --- בניית תנאי סינון ---
    const conditions = ['p.is_approved = TRUE'];
    const params     = [];

    if (search?.trim()) {
        conditions.push('(p.name LIKE ? OR p.description LIKE ?)');
        params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    if (category?.trim()) {
        conditions.push('p.category = ?');
        params.push(category.trim());
    }

    // --- שליפה מהמודל ---
    const { places, total } = await fetchPlaces(conditions, params, safeLimit, offset);

    return {
        places,
        total,
        page:       safePage,
        limit:      safeLimit,
        totalPages: Math.ceil(total / safeLimit),
    };
};
