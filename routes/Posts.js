const postsController = require("../controllers/Posts");
const {asyncWrapper} = require("../utils/asyncWrapper");
const express = require("express");
const postsRoutes = express.Router();
const ValidationMiddleware = require("../middlewares/validate");
postsRoutes.post(
    "/create",
    ValidationMiddleware.validJWTNeeded,
    asyncWrapper(postsController.create)
);

postsRoutes.get(
    "/show/:id",
    ValidationMiddleware.validJWTNeeded,
    asyncWrapper(postsController.show),
);

postsRoutes.get(
    "/list",
    ValidationMiddleware.validJWTNeeded,
    asyncWrapper(postsController.list),
);

module.exports = postsRoutes;