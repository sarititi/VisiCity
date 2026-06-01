import jwt from 'jsonwebtoken';
import { create, getUserByEmail } from '../models/UserModel.js';
import { create as createPassword, getPasswordByUserId } from '../models/PasswordModel.js';

const SECRET = process.env.JWT_SECRET;

export const login = async (email, password) => {
    const user = await getUserByEmail(email);
    if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }

    const pass = await getPasswordByUserId(user.id, password);
    if (!pass) {
        const error = new Error('Wrong password');
        error.status = 401;
        throw error;
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        SECRET,
        { expiresIn: '1h' }
    );

    return { user, token };
};

export const register = async (userName, email, password) => {
    const existing = await getUserByEmail(email);
    if (existing) {
        const error = new Error('Email already in use');
        error.status = 409;
        throw error;
    }

    const newUser = await create(userName, email);
    await createPassword(newUser.id, password);

    const token = jwt.sign(
        { id: newUser.id, role: newUser.role },
        SECRET,
        { expiresIn: '1h' }
    );

    return { user: newUser, token };
};