const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const customResponse = require("../utils/customResponses.js");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json(
        customResponse.badResponse(
          401,
          "Unauthorized access, token not provided."
        )
      );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    req.userId = decoded.user.id

    next();
  } catch (error) {
    return res
      .status(401)
      .json(customResponse.badResponse(401, "Token not valid."));
  }
};

module.exports = authMiddleware;
