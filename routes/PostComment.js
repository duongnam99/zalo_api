const postCommentController = require("../controllers/PostComment");
const {asyncWrapper} = require("../utils/asyncWrapper");
const express = require("express");
const postCommentRoutes = express.Router();
const ValidationMiddleware = require("../middlewares/validate");

postCommentRoutes.post(
    "/create/:postId",
    ValidationMiddleware.validJWTNeeded,
    asyncWrapper(postCommentController.create),
);

postCommentRoutes.get(
    "/list/:postId",
    ValidationMiddleware.validJWTNeeded,
    asyncWrapper(postCommentController.list),
);
module.exports = postCommentRoutes;