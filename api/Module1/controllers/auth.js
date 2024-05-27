function home(req, res) {
    console.log("Home page");
    res.send("Welcome to the home page!");
}

function signup(req, res) {
    console.log("Signup page ");
    console.log(framework)
    const myService = framework.services.Module1.test.myService1();    
    console.log(myService);
    const myFunction = framework.functions.Module1.allFunctions.function1();    
    console.log(myFunction);
    res.send("Signup page");
}

function login(req, res) {
    console.log("Login page");
    res.send("Login page here ---------------->");
}

function view(req, res) {
    console.log("View page");
    res.send("View page");
}

function edit(req, res) {
    console.log("Edit page");
    res.send("Edit page");
}

function remove(req, res) {
    console.log("Delete page");
    res.send("Delete page");
}

function create(req, res) {
    console.log("Create page");
    res.send("Create Page");
}


module.exports = {home, signup, login, view, edit, remove, create};
