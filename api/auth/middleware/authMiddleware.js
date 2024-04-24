function authMiddleware(req, res, next) {
    console.log('Middleware Use Successfully...');
    next(); 
}

module.exports = authMiddleware;
