import express from 'express';
import { postLogin } from '../controllers/loginController.js';
import { postRegister } from '../controllers/registerController.js';

const router = express.Router();

router.post('/login', postLogin);
router.post('/register', postRegister);

export default router;