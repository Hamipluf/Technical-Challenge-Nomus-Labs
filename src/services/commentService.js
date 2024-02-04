const commentDao = require("../persistence/DAOs/commentDao.js");
class CommentService {
  constructor() {
    this.commentDao = commentDao;
  }
  async addComment(userId, postId, content) {
    const comment = await this.commentDao.addComment(userId, postId, content);
    return comment;
  }
  async getPostComments(postId) {
    const comments = await this.commentDao.getPostComments(postId);
    return comments;
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new CommentService();
    }
    return this.instance;
  }
}
module.exports = CommentService.getInstance();
