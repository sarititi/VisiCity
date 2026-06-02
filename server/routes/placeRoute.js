import express from 'express';
import { postPlace } from '../controller/placeController.js';
import { authenticateToken, requireRole } from '../middleWare/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, requireRole('regular'), postPlace);

export default router;