const chatController = require("../controllers/Chats");
const {asyncWrapper} = require("../utils/asyncWrapper");
const express = require("express");
const chatsRoutes = express.Router();
const ValidationMiddleware = require("../middlewares/validate");

chatsRoutes.post(
    "/send",
    ValidationMiddleware.validJWTNeeded,
    asyncWrapper(chatController.send),
);

module.exports = chatsRoutes;