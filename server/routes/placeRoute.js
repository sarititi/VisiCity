import express from 'express';
import { postPlace, fetchPlaces, putPlace, deletePlace } from '../controller/PlaceController.js';
import { authenticateToken, requireRole, authorizePlaceModification } from '../middleWare/authMiddleware.js';

const router = express.Router();

// כל אחד (מאומת) יכול לפרסם place רגיל
router.post('/', authenticateToken, requireRole('regular'), postPlace);

// עדכון place — מאומת + בדיקת הרשאות בmiddleware
router.put('/:id', authenticateToken, authorizePlaceModification, putPlace);

// מחיקת place — מאומת + בדיקת הרשאות בmiddleware
router.delete('/:id', authenticateToken, authorizePlaceModification, deletePlace);

// רק business יכול לפרסם פרסומת
// router.post('/promoted', authenticateToken, requireRole('business'), postPromotedPlace);

// שליפת כל הפוסטים — promoted ראשונים
router.get('/', fetchPlaces);

export default router;
