const PostModel = require("../models/Posts");
const PostCommentModel = require("../models/PostComment");
const httpStatus = require("../utils/httpStatus");
const postCommentController = {};
postCommentController.create = async (req, res, next) => {
    try {
        let userId = req.userId;
        let post;
        try {
            post = await (await PostModel.findById(req.params.postId));
            if (post == null) {
                return res.status(httpStatus.NOT_FOUND).json({message: "Can not find post"});
            }
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
        }const {
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