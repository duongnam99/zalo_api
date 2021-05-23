const usersController = require("../controllers/Users");
const {asyncWrapper} = require("../utils/asyncWrapper");
const express = require("express");
const postLikeRoutes = express.Router();
const ValidationMiddleware = require("../middlewares/validate");


module.exports = postLikeRoutes;