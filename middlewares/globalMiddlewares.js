const jwt = require('jsonwebtoken');
require('dotenv').config();

function globalMiddleware1(req, res, next) {
    console.log('globalMiddleware1 Use Successfully...');
    next(); 
}

function globalMiddleware2(req, res, next) {
    console.log('globalMiddleware2 Use Successfully...');
    next(); 
}

function globalMiddleware3(req, res, next) {
    console.log('globalMiddleware3 Use Successfully...');
    next(); 
}

function globalMiddleware4(req, res, next) {
    console.log('globalMiddleware4 Use Successfully...');
    next(); 
}

function globalMiddleware5(req, res, next) {
    console.log('globalMiddleware5 Use Successfully...');
    next(); 
}

function globalMiddleware6(req, res, next) {
    console.log('globalMiddleware6 Use Successfully...');
    next(); 
}

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, userData) => {
        if (err) {
            return res.status(403).json({ message: 'Unauthorized: Invalid token' });
        }
        req.userData = userData;
        console.log("Token Verify");
        next();
    });
};

module.exports = {globalMiddleware1, globalMiddleware2, globalMiddleware3, globalMiddleware4, globalMiddleware5,  globalMiddleware6, verifyToken};
