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
}

module.exports = UserServices;
