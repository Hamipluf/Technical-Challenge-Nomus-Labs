const express = require("express");
const UserController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const userController = new UserController();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/logout", authMiddleware, userController.logoutUser);
router.get("/search/:username", authMiddleware, userController.searchUsers);
router.post("/follow/:targetUserId", authMiddleware, userController.followUser);
router.post("/unfollow/:targetUserId", authMiddleware, userController.unfollowUser);

module.exports = router;
