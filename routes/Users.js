const usersController = require("../controllers/Users");
const {asyncWrapper} = require("../utils/asyncWrapper");
const express = require("express");
const usersRoutes = express.Router();
const ValidationMiddleware = require("../middlewares/validate");
const auth = require("../middlewares/auth");

usersRoutes.post(
    "/register",
    asyncWrapper(usersController.register)
);
usersRoutes.post(
    "/login",
    asyncWrapper(usersController.login)
);
usersRoutes.post(
    "/edit",
    ValidationMiddleware.validJWTNeeded,
    // ValidationMiddleware.validJWTAdmin,
    asyncWrapper(usersController.edit),
);

usersRoutes.get(
    "/show",
    ValidationMiddleware.validJWTNeeded,
    // ValidationMiddleware.validJWTAdmin,
    asyncWrapper(usersController.show),
);

usersRoutes.post("/set-block-user", auth, usersController.setBlock);
usersRoutes.post("/set-block-diary", auth, usersController.setBlockDiary);
usersRoutes.post("/search", auth, usersController.searchUser);

module.exports = usersRoutes;