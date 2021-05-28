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

chatsRoutes.get(
    "/getMessages/:chatId",
    ValidationMiddleware.validJWTNeeded,
    asyncWrapper(chatController.getMessages),
);


module.exports = chatsRoutes;