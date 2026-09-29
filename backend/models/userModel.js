const db = require("../config/database");
//--------------------------------------------------------------------------------------
//get all users
const getAllUsers = (callback) => {

    const sql = "SELECT * FROM users";

    db.query(sql, (err, results) => {

        if (err) {
            callback(err, null);
            return;
        }

        callback(null, results);
    });
};
//-------------------------------------------------------------------------------------
//get user by id
const getUserById = (id, callback) => {

    const sql = "SELECT id, name, email, role, created_at FROM users WHERE id = ?";

    db.query(sql, [id], (err, results) => {

        if (err) {
            callback(err, null);
            return;
        }

        callback(null, results);
    });
};

//-------------------------------------------------------------------------------------
//create new user
const createUser = (userData, callback) => {

    const sql = `
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
    `;

    const values = [
        userData.name,
        userData.email,
        userData.password
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            callback(err, null);
            return;
        }

        callback(null, result);
    });
};

//-------------------------------------------------------------------------------------

//get user by email for login
const getUserByEmail = (email, callback) => {

    const sql = `
        SELECT id, name, email, password, role
        FROM users
        WHERE email = ?
    `;

    db.query(sql, [email], (err, results) => {

        if (err) {
            callback(err, null);
            return;
        }

        callback(null, results);
    });
};

//-------------------------------------------------------------------------------------
module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    getUserByEmail
};