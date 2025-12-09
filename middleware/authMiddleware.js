const jwt = require('jsonwebtoken');
const { STATUS_CODES } = require('../util/constant');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(STATUS_CODES.NOT_FOUND).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        res.status(STATUS_CODES.SERVER_ERROR).json({ error: 'Invalid token.' });
    }
};

module.exports = authMiddleware;

