const client = require("./config.js");

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
      "SELECT id, username FROM users WHERE username = $1",
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
      "INSERT INTO follows(user_id, target_user_id) VALUES($1, $2) RETURNING id, username",
      [userId, targetUserId]
    );
    return result.rows[0];
  }

  async unfollowUser(userId, targetUserId) {
    const result = await client.query(
      "DELETE FROM follows WHERE user_id = $1 AND target_user_id = $2 RETURNING id, username",
      [userId, targetUserId]
    );
    return result.rows[0];
  }
}

module.exports = UserDao;
