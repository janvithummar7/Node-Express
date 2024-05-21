const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost:27017/closeDigit";

const mongodbConncetion = mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const Employee = require("../models/employee");

const createUser = async () => {
  try {
    const newUsers = [
      {
        name: "Janvi",
        email: "janvi@gmail.com",
        age: 20,
      },
      {
        name: "Hinali",
        email: "hinali@gmail.com",
        age: 21,
      },
      {
        name: "Divisha",
        email: "divisha@gmail.com",
        age: 22,
      },
      {
        name: "Kinal",
        email: "kinal@gmail.com",
        age: 23,
      },
    ];
    const savedUsers = await Employee.insertMany(newUsers);
    console.log("User saved:", savedUsers);
  } catch (err) {
    console.log("Error creating user:", err);
  }
};

createUser();
module.exports = mongodbConncetion;