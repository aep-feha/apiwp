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
        
        // Calculate remaining time
        const currentTime = Math.floor(Date.now() / 1000);
        const remainingTime = decoded.exp - currentTime;
        
        // Convert remaining time to human-readable format
        const days = Math.floor(remainingTime / (24 * 60 * 60));
        const hours = Math.floor((remainingTime % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((remainingTime % (60 * 60)) / 60);
        
        let humanReadableTime = '';
        if (days > 0) humanReadableTime += `${days} day${days > 1 ? 's' : ''} `;
        if (hours > 0) humanReadableTime += `${hours} hour${hours > 1 ? 's' : ''} `;
        if (minutes > 0) humanReadableTime += `${minutes} minute${minutes > 1 ? 's' : ''}`;
        
        return {
            ...decoded,
            remainingTime: humanReadableTime.trim()
        };
    } catch (error) {
        throw new Error('Invalid token');
    }
}


module.exports = {
    generateToken,verifyToken
};
