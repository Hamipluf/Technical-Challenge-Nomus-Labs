const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserDao = require("../DAOs/userDao.js");

class UserServices {
  constructor() {
    this.userDao = new UserDao();
  }

  async registerUser(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userDao.createUser(username, hashedPassword);
    return user;
  }
  async loginUser(username, password) {
    const user = await this.userDao.getUserByUsername(username);

    if (!user) {
      return { error: true, message: "User not found." };
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { error: true, message: "Incorrect password." };
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return { token, userId: user.id, username: user.username };
  }
  async searchUsers(username) {
    const users = await this.userDao.searchUsersByUsername(username);
    if (users.length < 1) {
      return { error: true, message: "No Users Found" };
    }
    return users;
  }
  async followUser(userId, targetUserId) {
    const follow = await this.userDao.followUser(userId, targetUserId);
    return follow;
  }
  async unfollowUser(userId, targetUserId) {
    const unfollow = await this.userDao.unfollowUser(userId, targetUserId);
    return unfollow;
  }
  async getFeedPosts(userId, limit, offset) {
    const feedPosts = await this.userDao.getFeedPosts(userId, limit, offset);
    return feedPosts;
  }
  async createPost(userId, content) {
    const post = await this.userDao.createPost(userId, content);
    return post;
  }
  async updatePrivacy(userId, isPrivate) {
    const user = await this.userDao.updatePrivacy(userId, isPrivate);
    return user;
  }
  async getUserPrivacy(userId) {
    const isPrivate = await this.userDao.getUserPrivacy(userId);
    return isPrivate;
  }
  async addComment(userId, postId, content) {
    const comment = await this.userDao.addComment(userId, postId, content);
    return comment;
  }
  async getPostComments(postId) {
    const comments = await this.userDao.getPostComments(postId);
    return comments;
  }
  async likePost(userId, postId) {
    const like = await this.userDao.likePost(userId, postId);
    return like;
  }
  async unlikePost(userId, postId) {
    const unlike = await this.userDao.unlikePost(userId, postId);
    return unlike;
  }
  async getPostLikes(postId) {
    const likes = await this.userDao.getPostLikes(postId);
    return likes;
  }
  async createNotification(userId, senderId, type, postId, commentId) {
    const notification = await this.userDao.createNotification(
      userId,
      senderId,
      type,
      postId,
      commentId
    );
    return notification;
  }
  async getUnreadNotifications(userId) {
    const notifications = await this.userDao.getUnreadNotifications(userId);
    return notifications;
  }
  async markNotificationsAsRead(userId) {
    const notification = await this.userDao.markNotificationsAsRead(userId);
    return notification;
  }
  async updateProfilePicture(userId, profilePictureUrl) {
    const user = await this.userDao.updateProfilePicture(
      userId,
      profilePictureUrl
    );
    return user;
  }
}

module.exports = UserServices;
