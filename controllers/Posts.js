const jwt = require("jsonwebtoken");
const UserModel = require("../models/Users");
const PostModel = require("../models/Posts");
const DocumentModel = require("../models/Documents");

const httpStatus = require("../utils/httpStatus");
const bcrypt = require("bcrypt");
const {JWT_SECRET} = require("../constants/constants");
const {ROLE_CUSTOMER} = require("../constants/constants");
const uploadFile = require('../functions/uploadFile');

const postsController = {};
postsController.createPost = async (req, res, next) => {
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
                described,
                images,
                videos,
            } = req.body;
            let dataImages = [];
            if (Array.isArray(images)) {
                for (const image of images) {
                    if (uploadFile.matchesFileBase64(image) !== false) {
                        const imageResult = uploadFile.uploadFile(image);
                        if (imageResult !== false) {
                            let imageDocument = new DocumentModel({
                                fileName: imageResult.fileName,
                                fileSize: imageResult.fileSize,
                                type: imageResult.type
                            });
                            let savedImageDocument = await imageDocument.save();
                            if (savedImageDocument !== null) {
                                dataImages.push(savedImageDocument._id);
                            }
                        }
                    }
                }
            }
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'sss'});

            let dataVideos = [];
            if (Array.isArray(videos)) {
                for (const video of videos) {
                    if (uploadFile.matchesFileBase64(video) !== false) {
                        const videoResult = uploadFile.uploadFile(video);
                        if (videoResult !== false) {
                            let videoDocument = new DocumentModel({
                                fileName: videoResult.fileName,
                                fileSize: videoResult.fileSize,
                                type: videoResult.type
                            });
                            let savedVideoDocument = await videoDocument.save();
                            if (savedVideoDocument !== null) {
                                dataVideos.push(savedVideoDocument._id);
                            }
                        }
                    }
                }
            }
            console.log(dataImages);
            console.log(dataVideos);


            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'sss'});

            const post = new PostModel({
                author: userId,
                described: described,
                images: dataImages,
                videos: dataVideos
            });
            let postSaved = await post.save();
            return res.status(httpStatus.OK).json({
                data: postSaved
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
module.exports = postsController;