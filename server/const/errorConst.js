// ===== Auth Service Errors =====

export const USER_NOT_FOUND = {
    message: 'User not found',
    status: 404
};

export const INCORRECT_PASSWORD = {
    message: 'Incorrect password',
    status: 401
};

export const EMAIL_ALREADY_IN_USE = {
    message: 'Email already in use',
    status: 409
};

export const DB_NO_PASSWORD_RECORD = {
    message: 'Internal server error',
    status: 500
};

// ===== Auth Middleware Errors =====

export const NO_TOKEN = {
    message: 'No token provided',
    status: 401
};

export const TOKEN_EXPIRED = {
    message: 'Token expired',
    status: 401
};

export const INVALID_TOKEN = {
    message: 'Invalid token',
    status: 403
};

export const ACCESS_DENIED = {
    message: 'Access denied',
    status: 403
};

export const INSUFFICIENT_PERMISSIONS = {
    message: 'Insufficient permissions',
    status: 403
};

// ===== General Errors =====

export const INTERNAL_SERVER_ERROR = {
    message: 'Internal server error',
    status: 500
};