const postsController = require("../controllers/Posts");
const {asyncWrapper} = require("../utils/asyncWrapper");
const express = require("express");
const postsRoutes = express.Router();
const ValidationMiddleware = require("../middlewares/validate");
postsRoutes.post(
    "/create",
    ValidationMiddleware.validJWTNeeded,
    asyncWrapper(postsController.createPost)
);

module.exports = postsRoutes;