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

module.exports = {globalMiddleware1, globalMiddleware2, globalMiddleware3, globalMiddleware4, globalMiddleware5,  globalMiddleware6};
