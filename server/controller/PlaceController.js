import { addPlace } from '../services/placeService.js';

export const postPlace = async (req, res) => {
    try {
        const { name, description, category, latitude, longitude } = req.body;

        if (!name || !category) {
            return res.status(400).json({ error: 'name and category are required' });
        }

        const newPlace = await addPlace(name, description, category, latitude, longitude);
        res.status(201).json(newPlace);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
};