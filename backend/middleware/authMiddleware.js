const jwt = require('jsonwebtoken');

const User = require('../models/User');

const authorizationUser = async (req, res , next) =>{
let token;

if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    try {
        token = req.headers.authorization.split(' ')[1]
    const authorizedUser = jwt.verify(token, process.env.JWT_SECRET)
    req.user = authorizationUser.user
    next();
    } catch (error) {
        return res.status(401).json({message:' Not authorized, token failed'})
    }
}
return res.status(401).json({message: 'Not authorized, no token'})
}


module.exports = {authorizedUser}