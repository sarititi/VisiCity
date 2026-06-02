import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { create, getUserByEmail } from '../models/UserModel.js';
import { create as createPassword, getPasswordByUserId } from '../models/PasswordModel.js';

const SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        SECRET,
        { expiresIn: '1h' }
    );
};

export const login = async (email, password) => {
    const user = await getUserByEmail(email);
    if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }

    const pass = await getPasswordByUserId(user.id);
   if (!pass) {
        console.error(`Database inconsistency: User ID ${user.id} has no password record.`);
        const error = new Error('Internal server error');
        error.status = 500;
        throw error;
    }

    const isPasswordMatch = await bcrypt.compare(password, pass.password_hash);
    
    if (!isPasswordMatch) {
        const error = new Error('Incorrect password'); 
        error.status = 400;
        throw error;
    }

    const token = generateToken(user);
      
    return { user, token };
};      
      
export const register = async (userName, email, password) => {
    const existing = await getUserByEmail(email);
    if (existing) {
        const error = new Error('Email already in use');
        error.status = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await create(userName, email);
    await createPassword(newUser.id, hashedPassword);

    const token = generateToken(newUser);

    return { user: newUser, token };
};