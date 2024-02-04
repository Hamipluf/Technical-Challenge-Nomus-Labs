const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
// Multer
const upload = require("../utils/multerConfig");

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/logout", authMiddleware, userController.logoutUser);
router.get("/search/:username", authMiddleware, userController.searchUsers);
router.post("/follow/:targetUserId", authMiddleware, userController.followUser);
router.post(
  "/unfollow/:targetUserId",
  authMiddleware,
  userController.unfollowUser
);
router.post(
  "/updatePrivacy/:isPrivate",
  authMiddleware,
  userController.updatePrivacy
);
router.get("/getUserPrivacy", authMiddleware, userController.getUserPrivacy);

router.post(
  "/uploadProfilePicture",
  authMiddleware,
  upload.single("profilePicture"),
  userController.uploadProfilePicture
);
router.get(
  "/getProfilePicture",
  authMiddleware,
  userController.getProfilePicture
);

module.exports = router;
