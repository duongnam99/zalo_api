const userController = require("../controllers/User");
const {asyncWrapper} = require("../utils/asyncWrapper");
const express = require("express");
const userRoutes = express.Router();
const ValidationMiddleware = require("../middlewares/validate");
userRoutes.post(
    "/register",
    asyncWrapper(userController.register)
);
userRoutes.post(
    "/login",
    asyncWrapper(userController.login)
);
userRoutes.post(
    "/create-user",
    ValidationMiddleware.validJWTNeeded,
    ValidationMiddleware.validJWTAdmin,
    asyncWrapper(userController.createUser),
);


module.exports = userRoutes;