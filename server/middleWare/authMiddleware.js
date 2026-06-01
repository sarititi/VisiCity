import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

const ROLE_HIERARCHY = {
    'regular': 1,
    'business': 2,
    'admin': 3
};

export const authenticateToken = (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'אין טוקן' });

        req.user = jwt.verify(token, SECRET);
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError')
            return res.status(401).json({ error: 'טוקן פג תוקף' });
        if (err.name === 'JsonWebTokenError')
            return res.status(403).json({ error: 'טוקן לא תקין' });

        res.status(500).json({ error: 'שגיאה בשרת' });
    }
};

export const requireRole = (role) => (req, res, next) => {
    try {
        if (!req.user)
            return res.status(403).json({ error: 'שגיאה' });

        const requiredLevel = ROLE_HIERARCHY[role];
        const userLevel = ROLE_HIERARCHY[req.user.role];

        if (!userLevel || userLevel < requiredLevel)
            return res.status(403).json({ error: 'אין לך הרשאה' });

        next();
    } catch (err) {
        res.status(500).json({ error: 'שגיאה בשרת' });
    }
};