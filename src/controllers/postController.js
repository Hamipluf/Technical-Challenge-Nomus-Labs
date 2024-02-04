const postService = require("../services/postService.js");
const customResponses = require("../utils/customResponses.js");

class PostController {
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
      const post = await postService.createPost(parseInt(userId), content);
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

      const feedPosts = await postService.getFeedPosts(
        userId,
        parsedLimit,
        parsedOffset
      );
      const totalDocuments = await postService.getAllPostUser(userId);
      const totalPages = Math.ceil(totalDocuments.length / parsedLimit);
      const hasNextPage = parsedOffset + parsedLimit < totalDocuments.length;
      const hasPreviousPage = parsedOffset > 0;

      const response = {
        pag: Math.floor(parsedOffset / parsedLimit) + 1,
        hasNextPage,
        hasPreviousPage,
        totalPages,
        totalDocuments: totalDocuments.length,
        posts: feedPosts,
      };

      return feedPosts.length < 1
        ? res
            .status(400)
            .json(customResponses.badResponse(400, "Posts not found"))
        : res.json(customResponses.responseOk(200, "Posts Found", response));
    } catch (error) {
      console.log(error);
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }
  async editPost(req, res) {
    const { postId } = req.params;
    const { newContent } = req.body;
    if (!postId || !newContent) {
      return res
        .status(404)
        .json(
          customResponses.badResponse(404, "Missing fields to be completed")
        );
    }
    try {
      const editedPost = await postService.editPost(
        parseInt(postId),
        newContent
      );
      editedPost
        ? res.json(
            customResponses.responseOk(200, "Poste updated.", editedPost)
          )
        : res
            .status(400)
            .json(customResponses.badResponse(400, "Cant update the post."));
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json(customResponses.badResponse(500, "Server error.", error));
    }
  }
  async deletePost(req, res) {
    const { postId } = req.params;

    if (!postId) {
      return res
        .status(404)
        .json(
          customResponses.badResponse(404, "Missing fields to be completed")
        );
    }
    try {
      const deletedPost = await postService.deletePost(postId);
      deletedPost
        ? res.json(
            customResponses.responseOk(200, `Post ${deletedPost.id} deleted.`)
          )
        : res
            .status(400)
            .json(customResponses.badResponse(400, "Cant delete the post."));
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json(customResponses.badResponse(500, "Server error.", error));
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
      const like = await postService.likePost(
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
      const unlike = await postService.unlikePost(userId, parseInt(postId));
      return unlike
        ? res
            .status(200)
            .json(
              customResponses.responseOk(
                204,
                `Post ${unlike.post_id} was unliked`,
                unlike
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
      console.log(error);
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
      const likes = await postService.getPostLikes(parseInt(postId));
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
  static getInstance() {
    if (!this.instance) {
      this.instance = new PostController();
    }
    return this.instance;
  }
}

module.exports = PostController.getInstance();
