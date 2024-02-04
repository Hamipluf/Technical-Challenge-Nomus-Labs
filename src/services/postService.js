const PostDao = require("../persistence/DAOs/postDao.js");
class PostService {
  constructor() {
    this.postDao = PostDao;
  }
  async getFeedPosts(userId, limit, offset) {
    const feedPosts = await this.postDao.getFeedPosts(userId, limit, offset);
    return feedPosts;
  }
  async getAllPostUser(userId) {
    const feedPosts = await this.postDao.getAllPostUser(userId);
    return feedPosts;
  }
  async createPost(userId, content) {
    const post = await this.postDao.createPost(userId, content);
    return post;
  }
  async editPost(postId, newContent) {
    const post = await this.postDao.editPost(postId, newContent);
    return post;
  }
  async deletePost(postId) {
    const post = await this.postDao.deletePost(postId);
    return post;
  }
  async likePost(userId, postId) {
    const like = await this.postDao.likePost(userId, postId);
    return like;
  }
  async unlikePost(userId, postId) {
    const unlike = await this.postDao.unlikePost(userId, postId);
    return unlike;
  }
  async getPostLikes(postId) {
    const likes = await this.postDao.getPostLikes(postId);
    return likes;
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new PostService();
    }
    return this.instance;
  }
}
module.exports = PostService.getInstance();
