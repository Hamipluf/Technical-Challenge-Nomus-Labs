const express = require("express");
const notificationController = require("../controllers/notificationController.js");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.post(
  "/createNotification/:senderId/:type/:postId/:commentId?",
  authMiddleware,
  notificationController.createNotification
);
router.get(
  "/getUnreadNotifications",
  authMiddleware,
  notificationController.getUnreadNotifications
);
router.post(
  "/markNotificationsAsRead",
  authMiddleware,
  notificationController.markNotificationsAsRead
);
module.exports = router;
