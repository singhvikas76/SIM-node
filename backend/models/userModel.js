const db = require("../config/database");

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

module.exports = {
    getAllUsers,
    createUser
};