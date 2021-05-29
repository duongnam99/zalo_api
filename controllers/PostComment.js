const jwt = require("jsonwebtoken");
const UserModel = require("../models/Users");
const PostModel = require("../models/Posts");
const PostCommentModel = require("../models/PostComment");
const httpStatus = require("../utils/httpStatus");
const bcrypt = require("bcrypt");
const {JWT_SECRET} = require("../constants/constants");
const {ROLE_CUSTOMER} = require("../constants/constants");
const postCommentController = {};
postCommentController.create = async (req, res, next) => {
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
        let post;
        try {
            post = await (await PostModel.findById(req.params.postId));
            if (post == null) {
                return res.status(httpStatus.NOT_FOUND).json({message: "Can not find post"});
            }
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
        try {
            const {
                content,
                commentAnswered
            } = req.body;

            const postComment = new PostCommentModel({
                user: userId,
                post: post._id,
                content: content,
                commentAnswered: commentAnswered ? commentAnswered : null
            });

            let postCommentSaved = await postComment.save();
            // update countComments post
            await PostModel.findOneAndUpdate(req.params.postId, {
                countComments: post.countComments ? post.countComments + 1 : 1
            })
            postCommentSaved = await PostCommentModel.findById(postCommentSaved._id).populate('post', ['described']).populate('user', ['username', 'phonenumber']).populate('commentAnswered');
            return res.status(httpStatus.OK).json({
                data: postCommentSaved
            });
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

postCommentController.list = async (req, res, next) => {
    try {
        let postComments = await PostCommentModel.find().populate('post', ['described']).populate('user', ['username', 'phonenumber']).populate('commentAnswered');
        return res.status(httpStatus.OK).json({
            data: postComments
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
    }

}

module.exports = postCommentController;