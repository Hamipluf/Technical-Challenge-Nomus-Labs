const customResponses = require("../utils/customResponses.js");
const commentService = require("../services/commentService.js");

class CommentController {
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
      const comment = await commentService.addComment(
        parseInt(userId),
        parseInt(postId),
        content
      );
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
      const comments = await commentService.getPostComments(parseInt(postId));
      return comments.length < 1
        ? res.json(customResponses.badResponse(204, "Comments not founds"))
        : res.json(customResponses.responseOk(200, "Comments", comments));
    } catch (error) {
      res.status(500).json(customResponses.badResponse(500, error.message));
    }
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new CommentController();
    }
    return this.instance;
  }
}
module.exports = CommentController.getInstance();
