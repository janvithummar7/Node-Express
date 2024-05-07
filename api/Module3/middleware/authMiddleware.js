function authMiddleware1(req, res, next) {
    console.log('Middleware1 Use Successfully...');
    next(); 
}

function authMiddleware2(req, res, next) {
    console.log('Middleware2 Use Successfully...');
    next(); 
}

function authMiddleware3(req, res, next) {
    console.log('Middleware3 Use Successfully...');
    next(); 
}

function authMiddleware4(req, res, next) {
    console.log('Middleware4 Use Successfully...');
    next(); 
}

function authMiddleware5(req, res, next) {
    console.log('Middleware5 Use Successfully...');
    next(); 
}

function authMiddleware6(req, res, next) {
    console.log('Middleware6 Use Successfully...');
    next(); 
}

module.exports = {authMiddleware1, authMiddleware2, authMiddleware3, authMiddleware4, authMiddleware5,  authMiddleware6};
