const jwt = require('jsonwebtoken');
const redisClient = require('../config/redisClient');

const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        // Check if token is blacklisted in Redis
        const isBlacklisted = await redisClient.get(`token:${token}`);
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token has been revoked. Please log in again." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.role !== 'profileAdmin') {
            return res.status(403).json({ message: "Access denied. Requires profileAdmin role." });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

module.exports = { verifyAdmin };
