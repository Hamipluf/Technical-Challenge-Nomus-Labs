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
module.exports = router;
