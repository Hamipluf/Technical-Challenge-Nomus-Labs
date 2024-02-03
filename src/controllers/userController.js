const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const clientS3 = require("../DAOs/aws_s3_config.js").module;
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
      return user.error
        ? res.status(400).json(customResponses.responseOk(400, user.message))
        : res.json(customResponses.responseOk(200, "Logged", user));
    } catch (error) {
      console.log(error);
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
      users.error
        ? res.status(400).json(customResponses.responseOk(400, users.message))
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

  async createPost(req, res) {
    try {
      const { userId } = req;
      const { content } = req.body;
      if (!content || !userId) {
        return res
          .status(400)
          .json(
            customResponses.badResponse(400, "Missing fields to be completed")
          );
      }
      const post = await userServices.createPost(parseInt(userId), content);
      console.log(post);
      res.status(201).json(customResponses.responseOk(201, "Posted", post));
    } catch (error) {
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }

  async getFeedPosts(req, res) {
    try {
      const { userId } = req;
      const { limit, offset } = req.query;
      if (!userId) {
        return res
          .status(404)
          .json(
            customResponses.badResponse(404, "Missing fields to be completed")
          );
      }
      //Validate offset and limit to ensure that they are positive numbers.
      const parsedOffset = parseInt(offset, 10) || 0;
      const parsedLimit = parseInt(limit, 10) || 10;

      const feedPosts = await userServices.getFeedPosts(
        userId,
        parsedLimit,
        parsedOffset
      );
      
      const totalPages = Math.ceil(totalDocuments / parsedLimit);
      const hasNextPage = parsedOffset + parsedLimit < totalDocuments;
      const hasPreviousPage = parsedOffset > 0;

      const response = {
        pag: Math.floor(parsedOffset / parsedLimit) + 1,
        hasNextPage,
        hasPreviousPage,
        totalPages,
        posts: feedPosts,
      };

      return feedPosts.length < 1
        ? res
            .status(400)
            .json(customResponses.badResponse(400, "Posts not found"))
        : res.json(customResponses.responseOk(200, "Posts Found", response));
    } catch (error) {
      console.log(error)
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

  async addComment(req, res) {
    try {
      const { userId } = req;
      const { postId } = req.params;
      const { content } = req.body;
      if (!content || !postId || !userId) {
        return res
          .status(404)
          .json(
            customResponses.badResponse(404, "Missing fields to be completed")
          );
      }
      const comment = await userServices.addComment(
        parseInt(userId),
        parseInt(postId),
        content
      );
      console.log(comment);
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }

  async getPostComments(req, res) {
    try {
      const { postId } = req.params;
      if (!postId) {
        return res
          .status(404)
          .json(
            customResponses.badResponse(404, "Missing fields to be completed")
          );
      }
      const comments = await userServices.getPostComments(parseInt(postId));
      return comments.length < 1
        ? res.json(customResponses.badResponse(204, "Comments not founds"))
        : res.json(customResponses.responseOk(200, "Comments", comments));
    } catch (error) {
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }

  async likePost(req, res) {
    const { userId } = req;
    const { postId } = req.params;
    if (!postId || !userId) {
      return res
        .status(404)
        .json(
          customResponses.badResponse(404, "Missing fields to be completed")
        );
    }
    try {
      const like = await userServices.likePost(
        parseInt(userId),
        parseInt(postId)
      );
      return like
        ? res.json(
            customResponses.responseOk(
              204,
              `Post ${like.post_id} was liked`,
              like
            )
          )
        : res
            .status(400)
            .json(
              customResponses.badResponse(
                400,
                `Can not like post ${like.post_id}`
              )
            );
    } catch (error) {
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }

  async unlikePost(req, res) {
    const { userId } = req;
    const { postId } = req.params;
    if (!postId || !userId) {
      return res
        .status(404)
        .json(
          customResponses.badResponse(404, "Missing fields to be completed")
        );
    }
    try {
      const unlike = await userServices.unlikePost(
        parseInt(userId),
        parseInt(postId)
      );
      return like
        ? res
            .status(204)
            .json(
              customResponses.responseOk(
                204,
                `Post ${unlike.post_id} was unliked`,
                like
              )
            )
        : res
            .status(400)
            .json(
              customResponses.badResponse(
                400,
                `Can not unlike post ${unlike.post_id}`
              )
            );
    } catch (error) {
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }

  async getPostLikes(req, res) {
    const { postId } = req.params;
    if (!postId) {
      return res
        .status(404)
        .json(
          customResponses.badResponse(404, "Missing fields to be completed")
        );
    }
    try {
      const likes = await userServices.getPostLikes(parseInt(postId));
      return likes.length < 1
        ? res.json(
            customResponses.badResponse(204, `No have like the post ${postId}`)
          )
        : res
            .status(200)
            .json(
              customResponses.responseOk(
                200,
                `The post ${postId} have ${likes.length} likes`,
                likes
              )
            );
    } catch (error) {
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }

  async createNotification(req, res) {
    const { userId } = req;
    const { senderId, type, postId, commentId } = req.params;
    if (!userId || !senderId || !type) {
      return res
        .status(404)
        .json(
          customResponses.badResponse(404, "Missing fields to be completed")
        );
    }
    try {
      const notification = await userServices.createNotification(
        parseInt(userId),
        parseInt(senderId),
        type,
        parseInt(postId),
        parseInt(commentId)
      );
      return notification
        ? res
            .status(200)
            .json(
              customResponses.responseOk(
                200,
                `Notification created`,
                notification
              )
            )
        : res.json(
            customResponses.badResponse(204, `Cant create the notification`)
          );
    } catch (error) {
      console.log(error);
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }

  async getUnreadNotifications(req, res) {
    try {
      const { userId } = req;
      const notifications = await userServices.getUnreadNotifications(userId);
      return notifications.length < 1
        ? res.json(
            customResponses.badResponse(
              204,
              `No have notifications the user ${userId}`
            )
          )
        : res
            .status(200)
            .json(
              customResponses.responseOk(
                200,
                `The user ${userId} have ${notifications.length} notifications`,
                notifications
              )
            );
    } catch (error) {
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }

  async markNotificationsAsRead(req, res) {
    try {
      const { userId } = req;
      const notifications = await userServices.markNotificationsAsRead(userId);
      return (
        notifications.length &&
        res
          .status(200)
          .json(
            customResponses.responseOk(
              200,
              `The user ${userId} read ${notifications.length} notifications`,
              notifications
            )
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
        .status(400)
        .json({ error: "No se proporcionó ningún archivo." });
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
}

module.exports = UserController;
