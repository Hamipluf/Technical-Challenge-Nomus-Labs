const client = require("../config.js");

class PostDao {
  async createPost(userId, content) {
    const result = await client.query(
      "INSERT INTO posts(user_id, content) VALUES($1, $2) RETURNING *",
      [userId, content]
    );
    return result.rows[0];
  }
  async getAllPostUser(userId) {
    const result = await client.query(
      "SELECT posts.id, posts.content, posts.user_id, posts.created_at, users.username " +
        "FROM posts " +
        "JOIN follows ON posts.user_id = follows.target_user_id " +
        "JOIN users ON posts.user_id = users.id " +
        "WHERE follows.user_id = $1 ",
      [userId]
    );
    return result.rows;
  }
  async getFeedPosts(userId, limit, offset) {
    const result = await client.query(
      "SELECT posts.id, posts.content, posts.user_id, posts.created_at, users.username " +
        "FROM posts " +
        "JOIN follows ON posts.user_id = follows.target_user_id " +
        "JOIN users ON posts.user_id = users.id " +
        "WHERE follows.user_id = $1 " +
        "ORDER BY posts.created_at DESC " +
        "LIMIT $2 OFFSET $3",
      [userId, limit, offset]
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
  async editPost(postId, newContent) {
    const query = "UPDATE posts SET content = $1 WHERE id = $2 RETURNING *";
    const values = [newContent, postId];
    const result = await client.query(query, values);
    return result.rows[0];
  }
  async deletePost(postId) {
    // First delete the relationship of comment to post
    await this._deleteCommentsForPost(postId);
    // Next showld delete the like relation
    await this._deleteLikeOfPost(postId);
    // Then we can delete the post
    const query = "DELETE FROM posts WHERE id = $1 RETURNING *";
    const values = [postId];
    const result = await client.query(query, values);
    return result.rows[0];
  }
  async _deleteCommentsForPost(postId) {
    await client.query("DELETE FROM comments WHERE post_id = $1", [postId]);
  }
  async _deleteLikeOfPost(postId) {
    await client.query("DELETE FROM likes WHERE post_id = $1", [postId]);
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new PostDao();
    }
    return this.instance;
  }
}

module.exports = PostDao.getInstance();
