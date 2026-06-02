import { createPlace } from '../models/PlaceModel.js';

export const addPlace = async (name, description, category, latitude, longitude) => {
    const newPlace = await createPlace(name, description, category, latitude, longitude);
    return newPlace;
};