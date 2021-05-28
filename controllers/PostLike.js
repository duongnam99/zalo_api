const jwt = require("jsonwebtoken");
const UserModel = require("../models/Users");
const httpStatus = require("../utils/httpStatus");
const bcrypt = require("bcrypt");
const {JWT_SECRET} = require("../constants/constants");
const {ROLE_CUSTOMER} = require("../constants/constants");
const PostModel = require("../models/Posts");

const postLikeController = {};

postLikeController.action = async (req, res, next) => {
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
        let post;
        try {
            post = await PostModel.findById(req.params.postId);
            if (post == null) {
                return res.status(httpStatus.NOT_FOUND).json({message: "Can not find post"});
            }
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
        let arrLike = post.like;
        console.log(userId)
        let arrLikeNotContainCurrentUser = arrLike.filter((item) => {
            return item != userId
        });
        if (arrLikeNotContainCurrentUser.length === arrLike.length) {
            arrLike.push(userId);
        } else {
            arrLike = arrLikeNotContainCurrentUser;
        }
        post = await PostModel.findOneAndUpdate({_id: req.params.postId}, {
            like: arrLike
        }, {
            new: true,
            runValidators: true
        }).populate('like', ['username', 'phonenumber']);

        if (!post) {
            return res.status(httpStatus.NOT_FOUND).json({message: "Can not find post"});
        }
        return res.status(httpStatus.OK).json({
            data: post
        });

        return res.status(httpStatus.OK).json({
            data: 'post'
        });
    }

    return res.status(httpStatus.UNAUTHORIZED).json({
        message: 'UNAUTHORIZED'
    });
}

module.exports = postLikeController;