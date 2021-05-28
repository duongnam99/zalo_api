const jwt = require("jsonwebtoken");
const UserModel = require("../models/Users");
const PostModel = require("../models/Posts");
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
            user = await (await UserModel.findById(userId));
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
                member,
                type,
                content
            } = req.body;
            console.log(chatId);
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: 'UNAUTHORIZED'
            });
            // const postComment = new PostCommentModel({
            //     user: userId,
            //     post: post._id,
            //     content: content,
            //     commentAnswered: commentAnswered ? commentAnswered : null
            // });
            // let postCommentSaved = await postComment.save();
            // postCommentSaved = await PostCommentModel.findById(postCommentSaved._id).populate('post', ['described']).populate('user', ['username', 'phonenumber']).populate('commentAnswered');
            // return res.status(httpStatus.OK).json({
            //     data: postCommentSaved
            // });
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