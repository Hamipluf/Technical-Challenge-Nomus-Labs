const express = require("express");
const postController = require("../controllers/postController.js");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/createPost", authMiddleware, postController.createPost);
router.get("/feed", authMiddleware, postController.getFeedPosts);
router.post("/likePost/:postId", authMiddleware, postController.likePost);
router.post("/unlikePost/:postId", authMiddleware, postController.unlikePost);
router.put("/editPost/:postId", authMiddleware, postController.editPost);
router.delete("/deletePost/:postId", authMiddleware, postController.deletePost);
router.get(
  "/getPostLikes/:postId",
  authMiddleware,
  postController.getPostLikes
);
module.exports = router;
