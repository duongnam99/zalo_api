const usersController = require("../controllers/Users");
const {asyncWrapper} = require("../utils/asyncWrapper");
const express = require("express");
const usersRoutes = express.Router();
const ValidationMiddleware = require("../middlewares/validate");
usersRoutes.post(
    "/register",
    asyncWrapper(usersController.register)
);
usersRoutes.post(
    "/login",
    asyncWrapper(usersController.login)
);
usersRoutes.post(
    "/create-user",
    ValidationMiddleware.validJWTNeeded,
    ValidationMiddleware.validJWTAdmin,
    asyncWrapper(usersController.createUser),
);


module.exports = usersRoutes;