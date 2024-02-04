const notificationDao = require("../persistence/DAOs/notificationDao.js");

class NotificationSerivice {
  constructor() {
    this.notificationDao = notificationDao;
  }
  async createNotification(userId, senderId, type, postId, commentId) {
    const notification = await this.notificationDao.createNotification(
      userId,
      senderId,
      type,
      postId,
      commentId
    );
    return notification;
  }
  async getUnreadNotifications(userId) {
    const notifications = await this.notificationDao.getUnreadNotifications(
      userId
    );
    return notifications;
  }
  async markNotificationsAsRead(userId) {
    const notification = await this.notificationDao.markNotificationsAsRead(
      userId
    );
    return notification;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new NotificationSerivice();
    }
    return this.instance;
  }
}

module.exports = NotificationSerivice.getInstance();
