const express = require("express");
const commentController = require("../controllers/commentController.js");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.post(
  "/addComment/:postId",
  authMiddleware,
  commentController.addComment
);
router.get(
  "/getPostComments/:postId",
  authMiddleware,
  commentController.getPostComments
);
module.exports = router;
