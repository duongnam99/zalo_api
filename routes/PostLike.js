const postLikeController = require("../controllers/PostLike");
const {asyncWrapper} = require("../utils/asyncWrapper");
const express = require("express");
const postLikeRoutes = express.Router();
const ValidationMiddleware = require("../middlewares/validate");

postLikeRoutes.post(
    "/action/:postId",
    ValidationMiddleware.validJWTNeeded,
    asyncWrapper(postLikeController.action),
);

module.exports = postLikeRoutes;