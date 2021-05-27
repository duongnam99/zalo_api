const postReportController = require("../controllers/PostReport");
const {asyncWrapper} = require("../utils/asyncWrapper");
const express = require("express");
const postReportRoutes = express.Router();
const ValidationMiddleware = require("../middlewares/validate");

postReportRoutes.post(
    "/create/:postId",
    ValidationMiddleware.validJWTNeeded,
    asyncWrapper(postReportController.create),
);

module.exports = postReportRoutes;