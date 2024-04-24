function home(req, res) {
    console.log("Home page");
    res.send("Welcome to the home page!");
}

function signup(req, res) {
    console.log("Signup page ");
    res.send("Signup page");
}

function login(req, res) {
    console.log("Login page");
    res.send("Login page");
}

module.exports = {home, signup, login};
