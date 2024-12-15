const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; // Ensure this matches your token signing secret

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY); // Verify token
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};
