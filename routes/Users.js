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


module.exports = usersRoutes;