const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const clientS3 = require("../persistence/aws_s3_config.js").module;
const userServices = require("../services/userServices.js");
const customResponses = require("../utils/customResponses.js");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
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
      return user.error
        ? res
            .status(400)
            .json(
              customResponses.badResponse(
                400,
                "A user with this username already exists."
              )
            )
        : res
            .status(201)
            .json(
              customResponses.responseOk(
                200,
                "User successfully registered",
                user
              )
            );
    } catch (error) {
      console.log("Error", error);
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
      return user.error
        ? res.status(400).json(customResponses.badResponse(400, user.message))
        : res.json(customResponses.responseOk(200, "Logged", user));
    } catch (error) {
      console.log(error);
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }

  async getCurrentUser(req, res) {
    const { user } = req;

    if (!user) {
      return res.redirect("/login");
    }

    const token = jwt.sign({ user: user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res
      .status(200)
      .json(customResponses.responseOk(200, "Curren user", { user, token }));
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
      users.error
        ? res
            .status(200)
            .json(customResponses.responseOk(200, users.message, []))
        : res.json(customResponses.responseOk(200, "User Founded", users));
    } catch (error) {
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }

  async followUser(req, res) {
    try {
      const { userId } = req;
      const { targetUserId } = req.params;
      if (!targetUserId || !userId) {
        return res
          .status(404)
          .json(
            customResponses.badResponse(404, "Missing fields to be completed")
          );
      }
      const follow = await userServices.followUser(
        parseInt(userId),
        parseInt(targetUserId)
      );
      return follow
        ? res.json(customResponses.responseOk(200, "Followed", follow))
        : res.status(400).json(customResponses.responseOk(400, "Bad request"));
    } catch (error) {
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }

  async getAllFollowers(req, res) {
    try {
      const { userId } = req;
      if (!userId) {
        return res
          .status(404)
          .json(
            customResponses.badResponse(404, "Missing fields to be completed")
          );
      }
      const followers = await userServices.getFollowers(parseInt(userId));
      return followers
        ? res.json(customResponses.responseOk(200, "Followers", followers))
        : res.status(400).json(customResponses.responseOk(400, "Bad request"));
    } catch (error) {
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }
  async unfollowUser(req, res) {
    try {
      const { userId } = req;
      const { targetUserId } = req.params;
      if (!targetUserId || !userId) {
        return res
          .status(404)
          .json(
            customResponses.badResponse(404, "Missing fields to be completed")
          );
      }
      const unfollow = await userServices.unfollowUser(
        parseInt(userId),
        parseInt(targetUserId)
      );
      console.log(unfollow);
      return unfollow
        ? res.json(customResponses.responseOk(200, "Unfollowed", unfollow))
        : res.status(400).json(customResponses.responseOk(400, "Bad request"));
    } catch (error) {
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }

  async updatePrivacy(req, res) {
    try {
      const { userId } = req;
      const { isPrivate } = req.params;
      if (!userId || !isPrivate) {
        return res
          .status(404)
          .json(
            customResponses.badResponse(404, "Missing fields to be completed")
          );
      }
      const updatedUser = await userServices.updatePrivacy(
        parseInt(userId),
        isPrivate
      );
      res.json(
        customResponses.responseOk(
          200,
          `User ${updatedUser.username} is ${
            updatedUser.is_private ? "Private" : "Public"
          }`,
          updatedUser
        )
      );
    } catch (error) {
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }

  async getUserPrivacy(req, res) {
    try {
      const { userId } = req;
      const user = await userServices.getUserPrivacy(userId);
      res.json(
        customResponses.responseOk(
          200,
          `User ${user.username} is ${user.is_private ? "Private" : "Public"}`,
          user
        )
      );
    } catch (error) {
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }

  async getProfilePicture(req, res) {
    const { userId } = req;
    const getParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${userId}/profilePicture.jpg`,
    };

    try {
      const command = new GetObjectCommand(getParams);
      // Get file from S3
      const response = await clientS3.send(command);
      const uniqueParam = Date.now().toString(); // Generates a single parameter with the current timestamp
      const signedUrl = await getSignedUrl(clientS3, command, {
        expiresIn: 3600,
        query: { uniqueParam }, // Add unique params to URL
        forcePathStyle: true,
      });
      if (response.$metadata.httpStatusCode === 200) {
        signedUrl
          ? res.json(
              customResponses.responseOk(200, "Profile Picture.", signedUrl)
            )
          : res
              .status(400)
              .json(
                customResponses.badResponse(400, "Cant get the profile url")
              );
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json(
          customResponses.badResponse(
            500,
            "Error getting the photo url.",
            error
          )
        );
    }
  }

  async uploadProfilePicture(req, res) {
    const { userId } = req;
    const file = req.file; // Field of the request
    if (!file) {
      return res
        .status(404)
        .json(
          customResponses.badResponse(404, "Missing fields to be completed")
        );
    }
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${userId}/profilePicture.jpg`,
      Body: file.buffer,
      ContentType: file.mimetype,
      // Add Content-Disposition to overwrite the existing file
      ContentDisposition: `attachment; filename=profilePicture.jpg`,
    };
    try {
      const command = new PutObjectCommand(uploadParams);
      // Upload file to S3
      const response = await clientS3.send(command);
      return response.$metadata.httpStatusCode === 200
        ? res.json(
            customResponses.responseOk(
              200,
              "Photo uploaded",
              response.$metadata
            )
          )
        : res
            .status(400)
            .json(customResponses.badResponse(400, "Cant upload the file"));
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json(
          customResponses.badResponse(500, "Error uploading photo.", error)
        );
    }
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new UserController();
    }
    return this.instance;
  }
}

module.exports = UserController.getInstance();
