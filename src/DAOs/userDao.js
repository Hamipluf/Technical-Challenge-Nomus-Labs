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
  async createPost(userId, content) {
    const result = await client.query(
      "INSERT INTO posts(user_id, content) VALUES($1, $2) RETURNING *",
      [userId, content]
    );
    return result.rows[0];
  }
  async getFeedPosts(userId) {
    const result = await client.query(
      "SELECT posts.id, posts.content, posts.user_id, posts.created_at, users.username " +
        "FROM posts " +
        "JOIN follows ON posts.user_id = follows.target_user_id " +
        "JOIN users ON posts.user_id = users.id " +
        "WHERE follows.user_id = $1 " +
        "ORDER BY posts.created_at DESC",
      [userId]
    );
    return result.rows;
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
  async addComment(userId, postId, content) {
    const result = await client.query(
      "INSERT INTO comments(user_id, post_id, content) VALUES($1, $2, $3) RETURNING *",
      [userId, postId, content]
    );
    return result.rows[0];
  }
  async getPostComments(postId) {
    const result = await client.query(
      "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at ASC",
      [postId]
    );
    return result.rows;
  }
  async likePost(userId, postId) {
    const result = await client.query(
      "INSERT INTO likes(user_id, post_id) VALUES($1, $2) RETURNING *",
      [userId, postId]
    );
    return result.rows[0];
  }

  async unlikePost(userId, postId) {
    const result = await client.query(
      "DELETE FROM likes WHERE user_id = $1 AND post_id = $2 RETURNING *",
      [userId, postId]
    );
    return result.rows[0];
  }

  async getPostLikes(postId) {
    const result = await client.query(
      "SELECT * FROM likes WHERE post_id = $1",
      [postId]
    );
    return result.rows;
  }
}

module.exports = UserDao;
