const customResponses = require("../utils/customResponses.js");
const notificationService = require("../services/notificationService.js");
class NotificationController {
  async createNotification(req, res) {
    const { userId } = req;
    const { senderId, type, postId, commentId } = req.params;
    if (!userId || !senderId || !type) {
      return res
        .status(404)
        .json(
          customResponses.badResponse(404, "Missing fields to be completed")
        );
    }
    try {
      const notification = await notificationService.createNotification(
        parseInt(userId),
        parseInt(senderId),
        type,
        parseInt(postId),
        parseInt(commentId)
      );
      return notification
        ? res
            .status(200)
            .json(
              customResponses.responseOk(
                200,
                `Notification created`,
                notification
              )
            )
        : res.json(
            customResponses.badResponse(204, `Cant create the notification`)
          );
    } catch (error) {
      console.log(error);
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }

  async getUnreadNotifications(req, res) {
    try {
      const { userId } = req;
      const notifications = await notificationService.getUnreadNotifications(
        userId
      );
      return notifications.length < 1
        ? res.json(
            customResponses.badResponse(
              204,
              `No have notifications the user ${userId}`
            )
          )
        : res
            .status(200)
            .json(
              customResponses.responseOk(
                200,
                `The user ${userId} have ${notifications.length} notifications`,
                notifications
              )
            );
    } catch (error) {
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }

  async markNotificationsAsRead(req, res) {
    try {
      const { userId } = req;
      const notifications = await notificationService.markNotificationsAsRead(
        userId
      );
      return (
        notifications.length &&
        res
          .status(200)
          .json(
            customResponses.responseOk(
              200,
              `The user ${userId} read ${notifications.length} notifications`,
              notifications
            )
          )
      );
    } catch (error) {
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new NotificationController();
    }
    return this.instance;
  }
}

module.exports = NotificationController.getInstance();
