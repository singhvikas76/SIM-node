const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
    "/admin-test",
    authMiddleware,
    roleMiddleware(["admin"]),
    userController.adminTest
);

// router.get("/", userController.getUsers);
router.get(
    "/",
    authMiddleware,
    roleMiddleware(["admin"]),
    userController.getUsers
);

router.post(
    "/logout",
    authMiddleware,
    userController.logoutUser
);

router.post("/", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/profile", authMiddleware, userController.getProfile);
router.get("/:id", userController.getUserById);

module.exports = router;