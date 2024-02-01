const UserServices = require("../services/userServices.js");
const customResponses = require("../utils/customResponses.js");
const userServices = new UserServices();
class UserController {
  async registerUser(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res
          .status(404)
          .json(
            customResponses.badResponse(404, "Missing fields to be completed")
          );
      }
      const user = await userServices.registerUser(username, password);
      res
        .status(201)
        .json(
          customResponses.responseOk(200, "User successfully registered", user)
        );
    } catch (error) {
      console.log(error);
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }

  async loginUser(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res
          .status(404)
          .json(
            customResponses.badResponse(404, "Missing fields to be completed")
          );
      }
      const user = await userServices.loginUser(username, password);
      res.json(customResponses.responseOk(200, "Logged", user));
    } catch (error) {
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }

  logoutUser(req, res) {
    // Hhere I can delete the cookies or the session
    res.json({ message: "Successful logout." });
  }

  async searchUsers(req, res) {
    try {
      const { username } = req.params;
      if (!username) {
        return res
          .status(404)
          .json(
            customResponses.badResponse(404, "Missing fields to be completed")
          );
      }
      const users = await userServices.searchUsers(username);
      res.json(users);
    } catch (error) {
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }

  async followUser(req, res) {
    try {
      const { userId } = req;
      const { targetUserId } = req.params;
      const follow = await userServices.followUser(userId, targetUserId);
      res.json(customResponses.responseOk(200, "Followed", follow));
    } catch (error) {
      res.status(500).json(customResponses.badResponse(500));
    }
  }

  async unfollowUser(req, res) {
    try {
      const { userId } = req;
      const { targetUserId } = req.params;
      const unfollow = await userServices.unfollowUser(userId, targetUserId);
      res.json(unfollow);
    } catch (error) {
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }
}

module.exports = UserController;
