import { addPlace, getPlaces, editPlace, removePlace } from '../services/placeService.js';

export const postPlace = async (req, res) => {
    try {
        const { name, description, category, latitude, longitude } = req.body;

        if (!name || !category) {
            return res.status(400).json({ error: 'name and category are required' });
        }

        const newPlace = await addPlace(req.user.id, name, description, category, latitude, longitude);
        res.status(201).json(newPlace);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
};

// PUT /places/:id — עדכון place
export const putPlace = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, latitude, longitude } = req.body;

        if (!name || !category) {
            return res.status(400).json({ error: 'name and category are required' });
        }

        const updated = await editPlace(id, name, description, category, latitude, longitude);
        if (!updated) {
            return res.status(500).json({ error: 'Failed to update place' });
        }

        res.status(200).json({ success: true, message: 'Place updated successfully' });
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
};

// DELETE /places/:id — מחיקת place
export const deletePlace = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await removePlace(id);
        if (!deleted) {
            return res.status(500).json({ error: 'Failed to delete place' });
        }

        res.status(200).json({ success: true, message: 'Place deleted successfully' });
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
};

// // POST /places/promoted — פרסומת, business בלבד
// export const postPromotedPlace = async (req, res) => {
//     try {
//         const { name, description, category, latitude, longitude } = req.body;
//         if (!name || !category)
//             return res.status(400).json({ error: 'name and category are required' });

//         const newPlace = await addPromotedPlace(req.user.id, name, description, category, latitude, longitude);
//         res.status(201).json(newPlace);
//     } catch (err) {
//         res.status(err.status || 500).json({ error: err.message });
//     }
// };

// GET /places — שליפת כל הפוסטים (promoted ראשון)
export const fetchPlaces = async (req, res) => {
    try {
        const { page, limit, search, category } = req.query;
        const result = await getPlaces({ page, limit, search, category });
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};