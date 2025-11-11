const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    try {
        // 1️⃣ Get token (from cookie or Authorization header)
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).send({ message: 'Access denied. No token provided.' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
        req.user = decoded; // attach decoded user info to request
        next();

    } catch (error) {
        return res.status(401).send({ message: 'Invalid or expired token.' });
    }
};

module.exports = authenticate;
