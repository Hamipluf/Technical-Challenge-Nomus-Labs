const client = require("../config.js");

class CommentDao {
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
  static getInstance() {
    if (!this.instance) {
      this.instance = new CommentDao();
    }
    return this.instance;
  }
}
module.exports = CommentDao.getInstance();
