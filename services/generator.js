require('dotenv').config();
const jwt = require('jsonwebtoken');

function generateToken(payload) {
    const secretKey = process.env.JWT_SECRET_KEY;
    const expiresIn = '30d'; // 30 days

    if (!secretKey) {
        throw new Error('JWT_SECRET_KEY is not defined in environment variables');
    }

    return jwt.sign(payload, secretKey, { expiresIn });
}


function verifyToken(token) {
    const secretKey = process.env.JWT_SECRET_KEY;

    if (!secretKey) {
        throw new Error('JWT_SECRET_KEY is not defined in environment variables');
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
}


module.exports = {
    generateToken
};
