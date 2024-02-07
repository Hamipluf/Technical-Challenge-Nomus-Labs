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
  async getNotifications(userId) {
    const result = await client.query(
      `SELECT 
          n.id AS notification_id,
          n.type,
          n.is_read,
          n.created_at AS notification_created_at,
          u.id AS user_id,
          u.username,
          u.is_private,
          p.id AS post_id,
          p.content AS post_content,
          p.created_at AS post_created_at,
          c.id AS comment_id,
          c.content AS comment_content,
          c.created_at AS comment_created_at
      FROM 
          notifications n
      JOIN 
          users u ON n.sender_id = u.id
      LEFT JOIN 
          posts p ON n.post_id = p.id
      LEFT JOIN 
          comments c ON n.comment_id = c.id
      WHERE 
          n.user_id = $1`,
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
