const client = require("../config.js");

class UserDao {
  async createUser(username, password) {
    const result = await client.query(
      "INSERT INTO users(username, password) VALUES($1, $2) RETURNING id, username",
      [username, password]
    );
    return result.rows[0];
  }
  async getUserByUsername(username) {
    const result = await client.query(
      "SELECT id, username, password FROM users WHERE username = $1",
      [username]
    );
    return result.rows[0];
  }
  async searchUsersByUsername(username) {
    const result = await client.query(
      "SELECT id, username FROM users WHERE LOWER(username) LIKE $1",
      [`%${username.toLowerCase()}%`]
    );
    return result.rows;
  }
  async followUser(userId, targetUserId) {
    const result = await client.query(
      "INSERT INTO follows(user_id, target_user_id) VALUES($1, $2) RETURNING *",
      [userId, targetUserId]
    );
    return result.rows[0];
  }
  async unfollowUser(userId, targetUserId) {
    const result = await client.query(
      "DELETE FROM follows WHERE user_id = $1 AND target_user_id = $2 RETURNING *",
      [userId, targetUserId]
    );
    return result.rows[0];
  } 
  async updatePrivacy(userId, isPrivate) {
    const result = await client.query(
      "UPDATE users SET is_private = $1 WHERE id = $2 RETURNING id, username, is_private",
      [isPrivate, userId]
    );
    return result.rows[0];
  }
  async getUserPrivacy(userId) {
    const result = await client.query(
      "SELECT is_private, username FROM users WHERE id = $1",
      [userId]
    );
    return result.rows[0];
  }
 
 
 
 
  async updateProfilePicture(userId, profilePictureUrl) {
    const result = await client.query(
      "UPDATE users SET profile_picture_url = $1 WHERE id = $2 RETURNING *",
      [profilePictureUrl, userId]
    );
    return result.rows[0];
  }
  // Pattern singleton
  static getInstance() {
    if (!this.instance) {
      this.instance = new UserDao();
    }
    return this.instance;
  }
}

module.exports = UserDao.getInstance();
