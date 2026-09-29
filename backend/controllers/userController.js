const userModel = require("../models/userModel");

const getUsers = (req, res) => {

    userModel.getAllUsers((err, users) => {

        if (err) {
            return res.status(500).json({
                message: "Failed to fetch users",
                error: err.message
            });
        }

        res.json(users);
    });
};

const createUser = (req, res) => {

    const userData = req.body;
    
    if (!userData.name || !userData.email || !userData.password) {
        return res.status(400).json({
            message: "Name, email, and password are required"
        });
    }

    userModel.createUser(userData, (err, result) => {

        if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
            message: "Email already registered"
            });
        }

        res.status(201).json({
            message: "User created successfully",
            userId: result.insertId
        });
    });
};

module.exports = {
    getUsers,
    createUser
};