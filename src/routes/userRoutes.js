const express = require("express");
const UserController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
// Multer
const upload = require("../utils/multerConfig");

const router = express.Router();
const userController = new UserController();

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
router.post("/createPost", authMiddleware, userController.createPost);
router.get("/feed", authMiddleware, userController.getFeedPosts);
router.post(
  "/updatePrivacy/:isPrivate",
  authMiddleware,
  userController.updatePrivacy
);
router.get("/getUserPrivacy", authMiddleware, userController.getUserPrivacy);
router.post("/addComment/:postId", authMiddleware, userController.addComment);
router.get(
  "/getPostComments/:postId",
  authMiddleware,
  userController.getPostComments
);
router.post("/likePost/:postId", authMiddleware, userController.likePost);
router.post("/unlikePost/:postId", authMiddleware, userController.unlikePost);
router.get(
  "/getPostLikes/:postId",
  authMiddleware,
  userController.getPostLikes
);
router.post(
  "/createNotification/:senderId/:type/:postId/:commentId?",
  authMiddleware,
  userController.createNotification
);
router.get(
  "/getUnreadNotifications",
  authMiddleware,
  userController.getUnreadNotifications
);
router.post(
  "/markNotificationsAsRead",
  authMiddleware,
  userController.markNotificationsAsRead
);

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
