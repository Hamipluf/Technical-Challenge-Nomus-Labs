const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userDao = require("../persistence/DAOs/userDao.js");

class UserServices {
  constructor() {
    this.userDao = userDao;
  }

  async registerUser(username, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userDao.createUser(username, hashedPassword);

      const token = jwt.sign({ user: user }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return { user, token };
    } catch (error) {
      return { error: true, message: error.message};
    }
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

    const insensitiveUser = {
      id: user.id,
      username: user.username,
      is_private: user.is_private,
    };

    const token = jwt.sign({ user: insensitiveUser }, process.env.JWT_SECRET, {
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
  async getFollowers(userId) {
    const followers = await this.userDao.getFolowers(userId);
    return followers;
  }

  async updatePrivacy(userId, isPrivate) {
    const user = await this.userDao.updatePrivacy(userId, isPrivate);
    return user;
  }
  async getUserPrivacy(userId) {
    const isPrivate = await this.userDao.getUserPrivacy(userId);
    return isPrivate;
  }

  async updateProfilePicture(userId, profilePictureUrl) {
    const user = await this.userDao.updateProfilePicture(
      userId,
      profilePictureUrl
    );
    return user;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new UserServices();
    }
    return this.instance;
  }
}

module.exports = UserServices.getInstance();
