const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

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

const getUserById = (req, res) => {

    const id = req.params.id;

    userModel.getUserById(id, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Failed to fetch user"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(results[0]);
    });
};

const createUser = async (req, res) => {

    const userData = req.body;
    
    if (!userData.name || !userData.email || !userData.password) {
        return res.status(400).json({
            message: "Name, email, and password are required"
        });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = {
        name: userData.name,
        email: userData.email,
        password: hashedPassword
    };

    userModel.createUser(newUser, (err, result) => {

        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    message: "Email already registered"
                });
            }
            return res.status(500).json({
                message: "Failed to create user"
            });

        }
        res.status(201).json({
                message: "User created successfully",
                userId: result.insertId
            });
    });
};

//--------------------------------------------------------------------------------------
const loginUser = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    userModel.getUserByEmail(email, async (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Login failed"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = results[0];

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );            

        res.json({
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    });
};

//-------------------------------------------------------------------------------------
// const getProfile = (req,res) =>{
//     res.json({
//         message : "you are authorized",
//         user : req.user
//     });
// }
const getProfile = (req, res) => {

    const userId = req.user.userId;

    userModel.getUserById(userId, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Failed to fetch profile"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Profile fetched successfully",
            user: results[0]
        });
    });

};
//-------------------------------------------------------------------------------------

const adminTest = (req, res) => {

    res.json({
        message: "Admin access granted"
    });

};

//-----------------------------------------------------------------------------------

const logoutUser = (req, res) => {
    res.json({
        message: "Logout successful"
    });

};

//------------------------------------------------------------------------------------

module.exports = {
    getUsers,
    createUser,
    getUserById,
    loginUser,
    getProfile,
    adminTest,
    logoutUser
};