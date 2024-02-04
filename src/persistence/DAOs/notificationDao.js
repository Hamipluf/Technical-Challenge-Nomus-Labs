const client = require("../config.js");

class NotificationDao {
  async createNotification(userId, senderId, type, postId, commentId) {
    // Verify if commentId is a number
    const validCommentId = !isNaN(parseInt(commentId)) ? commentId : null;
    const result = await client.query(
      "INSERT INTO notifications(user_id, sender_id, type, post_id, comment_id) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [userId, senderId, type, postId, validCommentId]
    );
    return result.rows[0];
  }
  async getUnreadNotifications(userId) {
    const result = await client.query(
      "SELECT * FROM notifications WHERE user_id = $1 AND is_read = false",
      [userId]
    );
    return result.rows;
  }
  async markNotificationsAsRead(userId) {
    const result = await client.query(
      "UPDATE notifications SET is_read = true WHERE user_id = $1 RETURNING *",
      [userId]
    );
    return result.rows;
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new NotificationDao();
    }
    return this.instance;
  }
}

module.exports = NotificationDao.getInstance();
