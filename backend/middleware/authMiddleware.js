const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authorizationUser = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const decodedId = decoded.id;
            console.log('Decoded ID:', decodedId);
            // Find the user in the database
            req.user = await User.findById(decoded.id).select('-password');
            console.log('Decoded user:', req.user);
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // Proceed to the next middleware
            return next();
        } catch (error) {
            console.error('Authorization error:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If no token is provided
    return res.status(401).json({ message: 'Not authorized, no token' });
};

module.exports = { authorizationUser };