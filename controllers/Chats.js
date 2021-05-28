const {
    PRIVATE_CHAT,
    GROUP_CHAT,
} = require('../constants/constants');

const jwt = require("jsonwebtoken");
const UserModel = require("../models/Users");
const ChatModel = require("../models/Chats");
const MessagesModel = require("../models/Messages");
const PostCommentModel = require("../models/PostComment");
const httpStatus = require("../utils/httpStatus");
const bcrypt = require("bcrypt");
const {JWT_SECRET} = require("../constants/constants");
const {ROLE_CUSTOMER} = require("../constants/constants");
const chatController = {};
chatController.send = async (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        let authorization = req.headers.authorization.split(' ')[1], decoded;
        try {
            decoded = jwt.verify(authorization, process.env.JWT_SECRET);
        } catch (e) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                success: false,
                message: 'unauthorized'
            });
        }
        const userId = decoded.id;
        let user;
        try {
            user = await UserModel.findById(userId);
            if (user == null) {
                return res.status(httpStatus.NOT_FOUND).json({message: "Can not find user"});
            }
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
        try {
            const {
                name,
                chatId,
                receivedId,
                member,
                type,
                content
            } = req.body;
            let chatIdSend = null;
            let chat;
            if (type === PRIVATE_CHAT) {
                if (chatId) {
                    chat = await ChatModel.findById(chatId);
                    if (chat !== null) {
                        chatIdSend = chat._id;
                    }
                } else {
                    chat = new ChatModel({
                       type: PRIVATE_CHAT,
                       member: [
                           receivedId,
                           userId
                       ]
                    });
                    await chat.save();
                    chatIdSend = chat._id;
                }
            } else if (type === GROUP_CHAT) {
                if (chatId) {
                    chat = await ChatModel.findById(chatId);
                    if (chat !== null) {
                        chatIdSend = chat._id;
                    }
                } else {
                    chat = new ChatModel({
                        type: GROUP_CHAT,
                        member: member
                    });
                    await chat.save();
                    chatIdSend = chat._id;
                }
            }
            if (chatIdSend) {
                if (content) {
                    let message = new MessagesModel({
                        chat: chatIdSend,
                        user: userId,
                        content: content
                    });
                    await message.save();
                    console.log(message._id);
                    let messageNew = await MessagesModel.findById(message._id).populate('chat').populate('user');
                    return res.status(httpStatus.OK).json({
                        data: messageNew
                    });
                } else {
                    return res.status(httpStatus.OK).json({
                        data: chat,
                        message: 'Create chat success',
                        response: 'CREATE_CHAT_SUCCESS'
                    });
                }
            } else {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: 'Not chat'
                });
            }
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                message: e.message
            });
        }
    }

    return res.status(httpStatus.UNAUTHORIZED).json({
        message: 'UNAUTHORIZED'
    });
}

module.exports = chatController;