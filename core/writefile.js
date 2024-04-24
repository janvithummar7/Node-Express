const fs = require('fs');

const data = [
    {
        "path" : "/signup",
        "method" : "post",
        "action" : "auth.adminSignup",
        "public" : true,
        "globalMiddlewares": [],
        "middlewares": [],
        "pathFromRoot": false,
        "enabled": true
    },
    {
        "path" : "/login",
        "method" : "post",
        "action" : "auth.adminSignup",
        "public" : true,
        "globalMiddlewares": [],
        "middlewares": [],
        "pathFromRoot": false,
        "enabled": true
    },
    {
        "path" : "/view",
        "method" : "get",
        "action" : "auth.adminSignup",
        "public" : true,
        "globalMiddlewares": [],
        "middlewares": [],
        "pathFromRoot": false,
        "enabled": true
    },
    {
        "path" : "/create",
        "method" : "put",
        "action" : "auth.adminSignup",
        "public" : true,
        "globalMiddlewares": [],
        "middlewares": [],
        "pathFromRoot": false,
        "enabled": true
    },
    {
        "path" : "/delete",
        "method" : "delete",
        "action" : "auth.adminSignup",
        "public" : true,
        "globalMiddlewares": [],
        "middlewares": [],
        "pathFromRoot": false,
        "enabled": true
    }
];

const filePath = '../api/folder1/routes.json';

const jsonData = JSON.stringify(data, null, 2); 

+
fs.writeFile(filePath, jsonData, (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log(`File "${filePath}" has been created and data has been written successfully.`);
    }
});
