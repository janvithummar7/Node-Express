const { home, signup, login } = require('../controllers/pageControllers');
const middlewares = require('../middleware/authMiddleware');

function Routes(app) {
    app.get("/", middlewares, (req, res) => { home(req, res) });
    app.get("/signup", middlewares, (req, res) => { signup(req, res) });
    app.get("/login", middlewares, (req, res) => { login(req, res) });

}

module.exports = Routes;
