const framework = require('../../../core/services');
function home(req, res) {
    console.log("Home page");
     

    // accessing service
    // framework.services.Module1.test.myservice()

    // const framework = {
    //     services: {
    //         Module1: {
    //             test: {
    //                 myservice: () => {}
    //             }
    //         }
    //     }
    // }
    res.send("Welcome to the home page!");
}

function signup(req, res) {
    console.log("Signup page ");
    console.log(framework);
    const myService = framework.services.test.myService1;    
    console.log(myService());
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
