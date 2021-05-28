const jwt = require("jsonwebtoken");
const UserModel = require("../models/Users");
const PostReportModel = require("../models/PostReport");
const PostModel = require("../models/Posts");
const httpStatus = require("../utils/httpStatus");
const bcrypt = require("bcrypt");
const {JWT_SECRET} = require("../constants/constants");
const {ROLE_CUSTOMER} = require("../constants/constants");
const postReportController = {};
postReportController.create = async (req, res, next) => {
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
                subject,
                details,
            } = req.body;

            const postReport = new PostReportModel({
                user: userId,
                post: post._id,
                subject: subject,
                details: details
            });
            let postReportSaved = await postReport.save();
            console.log(postReportSaved._id);
            postReportSaved = await PostReportModel.findById(postReportSaved._id).populate('post', ['described']).populate('user', ['username', 'phonenumber']);
            return res.status(httpStatus.OK).json({
                data: postReportSaved
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

module.exports = postReportController;